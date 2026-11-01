#!/usr/bin/env python3
"""从 timeline.json 导出可读的旁白/分镜表。"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
timeline = json.loads((ROOT / "src/generated/timeline.json").read_text(encoding="utf-8"))
out = ROOT / "docs" / "script.md"
out.parent.mkdir(parents=True, exist_ok=True)

def fmt(s):
    m = int(s // 60)
    sec = s % 60
    return f"{m:02d}:{sec:05.2f}"

lines = [
    "# 《信任的裂缝》旁白与分镜表",
    "",
    f"- 总时长：{fmt(timeline['duration'])}（{timeline['duration']/60:.2f} min）",
    f"- 画幅：{timeline['meta']['width']} × {timeline['meta']['height']} · {timeline['meta']['fps']} fps",
    "- 配音：edge-tts 草稿（Yunxi / Xiaoxiao），可替换为真人或克隆音色",
    "- 时间码以成片为准；修改 `src/script/script.json` 后运行 `pnpm tts` 会重新生成",
    "",
]
for c in timeline["chapters"]:
    lines.append(f"## {c['tag']} · {c['title']}")
    lines.append("")
    lines.append(f"> {fmt(c['start'])} – {fmt(c['end'])} · {c['duration']:.1f}s · {c['subtitle']}")
    lines.append("")
    lines.append("| 时间 | 时长 | 旁白 |")
    lines.append("|---|---:|---|")
    for b in c["beats"]:
        if b.get("text", "").strip():
            text = b["text"].replace("**", "")
            lines.append(f"| {fmt(b['start'])} | {b['audioDuration']:.1f}s | {text} |")
        else:
            lines.append(f"| {fmt(b['start'])} | {b['duration']:.1f}s | *（纯视觉停顿）* |")
    lines.append("")
out.write_text("\n".join(lines), encoding="utf-8")
print(out)
