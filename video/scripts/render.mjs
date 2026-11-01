#!/usr/bin/env node
/**
 * 1080p 帧渲染器（验收通过后再跑）。
 *
 * 依赖：Chrome + ffmpeg + `pnpm dev`（或 `pnpm build && pnpm preview`）已经启动。
 *
 * 用法：
 *   node scripts/render.mjs --probe
 *   node scripts/render.mjs --out build/信任的裂缝-横屏-1080p.mp4
 *   node scripts/render.mjs --from 30 --to 90 --out build/segment.mp4
 *
 * 参数：
 *   --fps 30        帧率
 *   --out <path>    输出 mp4
 *   --from/--to     起止秒数（预览片段）
 *   --crf 18        x264 质量
 *   --preset slow   x264 preset
 *   --audio <path>  默认 public/audio/master.m4a，存在则自动混入
 *   --video-only    不混音
 *   --probe         只打印时长/帧数
 */
import puppeteer from "puppeteer-core";
import { spawn } from "node:child_process";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { once } from "node:events";

const CHROME =
  process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.VIDEO_BASE || "http://127.0.0.1:5173";

function arg(name, fallback = undefined) {
  const i = process.argv.indexOf(`--${name}`);
  if (i >= 0) {
    const v = process.argv[i + 1];
    return v && !v.startsWith("--") ? v : true;
  }
  return fallback;
}

const fps = Number(arg("fps", 30));
const width = Number(arg("width", 1920));
const height = Number(arg("height", 1080));
const crf = String(arg("crf", 18));
const preset = String(arg("preset", "slow"));
const out = path.resolve(String(arg("out", "build/信任的裂缝-横屏-1080p.mp4")));
const audioPath = path.resolve(String(arg("audio", "public/audio/master.m4a")));
const videoOnly = Boolean(arg("video-only", false));
const probe = Boolean(arg("probe", false));
const fromSec = Number(arg("from", 0));
const toSecArg = arg("to", null);
const toSec = toSecArg !== null ? Number(toSecArg) : null;

await fsp.mkdir(path.dirname(out), { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--force-color-profile=srgb",
    "--hide-scrollbars",
    "--font-render-hinting=none",
    "--disable-background-timer-throttling",
    "--disable-renderer-backgrounding",
    "--disable-features=CalculateNativeWinOcclusion",
  ],
});

let ffmpeg = null;
let finished = false;

async function shutdown(code = 0) {
  if (finished) return;
  finished = true;
  try {
    if (ffmpeg) {
      ffmpeg.stdin.end();
      await once(ffmpeg, "exit").catch(() => {});
    }
  } catch {
    /* noop */
  }
  await browser.close().catch(() => {});
  process.exit(code);
}

try {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  page.on("pageerror", (err) => console.error("[pageerror]", err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") console.error("[console]", msg.text());
  });

  const url = `${BASE}/?record=1&t=0&sub=1`;
  console.log("→", url);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForFunction("window.__ready === true", { timeout: 60000 });
  const duration = await page.evaluate(() => window.__duration);
  const nativeFps = await page.evaluate(() => window.__fps);
  console.log(`→ 时间轴：${duration.toFixed(2)}s · ${nativeFps} fps（渲染用 ${fps} fps）`);
  const totalFrames = Math.max(1, Math.ceil(duration * fps));
  const fromFrame = Math.max(0, Math.round(fromSec * fps));
  const toFrame = toSec === null ? totalFrames : Math.min(totalFrames, Math.round(toSec * fps));
  const count = Math.max(0, toFrame - fromFrame);

  if (probe) {
    console.log(`  总帧数：${totalFrames} · 本次：${count}（${(count / fps).toFixed(1)}s）`);
    await shutdown(0);
  }

  if (!count) {
    console.error("没有可渲染的帧。检查 --from / --to。");
    await shutdown(1);
  }

  const videoOnlyPath = count === totalFrames ? out.replace(/\.mp4$/, ".video-only.mp4") : out;
  console.log("→ 编码：", videoOnlyPath);
  ffmpeg = spawn(
    "ffmpeg",
    [
      "-y",
      "-f", "image2pipe",
      "-framerate", String(fps),
      "-i", "-",
      "-c:v", "libx264",
      "-preset", preset,
      "-crf", crf,
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      videoOnlyPath,
    ],
    { stdio: ["pipe", "inherit", "inherit"] },
  );

  const start = Date.now();
  for (let i = 0; i < count; i++) {
    const frame = fromFrame + i;
    const t = frame / fps;
    await page.evaluate(async (time) => {
      window.__seek(time);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    }, t);
    const buf = await page.screenshot({ type: "jpeg", quality: 95, captureBeyondViewport: false });
    if (!ffmpeg.stdin.write(buf)) await once(ffmpeg.stdin, "drain");
    if (i % 30 === 0 || i === count - 1) {
      const elapsed = (Date.now() - start) / 1000;
      const rate = (i + 1) / Math.max(0.001, elapsed);
      const eta = (count - i - 1) / Math.max(0.001, rate);
      console.log(
        `  frame ${String(frame).padStart(6, "0")} / ${totalFrames}  ${((i + 1) / count * 100).toFixed(1)}%  ${rate.toFixed(2)} fps  ETA ${Math.ceil(eta)}s`,
      );
    }
  }

  ffmpeg.stdin.end();
  const [code] = await once(ffmpeg, "exit");
  ffmpeg = null;
  if (code !== 0) throw new Error(`ffmpeg exited with ${code}`);

  if (!videoOnly && count === totalFrames && fs.existsSync(audioPath)) {
    console.log("→ 混入音轨：", audioPath);
    const temp = out.replace(/\.mp4$/, ".with-audio.mp4");
    await new Promise((resolve, reject) => {
      const p = spawn(
        "ffmpeg",
        [
          "-y", "-i", videoOnlyPath, "-i", audioPath,
          "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
          "-shortest", "-movflags", "+faststart", temp,
        ],
        { stdio: ["ignore", "inherit", "inherit"] },
      );
      p.on("exit", (c) => (c === 0 ? resolve() : reject(new Error(`audio mux exited ${c}`))));
      p.on("error", reject);
    });
    await fsp.rename(temp, out);
    await fsp.unlink(videoOnlyPath).catch(() => {});
  } else {
    if (videoOnlyPath !== out) await fsp.rename(videoOnlyPath, out);
    if (!videoOnly && count === totalFrames) console.log("  （未找到音轨，输出静音视频）");
  }

  const stat = await fsp.stat(out);
  console.log(`✓ 完成：${out}  ${(stat.size / 1024 / 1024).toFixed(1)} MB`);
  await shutdown(0);
} catch (err) {
  console.error("✗ 渲染失败：", err);
  try {
    ffmpeg?.kill("SIGKILL");
  } catch {
    /* noop */
  }
  await shutdown(1);
}
