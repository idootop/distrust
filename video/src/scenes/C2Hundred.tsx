import type { CSSProperties, ReactNode } from "react";
import { useChapter } from "../lib/ChapterContext";
import { clamp01, easeInOutCubic, easeOutBack, easeOutCubic, easeOutExpo, progress, spring } from "../lib/time";
import { LockGlyph } from "../components/devices";
import { FlowArrow } from "../components/visuals";

type EventRow = { time: string; date: string; title: string; sub: string; color: string; at: string; offset?: number };

const EVENTS: EventRow[] = [
  { time: "18:05", date: "10-17", title: "Chrome 收到报告", sub: "root program · UTC", color: "#4fe3ff", at: "c2_b3" },
  { time: "19:45", date: "10-17", title: "CRLSet 封禁 6 张 TLS 中间证书", sub: "用户无需重启浏览器", color: "#45e0a0", at: "c2_b3", offset: 3.2 },
  { time: "22:59", date: "10-17", title: "Mozilla 完成 OneCRL 封禁", sub: "收到报告后 3 小时", color: "#45e0a0", at: "c2_b4" },
  { time: "09:24", date: "10-18", title: "eMudhra 吊销 8 张证书", sub: "reason: ca_compromise", color: "#ffc466", at: "c2_b4", offset: 3.4 },
  { time: "10-19", date: "10-19", title: "Sectigo 吊销 8 张交叉签名证书", sub: "合计 16 张", color: "#ffc466", at: "c2_b5" },
  { time: "10-19", date: "10-20", title: "Go / Microsoft 完成封禁", sub: "CVE-2026-111943", color: "#b9a7ff", at: "c2_b5", offset: 3.6 },
  { time: "10-22", date: "10-22", title: "Apple 完成封禁", sub: "平台侧信任库更新", color: "#b9a7ff", at: "c2_b5", offset: 5.0 },
];

function Act({ from, to, children, fade = 0.55, style }: { from: number; to: number; children: ReactNode; fade?: number; style?: CSSProperties }) {
  const { local } = useChapter();
  const o = Math.min(progress(local, from, fade, easeInOutCubic), 1 - progress(local, to - fade, fade, easeInOutCubic));
  if (o <= 0.001) return null;
  return <div style={{ position: "absolute", inset: 0, opacity: o, ...style }}>{children}</div>;
}

function Tag({ children, color = "#4fe3ff" }: { children: ReactNode; color?: string }) {
  return (
    <span className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, letterSpacing: ".12em", color, border: `1px solid ${color}33`, background: `${color}0d`, borderRadius: 5, padding: "4px 7px" }}>
      <span style={{ width: 4, height: 4, borderRadius: "50%", background: color, boxShadow: `0 0 7px ${color}` }} />
      {children}
    </span>
  );
}

function CaseFile({ t }: { t: number }) {
  return (
    <div
      style={{
        width: 760,
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,.12)",
        background: "linear-gradient(155deg, rgba(22,23,34,.96), rgba(9,10,16,.98))",
        boxShadow: "0 40px 120px rgba(0,0,0,.5)",
        padding: 30,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div className="mono" style={{ fontSize: 9.5, letterSpacing: ".2em", color: "rgba(255,92,122,.7)" }}>DISCLOSURE BUNDLE · 10-17</div>
          <div style={{ fontSize: 30, fontWeight: 600, marginTop: 9, letterSpacing: "-.02em" }}>8 × Intermediate CA<br />Private Key Proof</div>
        </div>
        <div style={{ transform: "rotate(8deg)", border: "2px solid rgba(255,92,122,.45)", borderRadius: 7, padding: "7px 10px", color: "rgba(255,140,160,.8)", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".16em", opacity: progress(t, 2.1, 0.5) }}>
          PROOF
        </div>
      </div>
      <div style={{ height: 1, background: "rgba(255,255,255,.08)", margin: "22px 0 14px" }} />
      <div className="mono" style={{ display: "grid", gridTemplateColumns: "90px 1fr 70px 120px", gap: "9px 12px", fontSize: 10, color: "rgba(255,255,255,.3)", letterSpacing: ".06em" }}>
        <span>KEY #</span><span>VALUE</span><span>SIG</span><span>VERIFY</span>
        {[4, 56, 66, 115, 155, 156, 230, 237].map((n, i) => {
          const p = progress(t, 0.8 + i * 0.1, 0.4);
          return (
            <div key={n} style={{ display: "contents", opacity: p }}>
              <span style={{ color: "rgba(255,255,255,.45)" }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ color: "rgba(255,211,160,.9)" }}>{n}</span>
              <span style={{ color: "rgba(69,224,160,.75)" }}>ok</span>
              <span style={{ color: "rgba(69,224,160,.75)" }}>✓ valid</span>
            </div>
          );
        })}
      </div>
      <div style={{ height: 1, background: "rgba(255,255,255,.07)", margin: "20px 0 16px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,.32)" }}>SIGNED BY: WAYNE · 2026-10-17</div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", inset: -8, borderRadius: 10, border: "1px solid rgba(69,224,160,.16)", opacity: 0.8 }} />
          <div className="mono" style={{ fontSize: 10, color: "#68edb8", letterSpacing: ".1em", position: "relative" }}>SUBMITTED → ROOT PROGRAMS</div>
        </div>
      </div>
    </div>
  );
}

function RootPrograms({ t }: { t: number }) {
  const list = [
    { name: "Chrome", sub: "Root Program", color: "#4fe3ff" },
    { name: "Mozilla", sub: "Root Store", color: "#ffc466" },
    { name: "Microsoft", sub: "Trusted Root", color: "#b9a7ff" },
    { name: "Apple", sub: "Root Store", color: "#d9dce8" },
    { name: "Sectigo", sub: "Cross-sign", color: "#45e0a0" },
  ];
  return (
    <div style={{ width: 620 }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: ".16em", color: "rgba(255,255,255,.3)", marginBottom: 16 }}>DISCLOSED TO</div>
      {list.map((p, i) => {
        const a = progress(t, 1.4 + i * 0.12, 0.5);
        return (
          <div
            key={p.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "15px 18px",
              marginBottom: 10,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,.08)",
              background: "rgba(255,255,255,.025)",
              opacity: a,
              transform: `translateX(${(1 - a) * 18}px)`,
            }}
          >
            <span style={{ width: 30, height: 30, borderRadius: 8, display: "grid", placeItems: "center", background: `${p.color}14`, border: `1px solid ${p.color}33`, color: p.color, fontSize: 12, fontWeight: 700 }}>
              {p.name[0]}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 500 }}>{p.name}</div>
              <div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,.28)", marginTop: 2 }}>{p.sub}</div>
            </div>
            <span className="mono" style={{ fontSize: 9, color: "#68edb8" }}>RECEIVED</span>
          </div>
        );
      })}
    </div>
  );
}

function ResponseClock({ p, count }: { p: number; count: number }) {
  const r = 100;
  const c = Math.PI * 2 * r;
  return (
    <div style={{ position: "relative", width: 260, height: 260 }}>
      <svg width="260" height="260" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="130" cy="130" r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="2" />
        <circle cx="130" cy="130" r={r} fill="none" stroke="rgba(255,196,102,.8)" strokeWidth="3" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - p)} style={{ filter: "drop-shadow(0 0 10px rgba(255,196,102,.35))" }} />
        {Array.from({ length: 60 }, (_, i) => {
          const a = (i / 60) * Math.PI * 2;
          return <line key={i} x1={130 + Math.cos(a) * 112} y1={130 + Math.sin(a) * 112} x2={130 + Math.cos(a) * 118} y2={130 + Math.sin(a) * 118} stroke="rgba(255,255,255,.13)" strokeWidth="1" />;
        })}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div className="mono" style={{ fontSize: 58, fontWeight: 700, color: "#ffd28a", letterSpacing: "-.05em", lineHeight: 1 }}>{count}</div>
        <div className="mono" style={{ fontSize: 10, color: "rgba(255,196,102,.55)", letterSpacing: ".24em", marginTop: 8 }}>MINUTES</div>
      </div>
    </div>
  );
}

function Timeline({ t, clock }: { t: number; clock: number }) {
  const x0 = 160;
  const segA = 660;
  const gap = 50;
  const segB = 370;
  const y = 560;
  const firstX = x0 + (5 / 120) * segA;
  const hundredX = x0 + (105 / 120) * segA;
  const events = [
    { x: firstX, label: "18:05", at: "c2_b3", color: "#4fe3ff" },
    { x: hundredX, label: "19:45", at: "c2_b3", color: "#45e0a0" },
    { x: x0 + segA + gap + 18, label: "22:59", at: "c2_b4", color: "#45e0a0" },
    { x: x0 + segA + gap + 110, label: "10-18", at: "c2_b4", color: "#ffc466" },
    { x: x0 + segA + gap + 230, label: "10-19", at: "c2_b5", color: "#ffc466" },
  ];
  return (
    <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
      <line x1={x0} y1={y} x2={x0 + segA} y2={y} stroke="rgba(255,255,255,.22)" strokeWidth="1.2" />
      <line x1={x0 + segA + gap} y1={y} x2={x0 + segA + gap + segB} y2={y} stroke="rgba(255,255,255,.16)" strokeWidth="1.2" strokeDasharray="2 6" />
      {[0, 30, 60, 90, 120].map((m) => {
        const x = x0 + (m / 120) * segA;
        return (
          <g key={m}>
            <line x1={x} y1={y - 6} x2={x} y2={y + 6} stroke="rgba(255,255,255,.3)" />
            <text x={x} y={y + 30} textAnchor="middle" fill="rgba(255,255,255,.3)" fontSize="11" fontFamily="var(--mono)">{m === 120 ? "20:00" : `${18 + Math.floor((m + 0) / 60)}:${String(m % 60).padStart(2, "0")}`}</text>
          </g>
        );
      })}
      {[0, 1, 2, 3].map((i) => (
        <text key={i} x={x0 + segA + gap + 70 + i * 90} y={y + 30} textAnchor="middle" fill="rgba(255,255,255,.24)" fontSize="10" fontFamily="var(--mono)">{["10-18", "10-19", "10-20", "10-22"][i]}</text>
      ))}
      <text x={x0 + segA + gap - 26} y={y + 4} textAnchor="middle" fill="rgba(255,255,255,.3)" fontSize="14" fontFamily="var(--mono)">//</text>
      {/* 100 minute bracket */}
      <line x1={firstX} y1={y - 46} x2={hundredX} y2={y - 46} stroke="rgba(255,196,102,.55)" strokeWidth="1.4" />
      <line x1={firstX} y1={y - 52} x2={firstX} y2={y - 40} stroke="rgba(255,196,102,.55)" />
      <line x1={hundredX} y1={y - 52} x2={hundredX} y2={y - 40} stroke="rgba(255,196,102,.55)" />
      <text x={(firstX + hundredX) / 2} y={y - 58} textAnchor="middle" fill="rgba(255,196,102,.8)" fontSize="13" fontFamily="var(--mono)">100 MIN</text>
      <line x1={firstX} y1={y} x2={firstX + (hundredX - firstX) * clamp01(clock / 100)} y2={y} stroke="rgba(255,196,102,.85)" strokeWidth="3" strokeLinecap="round" />
      {events.map((e, i) => {
        const p = progress(t, e.at === "c2_b3" ? (i === 0 ? 0.4 : 4.0) : e.at === "c2_b4" ? (i === 2 ? 0.2 : 2.6) : 0.2, 0.5, easeOutBack);
        return (
          <g key={i} opacity={clamp01(p)} transform={`translate(0 ${(1 - p) * 10})`}>
            <circle cx={e.x} cy={y} r="8" fill={`${e.color}22`} />
            <circle cx={e.x} cy={y} r="4" fill={e.color} />
            <text x={e.x} y={y - 22} textAnchor="middle" fill={e.color} fontSize="10" fontFamily="var(--mono)">{e.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function EventLog({ t }: { t: number }) {
  return (
    <div style={{ width: 560, padding: "20px 22px", borderRadius: 16, border: "1px solid rgba(255,255,255,.09)", background: "rgba(9,10,16,.72)" }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: ".16em", color: "rgba(255,255,255,.3)", marginBottom: 16 }}>RESPONSE LOG · UTC</div>
      {EVENTS.map((e, i) => {
        const base = e.at === "c2_b3" ? 2.0 : e.at === "c2_b4" ? 1.0 : 0.4;
        const p = progress(t, base + (e.offset ?? i * 1.2), 0.55, easeOutCubic);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 12,
              padding: "7px 10px",
              marginLeft: -10,
              marginRight: -10,
              borderRadius: 8,
              background: p > 0.5 ? "rgba(255,255,255,.025)" : "transparent",
              opacity: 0.15 + 0.85 * p,
              transform: `translateX(${(1 - p) * 12}px)`,
            }}
          >
            <div className="mono" style={{ width: 58, flex: "0 0 auto", fontSize: 9, color: "rgba(255,255,255,.34)", lineHeight: 1.6 }}>
              {e.date}<br />{e.time}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.76)", lineHeight: 1.45 }}>{e.title}</div>
              <div className="mono" style={{ fontSize: 8.5, color: "rgba(255,255,255,.27)", marginTop: 3 }}>{e.sub}</div>
            </div>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: e.color, marginTop: 7, boxShadow: `0 0 8px ${e.color}`, opacity: p }} />
          </div>
        );
      })}
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,.26)" }}>总体响应时间</span>
        <span className="mono" style={{ fontSize: 12, color: "#68edb8" }}>100 min → 5 days</span>
      </div>
    </div>
  );
}

function TestTable({ t }: { t: number }) {
  const rows = [
    ["EM DV TLS CA - G3B", "emSign Root TLS CA - G3"],
    ["EM DV TLS CA - G3C", "emSign Root TLS CA - G3"],
    ["EM OV TLS CA - G3B", "emSign Root TLS CA - G3"],
    ["EM OV TLS CA - G3C", "emSign Root TLS CA - G3"],
    ["EM EV TLS CA - G3B", "AAA Certificate Services"],
    ["EM EV TLS CA - G3C", "AAA Certificate Services"],
    ["EM OV CS CA - G3B", "AAA Certificate Services"],
    ["EM OV CS CA - G3C", "AAA Certificate Services"],
  ];
  return (
    <div style={{ width: 1390, borderRadius: 16, border: "1px solid rgba(255,255,255,.1)", background: "rgba(9,10,16,.82)", overflow: "hidden", boxShadow: "0 40px 120px rgba(0,0,0,.45)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,.07)", background: "rgba(255,255,255,.02)" }}>
        <div style={{ display: "flex", gap: 6 }}>{["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.7 }} />)}</div>
        <div className="mono" style={{ marginLeft: 10, fontSize: 10, color: "rgba(255,255,255,.3)" }}>emudhra.we-have-a-problem.com / test</div>
        <div style={{ flex: 1 }} />
        <Tag color="#45e0a0">ALL CLEAR</Tag>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1.6fr 1fr", padding: "12px 22px", borderBottom: "1px solid rgba(255,255,255,.07)", fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: ".1em", color: "rgba(255,255,255,.32)" }}>
        <span>INTERMEDIATE CA</span><span>CHAINS TO</span><span style={{ textAlign: "right" }}>RESULT</span>
      </div>
      {rows.map(([name, chain], i) => {
        const p = progress(t, 0.2 + i * 0.16, 0.55, easeOutCubic);
        return (
          <div key={name} style={{ display: "grid", gridTemplateColumns: "2.5fr 1.6fr 1fr", alignItems: "center", padding: "13px 22px", borderBottom: "1px solid rgba(255,255,255,.045)", opacity: p, transform: `translateY(${(1 - p) * 8}px)` }}>
            <span className="mono" style={{ fontSize: 12, color: "rgba(79,227,255,.78)" }}>{name}</span>
            <span className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,.42)" }}>{chain}</span>
            <span style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
              <span style={{ width: 18, height: 18, borderRadius: 5, background: "rgba(69,224,160,.15)", border: "1px solid rgba(69,224,160,.4)", display: "grid", placeItems: "center", color: "#68edb8", fontSize: 11 }}>✓</span>
              <span className="mono" style={{ fontSize: 10.5, color: "rgba(104,237,184,.8)" }}>Did not connect</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function C2Hundred() {
  const { local, at, chapter } = useChapter();
  const T = {
    b1: at("c2_b1"),
    b2: at("c2_b2"),
    b3: at("c2_b3"),
    b4: at("c2_b4"),
    b5: at("c2_b5"),
    b6: at("c2_b6"),
    b7: at("c2_b7"),
    b8: at("c2_b8"),
  };
  const clock = Math.min(100, Math.max(0, ((local - T.b3) / 4.8) * 100));
  const freeze = progress(local, T.b8, 0.5, easeOutCubic);
  const red = progress(local, T.b8 + 0.1, 0.8, easeInOutCubic);

  return (
    <div className="scene" style={{ padding: 0 }}>
      {/* Act 1: disclosure */}
      <Act from={T.b1} to={T.b2 + 0.8} fade={0.5}>
        <div style={{ position: "absolute", left: 100, top: 118, opacity: 1 - progress(local, T.b2 - 0.1, 0.6) }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: ".2em", color: "rgba(255,92,122,.7)" }}>2026.10.17 · 18:05 UTC</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 10 }}>
            <div className="display" style={{ fontSize: 64 }}>一份无法反驳的证明</div>
            <div className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,.3)" }}>PROOF-OF-KEY</div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 100, top: 286 }}>
          <CaseFile t={local - T.b1} />
        </div>
        <div style={{ position: "absolute", left: 960, top: 300, opacity: progress(local, T.b1 + 1.1, 0.7) }}>
          <RootPrograms t={local - T.b1} />
        </div>
        <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <FlowArrow x1={866} y1={520} x2={952} y2={520} color="rgba(255,92,122,.45)" progress={progress(local, T.b1 + 1.0, 0.8)} />
        </svg>
      </Act>

      {/* Act 2: timeline */}
      <Act from={T.b2} to={T.b6 + 0.2} fade={0.55}>
        <div style={{ position: "absolute", left: 100, top: 116, right: 100 }}>
          <div className="kicker">THE FIRST 100 MINUTES</div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 12 }}>
            <div className="display" style={{ fontSize: 64 }}>接下来的一百分钟</div>
            <div className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,.3)", letterSpacing: ".12em" }}>UTC · 2026-10-17</div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 170, top: 208 }}>
          <ResponseClock p={progress(clock, 0, 100)} count={Math.round(clock)} />
        </div>
        <div style={{ position: "absolute", left: 170, top: 640, width: 400 }}>
          <div style={{ fontSize: 19, color: "rgba(255,255,255,.46)", lineHeight: 1.7 }}>
            Chrome 从收到报告，到用 CRLSet 封禁，<br />只用了 <span style={{ color: "#ffd28a" }}>100 分钟</span>。
          </div>
          <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
            <Tag color="#4fe3ff">NO RESTART</Tag>
            <Tag color="#45e0a0">GLOBAL</Tag>
          </div>
        </div>
        <div style={{ position: "absolute", left: 1268, top: 292, width: 560, opacity: progress(local, T.b2 + 0.4, 0.7) }}>
          <EventLog t={local} />
        </div>
        <Timeline t={local} clock={clock} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 154, textAlign: "center", opacity: progress(local, T.b5 + 2.0, 0.6) }}>
          <span className="mono" style={{ fontSize: 11, color: "rgba(69,224,160,.55)", letterSpacing: ".2em" }}>ONE OF THE FASTEST CERTIFICATE RESPONSES IN INTERNET HISTORY</span>
        </div>
      </Act>

      {/* Act 3: green checks */}
      <Act from={T.b6} to={chapter.duration + 0.1} fade={0.25}>
        <div style={{ position: "absolute", inset: 0, filter: `saturate(${1 - red * 0.75})` }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 106, textAlign: "center" }}>
            <div className="kicker" style={{ justifyContent: "center", color: "rgba(69,224,160,.8)" }}>BROWSER CHECK</div>
            <div className="display" style={{ fontSize: 48, marginTop: 10 }}>一排绿色的对勾</div>
          </div>
          <div style={{ position: "absolute", left: 264, top: 238 }}>
            <TestTable t={local - T.b6} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", opacity: progress(local, T.b7, 0.8) }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "14px 26px", borderRadius: 99, border: "1px solid rgba(69,224,160,.28)", background: "rgba(69,224,160,.07)" }}>
              <LockGlyph size={34} color="#45e0a0" />
              <span style={{ fontSize: 24, color: "#a9f5d3" }}>浏览器，安全了。</span>
            </div>
          </div>
        </div>
        {freeze > 0 && (
          <div style={{ position: "absolute", inset: 0, background: `rgba(5,6,10,${freeze * 0.32})`, zIndex: 30 }}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 50%, transparent 20%, rgba(255,92,122,${red * 0.18}) 100%)` }} />
            <div style={{ position: "absolute", left: "50%", top: "44%", transform: `translate(-50%, -50%) scale(${0.9 + freeze * 0.1})`, opacity: freeze }}>
              <div className="display" style={{ fontSize: 156, color: "#fff", textShadow: `0 0 60px rgba(255,92,122,${red * 0.6})`, letterSpacing: "-.07em" }}>
                真的<span style={{ color: "#ff5c7a" }}>吗？</span>
              </div>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 200, textAlign: "center", opacity: red }}>
              <span className="mono" style={{ fontSize: 12, color: "rgba(255,92,122,.7)", letterSpacing: ".26em" }}>REVOCATION ≠ EVERY CLIENT KNOWS</span>
            </div>
          </div>
        )}
      </Act>
    </div>
  );
}
