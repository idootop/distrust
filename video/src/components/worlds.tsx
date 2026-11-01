import type { CSSProperties, ReactNode } from "react";
import { mulberry32 } from "../lib/random";

type Variant = "cafe" | "passport" | "cosmos" | "alarm" | "house" | "lan" | "risk" | "chain" | "void";

const BG: Record<Variant, string> = {
  cafe: "radial-gradient(ellipse 70% 60% at 28% 18%, #2a2118 0%, #141414 42%, #08090d 100%)",
  passport: "radial-gradient(ellipse 70% 60% at 50% 20%, #2a2418 0%, #14130f 45%, #08090d 100%)",
  cosmos: "radial-gradient(ellipse 75% 65% at 50% 45%, #1b1240 0%, #0c0a18 45%, #05060a 100%)",
  alarm: "radial-gradient(ellipse 75% 65% at 50% 40%, #2b0f16 0%, #14080c 48%, #06070a 100%)",
  house: "radial-gradient(ellipse 80% 65% at 50% 60%, #101a2c 0%, #0a0e18 50%, #05060a 100%)",
  lan: "radial-gradient(ellipse 75% 65% at 50% 45%, #08202a 0%, #080e16 50%, #04060a 100%)",
  risk: "radial-gradient(ellipse 75% 65% at 50% 45%, #260d12 0%, #12080b 50%, #05060a 100%)",
  chain: "radial-gradient(ellipse 70% 60% at 50% 55%, #151a33 0%, #0a0c17 50%, #05060a 100%)",
  void: "#05060a",
};

export function World({
  variant,
  children,
  style,
  className = "",
}: {
  variant: Variant;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <div className={`world ${className}`} style={{ position: "absolute", inset: 0, overflow: "hidden", background: BG[variant], ...style }}>
      {children}
    </div>
  );
}

export function Bokeh({ count = 22, seed = 4, color = "rgba(255,190,110,.16)", t = 0 }: { count?: number; seed?: number; color?: string; t?: number }) {
  const rnd = mulberry32(seed);
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const x = rnd() * 1920;
        const y = rnd() * 1080;
        const s = 20 + rnd() * 150;
        const sp = 4 + rnd() * 14;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y - ((t * sp) % 220),
              width: s,
              height: s,
              borderRadius: "50%",
              background: color,
              filter: `blur(${s * 0.28}px)`,
              opacity: 0.35 + rnd() * 0.5,
            }}
          />
        );
      })}
    </>
  );
}

export function Starfield({ count = 220, seed = 9, t = 0, color = "#dfe6ff" }: { count?: number; seed?: number; t?: number; color?: string }) {
  const rnd = mulberry32(seed);
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const x = rnd() * 1920;
        const y = rnd() * 1080;
        const s = 0.8 + rnd() * 2.2;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * (0.4 + rnd()) + i));
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: i % 11 === 0 ? "#b9a7ff" : color, opacity: tw * 0.75, boxShadow: i % 23 === 0 ? `0 0 8px ${color}` : undefined }} />
        );
      })}
    </>
  );
}

export function FloorGrid({ color = "rgba(79,227,255,.14)", horizon = 620, t = 0 }: { color?: string; horizon?: number; t?: number }) {
  return (
    <div style={{ position: "absolute", left: -200, right: -200, top: horizon, bottom: -100, perspective: "400px", perspectiveOrigin: "50% 0%", overflow: "hidden", opacity: 0.7 }}>
      <div
        style={{
          position: "absolute",
          inset: "-40% -20% -20%",
          backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
          backgroundSize: "90px 90px",
          transform: "rotateX(62deg)",
          transformOrigin: "50% 0%",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 85%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 85%)",
          backgroundPosition: `${Math.sin(t * 0.2) * 10}px 0`,
        }}
      />
    </div>
  );
}

export function SpeedLines({ color = "rgba(255,255,255,.25)", count = 26, seed = 3, opacity = 1 }: { color?: string; count?: number; seed?: number; opacity?: number }) {
  const rnd = mulberry32(seed);
  return (
    <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const a = rnd() * Math.PI * 2;
        const r0 = 420 + rnd() * 260;
        const r1 = r0 + 240 + rnd() * 520;
        return <line key={i} x1={960 + Math.cos(a) * r0} y1={520 + Math.sin(a) * r0} x2={960 + Math.cos(a) * r1} y2={520 + Math.sin(a) * r1} stroke={color} strokeWidth={1 + rnd() * 2} strokeLinecap="round" />;
      })}
    </svg>
  );
}

export function Spotlight({ x = 960, y = 420, size = 900, color = "rgba(255,255,255,.09)" }: { x?: number; y?: number; size?: number; color?: string }) {
  return <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: "50%", background: `radial-gradient(circle, ${color}, transparent 68%)`, pointerEvents: "none" }} />;
}

export function Vignette({ strength = 0.6 }: { strength?: number }) {
  return <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 78% 70% at 50% 48%, transparent 38%, rgba(0,0,0,${strength}) 100%)`, pointerEvents: "none" }} />;
}

export function Grain() {
  return <div className="bg-grain" style={{ opacity: 0.35 }} />;
}

export function BigWord({
  text,
  size = 120,
  color = "#fff",
  at = 0,
  t = 0,
  weight = 700,
  style,
  letterSpacing = "-.05em",
}: {
  text: string;
  size?: number;
  color?: string;
  at?: number;
  t?: number;
  weight?: number;
  style?: CSSProperties;
  letterSpacing?: string;
}) {
  const p = Math.min(1, Math.max(0, (t - at) / 0.5));
  return (
    <div
      style={{
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.02,
        letterSpacing,
        color,
        opacity: p,
        transform: `translateY(${(1 - p) * 24}px) scale(${0.98 + p * 0.02})`,
        filter: `blur(${(1 - p) * 10}px)`,
        ...style,
      }}
    >
      {text}
    </div>
  );
}
