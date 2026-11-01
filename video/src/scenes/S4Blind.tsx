import type { CSSProperties, ReactNode } from "react";
import { useChapter } from "../lib/ChapterContext";
import { clamp01, easeInOutCubic, easeOutCubic, progress, spring } from "../lib/time";
import { Locky, PhoneBaddie, SleepyApp } from "../components/mascots";
import { LockGlyph } from "../components/devices";
import { Starfield, Vignette, World } from "../components/worlds";

function Act({ from, to, children, style }: { from: number; to: number; children: ReactNode; fade?: number; style?: CSSProperties }) {
  const { local } = useChapter();
  if (local < from || local >= to) return null;
  return <div style={{ position: "absolute", inset: 0, ...style }}>{children}</div>;
}

function Poster({ t }: { t: number }) {
  return (
    <div style={{ width: 360, padding: 22, borderRadius: 4, background: "linear-gradient(165deg,#eadcc0,#c9b28b)", color: "#3a2a18", boxShadow: "0 30px 70px rgba(0,0,0,.55)", transform: `rotate(-4deg) translateY(${Math.sin(t * 0.8) * 5}px)`, position: "relative", border: "1px solid rgba(90,60,30,.35)" }}>
      <div style={{ position: "absolute", inset: 12, border: "2px solid rgba(90,40,30,.35)" }} />
      <div style={{ fontSize: 40, fontWeight: 700, textAlign: "center", marginTop: 2, color: "rgba(120,30,35,.92)", letterSpacing: ".06em" }}>通缉令</div>
      <div style={{ width: 104, height: 104, margin: "12px auto 6px", borderRadius: "50%", border: "3px solid rgba(120,30,35,.55)", display: "grid", placeItems: "center" }}>
        <LockGlyph size={62} color="#8e2d35" />
      </div>
      <div style={{ marginTop: 12, padding: "7px 8px", border: "2px solid rgba(120,30,35,.5)", textAlign: "center", fontFamily: "var(--mono)", fontSize: 11, color: "rgba(120,30,35,.85)", transform: "rotate(-4deg)" }}>已吊销 · 10-18</div>
      <div style={{ position: "absolute", left: "50%", top: -14, width: 2, height: 20, background: "rgba(180,170,150,.8)" }} />
    </div>
  );
}

function WindowLeak({ t, p }: { t: number; p: number }) {
  return (
    <div style={{ width: 560, height: 680, position: "relative", opacity: p }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 6, background: "linear-gradient(160deg, rgba(38,34,40,.9), rgba(10,10,14,.98))", border: "10px solid #2b2620", boxShadow: "0 40px 90px rgba(0,0,0,.6), inset 0 0 80px rgba(0,0,0,.7)" }} />
      <div style={{ position: "absolute", left: 20, top: 20, right: 20, bottom: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 10 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ position: "relative", overflow: "hidden", background: i === 0 ? "radial-gradient(circle at 60% 40%, rgba(255,92,122,.45), rgba(30,8,16,.9) 65%)" : "linear-gradient(160deg, rgba(70,92,130,.18), rgba(8,10,16,.9))", border: "4px solid #1b1814" }}>
            {i === 0 && (
              <>
                <div style={{ position: "absolute", left: "-20%", top: "-10%", width: "70%", height: "120%", background: "rgba(255,92,122,.18)", borderRight: "3px solid rgba(255,140,160,.35)", transform: `rotate(${12 + Math.sin(t * 1.6) * 4}deg)` }} />
                {Array.from({ length: 8 }, (_, k) => <div key={k} style={{ position: "absolute", left: `${10 + k * 11}%`, top: `${-20 + ((t * 120 + k * 70) % 160)}%`, width: 2, height: 70, background: "linear-gradient(180deg, transparent, rgba(190,220,255,.5))", transform: "rotate(16deg)" }} />)}
              </>
            )}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: -80, bottom: 30, width: 120, height: 260, background: "linear-gradient(180deg, rgba(255,92,122,.16), transparent)", filter: "blur(18px)", transform: "rotate(22deg)" }} />
    </div>
  );
}

function HouseScene({ t, dark }: { t: number; dark: number }) {
  const open = [1, 4, 6, 9, 10];
  const windows = Array.from({ length: 12 }, (_, i) => ({ x: 300 + (i % 4) * 132, y: 360 + Math.floor(i / 4) * 100, i }));
  const light = 1 - dark * 0.86;
  return (
    <svg width="1180" height="820" viewBox="0 0 1180 820" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="roofB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(139,108,255,.32)" />
          <stop offset="1" stopColor="rgba(60,40,120,.12)" />
        </linearGradient>
        <linearGradient id="wallB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(44,40,58,.96)" />
          <stop offset="1" stopColor="rgba(20,18,30,.98)" />
        </linearGradient>
        <radialGradient id="warmWin">
          <stop offset="0" stopColor={`rgba(255,210,138,${light})`} />
          <stop offset="1" stopColor={`rgba(255,160,60,${0.15 * light})`} />
        </radialGradient>
        <radialGradient id="lamp">
          <stop offset="0" stopColor="rgba(255,210,138,.45)" />
          <stop offset="1" stopColor="rgba(255,210,138,0)" />
        </radialGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#16213a" />
          <stop offset="1" stopColor="#080b12" />
        </linearGradient>
      </defs>

      <rect x="0" y="620" width="1180" height="200" fill="url(#ground)" />
      <ellipse cx="600" cy="760" rx="520" ry="30" fill="rgba(0,0,0,.4)" />
      <path d="M240 760 C 320 700, 480 690, 600 760" fill="rgba(255,210,138,.04)" />
      <path d="M240 760 C 320 700, 480 690, 600 760" fill="none" stroke="rgba(255,210,138,.1)" strokeWidth="2" />

      {/* fence */}
      {Array.from({ length: 18 }, (_, i) => (
        <g key={i}>
          <rect x={60 + i * 62} y="650" width="8" height="80" rx="3" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.1)" />
          <path d={`M${60 + i * 62} 666 l8 -14 l8 14`} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="2" />
        </g>
      ))}
      <line x1="50" y1="700" x2="1180" y2="700" stroke="rgba(255,255,255,.09)" strokeWidth="5" />

      {/* chimney */}
      <rect x="760" y="150" width="70" height="120" fill="rgba(30,26,44,.95)" stroke="rgba(255,255,255,.15)" strokeWidth="2" />
      <path d="M760 150 h70" stroke="rgba(255,255,255,.25)" strokeWidth="4" />

      {/* house */}
      <path d="M220 320 L590 110 L960 320" fill="url(#roofB)" stroke="rgba(185,167,255,.75)" strokeWidth="3" />
      <path d="M250 315 L590 125 L930 315" fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="1.5" />
      <rect x="260" y="315" width="660" height="330" fill="url(#wallB)" stroke="rgba(255,255,255,.24)" strokeWidth="2" />
      <rect x="260" y="315" width="660" height="18" fill="rgba(255,255,255,.06)" />
      <rect x="500" y="470" width="120" height="175" rx="4" fill="rgba(69,224,160,.05)" stroke="rgba(69,224,160,.55)" strokeWidth="2" />
      <rect x="512" y="482" width="96" height="150" fill="rgba(69,224,160,.03)" />
      <circle cx="600" cy="560" r="3.5" fill="rgba(69,224,160,.75)" />
      <g transform="translate(558 440) scale(.58)"><LockGlyph size={70} color="#45e0a0" /></g>
      <path d="M455 470 q35 -28 70 0" fill="none" stroke="rgba(255,210,138,.25)" strokeWidth="3" />
      <path d="M585 470 q35 -28 70 0" fill="none" stroke="rgba(255,210,138,.25)" strokeWidth="3" />

      {/* windows */}
      {windows.map((w) => {
        const isOpen = open.includes(w.i);
        return (
          <g key={w.i}>
            <rect x={w.x} y={w.y} width="78" height="54" rx="2" fill={isOpen ? "rgba(255,92,122,.12)" : "url(#warmWin)"} stroke={isOpen ? "rgba(255,92,122,.7)" : "rgba(255,210,138,.32)"} strokeWidth="2" />
            <path d={`M${w.x + 39} ${w.y} v54 M${w.x} ${w.y + 27} h78`} stroke="rgba(255,255,255,.1)" strokeWidth="1.4" />
            {isOpen && (
              <>
                <path d={`M${w.x + 4} ${w.y + 4} h34 v20 q-17 10 -34 0 z`} fill="rgba(255,92,122,.2)" stroke="rgba(255,92,122,.35)" />
                <path d={`M${w.x + 78} ${w.y + 50} q18 -14 4 -32`} fill="none" stroke="rgba(255,92,122,.4)" strokeWidth="2" />
              </>
            )}
            {isOpen && w.i === 6 && <g transform={`translate(${w.x + 20} ${w.y + 6}) scale(.42)`}><PhoneBaddie size={80} mood="smug" t={t} /></g>}
          </g>
        );
      })}

      {/* porch light */}
      <circle cx="600" cy="450" r="80" fill="url(#lamp)" opacity={light} />
      <circle cx="600" cy="450" r="7" fill="rgba(255,210,138,.9)" opacity={light} />

      {/* bushes */}
      <ellipse cx="260" cy="660" rx="70" ry="36" fill="rgba(30,70,60,.65)" />
      <ellipse cx="920" cy="665" rx="80" ry="38" fill="rgba(30,70,60,.55)" />
      <ellipse cx="360" cy="668" rx="46" ry="24" fill="rgba(30,70,60,.45)" />

      {/* streetlight */}
      <rect x="90" y="430" width="6" height="250" fill="rgba(255,255,255,.14)" />
      <path d="M90 430 q40 -10 70 20" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="4" />
      <circle cx="164" cy="454" r="9" fill="rgba(255,210,138,.8)" />
      <circle cx="164" cy="460" r="90" fill="url(#lamp)" opacity=".55" />

      {/* wind */}
      <g opacity={0.35 + dark * 0.4}>
        <path d="M760 400 C 860 430, 920 480, 1010 520" fill="none" stroke="rgba(255,92,122,.55)" strokeWidth="2" strokeDasharray="6 9" />
        <path d="M700 500 C 820 540, 900 590, 1040 640" fill="none" stroke="rgba(255,92,122,.35)" strokeWidth="1.5" strokeDasharray="4 8" />
        {Array.from({ length: 10 }, (_, i) => (
          <circle key={i} cx={800 + ((t * 50 + i * 43) % 240)} cy={440 + Math.sin(i * 1.7 + t) * 60} r="2.5" fill="#ff8ba0" opacity={0.35 + (i % 3) * 0.15} />
        ))}
      </g>
      
    </svg>
  );
}

function PosterAlone({ t }: { t: number }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #0b1018, #05070b 65%)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 220, background: "linear-gradient(180deg, #111827, #070b12)" }} />
      <div style={{ position: "absolute", left: 80, top: 180, width: 480, height: 620, background: "repeating-linear-gradient(0deg, rgba(255,240,215,.025) 0 2px, transparent 2px 46px), linear-gradient(160deg,#2a2118,#0b0907)", borderRight: "1px solid rgba(255,220,170,.08)" }} />
      <div style={{ position: "absolute", left: 150, top: 250 }}>
        <Poster t={t} />
      </div>
      <div style={{ position: "absolute", right: 200, top: 330, opacity: 0.7 }}>
        <Locky size={220} mood="confused" t={t} color="#45e0a0" lookX={-0.7} />
      </div>
    </div>
  );
}

function Parade({ t, at }: { t: number; at: number }) {
  const apps = [
    { label: "curl", logo: "/logos/curl.svg", color: "#4fe3ff" },
    { label: "git", logo: "/logos/git.svg", color: "#ffc466" },
    { label: "python3", logo: "/logos/python.svg", color: "#b9a7ff" },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#07101a,#05070b 70%)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 700, background: "radial-gradient(ellipse 55% 45% at 50% 40%, rgba(79,227,255,.06), transparent 70%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 680, height: 2, background: "rgba(255,255,255,.08)" }} />
      <div style={{ position: "absolute", left: 120, top: 420, opacity: 0.25, transform: "scale(.6)", transformOrigin: "0 0" }}><Poster t={t} /></div>
      {apps.map((a, i) => {
        const p = 1;
        const walk = (t - at) * 30;
        return (
          <div key={a.label} style={{ position: "absolute", left: 480 + i * 360 + Math.sin(t * 2 + i) * 6 - walk, top: 520 + Math.sin(t * 3 + i) * 4, opacity: p }}>
            <SleepyApp label={a.label} color={a.color} size={180} z={i} wake={0.05} logo={a.logo} />
            {[0, 1, 2].map((k) => <span key={k} className="mono" style={{ position: "absolute", right: -10 - k * 14, top: -10 - k * 12, fontSize: 18 + k * 4, color: "rgba(185,167,255,.35)" }}>z</span>)}
          </div>
        );
      })}
    </div>
  );
}

function ToolLine({ t, at }: { t: number; at: number }) {
  const apps = [
    { label: "Go", logo: "/logos/go.svg", color: "#45e0a0" },
    { label: "Python", logo: "/logos/python.svg", color: "#b9a7ff" },
    { label: "Rust", logo: "/logos/rust.svg", color: "#ffc466" },
    { label: "Node", logo: "/logos/nodedotjs.svg", color: "#8beeff" },
    { label: "Electron", logo: "/logos/electron.svg", color: "#ff5c7a" },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#170f08,#05070b 72%)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, height: 26, background: "linear-gradient(180deg,#3b3124,#15110c)", boxShadow: "0 14px 40px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 694, height: 3, background: "rgba(255,196,102,.25)" }} />
      {apps.map((a, i) => {
        const p = 1;
        const x = 220 + i * 300 + Math.sin(t * 0.7 + i) * 6;
        return (
          <div key={a.label} style={{ position: "absolute", left: x, top: 510, opacity: 0.72 + p * 0.28, transform: `translateY(${(1 - p) * 16}px)` }}>
            <SleepyApp label={a.label} color={a.color} size={160} z={i} wake={0.05} logo={a.logo} />
          </div>
        );
      })}
      <div style={{ position: "absolute", right: 180, top: 180, padding: "16px 26px", border: "3px solid rgba(255,92,122,.55)", color: "#ff8ba0", fontSize: 28, transform: "rotate(-5deg)", background: "rgba(20,5,10,.35)" }}>已吊销</div>
    </div>
  );
}

function AppSleep({ t, at }: { t: number; at: number }) {
  const apps = [
    { label: "飞书", logo: "/logos/feishu.ico", color: "#4fe3ff" },
    { label: "Slack", logo: "/logos/slack.svg", color: "#ffc466" },
    { label: "ChatGPT", logo: "/logos/openai.svg", color: "#45e0a0" },
    { label: "Claude", logo: "/logos/anthropic.svg", color: "#ff8ba0" },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#0c0a16,#05060a 72%)" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/assets/feishu-chat.png)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.16, filter: "blur(20px)" }} />
      {apps.map((a, i) => {
        const p = 1;
        return (
          <div key={a.label} style={{ position: "absolute", left: 370 + i * 300, top: 400, opacity: p }}>
            <div style={{ marginBottom: 12, height: 34, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, border: "1px solid rgba(255,92,122,.3)", background: "rgba(255,92,122,.08)", color: "rgba(255,140,160,.7)", fontSize: 14 }}>证书已吊销</div>
            <SleepyApp label={a.label} color={a.color} size={190} z={i} wake={0.02} logo={a.logo} />
          </div>
        );
      })}
    </div>
  );
}

export function S4Blind() {
  const { local, at, chapter } = useChapter();
  const b1 = at("b1"), b2 = at("b2"), b3 = at("b3"), b4 = at("b4"), b5 = at("b5"), b6 = at("b6");
  const poster = progress(local, b1, 0.7);
  const parade = progress(local, b2, 0.7);
  const house = progress(local, b5, 1.0);
  const collapse = progress(local, b6, 1.2, easeInOutCubic);
  return (
    <div className="scene" style={{ padding: 0 }}>
      <World variant="house">
        <Starfield count={80} seed={55} t={local} color="#cbd6ff" />
        <div style={{ position: "absolute", right: 120, top: 80, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle at 38% 34%, #fff6dc, #d9c9a1 58%, rgba(120,110,90,.1) 70%)", boxShadow: "0 0 100px rgba(255,246,220,.18)", opacity: 0.85 - collapse * 0.6 }} />
        <Vignette strength={0.55} />

        <Act from={0} to={b2}><PosterAlone t={local} /></Act>
        <Act from={b2} to={b3}><Parade t={local} at={b2} /></Act>
        <Act from={b3} to={b4}><ToolLine t={local} at={b3} /></Act>
        <Act from={b4} to={b5}><AppSleep t={local} at={b4} /></Act>

        <Act from={b5} to={chapter.duration + 0.1}>
          <div style={{ position: "absolute", inset: 0, opacity: house }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center" }}>
              <div style={{ fontSize: 50, fontWeight: 700, color: "#fff" }}>前门换了锁，窗户还开着</div>
            </div>
            <div style={{ position: "absolute", left: 40, top: 170, transform: `scale(${0.92 + house * 0.08})`, transformOrigin: "50% 60%", filter: `brightness(${1 - collapse * 0.55})` }}>
              <HouseScene t={local} dark={collapse} />
            </div>
            <div style={{ position: "absolute", right: 60, top: 250, opacity: progress(local, b6 - 0.1, 0.6) }}>
              <WindowLeak t={local} p={progress(local, b6, 0.8)} />
            </div>
          </div>
        </Act>
      </World>
    </div>
  );
}
