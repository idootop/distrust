import type { CSSProperties } from "react";
import { clamp01, easeOutCubic, progress } from "../lib/time";

export type Mood = "proud" | "happy" | "confused" | "scared" | "smug" | "sleepy" | "shock";

function blinkAt(t: number, seed = 0) {
  const p = ((t * 0.9 + seed) % 3.4 + 3.4) % 3.4;
  return p > 3.28 ? 0.08 : 1;
}

function Eye({
  x,
  y,
  r = 16,
  lookX = 0,
  lookY = 0,
  blink = 1,
  color = "#0a0b10",
  sleepy = false,
}: {
  x: number;
  y: number;
  r?: number;
  lookX?: number;
  lookY?: number;
  blink?: number;
  color?: string;
  sleepy?: boolean;
}) {
  if (sleepy) {
    return <path d={`M${x - r} ${y} Q${x} ${y + r * 0.6} ${x + r} ${y}`} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />;
  }
  return (
    <g transform={`translate(${x} ${y}) scale(1 ${blink})`}>
      <circle r={r} fill="#fff" />
      <circle cx={lookX} cy={lookY} r={r * 0.46} fill={color} />
      <circle cx={lookX - r * 0.14} cy={lookY - r * 0.18} r={r * 0.12} fill="#fff" opacity=".8" />
    </g>
  );
}

function Mouth({ x, y, mood, color = "#0a0b10" }: { x: number; y: number; mood: Mood; color?: string }) {
  if (mood === "happy" || mood === "proud") {
    return <path d={`M${x - 18} ${y} Q${x} ${y + 16} ${x + 18} ${y}`} fill="none" stroke={color} strokeWidth={4.5} strokeLinecap="round" />;
  }
  if (mood === "smug") {
    return <path d={`M${x - 16} ${y + 2} Q${x + 2} ${y + 9} ${x + 18} ${y - 5}`} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />;
  }
  if (mood === "scared" || mood === "shock") {
    return <ellipse cx={x} cy={y + 4} rx={8} ry={10} fill={color} opacity=".85" />;
  }
  if (mood === "confused") {
    return <path d={`M${x - 15} ${y + 2} Q${x - 4} ${y - 4} ${x + 5} ${y + 2} T${x + 16} ${y - 2}`} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />;
  }
  return <path d={`M${x - 14} ${y + 3} L${x + 14} ${y + 3}`} stroke={color} strokeWidth={4} strokeLinecap="round" />;
}

export function Locky({
  size = 240,
  mood = "happy",
  t = 0,
  color = "#45e0a0",
  open = 0,
  lookX = 0,
  lookY = 0,
  wave = 0,
  style,
  seed = 0,
}: {
  size?: number;
  mood?: Mood;
  t?: number;
  color?: string;
  open?: number;
  lookX?: number;
  lookY?: number;
  wave?: number;
  style?: CSSProperties;
  seed?: number;
}) {
  const blink = mood === "sleepy" ? 0.08 : blinkAt(t, seed);
  const bob = Math.sin(t * 1.5 + seed) * 3;
  const bodyColor = color;
  const armWave = Math.sin(t * 6) * 10 * wave;
  return (
    <svg
      width={size}
      height={size * 1.12}
      viewBox="0 0 200 224"
      style={{ overflow: "visible", transform: `translateY(${bob}px)`, ...style }}
    >
      <defs>
        <linearGradient id={`lockBody-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity=".95" />
          <stop offset="1" stopColor={color} stopOpacity=".55" />
        </linearGradient>
        <radialGradient id={`lockGlow-${color.replace("#", "")}`}>
          <stop offset="0" stopColor={color} stopOpacity=".35" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="210" rx="56" ry="10" fill="#000" opacity=".28" />
      <circle cx="100" cy="130" r="96" fill={`url(#lockGlow-${color.replace("#", "")})`} />
      {/* arms */}
      <path d={`M44 140 Q 16 ${126 + armWave} 24 104`} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" opacity=".9" />
      <path d="M156 140 Q 184 126 176 104" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" opacity=".9" />
      {/* legs */}
      <path d="M74 192 l-8 18 M126 192 l8 18" stroke={color} strokeWidth="8" strokeLinecap="round" />
      {/* shackle */}
      <path
        d="M62 92 V64 a38 38 0 0 1 76 0 V92"
        fill="none"
        stroke={color}
        strokeWidth="13"
        strokeLinecap="round"
        transform={`translate(0 ${-open * 10}) rotate(${-open * 12} 62 92)`}
        opacity=".95"
      />
      {/* body */}
      <rect x="36" y="86" width="128" height="112" rx="30" fill={`url(#lockBody-${color.replace("#", "")})`} stroke={color} strokeWidth="3" />
      <rect x="42" y="92" width="116" height="100" rx="25" fill="rgba(5,7,10,.18)" />
      {/* eyes */}
      <Eye x={78} y={132} lookX={lookX * 5} lookY={lookY * 4} blink={blink} sleepy={mood === "sleepy"} />
      <Eye x={122} y={132} lookX={lookX * 5} lookY={lookY * 4} blink={blink} sleepy={mood === "sleepy"} />
      {/* brows */}
      {mood === "confused" ? (
        <>
          <path d="M64 112 Q77 102 90 110" fill="none" stroke="#07110c" strokeWidth="4" strokeLinecap="round" />
          <path d="M110 108 Q123 100 136 108" fill="none" stroke="#07110c" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : mood === "scared" || mood === "shock" ? (
        <>
          <path d="M64 110 Q77 102 90 108" fill="none" stroke="#07110c" strokeWidth="4" strokeLinecap="round" />
          <path d="M110 108 Q123 102 136 110" fill="none" stroke="#07110c" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : mood === "smug" ? (
        <>
          <path d="M64 114 L90 114" stroke="#07110c" strokeWidth="4" strokeLinecap="round" />
          <path d="M110 112 L136 112" stroke="#07110c" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M64 112 Q77 104 90 112" fill="none" stroke="#07110c" strokeWidth="4" strokeLinecap="round" />
          <path d="M110 112 Q123 104 136 112" fill="none" stroke="#07110c" strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      <Mouth x={100} y={158} mood={mood} />
      {/* cheeks */}
      <circle cx="62" cy="160" r="8" fill="#ff8ba0" opacity=".22" />
      <circle cx="138" cy="160" r="8" fill="#ff8ba0" opacity=".22" />
      {/* scared sweat */}
      {(mood === "scared" || mood === "shock") && (
        <path d="M160 88 q10 14 0 22 q-10 -8 0 -22" fill="#8beeff" opacity=".8" />
      )}
      {/* keyhole badge */}
      <g opacity=".55">
        <circle cx="100" cy="184" r="4" fill="#07110c" />
        <path d="M100 187v7" stroke="#07110c" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function PhoneBaddie({
  size = 210,
  mood = "lurk",
  t = 0,
  style,
  lookX = 0,
  lookY = 0,
}: {
  size?: number;
  mood?: "lurk" | "smug" | "shock";
  t?: number;
  style?: CSSProperties;
  lookX?: number;
  lookY?: number;
}) {
  const bob = Math.sin(t * 1.2 + 1) * 4;
  const blink = blinkAt(t, 2);
  return (
    <svg width={size} height={size * 1.8} viewBox="0 0 180 324" style={{ overflow: "visible", transform: `translateY(${bob}px)`, ...style }}>
      <defs>
        <radialGradient id="phEye">
          <stop offset="0" stopColor="#ff8ba0" />
          <stop offset=".6" stopColor="#ff3159" />
          <stop offset="1" stopColor="#7a0d25" />
        </radialGradient>
        <linearGradient id="phBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#24202c" />
          <stop offset="1" stopColor="#0a0a10" />
        </linearGradient>
      </defs>
      <ellipse cx="90" cy="312" rx="58" ry="9" fill="#000" opacity=".35" />
      {/* arms */}
      <path d={`M36 190 Q 8 ${180 + Math.sin(t * 2) * 6} 14 158`} fill="none" stroke="#ff5c7a" strokeWidth="7" strokeLinecap="round" opacity=".6" />
      <path d="M144 190 Q 172 180 166 158" fill="none" stroke="#ff5c7a" strokeWidth="7" strokeLinecap="round" opacity=".6" />
      {/* body */}
      <rect x="18" y="18" width="144" height="282" rx="30" fill="url(#phBody)" stroke="rgba(255,92,122,.35)" strokeWidth="2.5" />
      <rect x="27" y="34" width="126" height="248" rx="20" fill="#07080d" stroke="rgba(255,255,255,.08)" />
      <rect x="68" y="24" width="44" height="10" rx="5" fill="#05060a" />
      {/* eye */}
      <g transform={`translate(90 132) scale(${mood === "shock" ? 1.12 : 1})`}>
        <ellipse rx="48" ry="34" fill="url(#phEye)" opacity=".92" />
        <ellipse rx="22" ry="30" fill="#16040a" />
        <ellipse cx={lookX * 6 - 5} cy={lookY * 6 - 8} rx="7" ry="6" fill="#fff" opacity=".8" />
        <ellipse cx={lookX * 6 + 9} cy={lookY * 6 + 8} rx="3" ry="3" fill="#fff" opacity=".4" />
      </g>
      {/* smirk */}
      <path d="M62 196 Q90 214 120 194" fill="none" stroke="#ff8ba0" strokeWidth="4.5" strokeLinecap="round" opacity=".9" />
      <path d="M62 196 Q90 204 120 194" fill="#ff5c7a" opacity=".16" />
      <circle cx="42" cy="70" r="3.2" fill="#ff5c7a" opacity=".8" />
      <circle cx="138" cy="70" r="3.2" fill="#ff5c7a" opacity=".8" />
      {mood === "shock" && <text x="154" y="80" fill="#ff5c7a" fontSize="30" fontFamily="var(--mono)">!</text>}
    </svg>
  );
}

export function Certy({
  size = 180,
  t = 0,
  fake = 0,
  stamp = 0,
  style,
  sealLabel = "emSign",
}: {
  size?: number;
  t?: number;
  fake?: number;
  stamp?: number;
  style?: CSSProperties;
  sealLabel?: string;
}) {
  const blink = blinkAt(t, 4);
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 220 154" style={{ overflow: "visible", ...style }}>
      <defs>
        <linearGradient id="certPaper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4ecd8" />
          <stop offset="1" stopColor="#d9c9a8" />
        </linearGradient>
      </defs>
      <g transform={`rotate(${Math.sin(t * 0.9) * 2.2})`} style={{ transformOrigin: "110px 77px" }}>
        <rect x="6" y="8" width="208" height="138" rx="12" fill="rgba(0,0,0,.3)" />
        <rect x="0" y="0" width="208" height="138" rx="12" fill="url(#certPaper)" stroke={fake > 0.5 ? "#ff5c7a" : "#b9a27a"} strokeWidth="2" />
        <rect x="14" y="12" width="180" height="18" rx="4" fill="rgba(40,30,20,.08)" />
        <text x="22" y="25" fill="rgba(50,35,20,.55)" fontSize="10" fontFamily="var(--mono)" letterSpacing=".12em">证书</text>
        <rect x="18" y="44" width="48" height="56" rx="6" fill="rgba(50,35,20,.08)" stroke="rgba(50,35,20,.18)" />
        <circle cx="42" cy="64" r="10" fill="rgba(50,35,20,.14)" />
        <path d="M26 94 q16 -18 32 0" fill="none" stroke="rgba(50,35,20,.2)" strokeWidth="3" />
        <g transform={`translate(42 79) scale(.5)`}>
          <path d="M-14 0 h28 M0 -14 v28" stroke="rgba(50,35,20,.22)" strokeWidth="3" />
        </g>
        <Eye x={104} y={70} r={9} lookX={Math.sin(t * 0.7) * 2} lookY={0} blink={blink} color="#3a2a18" />
        <Eye x={132} y={70} r={9} lookX={Math.sin(t * 0.7) * 2} lookY={0} blink={blink} color="#3a2a18" />
        <path d="M103 90 Q118 102 133 90" fill="none" stroke="#3a2a18" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M22 116 h80" stroke="rgba(50,35,20,.18)" strokeWidth="3" strokeLinecap="round" />
        <path d="M22 126 h56" stroke="rgba(50,35,20,.13)" strokeWidth="3" strokeLinecap="round" />
        <g transform={`translate(178 112) rotate(-12) scale(${0.6 + stamp * 0.4})`} opacity={stamp}>
          <circle r="22" fill="none" stroke={fake > 0.5 ? "#ff3159" : "#b4552e"} strokeWidth="3" />
          <circle r="16" fill="none" stroke={fake > 0.5 ? "#ff3159" : "#b4552e"} strokeWidth="1.5" strokeDasharray="3 3" />
          <text y="4" textAnchor="middle" fill={fake > 0.5 ? "#ff3159" : "#b4552e"} fontSize="8" fontFamily="var(--mono)">{sealLabel}</text>
        </g>
        {fake > 0.5 && (
          <text x="104" y="36" textAnchor="middle" fill="rgba(255,49,89,.8)" fontSize="10" fontFamily="var(--mono)" letterSpacing=".12em">FORGED</text>
        )}
      </g>
    </svg>
  );
}

export function Keyy({
  size = 220,
  t = 0,
  weak = 0,
  style,
  color = "#b9a7ff",
}: {
  size?: number;
  t?: number;
  weak?: number;
  style?: CSSProperties;
  color?: string;
}) {
  const scale = 1 - weak * 0.28;
  const bob = Math.sin(t * 1.7) * 4;
  return (
    <svg width={size} height={size * 0.55} viewBox="0 0 240 130" style={{ overflow: "visible", transform: `translateY(${bob}px)`, ...style }}>
      <defs>
        <linearGradient id="keyMetal" x1="0" y1="0" x2="0" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#e8e2ff" />
          <stop offset=".45" stopColor={color} />
          <stop offset="1" stopColor="#6a53c8" />
        </linearGradient>
        <filter id="keyGlow">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g filter="url(#keyGlow)" transform={`translate(120 65) scale(${scale}) translate(-120 -65)`}>
        <circle cx="52" cy="65" r="30" fill="rgba(185,167,255,.1)" stroke="url(#keyMetal)" strokeWidth="7" />
        <circle cx="52" cy="65" r="12" fill="rgba(5,6,10,.7)" stroke="url(#keyMetal)" strokeWidth="3" />
        <path d="M82 65 H210" stroke="url(#keyMetal)" strokeWidth="10" strokeLinecap="round" />
        <path d="M160 68 v18 M180 68 v26 M200 68 v14" stroke="url(#keyMetal)" strokeWidth="9" strokeLinecap="round" />
        <Eye x={44} y={58} r={6} lookX={2} blink={blinkAt(t, 6)} color="#1b1230" />
        <Eye x={62} y={58} r={6} lookX={2} blink={blinkAt(t, 6)} color="#1b1230" />
        <path d="M46 76 q8 7 16 0" fill="none" stroke="#1b1230" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      {weak > 0.4 && (
        <text x="120" y="122" textAnchor="middle" fill="rgba(255,92,122,.75)" fontSize="9" fontFamily="var(--mono)" letterSpacing=".14em">ACTUAL ENTROPY: 8 BITS</text>
      )}
    </svg>
  );
}

export function SleepyApp({
  label,
  color,
  size = 110,
  z = 0,
  wake = 0,
  icon,
  logo,
}: {
  label: string;
  color: string;
  size?: number;
  z?: number;
  wake?: number;
  icon?: string;
  logo?: string;
}) {
  return (
    <div style={{ width: size, textAlign: "center", opacity: 0.55 + wake * 0.45, transform: `translateY(${Math.sin(z) * 3}px)` }}>
      <div style={{ position: "relative", width: size, height: size, borderRadius: size * 0.26, background: `linear-gradient(150deg, ${color}2a, rgba(12,13,20,.96))`, border: `1px solid ${color}44`, boxShadow: `0 18px 40px rgba(0,0,0,.35), 0 0 30px ${color}10`, display: "grid", placeItems: "center" }}>
        {logo ? (
          <img src={logo} alt="" style={{ width: "48%", height: "48%", objectFit: "contain", opacity: 0.9, filter: "drop-shadow(0 0 12px rgba(255,255,255,.15))" }} />
        ) : (
          <div style={{ fontFamily: "var(--mono)", fontSize: size * 0.2, color: `${color}dd` }}>{icon ?? label}</div>
        )}
        <div style={{ position: "absolute", left: "22%", top: "44%", width: "14%", height: 3, borderRadius: 3, background: "rgba(255,255,255,.55)", transform: "rotate(8deg)" }} />
        <div style={{ position: "absolute", right: "22%", top: "44%", width: "14%", height: 3, borderRadius: 3, background: "rgba(255,255,255,.55)", transform: "rotate(-8deg)" }} />
        <div style={{ position: "absolute", left: "40%", top: "62%", width: "20%", height: 4, borderRadius: 4, borderBottom: "2px solid rgba(255,255,255,.35)" }} />
        {wake < 0.4 && (
          <span className="mono" style={{ position: "absolute", right: 8, top: 4, fontSize: 9, color: `${color}99` }}>z</span>
        )}
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: "rgba(255,255,255,.42)", letterSpacing: ".02em" }}>{label}</div>
    </div>
  );
}
