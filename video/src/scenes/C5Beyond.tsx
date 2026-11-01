import type { CSSProperties, ReactNode } from "react";
import { useChapter } from "../lib/ChapterContext";
import { clamp01, easeInOutCubic, easeOutBack, easeOutCubic, progress, spring } from "../lib/time";
import { LockGlyph } from "../components/devices";
import { FlowArrow } from "../components/visuals";

function Act({ from, to, children, fade = 0.5, style }: { from: number; to: number; children: ReactNode; fade?: number; style?: CSSProperties }) {
  const { local } = useChapter();
  const o = Math.min(progress(local, from, fade, easeInOutCubic), 1 - progress(local, to - fade, fade, easeInOutCubic));
  if (o <= 0.001) return null;
  return <div style={{ position: "absolute", inset: 0, opacity: o, ...style }}>{children}</div>;
}

function Panel({
  index,
  kicker,
  title,
  color,
  active,
  children,
  at,
}: {
  index: string;
  kicker: string;
  title: string;
  color: string;
  active: number;
  children: ReactNode;
  at: number;
}) {
  const p = progress(at, 0, 1, easeOutCubic);
  return (
    <div
      style={{
        width: 510,
        height: 510,
        borderRadius: 16,
        border: `1px solid ${active > 0.5 ? `${color}55` : "rgba(255,255,255,.1)"}`,
        background: active > 0.5 ? `linear-gradient(170deg, ${color}0d, rgba(10,11,17,.96))` : "rgba(10,11,17,.82)",
        padding: "22px 24px",
        opacity: 0.32 + 0.68 * active,
        transform: `translateY(${(1 - active) * 14}px) scale(${0.985 + active * 0.015})`,
        boxShadow: active > 0.5 ? `0 30px 90px ${color}10` : "0 20px 60px rgba(0,0,0,.3)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        transition: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: ".16em", color: `${color}aa` }}>{index} / {kicker}</div>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, boxShadow: `0 0 9px ${color}`, opacity: active }} />
      </div>
      <div style={{ fontSize: 24, fontWeight: 600, marginTop: 12, letterSpacing: "-.02em" }}>{title}</div>
      <div style={{ flex: 1, marginTop: 18, position: "relative" }}>{children}</div>
      <div style={{ height: 1, background: "rgba(255,255,255,.07)", margin: "10px 0 10px" }} />
      <div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,.28)", letterSpacing: ".1em" }}>
        {index === "01" ? "TOOL CALL · INJECTION" : index === "02" ? "PROXY NODE · DECRYPT" : "TOKEN · API · BANKING"}
      </div>
    </div>
  );
}

function CodeViz({ t, at }: { t: number; at: number }) {
  const inject = progress(t, at, 0.5, easeOutCubic);
  const lines = [
    { s: '> agent.tool("read_file")', c: "rgba(255,255,255,.4)" },
    { s: "  ← ok · 42 lines", c: "rgba(69,224,160,.55)" },
    { s: '> agent.tool("run_shell")', c: "rgba(255,255,255,.4)" },
  ];
  return (
    <div style={{ borderRadius: 10, border: "1px solid rgba(255,255,255,.08)", background: "rgba(0,0,0,.25)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff5c7a", opacity: 0.6 }} />
        <span className="mono" style={{ fontSize: 7.5, color: "rgba(255,255,255,.25)" }}>agent / tool-call</span>
        <span style={{ flex: 1 }} />
        <span className="mono" style={{ fontSize: 7.5, color: "rgba(255,92,122,.7)" }}>UNTRUSTED</span>
      </div>
      <div style={{ padding: "12px 13px", fontFamily: "var(--mono)", fontSize: 11, lineHeight: 1.8 }}>
        {lines.map((l, i) => (
          <div key={i} style={{ color: l.c, opacity: progress(t, 0.2 + i * 0.35, 0.4) }}>{l.s}</div>
        ))}
        <div style={{ marginTop: 6, padding: "7px 8px", borderRadius: 5, border: "1px solid rgba(255,92,122,.35)", background: "rgba(255,92,122,.08)", opacity: inject, transform: `translateX(${(1 - inject) * -8}px)` }}>
          <div style={{ color: "#ff8ba0", fontSize: 9, letterSpacing: ".08em" }}>← tool result (injected)</div>
          <div style={{ color: "#ffd0d8", fontSize: 11, marginTop: 4 }}>$ rm -rf ~/work</div>
        </div>
      </div>
    </div>
  );
}

function ProxyViz({ t, at }: { t: number; at: number }) {
  const p = progress(t, at, 0.8, easeOutCubic);
  return (
    <div style={{ position: "relative", height: "100%", display: "grid", placeItems: "center" }}>
      <svg width="430" height="300" viewBox="0 0 430 300">
        <circle cx="215" cy="150" r="112" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="1" />
        <ellipse cx="215" cy="150" rx="112" ry="42" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="1" />
        <ellipse cx="215" cy="150" rx="55" ry="112" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="1" />
        <path d="M70 90 Q 215 20 360 90" fill="none" stroke="rgba(255,92,122,.4)" strokeWidth="1.2" strokeDasharray="4 6" opacity={p} />
        <path d="M70 90 Q 215 280 360 210" fill="none" stroke="rgba(255,92,122,.25)" strokeWidth="1.2" strokeDasharray="4 6" opacity={p} />
        <line x1="80" y1="120" x2="350" y2="200" stroke="rgba(79,227,255,.25)" strokeWidth="1.1" strokeDasharray="3 5" />
        <circle cx="80" cy="120" r="4" fill="#4fe3ff" />
        <circle cx="350" cy="200" r="4" fill="#b9a7ff" />
        <g opacity={p}>
          <circle cx="215" cy="150" r="30" fill="rgba(255,92,122,.1)" stroke="rgba(255,92,122,.45)" strokeWidth="1.4" />
          <circle cx="215" cy="150" r="8" fill="#ff5c7a" />
          <text x="215" y="205" textAnchor="middle" fill="rgba(255,140,160,.7)" fontSize="9" fontFamily="var(--mono)">MALICIOUS NODE</text>
        </g>
        <g opacity={p}>
          <rect x="168" y="60" width="94" height="30" rx="6" fill="rgba(255,92,122,.1)" stroke="rgba(255,92,122,.35)" />
          <text x="215" y="79" textAnchor="middle" fill="#ff8ba0" fontSize="9" fontFamily="var(--mono)">TLS OPEN</text>
        </g>
      </svg>
      <div style={{ position: "absolute", bottom: 4, left: 0, right: 0, display: "flex", justifyContent: "space-between" }}>
        <span className="mono" style={{ fontSize: 8, color: "rgba(255,255,255,.28)" }}>YOU</span>
        <span className="mono" style={{ fontSize: 8, color: "rgba(255,92,122,.6)" }}>PLAINTEXT → NODE</span>
        <span className="mono" style={{ fontSize: 8, color: "rgba(255,255,255,.28)" }}>BANK</span>
      </div>
    </div>
  );
}

function BankViz({ t, at }: { t: number; at: number }) {
  const p = progress(t, at, 0.8, easeOutCubic);
  return (
    <div style={{ position: "relative", height: "100%" }}>
      <div style={{ width: 300, height: 180, borderRadius: 14, border: "1px solid rgba(255,255,255,.14)", background: "linear-gradient(145deg, rgba(79,227,255,.12), rgba(109,77,240,.12))", padding: 18, margin: "8px auto", transform: "rotate(-3deg)", boxShadow: "0 20px 50px rgba(0,0,0,.35)" }}>
        <div className="mono" style={{ fontSize: 8, color: "rgba(255,255,255,.35)", letterSpacing: ".14em" }}>EXAMPLE BANK · PLATINUM</div>
        <div className="mono" style={{ fontSize: 26, marginTop: 24, letterSpacing: ".08em", color: "rgba(255,255,255,.72)" }}>···· ···· ···· 8842</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, fontSize: 9, color: "rgba(255,255,255,.38)" }}>
          <span>DEL WANG</span><span>09/29</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 10, right: 10, top: 206, padding: "11px 13px", borderRadius: 8, border: "1px solid rgba(255,92,122,.25)", background: "rgba(255,92,122,.06)", opacity: p }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="mono" style={{ fontSize: 8, color: "rgba(255,140,160,.65)", letterSpacing: ".1em" }}>AUTH TOKEN</span>
          <span className="mono" style={{ fontSize: 7.5, color: "#ff8ba0" }}>VISIBLE</span>
        </div>
        <div className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,.55)", marginTop: 7 }}>eyJhbGciOiJIUzI1NiIsInR5cCI6…</div>
      </div>
      <div style={{ position: "absolute", left: 10, right: 10, top: 270, padding: "11px 13px", borderRadius: 8, border: "1px solid rgba(255,92,122,.25)", background: "rgba(255,92,122,.06)", opacity: p }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="mono" style={{ fontSize: 8, color: "rgba(255,140,160,.65)", letterSpacing: ".1em" }}>API KEY</span>
          <span className="mono" style={{ fontSize: 7.5, color: "#ff8ba0" }}>LEAKED</span>
        </div>
        <div className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,.55)", marginTop: 7 }}>sk-live-••••••••••••••••</div>
      </div>
    </div>
  );
}

export function C5Beyond() {
  const { at, local, chapter } = useChapter();
  const T = {
    b1: at("c5_b1"), b2: at("c5_b2"), b3: at("c5_b3"),
    b4: at("c5_b4"), b5: at("c5_b5"), b6: at("c5_b6"),
  };
  const p1 = progress(local, T.b2, 0.6, easeOutCubic);
  const p2 = progress(local, T.b4, 0.6, easeOutCubic);
  const p3 = progress(local, T.b5, 0.6, easeOutCubic);
  const quote = progress(local, T.b6, 0.8, easeInOutCubic);

  return (
    <div className="scene" style={{ padding: 0 }}>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - quote * 0.75 }}>
        <div style={{ position: "absolute", left: 96, top: 104 }}>
          <div className="kicker" style={{ color: "rgba(255,92,122,.7)" }}>BEYOND CHAT</div>
          <div className="display" style={{ fontSize: 54, marginTop: 12 }}>不止聊天</div>
          <div style={{ fontSize: 19, color: "rgba(255,255,255,.4)", marginTop: 10 }}>把场景换一下，后果会更糟。</div>
        </div>
        <div style={{ position: "absolute", left: 96, top: 260, display: "flex", gap: 26 }}>
          <Panel index="01" kicker="VIBE CODING" title="AI 编码助手" color="#4fe3ff" active={p1} at={T.b2} >
            <CodeViz t={local - T.b2} at={T.b3 - T.b2} />
            <div style={{ marginTop: 12, fontSize: 12.5, color: "rgba(255,255,255,.45)", lineHeight: 1.6 }}>
              工具调用返回时，注入一条恶意 Shell 命令。<br />删库、后门、API Key，只在一瞬间。
            </div>
          </Panel>
          <Panel index="02" kicker="PROXY NODE" title="机场 / 代理节点" color="#ffc466" active={p2} at={T.b4}>
            <ProxyViz t={local - T.b4} at={0.4} />
            <div style={{ marginTop: 10, fontSize: 12.5, color: "rgba(255,255,255,.45)", lineHeight: 1.6 }}>
              节点是恶意的，经过它的加密流量，<br />都可能被解开。
            </div>
          </Panel>
          <Panel index="03" kicker="BANK / API" title="银行与交易所" color="#ff5c7a" active={p3} at={T.b5}>
            <BankViz t={local - T.b5} at={0.4} />
            <div style={{ marginTop: 10, fontSize: 12.5, color: "rgba(255,255,255,.45)", lineHeight: 1.6 }}>
              校验、API、登录 Token，在旧客户端面前，<br />都是透明的。
            </div>
          </Panel>
        </div>
        <div style={{ position: "absolute", left: 96, top: 810, opacity: progress(local, T.b3, 0.8) }}>
          <div className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,.24)", letterSpacing: ".14em" }}>
            ONE OLD COMPONENT · THREE ATTACK SURFACES
          </div>
        </div>
      </div>
      {quote > 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 20, background: `radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,92,122,${quote * 0.08}), rgba(5,6,10,${quote * 0.88}) 70%)` }}>
          <div className="mono" style={{ fontSize: 11, color: "rgba(255,92,122,.65)", letterSpacing: ".26em", opacity: quote }}>THE UNCOMFORTABLE TRUTH</div>
          <div className="display" style={{ fontSize: 68, marginTop: 24, textAlign: "center", lineHeight: 1.3, opacity: quote, transform: `scale(${0.96 + quote * 0.04})` }}>
            你以为的安全，
            <br />
            只是因为<span style={{ color: "#ff5c7a" }}>还没人对你出手</span>。
          </div>
          <div style={{ marginTop: 30, width: 120, height: 1, background: "rgba(255,92,122,.5)", opacity: quote }} />
        </div>
      )}
    </div>
  );
}
