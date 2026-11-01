import type { CSSProperties, ReactNode } from "react";
import { LockGlyph } from "./devices";

export function BrowserFrame({
  children,
  width = 1500,
  height = 820,
  url = "https://bank.example/account",
  secure = true,
  style,
  contentStyle,
}: {
  children?: ReactNode;
  width?: number;
  height?: number;
  url?: string;
  secure?: boolean;
  style?: CSSProperties;
  contentStyle?: CSSProperties;
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 18,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,.11)",
        background: "#0a0b11",
        boxShadow: "0 50px 140px rgba(0,0,0,.55), 0 0 90px rgba(109,77,240,.08)",
        ...style,
      }}
    >
      <div
        style={{
          height: 54,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 16px",
          borderBottom: "1px solid rgba(255,255,255,.07)",
          background: "linear-gradient(180deg, #15161e, #101117)",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: 0.75 }} />
          ))}
        </div>
        <div
          style={{
            height: 26,
            padding: "0 12px",
            borderRadius: 7,
            background: "rgba(255,255,255,.04)",
            border: "1px solid rgba(255,255,255,.055)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "rgba(255,255,255,.3)",
            fontSize: 10.5,
            fontFamily: "var(--mono)",
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,.18)" }} />
          <span>新标签页</span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 5, opacity: 0.3 }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: "#fff" }} />
          ))}
        </div>
      </div>
      <div
        style={{
          height: 46,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 18px",
          borderBottom: "1px solid rgba(255,255,255,.055)",
          background: "rgba(255,255,255,.018)",
        }}
      >
        <div style={{ display: "flex", gap: 10, color: "rgba(255,255,255,.22)", fontSize: 11 }}>
          <span>←</span>
          <span>→</span>
        </div>
        <div
          style={{
            flex: 1,
            height: 30,
            borderRadius: 8,
            background: "rgba(0,0,0,.26)",
            border: "1px solid rgba(255,255,255,.07)",
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "0 12px",
            fontFamily: "var(--mono)",
            fontSize: 12.5,
            color: "rgba(255,255,255,.56)",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: secure ? "#68edb8" : "#ff8ba0" }}>
            <LockGlyph size={15} color={secure ? "#45e0a0" : "#ff5c7a"} open={secure ? 0 : 0.6} />
            {secure ? "安全" : "不安全"}
          </span>
          <span style={{ color: "rgba(255,255,255,.22)" }}>|</span>
          <span>{url}</span>
        </div>
        <div style={{ display: "flex", gap: 8, opacity: 0.3 }}>
          <span style={{ width: 13, height: 13, border: "1px solid #fff", borderRadius: 3 }} />
          <span style={{ fontSize: 13 }}>☆</span>
        </div>
      </div>
      <div style={{ height: height - 100, position: "relative", overflow: "hidden", ...contentStyle }}>{children}</div>
    </div>
  );
}

export function Seal({
  size = 94,
  color = "#45e0a0",
  label = "emSign",
  rotate = 0,
}: {
  size?: number;
  color?: string;
  label?: string;
  rotate?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        position: "relative",
        display: "grid",
        placeItems: "center",
        background: `conic-gradient(from ${rotate}deg, ${color}22, ${color}05, ${color}2a, ${color}08, ${color}22)`,
        border: `1px solid ${color}66`,
        boxShadow: `0 0 ${size * 0.5}px ${color}18, inset 0 0 0 4px ${color}0d`,
        color,
        flex: "0 0 auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 7,
          borderRadius: "50%",
          border: `1px dashed ${color}55`,
        }}
      />
      <div style={{ textAlign: "center", lineHeight: 1.05 }}>
        <div style={{ fontSize: size * 0.19, fontWeight: 700, letterSpacing: "-.03em", fontFamily: "var(--serif)" }}>{label}</div>
        <div className="mono" style={{ fontSize: size * 0.085, letterSpacing: ".16em", opacity: 0.75, marginTop: 3 }}>
          CA 签章
        </div>
      </div>
    </div>
  );
}

export type CertKind = "root" | "intermediate" | "server" | "forged";

export function CertCard({
  kind = "intermediate",
  title,
  issuer,
  subject,
  meta,
  state = "ok",
  width = 460,
  seal = true,
  style,
  compact = false,
}: {
  kind?: CertKind;
  title: string;
  issuer: string;
  subject: string;
  meta?: string;
  state?: "ok" | "danger" | "muted";
  width?: number;
  seal?: boolean;
  style?: CSSProperties;
  compact?: boolean;
}) {
  const color = state === "danger" ? "#ff5c7a" : state === "muted" ? "#6a7089" : "#45e0a0";
  const label =
    kind === "root"
      ? "ROOT CA"
      : kind === "intermediate"
        ? "INTERMEDIATE CA"
        : kind === "forged"
          ? "FORGED · SIGNED"
          : "SERVER CERT";
  return (
    <div
      style={{
        width,
        borderRadius: 18,
        border: `1px solid ${state === "danger" ? "rgba(255,92,122,.38)" : "rgba(255,255,255,.13)"}`,
        background:
          state === "danger"
            ? "linear-gradient(165deg, rgba(40,14,22,.94), rgba(14,11,18,.97))"
            : "linear-gradient(165deg, rgba(24,25,36,.96), rgba(11,12,18,.97))",
        boxShadow: state === "danger" ? `0 30px 90px rgba(255,92,122,.09)` : "0 30px 90px rgba(0,0,0,.4)",
        padding: compact ? 20 : 26,
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 5,
          background: `linear-gradient(180deg, ${color}, ${color}22)`,
          opacity: 0.85,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -40,
          top: -50,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}12, transparent 65%)`,
        }}
      />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 18 }}>
        <div style={{ minWidth: 0 }}>
          <div className="mono" style={{ fontSize: compact ? 9 : 10, letterSpacing: ".16em", color: `${color}cc` }}>
            {label}
          </div>
          <div style={{ fontSize: compact ? 19 : 23, fontWeight: 600, letterSpacing: "-.02em", marginTop: 9, lineHeight: 1.25 }}>{title}</div>
          <div className="mono" style={{ fontSize: compact ? 10 : 11, color: "rgba(255,255,255,.32)", marginTop: 7, letterSpacing: ".02em" }}>
            {meta ?? "SHA-256 · 88:6f:2a:1c … 4d:1e"}
          </div>
        </div>
        {seal && <Seal size={compact ? 58 : 76} color={color} rotate={16} />}
      </div>
      <div style={{ height: 1, background: "rgba(255,255,255,.075)", margin: compact ? "16px 0 13px" : "20px 0 17px" }} />
      <div style={{ display: "grid", gridTemplateColumns: "70px 1fr", gap: "7px 12px", fontSize: compact ? 11 : 12.5, lineHeight: 1.55 }}>
        <span style={{ color: "rgba(255,255,255,.3)" }}>Issuer</span>
        <span className="mono" style={{ color: "rgba(255,255,255,.66)" }}>{issuer}</span>
        <span style={{ color: "rgba(255,255,255,.3)" }}>Subject</span>
        <span className="mono" style={{ color: "rgba(255,255,255,.66)" }}>{subject}</span>
      </div>
    </div>
  );
}
