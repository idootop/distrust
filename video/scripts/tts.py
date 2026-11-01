#!/usr/bin/env python3
"""
生成《信任的裂缝》的配音与时间轴。

- 使用 edge-tts（本地进程，调用微软在线语音合成）逐句生成配音
- 自动裁剪句首句尾静音，按脚本里的 pauseAfter / pre 拼成精确时间轴
- 输出：
  src/generated/timeline.json   动画与音频共用的唯一时间轴
  public/audio/voice_raw.wav    对齐后的旁白原始音轨（24k mono）
  public/audio/subtitles.srt    字幕文件
  public/audio/vo/<id>.wav      单句配音（已裁剪）
  public/audio/vo/<id>.json     单句元数据 + 文本 hash

用法：
  .venv/bin/python scripts/tts.py            # 增量生成，自动跳过未变更的句子
  .venv/bin/python scripts/tts.py --force    # 全部重新生成
  .venv/bin/python scripts/tts.py --timeline-only  # 不联网，只按现有音频重算时间轴
"""
from __future__ import annotations

import argparse
import asyncio
import hashlib
import json
import math
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "src" / "script" / "script.json"
VO_DIR = ROOT / "public" / "audio" / "vo"
AUDIO_DIR = ROOT / "public" / "audio"
CACHE_DIR = ROOT / ".cache" / "tts"
TIMELINE = ROOT / "src" / "generated" / "timeline.json"
SAMPLE_RATE = 24000


def run(cmd: list[str]) -> None:
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if proc.returncode != 0:
        raise RuntimeError(
            f"command failed: {' '.join(cmd)}\n{proc.stderr.decode(errors='ignore')[-2000:]}"
        )


def speak_text(beat: dict) -> str:
    text = beat.get("speak") or beat.get("text") or ""
    return text.replace("**", "").strip()


def voice_config(script: dict, beat: dict) -> dict:
    key = beat.get("voice") or script.get("defaults", {}).get("voice", "narrator")
    cfg = dict(script.get("voices", {}).get(key, {}))
    cfg.setdefault("voice", "zh-CN-YunxiNeural")
    cfg.setdefault("rate", "+0%")
    cfg.setdefault("pitch", "+0Hz")
    cfg.setdefault("volume", "+0%")
    return cfg


def beat_hash(text: str, cfg: dict) -> str:
    payload = json.dumps(
        {"text": text, "voice": cfg["voice"], "rate": cfg["rate"], "pitch": cfg["pitch"], "volume": cfg["volume"]},
        ensure_ascii=False,
        sort_keys=True,
    )
    return hashlib.sha1(payload.encode("utf-8")).hexdigest()


async def synth_one(text: str, cfg: dict, out_mp3: Path, retries: int = 4) -> None:
    import edge_tts

    last_err: Exception | None = None
    for attempt in range(1, retries + 1):
        try:
            communicate = edge_tts.Communicate(
                text,
                cfg["voice"],
                rate=cfg["rate"],
                volume=cfg["volume"],
                pitch=cfg["pitch"],
            )
            await communicate.save(str(out_mp3))
            if out_mp3.exists() and out_mp3.stat().st_size > 500:
                return
            raise RuntimeError("empty audio")
        except Exception as exc:  # noqa: BLE001
            last_err = exc
            await asyncio.sleep(1.2 * attempt)
    raise RuntimeError(f"TTS failed for {text[:40]!r}: {last_err}")


def mp3_to_wav(mp3: Path, wav: Path) -> None:
    run(
        [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-i",
            str(mp3),
            "-ar",
            str(SAMPLE_RATE),
            "-ac",
            "1",
            "-c:a",
            "pcm_s16le",
            str(wav),
        ]
    )


def read_wav(path: Path) -> np.ndarray:
    with wave.open(str(path), "rb") as f:
        assert f.getframerate() == SAMPLE_RATE, f"unexpected sample rate {f.getframerate()}"
        assert f.getnchannels() == 1, "expected mono"
        data = f.readframes(f.getnframes())
    return np.frombuffer(data, dtype=np.int16).copy()


def write_wav(path: Path, samples: np.ndarray) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(SAMPLE_RATE)
        f.writeframes(np.clip(samples, -32768, 32767).astype("<i2").tobytes())


def trim_silence(samples: np.ndarray, threshold: float = 0.008, pad_sec: float = 0.035) -> np.ndarray:
    if samples.size == 0:
        return samples
    env = np.abs(samples.astype(np.float32) / 32768.0)
    # 5ms 平滑，避免把齿音/呼吸误判为静音
    win = max(1, int(SAMPLE_RATE * 0.005))
    kernel = np.ones(win, dtype=np.float32) / win
    smooth = np.convolve(env, kernel, mode="same")
    idx = np.flatnonzero(smooth > threshold)
    if idx.size == 0:
        return samples
    pad = int(pad_sec * SAMPLE_RATE)
    a = max(0, int(idx[0]) - pad)
    b = min(samples.size, int(idx[-1]) + pad)
    return samples[a:b]


def add_edge_fades(samples: np.ndarray, fade_sec: float = 0.008) -> np.ndarray:
    n = min(int(fade_sec * SAMPLE_RATE), samples.size // 2)
    if n <= 0:
        return samples
    out = samples.astype(np.float32)
    out[:n] *= np.linspace(0, 1, n, dtype=np.float32)
    out[-n:] *= np.linspace(1, 0, n, dtype=np.float32)
    return out.astype(np.int16)


def build_timeline(script: dict) -> dict:
    defaults = script.get("defaults", {})
    default_pre = float(defaults.get("pre", 0.25))
    default_pause = float(defaults.get("pauseAfter", 0.55))
    cursor = 0.0
    chapters_out = []
    all_beats = []

    for chapter in script["chapters"]:
        lead_in = float(chapter.get("leadIn", 0.5))
        tail = float(chapter.get("tail", 1.0))
        chapter_start = cursor
        cursor += lead_in
        beats_out = []
        for beat in chapter["beats"]:
            text = beat.get("text", "")
            has_audio = bool(text.strip())
            pre = float(beat.get("pre", default_pre))
            pause = float(beat.get("pauseAfter", default_pause))
            if has_audio:
                start = cursor + pre
                wav_path = VO_DIR / f"{beat['id']}.wav"
                if not wav_path.exists():
                    raise FileNotFoundError(f"missing voice clip: {wav_path}")
                audio = read_wav(wav_path)
                duration = audio.size / SAMPLE_RATE
                end = start + duration
                out = {
                    "id": beat["id"],
                    "text": text,
                    "speak": beat.get("speak"),
                    "voice": beat.get("voice") or defaults.get("voice", "narrator"),
                    "start": round(start, 4),
                    "audioStart": round(start, 4),
                    "audioDuration": round(duration, 4),
                    "end": round(end, 4),
                    "duration": round(duration, 4),
                    "hold": False,
                }
                cursor = end + pause
            else:
                hold = float(beat.get("hold", 1.0))
                start = cursor
                end = start + hold
                out = {
                    "id": beat["id"],
                    "text": "",
                    "start": round(start, 4),
                    "audioStart": None,
                    "audioDuration": 0,
                    "end": round(end, 4),
                    "duration": round(hold, 4),
                    "hold": True,
                }
                cursor = end + pause
            beats_out.append(out)
            all_beats.append(out)
        cursor += tail
        chapter_end = cursor
        chapters_out.append(
            {
                "id": chapter["id"],
                "tag": chapter.get("tag", ""),
                "index": chapter.get("index", ""),
                "title": chapter.get("title", ""),
                "subtitle": chapter.get("subtitle", ""),
                "mood": chapter.get("mood", ""),
                "start": round(chapter_start, 4),
                "end": round(chapter_end, 4),
                "duration": round(chapter_end - chapter_start, 4),
                "leadIn": lead_in,
                "tail": tail,
                "beats": beats_out,
            }
        )

    return {
        "meta": script["meta"],
        "duration": round(cursor, 4),
        "chapters": chapters_out,
        "beats": all_beats,
    }


def assemble_voice(timeline: dict) -> np.ndarray:
    total_samples = int(math.ceil(timeline["duration"] * SAMPLE_RATE)) + SAMPLE_RATE // 2
    track = np.zeros(total_samples, dtype=np.int32)
    for beat in timeline["beats"]:
        if not beat.get("audioStart"):
            continue
        samples = read_wav(VO_DIR / f"{beat['id']}.wav").astype(np.int32)
        start = int(round(beat["audioStart"] * SAMPLE_RATE))
        end = start + samples.size
        if end > track.size:
            track = np.pad(track, (0, end - track.size + SAMPLE_RATE))
        track[start:end] += samples
    # 峰值保护
    peak = int(np.max(np.abs(track))) if track.size else 0
    if peak > 32000:
        track = (track.astype(np.float32) * (32000.0 / peak)).astype(np.int32)
    return track.astype(np.int16)


def wrap_subtitle(text: str, width: int = 22) -> str:
    clean = text.replace("**", "")
    lines: list[str] = []
    current = ""
    for ch in clean:
        current += ch
        if len(current) >= width and ch in "，。！？；：、,.!?;: ":
            lines.append(current.strip())
            current = ""
    if current.strip():
        lines.append(current.strip())
    if not lines:
        return clean
    # 最多两行；超长时在中间硬切
    if len(lines) > 2:
        joined = "".join(lines)
        mid = len(joined) // 2
        lines = [joined[:mid], joined[mid:]]
    return "\n".join(lines)


def srt_time(sec: float) -> str:
    ms = int(round(sec * 1000))
    h, ms = divmod(ms, 3600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def write_srt(timeline: dict, path: Path) -> None:
    entries = []
    n = 0
    for beat in timeline["beats"]:
        if not beat.get("text") or beat.get("audioStart") is None:
            continue
        n += 1
        start = max(0.0, beat["audioStart"] - 0.08)
        end = beat["audioStart"] + beat["audioDuration"] + 0.18
        entries.append(f"{n}\n{srt_time(start)} --> {srt_time(end)}\n{wrap_subtitle(beat['text'])}\n")
    path.write_text("\n".join(entries), encoding="utf-8")


async def main_async(args: argparse.Namespace) -> None:
    script = json.loads(SCRIPT.read_text(encoding="utf-8"))
    VO_DIR.mkdir(parents=True, exist_ok=True)
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)

    jobs = []
    for chapter in script["chapters"]:
        for beat in chapter["beats"]:
            text = speak_text(beat)
            if not text:
                continue
            cfg = voice_config(script, beat)
            h = beat_hash(text, cfg)
            meta_path = VO_DIR / f"{beat['id']}.json"
            wav_path = VO_DIR / f"{beat['id']}.wav"
            need = args.force
            if not need:
                if not wav_path.exists() or not meta_path.exists():
                    need = True
                else:
                    try:
                        meta = json.loads(meta_path.read_text(encoding="utf-8"))
                        need = meta.get("hash") != h
                    except Exception:  # noqa: BLE001
                        need = True
            jobs.append((beat, text, cfg, h, need))

    todo = [j for j in jobs if j[4]]
    if args.timeline_only and todo:
        print(f"注意：有 {len(todo)} 句配音缺失或已过期，--timeline-only 不会重新生成。", file=sys.stderr)
        for beat, *_ in todo:
            if not (VO_DIR / f"{beat['id']}.wav").exists():
                raise SystemExit(f"缺少配音：{beat['id']}，请先运行 pnpm tts")

    print(f"配音句子：{len(jobs)}，需要生成：{len(todo)}")
    sem = asyncio.Semaphore(2)

    async def worker(beat: dict, text: str, cfg: dict, h: str, _need: bool) -> None:
        async with sem:
            mp3_path = CACHE_DIR / f"{beat['id']}.mp3"
            wav_path = VO_DIR / f"{beat['id']}.wav"
            print(f"  · TTS {beat['id']}: {text[:34]}{'…' if len(text) > 34 else ''}")
            await synth_one(text, cfg, mp3_path)
            tmp_wav = CACHE_DIR / f"{beat['id']}.raw.wav"
            mp3_to_wav(mp3_path, tmp_wav)
            raw = read_wav(tmp_wav)
            trimmed = add_edge_fades(trim_silence(raw))
            write_wav(wav_path, trimmed)
            meta = {
                "id": beat["id"],
                "text": text,
                "hash": h,
                "voice": cfg["voice"],
                "rate": cfg["rate"],
                "pitch": cfg["pitch"],
                "duration": round(trimmed.size / SAMPLE_RATE, 4),
            }
            (VO_DIR / f"{beat['id']}.json").write_text(
                json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8"
            )

    if todo:
        await asyncio.gather(*(worker(*j) for j in todo))

    timeline = build_timeline(script)
    TIMELINE.parent.mkdir(parents=True, exist_ok=True)
    TIMELINE.write_text(json.dumps(timeline, ensure_ascii=False, indent=2), encoding="utf-8")

    voice = assemble_voice(timeline)
    write_wav(AUDIO_DIR / "voice_raw.wav", voice)
    write_srt(timeline, AUDIO_DIR / "subtitles.srt")

    print("\n章节时间轴")
    print("-" * 64)
    for ch in timeline["chapters"]:
        print(f"  {ch['index']:>2}  {ch['title']:<12} {ch['start']:7.2f}s → {ch['end']:7.2f}s  ({ch['duration']:6.1f}s)")
    print("-" * 64)
    print(f"  总时长：{timeline['duration']:.2f}s  ≈ {timeline['duration'] / 60:.2f} min")
    print(f"  时间轴：{TIMELINE.relative_to(ROOT)}")
    print(f"  旁白：  {(AUDIO_DIR / 'voice_raw.wav').relative_to(ROOT)}")
    print(f"  字幕：  {(AUDIO_DIR / 'subtitles.srt').relative_to(ROOT)}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="重新生成所有配音")
    parser.add_argument("--timeline-only", action="store_true", help="不联网，只用现有音频重算时间轴")
    args = parser.parse_args()
    asyncio.run(main_async(args))


if __name__ == "__main__":
    main()
