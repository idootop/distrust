# 《信任的裂缝》· 视频工坊 v6

> 8 个数字，干翻 HTTPS。
> 一部关于 eMudhra 中间证书事件的安全科普视频。

**当前状态：视觉稿 v6 已完成，网页可交互预览；MP4 尚未渲染，等待验收。**

- 时长：**2 分 37 秒**（再拆场景、再砍解释，画面跟着口播走）
- 画幅：**1920 × 1080 @ 30fps**（竖屏 9:16 后续再做，时间轴/配音/脚本可复用）
- 结构：Prologue + `0x01`—`0x06`，对齐 `docs/blog.md` 的六段式叙事
- 风格：小 Lin 说的“讲人话 + 有梗 + 大字”，加上 3b1b 的“用一个视觉隐喻讲清一个概念”
- 视觉：吉祥物 + 物理隐喻 + 全屏动画；**不再用表格/卡片墙/小字说明**
- 配音：edge-tts 草稿（Yunxi / Xiaoxiao，已调快语速）
- 配乐/音效：`scripts/build_audio.py` 程序化合成，无第三方版权素材
- 视频渲染：`scripts/render.mjs`（Chrome 帧捕获 → ffmpeg），**尚未执行**

> 第一版 9 分 12 秒的“信息卡片版”备份在 `docs/v1/`。当前版本是重做后的加速版：更短、更口语，按“一个概念一个画面”重新拆分，补了真实 logo / 素材。

---

## 1. 现在怎么看

开发服务器已经由 `pnpm dev` 启动：

```
http://127.0.0.1:5173/
```

如果服务没在跑：

```bash
cd video
pnpm dev
```

播放器快捷键：

- 空格：播放 / 暂停
- `← / →`：逐秒；`Shift + ← / →`：5 秒
- `, / .`：逐帧；数字 `1–8`：跳章
- `S`：字幕；`M`：静音；`D`：安全区 / 调试；`F`：全屏
- 右上角「旁白与分镜」：按句子跳转
- 网址参数：`?t=42.5`、`?chapter=demo`、`?debug=1`、`?sub=0`、`?record=1`

音频会自动加载 `public/audio/master.m4a`。如果没声音，先确认这个文件存在（构建命令见第 5 节）。

### 逐帧截图

```bash
node scripts/snap.mjs --preview --out snaps/player.png
node scripts/snap.mjs --record --time 200 --out snaps/demo.png
node scripts/snap.mjs --record --times 5,36,93,133,176,222,246,290 --out snaps/check.png
```

---

## 2. 章节与时间码

| # | 章节 | 时间 | 一句话 |
|---|---|---|---|
| 00 | 隔桌有眼 | 00:00–00:16 | 冷开场：一条私聊，隔壁桌同步看到 |
| 01 | 小锁、身份证、章 | 00:16–00:50 | 浏览器小锁 → 证书 → 章被偷 → 8 张中间证书 → 384 位 → 实际 8 位 → 能签任何域名 |
| 02 | 一百分钟 | 00:50–01:09 | Chrome 100 分钟、Firefox 3 小时、第二天吊销 |
| 03 | 关不上的窗 | 01:09–01:36 | 通缉令、curl/git、工具链、飞书/Slack/AI 四个独立页面；一扇窗 |
| 04 | 透明局域网 | 01:36–02:00 | Distrust、ARP 劫持、聊天监听与“老子不干了” |
| 05 | 不止聊天 | 02:00–02:17 | 智能助手删库、免费节点、银行凭证、旧客户端 |
| 06 | 现在，去更新 | 02:17–02:37 | 两件事：保持更新、别连陌生热点；红色片尾 |

完整逐句旁白见 [`docs/script.md`](docs/script.md)。

---

## 3. v6 的视觉思路

v1 的问题：信息卡片太多、字太小、镜头太静，像 PPT 配旁白。

v6 的做法：

- **去 UI 化**：浏览器窗口、聊天面板、终端窗口这些“网页感”元素全部拆掉；只在小锁那一段保留一个浏览器画面。其余改成实体银行卡、会眨眼的证书、聊天气泡、机械臂、CRT 旧终端和实体锁。
- **一个概念，一个吉祥物/道具**
  - `Locky`：绿色小锁，也就是浏览器/HTTPS。会骄傲、会困惑、会害怕、会修链子。
  - `PhoneBaddie`：一只红色单眼手机，负责偷看、偷章、改写消息。
  - `Certy`：会眨眼的证书/身份证；`Keyy`：带表情的私钥；`SleepyApp`：闭着眼的旧客户端。
- **一个章节，一个完整世界**
  - 咖啡店：暖光、桌面、Wi-Fi 波纹、消息复制。
  - 护照办公室：放大镜、印章、传送带、被偷走的 CA 章。
  - 赌场/宇宙：2^384 的球、老虎机、8 个号码球、256 组合的行李锁。
  - 赛场：秒表、赛车、奖杯、绿色对勾雨。
  - 夜晚街区 + 房子：通缉令、睡着的客户端、前门锁着但窗户开着。
  - 霓虹局域网：路由器、Mac、手机、伪造证书、实时聊天镜像。
  - 黑色链条：最弱的一环、修复、报警器、现在去更新。
- **大字 + 少字**：屏幕上只保留 2–6 个字的关键词；解释交给旁白和字幕。
- **持续运动**：每个场景有缓慢推镜、漂浮、眨眼、弹簧入场、粒子、速度线、冲击波；没有“静止一张图”超过 2 秒。
- **声音**：程序化配乐 + 冲击/滑音/铃声/打字/水滴/链条/开关等 SFX，跟着画面走。

---

## 4. 文件结构

```
video/
├─ src/
│  ├─ script/script.json          # 唯一文案源：章节 / 句子 / 停顿 / 音色
│  ├─ generated/timeline.json     # 由 TTS 生成：每句音频时长 + 全局时间轴
│  ├─ scenes/                     # S0 Hook、S1 Cert、S2 Random、S3 Response、
│  │                              # S4 Blind、S5 Demo、S6 Risk、S7 Fix
│  ├─ components/
│  │  ├─ mascots.tsx              # Locky / PhoneBaddie / Certy / Keyy / SleepyApp
│  │  ├─ worlds.tsx               # 全屏世界背景、星空、地面网格、聚光灯
│  │  ├─ Player.tsx / Stage.tsx   # 审阅播放器 + 舞台
│  │  └─ ...
│  ├─ lib/                        # 动效、时间轴、章节上下文
│  └─ styles/global.css           # 舞台 + 审阅界面的设计系统
├─ scripts/
│  ├─ tts.py                      # edge-tts → 逐句 wav → timeline.json
│  ├─ build_audio.py              # 程序化配乐 + 音效 + 对白处理 + 混音
│  ├─ render.mjs                  # Chrome 帧捕获 → ffmpeg → mp4（暂未跑）
│  ├─ snap.mjs                    # 审阅截图
│  └─ export_script.py            # timeline.json → docs/script.md
├─ public/
│  ├─ assets/                     # 真实界面截图、logo
│  ├─ audio/                      # voice_raw / master / 字幕
│  └─ fonts/                      # Inter / JetBrains Mono
├─ docs/
│  ├─ script.md                   # v2 旁白表
│  └─ v1/                         # v1 备份（9:12 版）
├─ snaps/                         # 审阅截图（可删）
└─ build/                         # 音频中间文件 / 渲染产物（已 gitignore）
```

---

## 5. 改文案 / 调节奏 / 换配音

文案源：`src/script/script.json`。每个 beat：

```json
{
  "id": "r4",
  "text": "4、56、66、115、155、156、230、237。",
  "speak": "可选的 TTS 读法",
  "pauseAfter": 0.8
}
```

修改后：

```bash
pnpm tts        # 重新生成配音 + timeline（增量）
pnpm audio      # 重新混音
```

场景动画都以 **beat id** 为锚点（`at("r4")`），改停顿时长画面会自动跟随。

**换音色（最快）**：改 `script.json` 顶部的 `voices`，然后 `pnpm tts -- --force`。

**真人 / 克隆音色**：按 `public/audio/vo/<beat-id>.wav` 替换每句录音（24kHz mono WAV），然后：

```bash
.venv/bin/python scripts/tts.py --timeline-only
pnpm audio
```

**整条旁白替换**：直接替换 `public/audio/voice_raw.wav`，保持与 timeline 等长，然后 `pnpm audio -- --reuse-music`。

---

## 6. 声音

`pnpm audio` 会生成：

- `public/audio/master.wav` / `master.m4a`：最终混音
- `build/audio/music_bed.wav`：配乐 stem
- `build/audio/sfx_bed.wav`：音效 stem
- `build/audio/voice_bed.wav`：对白 stem（已 EQ / 压缩）
- `build/audio/music_raw.wav`：配乐缓存（`--reuse-music` 复用）

配乐是程序化 ambient / pulse；音效也全部用 numpy 合成。想换风格，改 `SECTIONS` / `MOOD_CFG` / `build_sfx` 里的 cue。

> 当前仍是 AI 配音草稿。正式发布前，建议用真人或克隆音色替换；音乐和音效可保留。

---

## 7. 渲染 MP4（验收之后再跑）

```bash
node scripts/render.mjs --probe
node scripts/render.mjs --out "build/信任的裂缝-横屏-1080p.mp4"
node scripts/render.mjs --from 186 --to 232 --out build/demo.mp4   # 先渲一段看
```

渲染器会打开 `?record=1` 舞台，逐帧 `window.__seek(t)`，用 Chrome 截图 pipe 给 ffmpeg（libx264 / crf 18 / yuv420p），最后自动混入 `master.m4a`。

> 没跑全片是刻意的：等你先验收画面、节奏、文案。

---

## 8. 竖屏 9:16 的计划

复用 `timeline.json`、`script.json`、`master.m4a`，给场景加 `portrait` 布局：

- 标题上移，设备/图表纵向排列，字幕区上移；
- 重新设计信息密度高的场景（S2 的 384 位、S5 的聊天、S7 的链条）为纵向卡片流/上下分屏；
- 渲染器支持 `--width 1080 --height 1920`。

建议横屏定稿后再做。

---

## 9. 这版重点看什么

- **是不是“像视频”了**：吉祥物、世界、镜头运动、音效是否让你愿意看下去。
- **节奏**：2:37 是否仍然偏慢/偏赶；TTS 的语速和画面是否咬合。
- **文案**：`docs/script.md` 里有没有你不想要的表述；事实/版本号是否需要补。
- **画面**：S4 的房子、S5 的聊天镜像、S7 的链条是否达到你要的“生动”。
- **声音**：AI 配音是否可接受；音乐是否太满/太薄；SFX 是否抢戏。
- **合规**：片中已写“演示数据均为虚构”“仅用于安全科普与已授权测试”。

## 10. 已知可改进点

- S3 浏览器封禁段可以再加一点“时间流逝”的运动。
- S5 的两块屏幕仍然偏黑；可以再加环境反光/桌面倒影。
- S7 已删掉链条，改成锁小人 + “现在，去更新”居中。
- AI 配音情绪有限；真人/克隆音色会更好。
- 片尾只保留红色 Don't Trust Anyone 与免责声明，不再出现 logo / 网址。
- 竖屏尚未开始。

---

## 11. 免责声明

本视频仅用于安全科普与已授权测试。片中的 IP、域名、会话、聊天内容均为虚构演示数据。
ARP 劫持与证书解密会直接影响他人的网络，请勿在未授权环境中使用。
