import type { CSSProperties } from "react";
import { mulberry32 } from "../lib/random";
import { clamp01, lerp } from "../lib/time";

export function KeyGlyph({ size = 200, color = "#b9a7ff", glow = 0.6 }: { size?: number; color?: string; glow?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" style={{ overflow: "visible" }}>
      <defs>
        <filter id="keyglow">
          <feGaussianBlur stdDeviation={4 * glow} result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#keyglow)" stroke={color} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="38" cy="38" r="18" fill="rgba(185,167,255,.06)" />
        <circle cx="38" cy="38" r="7" fill="rgba(185,167,255,.12)" />
        <path d="M50 50l38 38M72 72l10-10M82 82l10-10M92 92l9-9" />
      </g>
    </svg>
  );
}

export function FlowArrow({
  x1,
  y1,
  x2,
  y2,
  color = "rgba(255,255,255,.25)",
  width = 1.4,
  dash = false,
  head = true,
  progress = 1,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  width?: number;
  dash?: boolean;
  head?: boolean;
  progress?: number;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const ux = dx / (len || 1);
  const uy = dy / (len || 1);
  const ex = x1 + dx * progress;
  const ey = y1 + dy * progress;
  const hx = ex - ux * 9;
  const hy = ey - uy * 9;
  const px = -uy * 5;
  const py = ux * 5;
  return (
    <g>
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth={width} strokeDasharray={dash ? "5 8" : undefined} strokeLinecap="round" />
      {head && progress > 0.02 && (
        <path d={`M${ex} ${ey} L${hx + px} ${hy + py} L${hx - px} ${hy - py} Z`} fill={color} />
      )}
    </g>
  );
}

export function BitGrid({
  rows = 16,
  cols = 24,
  cell = 21,
  gap = 4,
  t,
  mode = "random",
  seed = 7,
  highlight = [],
  opacity = 1,
  style,
}: {
  rows?: number;
  cols?: number;
  cell?: number;
  gap?: number;
  t: number;
  mode?: "random" | "zero" | "collapse";
  seed?: number;
  highlight?: number[];
  opacity?: number;
  style?: CSSProperties;
}) {
  const total = rows * cols;
  const rnd = mulberry32(seed);
  const bits = Array.from({ length: total }, () => rnd() > 0.5);
  const highlightSet = new Set(highlight);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${cell}px)`,
        gridTemplateRows: `repeat(${rows}, ${cell}px)`,
        gap,
        opacity,
        ...style,
      }}
    >
      {bits.map((b, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const flicker = 0.55 + 0.45 * Math.sin(t * (1.2 + (i % 7) * 0.15) + i * 0.77);
        const isHl = highlightSet.has(i);
        const zero = mode !== "random";
        const value = zero ? (isHl ? 1 : 0) : b ? 1 : 0;
        return (
          <div
            key={i}
            style={{
              width: cell,
              height: cell,
              borderRadius: 3.5,
              display: "grid",
              placeItems: "center",
              fontFamily: "var(--mono)",
              fontSize: cell * 0.48,
              background: zero
                ? isHl
                  ? "rgba(255,196,102,.26)"
                  : "rgba(255,255,255,.04)"
                : b
                  ? "rgba(139,108,255,.3)"
                  : "rgba(255,255,255,.05)",
              border: `1px solid ${zero ? (isHl ? "rgba(255,196,102,.55)" : "rgba(255,255,255,.07)") : b ? "rgba(139,108,255,.42)" : "rgba(255,255,255,.08)"}`,
              color: zero ? (isHl ? "#ffd28a" : "rgba(255,255,255,.22)") : b ? "rgba(218,208,255,1)" : "rgba(255,255,255,.42)",
              opacity: zero ? 1 : 0.5 + 0.5 * flicker,
              boxShadow: isHl ? "0 0 18px rgba(255,196,102,.28)" : b && !zero ? "0 0 10px rgba(139,108,255,.1)" : undefined,
              transition: "none",
            }}
          >
            {value}
          </div>
        );
      })}
    </div>
  );
}

export function CosmicDots({ t, count = 260, seed = 19 }: { t: number; count?: number; seed?: number }) {
  const rnd = mulberry32(seed);
  const dots = Array.from({ length: count }, (_, i) => {
    const a = rnd() * Math.PI * 2;
    const r = Math.pow(rnd(), 0.55) * 480;
    return { x: 960 + Math.cos(a) * r * 1.5, y: 520 + Math.sin(a) * r * 0.66, s: 0.6 + rnd() * 1.9, p: rnd() * 6.28, o: 0.15 + rnd() * 0.6, i };
  });
  return (
    <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
      {dots.map((d) => (
        <circle
          key={d.i}
          cx={d.x}
          cy={d.y}
          r={d.s}
          fill={d.i % 9 === 0 ? "#b9a7ff" : "#dbe2ff"}
          opacity={d.o * (0.6 + 0.4 * Math.sin(t * 0.5 + d.p))}
        />
      ))}
    </svg>
  );
}

export function LogScale({
  t,
  progress = 1,
  width = 1560,
}: {
  t: number;
  progress?: number;
  width?: number;
}) {
  const startX = 180;
  const x80 = startX + width * 0.615;
  const x115 = startX + width * 0.94;
  const labels = [0, 20, 40, 60, 80, 100, 115];
  return (
    <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
      <line x1={startX} y1={600} x2={startX + width} y2={600} stroke="rgba(255,255,255,.22)" strokeWidth="1.2" strokeDasharray="2 6" />
      {labels.map((p) => {
        const x = startX + width * (p / 115);
        return (
          <g key={p}>
            <line x1={x} y1={590} x2={x} y2={610} stroke="rgba(255,255,255,.3)" strokeWidth="1.2" />
            <text x={x} y={638} textAnchor="middle" fill="rgba(255,255,255,.34)" fontSize="13" fontFamily="var(--mono)">
              10^{p}
            </text>
          </g>
        );
      })}
      <g opacity={progress}>
        <line x1={x80} y1={420} x2={x80} y2={600} stroke="rgba(79,227,255,.55)" strokeWidth="1.4" strokeDasharray="4 5" />
        <circle cx={x80} cy={600} r="5" fill="#4fe3ff" />
        <text x={x80} y={392} textAnchor="middle" fill="#8beeff" fontSize="18" fontFamily="var(--mono)">宇宙原子 · 10^80</text>
        <line x1={x115} y1={420} x2={x115} y2={600} stroke="rgba(139,108,255,.7)" strokeWidth="1.6" />
        <circle cx={x115} cy={600} r="7" fill="#b9a7ff" />
        <circle cx={x115} cy={600} r="14" fill="none" stroke="rgba(185,167,255,.3)" />
        <text x={x115} y={392} textAnchor="middle" fill="#cbbdff" fontSize="18" fontFamily="var(--mono)">私钥空间 · 10^115</text>
        <path d={`M${x80} 540 Q ${(x80 + x115) / 2} 500 ${x115} 540`} fill="none" stroke="rgba(255,196,102,.5)" strokeWidth="1.2" strokeDasharray="3 6" />
        <text x={(x80 + x115) / 2} y={492} textAnchor="middle" fill="#ffc466" fontSize="17" fontFamily="var(--mono)">×10^35</text>
      </g>
    </svg>
  );
}

export function Moat({ t, puddles = 8, reveal = 1 }: { t: number; puddles?: number; reveal?: number }) {
  const rnd = mulberry32(88);
  const ps = Array.from({ length: puddles }, (_, i) => ({
    x: 360 + i * 170 + (rnd() - 0.5) * 40,
    y: 720 + (rnd() - 0.5) * 70,
    r: 26 + rnd() * 18,
    i,
  }));
  return (
    <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="moatwater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(20,26,42,.2)" />
          <stop offset="1" stopColor="rgba(6,8,14,.1)" />
        </linearGradient>
        <linearGradient id="puddle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b6cff" stopOpacity=".55" />
          <stop offset="1" stopColor="#4fe3ff" stopOpacity=".25" />
        </linearGradient>
      </defs>
      {/* castle wall silhouette */}
      <g opacity={0.8} stroke="rgba(255,255,255,.28)" strokeWidth="1.5" fill="rgba(255,255,255,.035)">
        <path d="M260 470 h1400 v90 H260 Z" />
        {Array.from({ length: 18 }, (_, i) => (
          <rect key={i} x={280 + i * 78} y={440} width="40" height="34" />
        ))}
        <rect x="760" y="370" width="120" height="100" />
        <rect x="1080" y="390" width="90" height="80" />
        <path d="M820 370 l40 -46 40 46" fill="none" />
      </g>
      {/* moat */}
      <path d="M180 660 Q 960 620 1740 660 L 1740 930 Q 960 980 180 930 Z" fill="url(#moatwater)" stroke="rgba(79,227,255,.22)" strokeWidth="1.4" />
      <path d="M180 660 Q 960 620 1740 660" fill="none" stroke="rgba(79,227,255,.2)" strokeWidth="1" strokeDasharray="2 5" />
      <text x="960" y="985" textAnchor="middle" fill="rgba(79,227,255,.42)" fontSize="13" fontFamily="var(--mono)" letterSpacing=".28em">
        THE MOAT OF RANDOMNESS
      </text>
      <text x="960" y="795" textAnchor="middle" fill="rgba(139,108,255,.07)" fontSize="190" fontWeight="700" fontFamily="var(--mono)">
        2^384
      </text>
      {ps.map((p, i) => {
        const a = clamp01(reveal * 1.2 - i * 0.08);
        return (
          <g key={i} opacity={a}>
            <ellipse cx={p.x} cy={p.y} rx={p.r * 2.8} ry={p.r * 0.85} fill="rgba(139,108,255,.11)" />
            <ellipse cx={p.x} cy={p.y} rx={p.r} ry={p.r * 0.38} fill="url(#puddle)" stroke="rgba(185,167,255,.7)" strokeWidth="1.2" />
            <ellipse cx={p.x} cy={p.y} rx={p.r * 1.35} ry={p.r * 0.5} fill="none" stroke="rgba(139,108,255,.16)" strokeWidth="1" />
            <ellipse cx={p.x} cy={p.y - 3} rx={p.r * 0.5} ry={p.r * 0.12} fill="rgba(255,255,255,.18)" />
            <text x={p.x} y={p.y + 30} textAnchor="middle" fill="rgba(185,167,255,.7)" fontSize="12" fontFamily="var(--mono)">
              {i + 1}
            </text>
          </g>
        );
      })}
      <g opacity={0.9}>
        <text x="960" y="205" textAnchor="middle" fill="rgba(255,255,255,.82)" fontSize="30" fontWeight="600">
          本该是 2^384 种可能的护城河
        </text>
        <text x="960" y="252" textAnchor="middle" fill="rgba(255,196,102,.7)" fontSize="16" fontFamily="var(--mono)" letterSpacing=".18em">
          实际只有 8 个水坑
        </text>
      </g>
    </svg>
  );
}

export function NumberBall({ n, i, size = 108 }: { n: number; i: number; size?: number }) {
  const hue = 250 + i * 12;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        position: "relative",
        background: `radial-gradient(circle at 34% 28%, rgba(255,255,255,.18), rgba(139,108,255,.16) 38%, rgba(20,15,40,.9) 78%)`,
        border: "1px solid rgba(185,167,255,.28)",
        boxShadow: `0 0 ${size * 0.45}px hsla(${hue},80%,70%,.16), inset 0 0 24px rgba(139,108,255,.1)`,
        fontFamily: "var(--mono)",
        fontSize: size * 0.33,
        fontWeight: 700,
        color: "#f1ecff",
        letterSpacing: "-.05em",
      }}
    >
      {n}
      <span
        style={{
          position: "absolute",
          bottom: -26,
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: ".14em",
          color: "rgba(185,167,255,.45)",
          fontWeight: 400,
        }}
      >
        KEY {String(i + 1).padStart(2, "0")}
      </span>
    </div>
  );
}

export function formatPow(n: number) {
  return Math.round(n).toLocaleString("en-US");
}

export function lerpX(a: number, b: number, p: number) {
  return lerp(a, b, clamp01(p));
}
