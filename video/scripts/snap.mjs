#!/usr/bin/env node
/**
 * 审阅截图工具：在真实 Chrome 中按时间点截取舞台画面。
 *
 * 用法：
 *   node scripts/snap.mjs --record --times 2,38,75 --out snaps/scene01
 *   node scripts/snap.mjs --record --time 100 --out snaps/frame.png
 *   node scripts/snap.mjs --preview --out snaps/player.png
 */
import puppeteer from "puppeteer-core";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

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

const record = Boolean(arg("record", false));
const preview = Boolean(arg("preview", false));
const width = Number(arg("width", record ? 1920 : 1600));
const height = Number(arg("height", record ? 1080 : 1000));
const out = String(arg("out", "snaps/snap.png"));
const timesArg = arg("times", null);
const timeArg = arg("time", null);
const extra = String(arg("query", ""));
const t = timeArg !== null ? Number(timeArg) : null;
const times =
  timesArg !== null
    ? String(timesArg)
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isFinite(n))
    : null;

await fs.mkdir(path.dirname(out), { recursive: true });

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
  ],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  const params = new URLSearchParams(extra.replace(/^\?/, ""));
  if (record) {
    params.set("record", "1");
    params.set("t", String(t ?? times?.[0] ?? 0));
  } else if (t !== null) {
    params.set("t", String(t));
  }
  const url = `${BASE}/?${params.toString()}`;
  console.log("→", url);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForFunction("window.__ready === true", { timeout: 30000 });

  if (record && (times || t !== null)) {
    const list = times ?? [t];
    for (const sec of list) {
      await page.evaluate(async (s) => {
        window.__seek(s);
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      }, sec);
      // 等一张稳定帧
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r(null))));
      const file = times
        ? out.replace(/\.png$/, `-${String(sec).replace(/\./g, "_")}.png`)
        : out;
      await page.screenshot({ path: file });
      console.log("✓", file);
    }
  } else {
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    await page.screenshot({ path: out });
    console.log("✓", out);
  }
} finally {
  await browser.close();
}
