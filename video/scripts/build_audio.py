#!/usr/bin/env python3
"""
《信任的裂缝》声音设计 / 混音。

- 读取 src/generated/timeline.json 与 public/audio/voice_raw.wav
- 用 numpy 合成原创配乐（drone / pad / pulse / arp / heartbeat）
- 用 numpy 合成音效（impact / whoosh / riser / chime / glitch / tick / type / ...）
- 对白做 EQ / 压缩 / de-ess，并对注入语音做电话化处理
- 侧链压低音乐，混音后输出 48k 立体声 master.wav / master.m4a
"""
from __future__ import annotations

import argparse
import json
import math
import subprocess
import wave
from pathlib import Path

import numpy as np
from scipy import signal
from scipy.io import wavfile

ROOT = Path(__file__).resolve().parent.parent
TIMELINE = ROOT / "src" / "generated" / "timeline.json"
AUDIO = ROOT / "public" / "audio"
BUILD = ROOT / "build" / "audio"
SR = 48000
NEG_INF = -120.0


def db(x: float) -> float:
    return 10 ** (x / 20)


def read_wav(path: Path) -> tuple[np.ndarray, int]:
    sr, data = wavfile.read(path)
    if data.dtype == np.int16:
        data = data.astype(np.float32) / 32768.0
    elif data.dtype == np.int32:
        data = data.astype(np.float32) / 2147483648.0
    else:
        data = data.astype(np.float32)
    if data.ndim == 1:
        data = np.stack([data, data])
    else:
        data = data.T
    return data.astype(np.float32), sr


def write_wav(path: Path, data: np.ndarray, sr: int = SR) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if data.ndim == 1:
        data = np.stack([data, data])
    data = np.clip(data, -1, 1)
    wavfile.write(path, sr, (data.T * 32767).astype(np.int16))


def sos_filter(x: np.ndarray, kind: str, freq, order=2) -> np.ndarray:
    nyq = SR / 2
    if isinstance(freq, (list, tuple)):
        sos = signal.butter(order, [f / nyq for f in freq], btype=kind, output="sos")
    else:
        sos = signal.butter(order, freq / nyq, btype=kind, output="sos")
    return signal.sosfilt(sos, x).astype(np.float32)


def lp(x, f, order=2):
    return sos_filter(x, "lowpass", f, order)


def hp(x, f, order=2):
    return sos_filter(x, "highpass", f, order)


def bp(x, lo, hi, order=2):
    return sos_filter(x, "bandpass", [lo, hi], order)


def env_ad(n: int, attack: float, release: float, sustain: float = 1.0) -> np.ndarray:
    a = max(1, int(attack * SR))
    r = max(1, int(release * SR))
    e = np.ones(n, dtype=np.float32) * sustain
    if a < n:
        e[:a] *= np.linspace(0, 1, a, dtype=np.float32)
    if r < n:
        e[-r:] *= np.linspace(1, 0, r, dtype=np.float32)
    return e


def pan_gains(pan: float) -> tuple[float, float]:
    p = max(-1.0, min(1.0, pan))
    ang = (p + 1) * math.pi / 4
    return math.cos(ang), math.sin(ang)


class Mix:
    def __init__(self, seconds: float):
        self.n = int(math.ceil(seconds * SR)) + SR
        self.data = np.zeros((2, self.n), dtype=np.float32)

    def add(self, sig: np.ndarray, start: float, gain: float = 1.0, pan: float = 0.0):
        if sig.ndim == 1:
            gl, gr = pan_gains(pan)
            sig = np.stack([sig * gl, sig * gr])
        i = int(round(start * SR))
        if i < 0:
            sig = sig[:, -i:]
            i = 0
        end = min(self.n, i + sig.shape[1])
        if end <= i:
            return
        self.data[:, i:end] += sig[:, : end - i] * gain

    def rms(self) -> float:
        return float(np.sqrt(np.mean(self.data**2)))


# ---------------------------------------------------------------- music synth


def note_wave(freq: float, n: int, harm: int = 6) -> np.ndarray:
    t = np.arange(n, dtype=np.float32) / SR
    sig = np.zeros(n, dtype=np.float32)
    for h in range(1, harm + 1):
        sig += np.sin(2 * np.pi * freq * h * t + h * 0.37) / (h**1.35)
    return sig / 2.0


def pad(freqs: list[float], dur: float, amp=0.045, attack=2.2, release=3.0, cutoff=1600) -> np.ndarray:
    n = int(dur * SR)
    sig = np.zeros(n, dtype=np.float32)
    for f in freqs:
        sig += note_wave(f * 0.9985, n, 5) * 0.8
        sig += note_wave(f * 1.0015, n, 5) * 0.8
        sig += np.sin(2 * np.pi * (f / 2) * np.arange(n) / SR).astype(np.float32) * 0.5
    sig = lp(sig / max(1, len(freqs)), cutoff, 2)
    return sig * env_ad(n, attack, release) * amp


def pluck(freq: float, dur=2.0, amp=0.05) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n, dtype=np.float32) / SR
    sig = (
        np.sin(2 * np.pi * freq * t) * np.exp(-2.8 * t)
        + 0.35 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-4.5 * t)
        + 0.15 * np.sin(2 * np.pi * freq * 3 * t) * np.exp(-6.0 * t)
    ).astype(np.float32)
    return sig * env_ad(n, 0.004, 0.05) * amp


def kick(dur=0.55, amp=0.18, f0=110, f1=44, decay=8.0) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n, dtype=np.float32) / SR
    f = f1 + (f0 - f1) * np.exp(-t * 24)
    phase = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(phase) * np.exp(-t * decay)
    click = np.random.default_rng(3).normal(0, 1, n).astype(np.float32) * np.exp(-t * 380)
    return (body + 0.35 * click) * amp


def tick(amp=0.05) -> np.ndarray:
    n = int(0.09 * SR)
    t = np.arange(n, dtype=np.float32) / SR
    rng = np.random.default_rng(7)
    noise = rng.normal(0, 1, n).astype(np.float32)
    noise = hp(noise, 2600, 2) * np.exp(-t * 65)
    tone = np.sin(2 * np.pi * 1900 * t) * np.exp(-t * 90)
    return (noise * 0.7 + tone * 0.4) * amp


def heartbeat(amp=0.2) -> np.ndarray:
    n = int(0.85 * SR)
    out = np.zeros(n, dtype=np.float32)
    for at, g in [(0.0, 1.0), (0.2, 0.62)]:
        k = kick(0.35, amp * g, 80, 36, 10)
        i = int(at * SR)
        out[i : i + len(k)] += k
    return lp(out, 160, 2)


def impact(dur=3.2, amp=0.6) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n, dtype=np.float32) / SR
    f = 42 + 58 * np.exp(-t * 8)
    phase = 2 * np.pi * np.cumsum(f) / SR
    boom = np.sin(phase) * np.exp(-t * 1.8)
    rng = np.random.default_rng(11)
    rumble = lp(rng.normal(0, 1, n).astype(np.float32), 180, 2) * np.exp(-t * 2.3)
    sig = (boom * 0.9 + rumble * 0.5) * amp
    return sig


def whoosh(dur=1.4, amp=0.22, up=True) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n, dtype=np.float32) / SR
    rng = np.random.default_rng(13)
    noise = rng.normal(0, 1, n).astype(np.float32)
    blocks = 24
    out = np.zeros(n, dtype=np.float32)
    bs = n // blocks + 1
    for i in range(blocks):
        u = i / (blocks - 1)
        cut = (300 + 5200 * (u if up else 1 - u)) if up else (300 + 5200 * (1 - u))
        a = max(0, i * bs - 200)
        b = min(n, (i + 1) * bs + 200)
        seg = noise[a:b]
        seg = bp(seg, max(60, cut * 0.45), min(20000, cut * 1.8))
        win = np.hanning(b - a).astype(np.float32)
        out[a:b] += seg * win
    return out * env_ad(n, 0.15, 0.35) * amp


def riser(dur=3.5, amp=0.22) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n, dtype=np.float32) / SR
    rng = np.random.default_rng(17)
    noise = rng.normal(0, 1, n).astype(np.float32)
    blocks = 32
    out = np.zeros(n, dtype=np.float32)
    bs = n // blocks + 1
    for i in range(blocks):
        u = i / (blocks - 1)
        cut = 180 + 7000 * (u**2)
        a = max(0, i * bs - 300)
        b = min(n, (i + 1) * bs + 300)
        seg = bp(noise[a:b], max(60, cut * 0.5), min(20000, cut * 2.2))
        win = np.hanning(b - a).astype(np.float32)
        out[a:b] += seg * win
    sweep = np.sin(2 * np.pi * (90 + 190 * (t / dur) ** 2) * t) * (t / dur) ** 1.5
    return (out * 0.7 + sweep * 0.25) * amp


def chime(freq=880, dur=1.8, amp=0.12) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n, dtype=np.float32) / SR
    partials = [(1.0, 1.0, 2.2), (2.01, 0.5, 3.0), (3.9, 0.22, 4.6), (5.4, 0.1, 6.0)]
    sig = np.zeros(n, dtype=np.float32)
    for ratio, g, dec in partials:
        sig += g * np.sin(2 * np.pi * freq * ratio * t) * np.exp(-t * dec)
    return sig * env_ad(n, 0.003, 0.15) * amp


def error(dur=0.6, amp=0.16) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n, dtype=np.float32) / SR
    a = signal.square(2 * np.pi * 118 * t).astype(np.float32)
    b = signal.square(2 * np.pi * 167 * t).astype(np.float32)
    sig = (a * 0.6 + b * 0.4) * np.exp(-t * 3.2)
    sig = np.round(sig * 12) / 12
    return lp(sig, 3200) * env_ad(n, 0.002, 0.1) * amp


def glitch(dur=0.45, amp=0.16) -> np.ndarray:
    n = int(dur * SR)
    rng = np.random.default_rng(23)
    x = rng.normal(0, 1, n).astype(np.float32)
    hold = 12
    x = np.repeat(x[::hold], hold)[:n]
    x = np.round(x * 8) / 8
    gate = (np.sin(2 * np.pi * 17 * np.arange(n) / SR) > -0.2).astype(np.float32)
    return bp(x * gate, 300, 7000) * env_ad(n, 0.002, 0.12) * amp


def stamp(amp=0.3) -> np.ndarray:
    n = int(0.7 * SR)
    t = np.arange(n, dtype=np.float32) / SR
    thud = np.sin(2 * np.pi * (62 + 20 * np.exp(-t * 20)) * t) * np.exp(-t * 8)
    rng = np.random.default_rng(29)
    paper = hp(rng.normal(0, 1, n).astype(np.float32), 900) * np.exp(-t * 25)
    return (thud * 0.9 + paper * 0.5) * amp


def notify(amp=0.1) -> np.ndarray:
    n = int(0.7 * SR)
    out = np.zeros(n, dtype=np.float32)
    for at, f in [(0.0, 1046), (0.13, 1568)]:
        k = chime(f, 0.5, amp)
        i = int(at * SR)
        out[i : i + len(k)] += k
    return out


def typing(dur=1.4, amp=0.07) -> np.ndarray:
    n = int(dur * SR)
    out = np.zeros(n, dtype=np.float32)
    rng = np.random.default_rng(31)
    t = 0.0
    while t < dur - 0.05:
        k = tick(amp * (0.6 + rng.random() * 0.6))
        i = int(t * SR)
        room = n - i
        if room > 0:
            out[i : i + len(k)] += k[:room]
        t += 0.035 + rng.random() * 0.06
    return out


def water(amp=0.08) -> np.ndarray:
    n = int(0.7 * SR)
    t = np.arange(n, dtype=np.float32) / SR
    f = 900 * np.exp(-t * 8) + 180
    phase = 2 * np.pi * np.cumsum(f) / SR
    sig = np.sin(phase) * np.exp(-t * 6)
    rng = np.random.default_rng(37)
    splash = bp(rng.normal(0, 1, n).astype(np.float32), 600, 5000) * np.exp(-t * 20)
    return (sig * 0.7 + splash * 0.25) * amp


def chain(amp=0.12) -> np.ndarray:
    n = int(0.9 * SR)
    t = np.arange(n, dtype=np.float32) / SR
    rng = np.random.default_rng(41)
    metal = bp(rng.normal(0, 1, n).astype(np.float32), 2200, 9000) * np.exp(-t * 12)
    ring = np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 9) * 0.4
    return (metal * 0.7 + ring) * amp


def switch(amp=0.08) -> np.ndarray:
    n = int(0.18 * SR)
    t = np.arange(n, dtype=np.float32) / SR
    rng = np.random.default_rng(43)
    click = hp(rng.normal(0, 1, n).astype(np.float32), 2500) * np.exp(-t * 160)
    tone = np.sin(2 * np.pi * 1500 * t) * np.exp(-t * 80)
    return (click * 0.7 + tone * 0.3) * amp


def warn(amp=0.13) -> np.ndarray:
    n = int(0.75 * SR)
    t = np.arange(n, dtype=np.float32) / SR
    beep = signal.square(2 * np.pi * 330 * t).astype(np.float32)
    gate = ((t < 0.18) | ((t > 0.3) & (t < 0.48))).astype(np.float32)
    return lp(beep * gate, 2500) * env_ad(n, 0.005, 0.05) * amp


def shutter(amp=0.16) -> np.ndarray:
    n = int(0.3 * SR)
    t = np.arange(n, dtype=np.float32) / SR
    rng = np.random.default_rng(47)
    click = hp(rng.normal(0, 1, n).astype(np.float32), 3000) * np.exp(-t * 90)
    mech = np.sin(2 * np.pi * (300 + 900 * np.exp(-t * 40)) * t) * np.exp(-t * 35)
    return (click * 0.7 + mech * 0.3) * amp


def power(amp=0.2) -> np.ndarray:
    n = int(2.4 * SR)
    t = np.arange(n, dtype=np.float32) / SR
    f = 180 + 620 * (t / n) ** 1.6
    phase = 2 * np.pi * np.cumsum(f) / SR
    sig = np.sin(phase) * np.exp(-np.maximum(0, t - 0.5) * 1.8)
    c = chime(1046, 2.2, 0.4)
    sig[: min(n, c.size)] += c[: min(n, c.size)]
    return sig * amp


# ---------------------------------------------------------------- score


CHORDS = {
    "Dm": [73.42, 110.0, 146.83, 174.61],
    "Bb": [58.27, 87.31, 116.54, 146.83],
    "F": [87.31, 130.81, 174.61, 220.0],
    "C": [65.41, 98.0, 130.81, 164.81],
    "Gm": [49.0, 73.42, 98.0, 116.54],
    "A": [55.0, 82.41, 110.0, 138.59],
    "Eb": [77.78, 116.54, 155.56, 196.0],
    "D": [73.42, 110.0, 146.83, 185.0],
}

def make_sections(timeline: dict):
    beats = {b["id"]: b for b in timeline["beats"]}
    chapters = {c["id"]: c for c in timeline["chapters"]}

    def bt(beat_id: str) -> float:
        return float(beats[beat_id]["start"])

    def ch(chapter_id: str):
        c = chapters[chapter_id]
        return float(c["start"]), float(c["end"])

    h0, h1 = ch("hook")
    c0, c1 = ch("cert")
    s0, s1 = ch("response")
    b0, b1 = ch("blind")
    d0, d1 = ch("demo")
    x0, x1 = ch("risk")
    f0, f1 = ch("fix")
    return [
        (h0, h1, "mystery", ["Dm", "Dm", "Bb", "Gm"]),
        (c0, c1, "curiosity", ["Dm", "Bb", "F", "C"]),
        (s0, bt("s5"), "relief", ["F", "C", "Dm", "Bb"]),
        (bt("s5"), s1, "cut", ["Dm"]),
        (b0, b1, "tension", ["Dm", "Bb", "Gm", "A"]),
        (d0, bt("d7"), "demo", ["Dm", "F", "Bb", "C"]),
        (bt("d7"), d1, "creep", ["Gm", "Dm", "Bb", "A"]),
        (x0, x1, "danger", ["Dm", "Eb", "Bb", "A"]),
        (f0, bt("f4"), "resolve", ["Bb", "F", "C", "D"]),
        (bt("f4"), f1, "finale", ["D", "Bb", "F", "D"]),
    ]


MOOD_CFG = {
    "mystery": dict(pad=0.036, cutoff=900, pulse=0.0, arp=0.018, arp_step=3.0, heart=True),
    "curiosity": dict(pad=0.032, cutoff=1500, pulse=0.0, arp=0.026, arp_step=1.5, heart=False),
    "scale": dict(pad=0.032, cutoff=1800, pulse=0.0, arp=0.03, arp_step=2.0, heart=False),
    "bug": dict(pad=0.04, cutoff=1100, pulse=0.0, arp=0.016, arp_step=4.0, heart=True),
    "relief": dict(pad=0.034, cutoff=2200, pulse=0.07, arp=0.028, arp_step=1.0, heart=False),
    "cut": dict(pad=0.0, cutoff=400, pulse=0.0, arp=0.0, arp_step=4.0, heart=False),
    "tension": dict(pad=0.038, cutoff=1200, pulse=0.0, arp=0.018, arp_step=2.0, heart=True),
    "collapse": dict(pad=0.04, cutoff=700, pulse=0.0, arp=0.0, arp_step=4.0, heart=True),
    "demo": dict(pad=0.03, cutoff=1700, pulse=0.08, arp=0.026, arp_step=0.75, heart=False),
    "creep": dict(pad=0.04, cutoff=1000, pulse=0.02, arp=0.012, arp_step=3.0, heart=True),
    "danger": dict(pad=0.04, cutoff=1200, pulse=0.0, arp=0.014, arp_step=2.0, heart=True),
    "resolve": dict(pad=0.045, cutoff=2200, pulse=0.06, arp=0.026, arp_step=1.5, heart=False),
    "finale": dict(pad=0.055, cutoff=2600, pulse=0.05, arp=0.03, arp_step=2.0, heart=False),
}


def build_music(total: float, sections) -> Mix:
    mix = Mix(total)
    rng = np.random.default_rng(101)
    for sec_start, sec_end, mood, prog in sections:
        cfg = MOOD_CFG[mood]
        dur = sec_end - sec_start
        if dur <= 0.2:
            continue
        pos = sec_start
        idx = 0
        while pos < sec_end - 0.5:
            chord = CHORDS[prog[idx % len(prog)]]
            block = min(10.0, sec_end - pos + 1.5)
            if cfg["pad"] > 0:
                sig = pad(chord, block, cfg["pad"], attack=1.8, release=2.4, cutoff=cfg["cutoff"])
                mix.add(sig, pos, 1.0, -0.15)
            if cfg["pulse"] > 0:
                bpm = 84 if mood in ("relief", "resolve", "finale") else 100
                beat = 60 / bpm * 2
                p = pos
                while p < min(pos + 8, sec_end):
                    if int((p - sec_start) / beat) % 2 == 0:
                        mix.add(kick(0.6, cfg["pulse"], 100, 42, 8), p, 1.0, 0.0)
                    mix.add(tick(0.02), p + beat * 0.5, 1.0, 0.2)
                    p += beat
            if cfg["arp"] > 0:
                step = cfg["arp_step"]
                p = pos
                k = 0
                while p < min(pos + 8, sec_end):
                    f = chord[(k * 2 + 1) % len(chord)] * 2
                    sig = pluck(f, 2.2, cfg["arp"])
                    mix.add(sig, p, 1.0, 0.35 if k % 2 == 0 else -0.35)
                    mix.add(sig, p + 0.42, 0.28, -0.35 if k % 2 == 0 else 0.35)
                    p += step
                    k += 1
            if cfg["heart"] and int((pos - sec_start) // 8) % 2 == 0:
                hb = heartbeat(0.16)
                mix.add(hb, pos + 1.0, 1.0, 0.0)
                mix.add(hb, pos + 4.4, 0.7, 0.0)
            pos += 8.0
            idx += 1
    # low room tone
    n = mix.n
    rng = np.random.default_rng(202)
    room = lp(rng.normal(0, 1, n).astype(np.float32), 120, 2) * 0.006
    mix.data += np.stack([room, np.roll(room, 1750)])
    return mix


def build_sfx(total: float, timeline: dict) -> Mix:
    mix = Mix(total)
    beats = {b["id"]: b for b in timeline["beats"]}
    chapters = timeline["chapters"]

    def at(beat_id: str, offset: float = 0.0) -> float:
        return float(beats[beat_id]["start"]) + offset

    def add(kind: str, t: float, gain=1.0, pan=0.0):
        if t < 0 or t > total:
            return
        table = {
            "impact": lambda: impact(3.2, 0.55),
            "whoosh": lambda: whoosh(1.5, 0.24),
            "riser": lambda: riser(3.2, 0.2),
            "chime": lambda: chime(980, 1.8, 0.1),
            "chime2": lambda: chime(1318, 1.4, 0.09),
            "error": lambda: error(0.55, 0.15),
            "glitch": lambda: glitch(0.4, 0.13),
            "stamp": lambda: stamp(0.3),
            "notify": lambda: notify(0.1),
            "type": lambda: typing(1.3, 0.06),
            "tick": lambda: tick(0.04),
            "water": lambda: water(0.07),
            "chain": lambda: chain(0.11),
            "switch": lambda: switch(0.07),
            "warn": lambda: warn(0.11),
            "shutter": lambda: shutter(0.14),
            "power": lambda: power(0.17),
        }
        if kind not in table:
            return
        mix.add(table[kind](), t, gain, pan)

    # 章节转场
    for c in chapters[1:]:
        add("whoosh", c["start"] - 0.22, 0.65, -0.2)
        add("impact", c["start"] + 0.02, 0.28, 0.0)

    # hook
    add("notify", at("h1", 0.4), 0.7, 0.1)
    add("tick", at("h1", 0.2), 0.5)
    add("whoosh", at("h2", 0.1), 0.6, -0.2)
    add("impact", at("h2", 0.2), 0.5)
    add("glitch", at("h3", 0.2), 0.6)
    add("riser", at("h4", -0.3), 0.8)
    add("impact", at("h4", 0.0), 0.9)
    add("chain", at("h4", 0.6), 0.8)

    # cert
    add("stamp", at("c1", 0.5), 0.8)
    add("stamp", at("c3", 0.4), 1.0)
    add("error", at("c4", 0.5), 0.5)
    add("glitch", at("c5", 0.4), 0.8)
    add("whoosh", at("c6", 0.1), 0.6, -0.2)
    add("chain", at("c7", 0.3), 0.7)
    add("chime", at("c8", 0.3), 0.45, 0.2)

    # response
    add("whoosh", at("s1", 0.1), 0.5)
    add("stamp", at("s1", 0.6), 0.6)
    add("riser", at("s2", 0.1), 0.7)
    add("tick", at("s2", 0.8), 0.6)
    add("chime", at("s3", 0.2), 0.6)
    add("stamp", at("s4", 0.2), 0.5)
    add("impact", at("s5", 0.0), 0.7)
    add("chime", at("s5", 0.5), 0.5)
    for i in range(8):
        add("chime", at("s6", 0.2 + i * 0.1), 0.4, -0.3 + i * 0.08)
    add("glitch", at("s7", -0.05), 1.0)
    add("impact", at("s7", 0.0), 1.0)

    # blind
    # blind
    add("stamp", at("b1", 0.6), 0.8)
    for i in range(4):
        add("tick", at("b2", 0.7 + i * 0.5), 0.55, -0.2 + i * 0.12)
    add("type", at("b3", 0.2), 0.5)
    add("error", at("b4", 0.3), 0.4)
    add("whoosh", at("b5", 0.2), 0.4, -0.3)
    add("impact", at("b6", 0.0), 0.9)
    add("glitch", at("b6", 0.1), 0.7)

    # demo
    add("power", at("d1", 0.1), 0.5)
    add("notify", at("d2", 0.5), 0.5, 0.2)
    add("glitch", at("d3", 0.2), 0.7)
    add("notify", at("d7", 0.2), 0.6, 0.2)
    add("notify", at("d8", 0.2), 0.6, -0.2)
    add("glitch", at("d8b", 0.0), 0.8)
    add("impact", at("d9", 0.0), 0.45)
    add("impact", at("d10", 0.0), 0.6)

    # risk
    add("glitch", at("x2", 0.1), 0.6)
    add("type", at("x2", 0.2), 0.5)
    add("impact", at("x2", 1.2), 0.7)
    add("glitch", at("x3", 0.2), 0.5)
    add("impact", at("x3", 0.4), 0.6)
    add("whoosh", at("x3", 0.8), 0.4)
    add("impact", at("x4", 0.0), 0.8)
    add("chain", at("x5", 0.2), 0.6)
    add("switch", at("x5", 0.6), 0.5)
    add("riser", at("x6", -0.4), 0.7)
    add("impact", at("x6", 0.0), 1.0)

    # fix
    add("chime", at("f1", 0.2), 0.5)
    add("power", at("f2", 0.1), 0.5)
    add("riser", at("f2", 0.0), 0.4)
    add("switch", at("f3", 0.3), 0.6)
    add("warn", at("f3", 0.9), 0.35)
    add("chain", at("f4", 0.3), 0.8)
    add("chime2", at("f4", 0.8), 0.6)
    add("riser", at("f4", -0.2), 0.7)
    add("impact", at("f4", 0.1), 0.8)
    add("chime", at("f_end", 0.3), 0.5)

    return mix


# ---------------------------------------------------------------- voice


def process_voice(total: float) -> np.ndarray:
    raw = AUDIO / "voice_raw.wav"
    out = BUILD / "voice_processed.wav"
    BUILD.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            "ffmpeg", "-y", "-loglevel", "error", "-i", str(raw),
            "-af",
            "highpass=f=70,equalizer=f=220:t=q:w=1.2:g=1.4,"
            "equalizer=f=3400:t=q:w=1.2:g=1.0,deesser=i=0.3,"
            "acompressor=threshold=-20dB:ratio=3:attack=8:release=150:makeup=1.5,"
            "aresample=48000",
            "-ac", "2", "-c:a", "pcm_s16le", str(out),
        ],
        check=True,
    )
    data, sr = read_wav(out)
    assert sr == SR
    target_n = int(math.ceil(total * SR))
    if data.shape[1] < target_n:
        data = np.pad(data, ((0, 0), (0, target_n - data.shape[1])))
    data = data[:, :target_n]
    # telephone / uncanny processing for the injected line
    timeline = json.loads(TIMELINE.read_text(encoding="utf-8"))
    beat = next(b for b in timeline["beats"] if b["id"] == "d8b")
    a = int(beat["audioStart"] * SR)
    b = int((beat["audioStart"] + beat["audioDuration"]) * SR)
    seg = data[:, a:b].copy()
    if seg.shape[1] > 100:
        mono = seg.mean(axis=0)
        sos = signal.butter(4, [380 / (SR / 2), 3400 / (SR / 2)], btype="band", output="sos")
        mono = signal.sosfilt(sos, mono).astype(np.float32)
        mono = np.round(mono * 24) / 24
        delay = int(0.028 * SR)
        echo = np.zeros_like(mono)
        echo[delay:] = mono[:-delay] * 0.25
        mono = mono + echo
        mono = np.tanh(mono * 1.6) * 0.8
        data[:, a:b] = np.stack([mono, mono])
    # RMS normalize to -19 dBFS
    rms = float(np.sqrt(np.mean(data**2)))
    if rms > 1e-9:
        data *= db(-19) / rms
    peak = float(np.max(np.abs(data)))
    if peak > 0.95:
        data *= 0.95 / peak
    write_wav(BUILD / "voice_norm.wav", data)
    return data


def duck_music(music: np.ndarray, voice: np.ndarray) -> np.ndarray:
    hop = int(0.02 * SR)
    n = music.shape[1]
    env = np.zeros(n, dtype=np.float32)
    v = np.abs(voice).mean(axis=0)
    for i in range(0, n, hop):
        env[i : i + hop] = float(np.sqrt(np.mean(v[i : i + hop] ** 2))) if i < v.size else 0
    # smooth envelope with attack/release
    k = int(0.15 * SR)
    kernel = np.hanning(k).astype(np.float32)
    kernel /= kernel.sum()
    env = signal.fftconvolve(env, kernel, mode="same").astype(np.float32)
    env = np.clip(env / (db(-24)), 0, 1)
    gain = 1.0 - 0.45 * env
    return music * gain


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--no-master", action="store_true")
    parser.add_argument("--reuse-music", action="store_true")
    args = parser.parse_args()
    timeline = json.loads(TIMELINE.read_text(encoding="utf-8"))
    total = float(timeline["duration"])
    BUILD.mkdir(parents=True, exist_ok=True)

    sections = make_sections(timeline)
    sig = json.dumps([[round(a, 3), round(b, 3), m] for a, b, m, _ in sections], ensure_ascii=False)
    sig_hash = __import__("hashlib").sha1(sig.encode()).hexdigest()[:12]
    music_cache = BUILD / "music_raw.wav"
    cache_meta = BUILD / "music_raw.json"
    music = None
    if args.reuse_music and music_cache.exists() and cache_meta.exists():
        try:
            meta = json.loads(cache_meta.read_text())
            if abs(float(meta.get("duration", -1)) - total) < 0.05 and meta.get("hash") == sig_hash:
                data, sr = read_wav(music_cache)
                music = Mix(total)
                music.data[:, : min(music.n, data.shape[1])] = data[:, : min(music.n, data.shape[1])]
                print("→ 复用配乐缓存…", flush=True)
        except Exception:
            music = None
    if music is None:
        print("→ 合成配乐…", flush=True)
        music = build_music(total, sections)
        write_wav(music_cache, music.data)
        cache_meta.write_text(json.dumps({"duration": total, "hash": sig_hash}, ensure_ascii=False))
    print("→ 合成音效…", flush=True)
    sfx = build_sfx(total, timeline)
    print("→ 处理对白…", flush=True)
    voice = process_voice(total)

    # levels (RMS based) before ducking
    def set_rms(buf: np.ndarray, target_db: float) -> np.ndarray:
        r = float(np.sqrt(np.mean(buf**2)))
        if r < 1e-9:
            return buf
        return buf * (db(target_db) / r)

    voice = set_rms(voice, -19.0)
    vpeak = float(np.max(np.abs(voice)))
    if vpeak > 0.9:
        voice *= 0.9 / vpeak
    music_d = duck_music(music.data, voice)
    music_d = set_rms(music_d, -27.5)
    # keep music a bit fuller in the finale
    sfx_peak = float(np.max(np.abs(sfx.data)))
    sfx_d = sfx.data * (db(-8.0) / sfx_peak) if sfx_peak > 1e-9 else sfx.data

    print("→ 混音…", flush=True)
    n_total = int(math.ceil(total * SR))
    voice = voice[:, :n_total]
    music_d = music_d[:, :n_total]
    sfx_d = sfx_d[:, :n_total]
    mix = voice + music_d + sfx_d
    # gentle bus glue + soft limiter
    mix = np.tanh(mix * 1.08) / np.tanh(1.08)
    peak = float(np.max(np.abs(mix)))
    if peak > 0.98:
        mix *= 0.98 / peak
    write_wav(BUILD / "mix_premaster.wav", mix)
    write_wav(BUILD / "music_bed.wav", music_d)
    write_wav(BUILD / "sfx_bed.wav", sfx_d)
    write_wav(BUILD / "voice_bed.wav", voice)

    if not args.no_master:
        print("→ loudnorm + AAC…", flush=True)
        master = AUDIO / "master.wav"
        subprocess.run(
            [
                "ffmpeg", "-y", "-loglevel", "error", "-i", str(BUILD / "mix_premaster.wav"),
                "-af", "loudnorm=I=-15:TP=-1.0:LRA=9",
                "-ar", "48000", "-ac", "2", "-c:a", "pcm_s16le", str(master),
            ],
            check=True,
        )
        subprocess.run(
            [
                "ffmpeg", "-y", "-loglevel", "error", "-i", str(master),
                "-c:a", "aac", "-b:a", "192k", str(AUDIO / "master.m4a"),
            ],
            check=True,
        )
        print("   master.wav / master.m4a")

    # stats
    def stats(name: str, x: np.ndarray):
        r = float(np.sqrt(np.mean(x**2)))
        p = float(np.max(np.abs(x)))
        print(f"   {name:<10} RMS {20*math.log10(max(r,1e-9)):6.1f} dBFS · peak {20*math.log10(max(p,1e-9)):6.1f} dBFS")

    stats("voice", voice)
    stats("music", music_d)
    stats("sfx", sfx_d)
    stats("mix", mix)
    print(f"   时长 {total/60:.2f} min")


if __name__ == "__main__":
    main()
