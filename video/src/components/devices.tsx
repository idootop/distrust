import type { CSSProperties, ReactNode } from "react";

export function LaptopFrame({
  children,
  width = 820,
  tilt = 0,
  glow = "rgba(109,77,240,.18)",
  style,
}: {
  children: ReactNode;
  width?: number;
  tilt?: number;
  glow?: string;
  style?: CSSProperties;
}) {
  const screenH = Math.round(width * 0.59);
  return (
    <div style={{ width, position: "relative", ...style }}>
      <div
        style={{
          width: "100%",
          height: screenH,
          borderRadius: 22,
          padding: 10,
          background: "linear-gradient(160deg, #23242e, #0e0f15 60%)",
          boxShadow: `0 50px 120px rgba(0,0,0,.6), 0 0 90px ${glow}, inset 0 1px 0 rgba(255,255,255,.12)`,
          transform: tilt ? `perspective(1800px) rotateY(${tilt}deg)` : undefined,
          transformOrigin: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 14,
            background: "#07080d",
            overflow: "hidden",
            position: "relative",
            border: "1px solid rgba(255,255,255,.06)",
          }}
        >
          {children}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "linear-gradient(115deg, rgba(255,255,255,.035) 0%, transparent 32%, transparent 70%, rgba(255,255,255,.02) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 5,
              width: 5,
              height: 5,
              marginLeft: -2.5,
              borderRadius: "50%",
              background: "#2a2c38",
              boxShadow: "inset 0 0 2px #000",
            }}
          />
        </div>
      </div>
      <div
        style={{
          width: "112%",
          marginLeft: "-6%",
          height: 15,
          borderRadius: "0 0 16px 16px",
          background: "linear-gradient(180deg, #262833 0%, #101117 60%, #08090d 100%)",
          boxShadow: "0 18px 40px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.14)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 4,
            width: 96,
            height: 4,
            marginLeft: -48,
            borderRadius: 4,
            background: "rgba(255,255,255,.08)",
          }}
        />
      </div>
    </div>
  );
}

export function PhoneFrame({
  children,
  width = 300,
  height = 620,
  tilt = 0,
  glow = "rgba(255,92,122,.12)",
  style,
}: {
  children: ReactNode;
  width?: number;
  height?: number;
  tilt?: number;
  glow?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 42,
        padding: 8,
        background: "linear-gradient(155deg, #2a2b36, #0d0e14 55%)",
        boxShadow: `0 50px 120px rgba(0,0,0,.65), 0 0 80px ${glow}, inset 0 1px 0 rgba(255,255,255,.16)`,
        position: "relative",
        transform: tilt ? `perspective(1600px) rotateY(${tilt}deg)` : undefined,
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 34,
          background: "#07080d",
          overflow: "hidden",
          position: "relative",
          border: "1px solid rgba(255,255,255,.06)",
        }}
      >
        {children}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 9,
            width: 84,
            height: 22,
            marginLeft: -42,
            borderRadius: 20,
            background: "#05060a",
            zIndex: 5,
            border: "1px solid rgba(255,255,255,.045)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: "linear-gradient(120deg, rgba(255,255,255,.045) 0%, transparent 30%, transparent 75%, rgba(255,255,255,.02) 100%)",
          }}
        />
      </div>
    </div>
  );
}

export function WifiGlyph({ size = 46, color = "#4fe3ff", opacity = 1 }: { size?: number; color?: string; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ opacity }}>
      <path d="M6 18.5C16.5 8.5 31.5 8.5 42 18.5" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M12 25c7-6.3 17-6.3 24 0" stroke={color} strokeWidth="3.2" strokeLinecap="round" opacity=".75" />
      <path d="M18 31.2c3.6-3 8.4-3 12 0" stroke={color} strokeWidth="3.2" strokeLinecap="round" opacity=".55" />
      <circle cx="24" cy="38" r="2.6" fill={color} />
    </svg>
  );
}

export function LockGlyph({
  size = 90,
  color = "#45e0a0",
  open = 0,
  crack = 0,
}: {
  size?: number;
  color?: string;
  open?: number;
  crack?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`lockbody-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity=".28" />
          <stop offset="1" stopColor={color} stopOpacity=".08" />
        </linearGradient>
        <filter id="lockglow">
          <feGaussianBlur stdDeviation="3.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#lockglow)">
        <path
          d="M25 34V25.5C25 17.5 31.5 11 40 11s15 6.5 15 14.5V34"
          stroke={color}
          strokeWidth="4.6"
          strokeLinecap="round"
          transform={`translate(0 ${-open * 7}) rotate(${-open * 16} 25 32)`}
          opacity=".9"
        />
        <rect x="18" y="33" width="44" height="36" rx="10" fill={`url(#lockbody-${color.replace("#", "")})`} stroke={color} strokeWidth="3.2" />
        <circle cx="40" cy="49" r="4" fill={color} />
        <path d="M40 52.5v7" stroke={color} strokeWidth="3" strokeLinecap="round" />
      </g>
      {crack > 0 && (
        <g opacity={crack} stroke="#ff5c7a" strokeWidth="2" strokeLinecap="round">
          <path d="M30 8l5 10-6 7 7 8-4 9" />
          <path d="M52 14l-3 9 6 6-5 10" />
        </g>
      )}
    </svg>
  );
}

export function RouterGlyph({ size = 120, color = "#4fe3ff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" style={{ overflow: "visible" }}>
      <rect x="20" y="76" width="80" height="26" rx="8" fill="rgba(79,227,255,.05)" stroke={color} strokeWidth="2.4" />
      <path d="M38 76 L31 38" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M82 76 L89 38" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="30.5" cy="35" r="3.6" fill={color} />
      <circle cx="89.5" cy="35" r="3.6" fill={color} />
      <circle cx="34" cy="89" r="2.6" fill={color} />
      <circle cx="46" cy="89" r="2.6" fill={color} opacity=".6" />
      <circle cx="58" cy="89" r="2.6" fill={color} opacity=".35" />
    </svg>
  );
}

export function ServerGlyph({ size = 110, color = "#b9a7ff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <rect x="30" y="16" width="60" height="26" rx="7" stroke={color} strokeWidth="2.2" fill="rgba(185,167,255,.05)" />
      <rect x="30" y="47" width="60" height="26" rx="7" stroke={color} strokeWidth="2.2" fill="rgba(185,167,255,.05)" />
      <rect x="30" y="78" width="60" height="26" rx="7" stroke={color} strokeWidth="2.2" fill="rgba(185,167,255,.05)" />
      <circle cx="42" cy="29" r="3" fill={color} />
      <circle cx="42" cy="60" r="3" fill={color} opacity=".6" />
      <circle cx="42" cy="91" r="3" fill={color} opacity=".35" />
      <path d="M58 29h20M58 60h20M58 91h20" stroke={color} strokeWidth="2" strokeLinecap="round" opacity=".35" />
    </svg>
  );
}
