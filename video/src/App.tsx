import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Stage } from "./components/Stage";
import { Player } from "./components/Player";
import { ReviewDrawer } from "./components/ReviewDrawer";
import { HelpModal } from "./components/HelpModal";
import { HelpIcon, LogoMark, PanelIcon, PlayIcon } from "./components/icons";
import { CHAPTERS, DURATION, FPS, chapterById, timeline } from "./lib/timeline";
import { clamp } from "./lib/time";

const ASSETS = [
  "/assets/logo.svg",
  "/assets/admin-overview.png",
  "/assets/admin-chats.png",
  "/assets/admin-flows.png",
  "/assets/admin-rules-rewrite.png",
  "/assets/admin-devices.png",
  "/assets/admin-logs.png",
  "/assets/feishu-chat.png",
];

function useQuery() {
  return useRef(new URLSearchParams(window.location.search)).current;
}

export default function App() {
  const query = useQuery();
  const record = query.get("record") === "1";
  const chapterParam = query.get("chapter");
  const tParam = Number(query.get("t"));
  const initial = Number.isFinite(tParam) && tParam > 0
    ? clamp(tParam, 0, DURATION)
    : chapterParam && chapterById(chapterParam)
      ? chapterById(chapterParam)!.start + 0.01
      : 0;

  const [time, setTimeState] = useState(initial);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(query.get("mute") === "1");
  const [subtitles, setSubtitles] = useState(query.get("sub") !== "0");
  const [debug, setDebug] = useState(query.get("debug") === "1");
  const [drawer, setDrawer] = useState(false);
  const [help, setHelp] = useState(false);
  const [scale, setScale] = useState(0.64);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showCenter, setShowCenter] = useState(!record);

  const areaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timeRef = useRef(time);
  const playingRef = useRef(playing);
  const toastTimer = useRef<number | null>(null);

  timeRef.current = time;
  playingRef.current = playing;

  const flashToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  }, []);

  const seek = useCallback((next: number, syncAudio = true) => {
    const v = clamp(next, 0, DURATION);
    timeRef.current = v;
    setTimeState(v);
    const a = audioRef.current;
    if (syncAudio && a && audioSrc && Number.isFinite(a.duration)) {
      try {
        a.currentTime = v;
      } catch {
        /* noop */
      }
    }
  }, [audioSrc]);

  const toggle = useCallback(() => {
    if (record) return;
    setPlaying((p) => {
      const next = !p;
      if (next && timeRef.current >= DURATION - 0.05) {
        seek(0);
      }
      return next;
    });
  }, [record, seek]);

  // 音频探测：优先混音版，其次是裸旁白
  useEffect(() => {
    if (record) return;
    let cancelled = false;
    (async () => {
      const v = Math.round(DURATION * 1000);
      for (const base of ["/audio/master.m4a", "/audio/master.wav", "/audio/voice_raw.wav"]) {
        const src = `${base}?v=${v}`;
        try {
          const res = await fetch(src, { method: "HEAD", cache: "no-store" });
          if (res.ok) {
            if (!cancelled) setAudioSrc(src);
            return;
          }
        } catch {
          /* noop */
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [record]);

  // 音频加载/切换时，先对齐到当前画面时间，避免开场 1.3s 偏移
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !audioSrc || record) return;
    const sync = () => {
      if (Number.isFinite(a.duration)) {
        try { a.currentTime = timeRef.current; } catch { /* noop */ }
      }
    };
    sync();
    a.addEventListener("loadedmetadata", sync);
    return () => a.removeEventListener("loadedmetadata", sync);
  }, [audioSrc, record]);

  // 音频播放状态
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !audioSrc || record) return;
    a.muted = muted;
    if (playing) {
      const current = Math.abs(a.currentTime - timeRef.current);
      if (current > 0.35) a.currentTime = timeRef.current;
      a.play().catch(() => {
        /* 自动播放可能被拦截，画面继续 */
      });
    } else {
      a.pause();
    }
  }, [playing, audioSrc, muted, record]);

  // 主时钟：有音频时以音频为母钟，否则用 rAF
  useEffect(() => {
    if (!playing || record) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.12, (now - last) / 1000);
      last = now;
      const a = audioRef.current;
      let next: number;
      if (a && audioSrc && !a.paused && a.readyState >= 2 && a.currentTime > 0) {
        next = a.currentTime;
      } else {
        next = timeRef.current + dt;
      }
      if (next >= DURATION) {
        setTimeState(DURATION);
        setPlaying(false);
        return;
      }
      timeRef.current = next;
      setTimeState(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, audioSrc, record]);

  // 暂停时短暂显示中央播放键，避免长时间遮挡画面
  useEffect(() => {
    if (record) return;
    if (playing) {
      setShowCenter(false);
      return;
    }
    setShowCenter(true);
    const t = window.setTimeout(() => setShowCenter(false), 1500);
    return () => window.clearTimeout(t);
  }, [playing, record]);

  // 缩放
  useEffect(() => {
    if (record) {
      setScale(1);
      return;
    }
    const el = areaRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const availW = Math.max(300, r.width - 60);
      const availH = Math.max(200, r.height - 28);
      setScale(Math.min(availW / 1920, availH / 1080));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [record]);

  // 录制模式：隐藏滚动条，暴露确定性 seek
  useEffect(() => {
    if (!record) return;
    document.documentElement.classList.add("record");
    document.body.classList.add("record");
    (window as unknown as { __seek: (t: number) => void }).__seek = (t: number) => {
      const v = clamp(t, 0, DURATION);
      timeRef.current = v;
      setTimeState(v);
      setPlaying(false);
    };
    (window as unknown as { __duration: number }).__duration = DURATION;
    (window as unknown as { __fps: number }).__fps = FPS;
    return () => {
      document.documentElement.classList.remove("record");
      document.body.classList.remove("record");
    };
  }, [record]);

  // 预加载字体与截图，通知渲染脚本就绪
  useEffect(() => {
    let cancelled = false;
    const images = ASSETS.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
        }),
    );
    Promise.all([document.fonts.ready, ...images]).then(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) (window as unknown as { __ready: boolean }).__ready = true;
        });
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // 快捷键
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (e.code === "Space") {
        e.preventDefault();
        toggle();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        seek(timeRef.current - (e.shiftKey ? 5 : 1));
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        seek(timeRef.current + (e.shiftKey ? 5 : 1));
      } else if (e.code === "Comma") {
        e.preventDefault();
        seek(timeRef.current - 1 / FPS);
      } else if (e.code === "Period") {
        e.preventDefault();
        seek(timeRef.current + 1 / FPS);
      } else if (e.code === "Home") {
        e.preventDefault();
        seek(0);
      } else if (e.code === "End") {
        e.preventDefault();
        seek(DURATION);
      } else if (e.key === "?") {
        setHelp((v) => !v);
      } else if (e.code === "KeyS") {
        setSubtitles((v) => !v);
      } else if (e.code === "KeyM") {
        setMuted((v) => !v);
      } else if (e.code === "KeyD") {
        setDebug((v) => !v);
      } else if (e.code === "KeyF") {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
      } else if (e.code === "KeyR") {
        const url = `${location.origin}${location.pathname}?t=${timeRef.current.toFixed(2)}&debug=1`;
        navigator.clipboard?.writeText(url).then(
          () => flashToast("已复制当前时间码链接"),
          () => flashToast("复制失败，可手动查看地址栏"),
        );
      } else if (/^Digit[1-9]$/.test(e.code)) {
        const idx = Number(e.code.replace("Digit", "")) - 1;
        const c = CHAPTERS[idx];
        if (c) seek(c.start + 0.01);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, seek, flashToast]);

  const currentChapter = CHAPTERS.find((c) => time >= c.start && time < c.end);

  if (record) {
    return (
      <div className="app record">
        <div className="stage-area">
          <div className="stage-viewport" style={{ width: 1920, height: 1080 }}>
            <div className="stage-shell">
              <Stage t={time} subtitles={subtitles} debug={debug} />
            </div>
          </div>
        </div>
        <audio ref={audioRef} src={audioSrc ?? undefined} preload="auto" />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <LogoMark size={34} />
          <div className="brand-text">
            <div className="brand-title">
              信任的裂缝 <span>DISTRUST ORIGINAL</span>
            </div>
            <div className="brand-sub">8 个数字，干翻 HTTPS · 视觉稿 v6</div>
          </div>
        </div>
        <div className="header-right">
          <span className="badge">
            <span className="dot" /> 审阅版 · 横屏
          </span>
          <span className="badge">1920×1080 · 30FPS</span>
          <button className="icon-btn" onClick={() => setDrawer(true)} title="旁白与分镜">
            <PanelIcon />
          </button>
          <button className="icon-btn" onClick={() => setHelp(true)} title="快捷键 (?)">
            <HelpIcon />
          </button>
        </div>
      </header>

      <div className="stage-area" ref={areaRef}>
        <div className="stage-viewport" style={{ width: 1920 * scale, height: 1080 * scale }}>
          <div className="stage-shell" style={{ transform: `scale(${scale})` }}>
            <Stage t={time} subtitles={subtitles} debug={debug} />
          </div>
          <div className={clsx("center-play", showCenter && "show")} onClick={toggle} title="播放">
            <div className="center-play-inner">
              <PlayIcon style={{ width: 24, height: 24, marginLeft: 3 }} />
            </div>
          </div>
        </div>
      </div>

      <Player
        time={time}
        duration={DURATION}
        playing={playing}
        currentChapterId={currentChapter?.id}
        muted={muted}
        subtitles={subtitles}
        debug={debug}
        audioAvailable={Boolean(audioSrc)}
        onToggle={toggle}
        onSeek={seek}
        onMute={() => setMuted((v) => !v)}
        onSubtitles={() => setSubtitles((v) => !v)}
        onDebug={() => setDebug((v) => !v)}
        onFullscreen={() => {
          if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
          else document.exitFullscreen?.();
        }}
      />

      <ReviewDrawer open={drawer} t={time} onClose={() => setDrawer(false)} onSeek={seek} />
      <HelpModal open={help} onClose={() => setHelp(false)} />
      {toast && <div className="toast">{toast}</div>}
      <audio ref={audioRef} src={audioSrc ?? undefined} preload="auto" />
    </div>
  );
}
