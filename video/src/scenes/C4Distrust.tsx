import type { CSSProperties, ReactNode } from "react";
import { useChapter } from "../lib/ChapterContext";
import { clamp01, easeInOutCubic, easeOutBack, easeOutCubic, easeOutExpo, progress, spring } from "../lib/time";
import { LogoMark } from "../components/icons";
import { LockGlyph, PhoneFrame, RouterGlyph, ServerGlyph } from "../components/devices";
import { FlowArrow } from "../components/visuals";
import { Seal } from "../components/cert";

function Act({ from, to, children, fade = 0.55, style }: { from: number; to: number; children: ReactNode; fade?: number; style?: CSSProperties }) {
  const { local } = useChapter();
  const o = Math.min(progress(local, from, fade, easeInOutCubic), 1 - progress(local, to - fade, fade, easeInOutCubic));
  if (o <= 0.001) return null;
  return <div style={{ position: "absolute", inset: 0, opacity: o, ...style }}>{children}</div>;
}

function LaptopNode({ t }: { t: number }) {
  return (
    <div style={{ width: 330 }}>
      <div style={{ height: 206, borderRadius: 14, border: "1px solid rgba(255,255,255,.16)", background: "#090a10", padding: 8, boxShadow: "0 30px 80px rgba(0,0,0,.5)" }}>
        <div style={{ height: "100%", borderRadius: 7, border: "1px solid rgba(255,255,255,.05)", background: "linear-gradient(170deg, rgba(20,22,32,.9), rgba(9,10,16,.98))", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#45e0a0" }} />
            <span style={{ fontSize: 10, color: "rgba(255,255,255,.65)" }}>飞书 · 项目群</span>
            <span style={{ flex: 1 }} />
            <span className="mono" style={{ fontSize: 7, color: "#68edb8", border: "1px solid rgba(69,224,160,.25)", borderRadius: 3, padding: "2px 4px" }}>HTTPS</span>
          </div>
          <div style={{ padding: "14px 14px" }}>
            {["评审改到下午三点", "收到，我准备一下", "方案什么时候好？"].map((s, i) => (
              <div key={s} style={{ display: "flex", justifyContent: i === 1 ? "flex-end" : "flex-start", marginBottom: 9, opacity: 0.45 + i * 0.18 }}>
                <span style={{ fontSize: 9.5, color: "rgba(255,255,255,.72)", background: i === 1 ? "rgba(109,77,240,.25)" : "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 5, padding: "5px 7px" }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ width: "110%", marginLeft: "-5%", height: 8, borderRadius: "0 0 8px 8px", background: "linear-gradient(180deg,#262833,#0b0c11)" }} />
      <div className="mono" style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,.35)", marginTop: 16, letterSpacing: ".12em" }}>你的 Mac · 旧客户端</div>
    </div>
  );
}

function PhoneNode({ t, hasKey }: { t: number; hasKey: number }) {
  return (
    <div style={{ width: 172 }}>
      <PhoneFrame width={172} height={354} glow="rgba(255,92,122,.16)">
        <div style={{ padding: "24px 12px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#ff5c7a", boxShadow: "0 0 7px #ff5c7a" }} />
            <span className="mono" style={{ fontSize: 6.5, color: "rgba(255,255,255,.6)", letterSpacing: ".08em" }}>DISTRUST</span>
            <span style={{ flex: 1 }} />
            <span className="mono" style={{ fontSize: 5.5, color: "#ff8ba0" }}>LIVE</span>
          </div>
          <div className="mono" style={{ fontSize: 5.5, color: "rgba(255,255,255,.2)", marginTop: 8, lineHeight: 1.8 }}>
            192.168.31.247<br />feishu.cn · WS
          </div>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {["评审改到下午三点", "收到，我准备一下", "方案什么时候好？"].map((s, i) => (
              <div key={s} style={{ fontSize: 7, color: "rgba(255,255,255,.6)", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 4, padding: "4px 5px", opacity: 0.45 + i * 0.18 }}>{s}</div>
            ))}
          </div>
          <div style={{ marginTop: 12, opacity: hasKey }}>
            <div style={{ borderRadius: 6, border: "1px solid rgba(255,92,122,.28)", background: "rgba(255,92,122,.06)", padding: 6 }}>
              <div className="mono" style={{ fontSize: 5.5, color: "#ff8ba0", letterSpacing: ".08em" }}>FORGED CERT</div>
              <div className="mono" style={{ fontSize: 6, color: "rgba(255,255,255,.62)", marginTop: 3 }}>CN=feishu.cn</div>
            </div>
          </div>
        </div>
      </PhoneFrame>
      <div className="mono" style={{ textAlign: "center", fontSize: 10, color: "rgba(255,92,122,.6)", marginTop: 14, letterSpacing: ".1em" }}>同一个 Wi-Fi · 攻击者</div>
    </div>
  );
}

function TlsConsole({ t, stage }: { t: number; stage: number }) {
  const lines =
    stage < 1
      ? [
          ["$ tls.handshake feishu.cn", "dim"],
          ["→ ClientHello", "dim"],
          ["← ServerHello", "dim"],
          ["← Certificate: feishu.cn", "dim"],
          ["! no private key — cannot decrypt", "red"],
        ]
      : stage < 2
        ? [
            ["$ use compromised intermediate key", "amber"],
            ["→ forge certificate: CN=feishu.cn", "amber"],
            ["← signed by EM DV TLS CA - G3B", "amber"],
            ["… handshake retry", "dim"],
          ]
        : [
            ["$ verify certificate chain", "dim"],
            ["✓ root trusted", "green"],
            ["✓ intermediate trusted", "green"],
            ["✓ signature valid", "green"],
            ["→ TLS 1.3 established", "green"],
          ];
  return (
    <div style={{ width: 760, borderRadius: 12, border: "1px solid rgba(255,255,255,.1)", background: "rgba(6,7,11,.82)", boxShadow: "0 20px 60px rgba(0,0,0,.4)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 6, height: 6, borderRadius: "50%", background: c, opacity: 0.6 }} />)}
        <span className="mono" style={{ fontSize: 8, color: "rgba(255,255,255,.25)", marginLeft: 6, letterSpacing: ".08em" }}>distrust / tls-interceptor</span>
        <span style={{ flex: 1 }} />
        <span className="mono" style={{ fontSize: 7.5, color: "rgba(255,92,122,.65)", border: "1px solid rgba(255,92,122,.22)", borderRadius: 3, padding: "2px 5px" }}>MITM</span>
      </div>
      <div style={{ padding: "10px 14px 12px" }}>
        {lines.map(([s, c], i) => (
          <div key={i} className="mono" style={{ fontSize: 10.5, lineHeight: 1.7, color: c === "red" ? "#ff8ba0" : c === "green" ? "#68edb8" : c === "amber" ? "#ffd28a" : "rgba(255,255,255,.38)", opacity: progress(t, i * 0.35, 0.4) }}>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatPanel({
  side,
  t,
  injected,
}: {
  side: "target" | "attacker";
  t: number;
  injected: number;
}) {
  const isTarget = side === "target";
  const messages = [
    { who: "老板", text: "评审改到下午三点。", at: 0.2, self: false, tag: "" },
    { who: "我", text: "收到，我准备一下。", at: 1.4, self: true, tag: "" },
    { who: "老板", text: "方案什么时候好？", at: 6.0, self: false, tag: "" },
    { who: "我", text: "已经发您了。", at: 9.2, self: true, tag: "INJECTED" },
  ];
  return (
    <div style={{ width: isTarget ? 780 : 800, height: 620, borderRadius: 16, border: `1px solid ${isTarget ? "rgba(255,255,255,.12)" : "rgba(255,92,122,.2)"}`, background: "rgba(8,9,14,.86)", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 40px 100px rgba(0,0,0,.45)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,.07)", background: isTarget ? "rgba(255,255,255,.018)" : "rgba(255,92,122,.035)" }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: isTarget ? "#45e0a0" : "#ff5c7a", boxShadow: `0 0 8px ${isTarget ? "#45e0a0" : "#ff5c7a"}` }} />
        <span style={{ fontSize: 15, fontWeight: 500 }}>{isTarget ? "飞书 · 项目群（演示）" : "DISTRUST · 消息审计"}</span>
        <span style={{ flex: 1 }} />
        {isTarget ? (
          <span className="mono" style={{ fontSize: 9, color: "#68edb8", border: "1px solid rgba(69,224,160,.25)", borderRadius: 4, padding: "3px 6px" }}>HTTPS · 绿色锁</span>
        ) : (
          <span className="mono" style={{ fontSize: 9, color: "#ff8ba0", border: "1px solid rgba(255,92,122,.3)", borderRadius: 4, padding: "3px 6px", letterSpacing: ".08em" }}>MITM · LIVE</span>
        )}
      </div>
      <div style={{ flex: 1, padding: "20px 24px", overflow: "hidden" }}>
        <div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,.22)", letterSpacing: ".1em", marginBottom: 18 }}>{isTarget ? "TUESDAY · 14:32 · 项目群" : "实时镜像 · 演示数据 · 会话 #10248"}</div>
        {messages.map((m, i) => {
          const p = progress(t, m.at, 0.55, easeOutCubic);
          const isInjected = !isTarget && m.tag && i === 3;
          const suspect = isTarget && m.tag && injected > 0.4;
          return (
            <div key={i} style={{ display: "flex", flexDirection: m.self ? "row-reverse" : "row", gap: 10, marginBottom: 14, opacity: p, transform: `translateY(${(1 - p) * 10}px)` }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, display: "grid", placeItems: "center", fontSize: 11, fontWeight: 600, background: m.self ? "rgba(109,77,240,.22)" : "rgba(79,227,255,.12)", color: m.self ? "#c4b5fd" : "#8beeff", border: "1px solid rgba(255,255,255,.08)" }}>{m.self ? "我" : "王"}</div>
              <div style={{ maxWidth: "70%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, justifyContent: m.self ? "flex-end" : "flex-start", marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,.38)" }}>{m.who}</span>
                  {isInjected && (
                    <span className="mono" style={{ fontSize: 8, color: "#ff8ba0", border: "1px solid rgba(255,92,122,.3)", background: "rgba(255,92,122,.08)", borderRadius: 3, padding: "2px 4px", letterSpacing: ".06em" }}>{m.tag}</span>
                  )}
                  {suspect && (
                    <span className="mono" style={{ fontSize: 8, color: "#ff8ba0", border: "1px solid rgba(255,92,122,.3)", background: "rgba(255,92,122,.08)", borderRadius: 3, padding: "2px 4px", letterSpacing: ".06em" }}>你发过吗？</span>
                  )}
                </div>
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: m.self ? "12px 4px 12px 12px" : "4px 12px 12px 12px",
                    background: isInjected ? "rgba(255,92,122,.12)" : m.self ? "rgba(109,77,240,.24)" : "rgba(255,255,255,.06)",
                    border: `1px solid ${isInjected || suspect ? "rgba(255,92,122,.4)" : "rgba(255,255,255,.07)"}`,
                    color: "rgba(255,255,255,.88)",
                    fontSize: 15,
                    lineHeight: 1.5,
                    boxShadow: isInjected || suspect ? "0 0 30px rgba(255,92,122,.14)" : undefined,
                  }}
                >
                  {m.text}
                </div>
              </div>
            </div>
          );
        })}
        {isTarget && injected > 0.5 && (
          <div style={{ position: "relative", marginTop: 6, marginLeft: 40, padding: "8px 10px", borderLeft: "2px solid rgba(255,92,122,.55)", color: "rgba(255,92,122,.7)", fontSize: 12, opacity: injected }}>
            你在屏幕上看到的，只是一条普通的已发送消息。
          </div>
        )}
      </div>
      <div style={{ padding: "0 18px 16px" }}>
        <div style={{ height: 34, borderRadius: 7, border: "1px solid rgba(255,255,255,.07)", background: "rgba(255,255,255,.02)", display: "flex", alignItems: "center", padding: "0 10px", fontSize: 10, color: "rgba(255,255,255,.22)" }}>
          {isTarget ? "输入消息…" : "正在监听明文消息…"}
        </div>
      </div>
    </div>
  );
}

export function C4Distrust() {
  const { at, local, chapter } = useChapter();
  const T = {
    b1: at("c4_b1"), b2: at("c4_b2"), b3: at("c4_b3"), b4: at("c4_b4"),
    b5: at("c4_b5"), b6: at("c4_b6"), b7: at("c4_b7"), b8: at("c4_b8"),
    b9: at("c4_b9"), b10: at("c4_b10"), b11: at("c4_b11"), b11b: at("c4_b11b"),
    b11c: at("c4_b11c"), b12: at("c4_b12"), b13: at("c4_b13"),
  };
  const arp = progress(local, T.b4, 1.0, easeInOutCubic);
  const handshake = progress(local, T.b5, 0.8, easeOutCubic);
  const forged = progress(local, T.b6, 0.8, easeOutCubic);
  const accepted = progress(local, T.b7, 0.8, easeOutCubic);
  const zeros = progress(local, T.b8, 0.8, easeOutCubic);
  const chat = progress(local, T.b9, 1.0, easeInOutCubic);
  const injected = progress(local, T.b11b, 0.6, easeOutCubic);
  const accuse = progress(local, T.b11c, 0.8, easeOutCubic);
  const finalShot = progress(local, T.b13, 1.0, easeInOutCubic);

  return (
    <div className="scene" style={{ padding: 0 }}>
      {/* Act A: brand */}
      <Act from={T.b1} to={T.b3 + 0.2} fade={0.6}>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse 50% 50% at 50% 45%, rgba(109,77,240,.13), transparent 70%)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, opacity: progress(local, T.b1, 1.0, easeOutCubic), transform: `translateY(${(1 - progress(local, T.b1, 1.0)) * 18}px)` }}>
            <LogoMark size={86} />
            <div>
              <div style={{ fontSize: 78, fontWeight: 700, letterSpacing: "-.055em", lineHeight: 1 }}>Distrust</div>
              <div className="mono" style={{ fontSize: 12, letterSpacing: ".3em", color: "rgba(185,167,255,.65)", marginTop: 10 }}>DON&apos;T TRUST ANYONE</div>
            </div>
          </div>
          <div style={{ marginTop: 38, fontSize: 24, color: "rgba(255,255,255,.46)", opacity: progress(local, T.b1 + 1.4, 0.8) }}>
            一个局域网 HTTPS 审计工具
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 50, opacity: progress(local, T.b2, 0.8) }}>
            {["不破解私钥", "不入侵设备", "只利用旧信任"].map((s, i) => (
              <div key={s} style={{ padding: "11px 18px", borderRadius: 8, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.03)", fontSize: 16, color: "rgba(255,255,255,.66)", opacity: 0.5 + i * 0.15 }}>
                <span style={{ color: "#b9a7ff", marginRight: 9 }}>✕</span>{s}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 54, fontSize: 21, color: "rgba(255,255,255,.34)", opacity: progress(local, T.b2 + 2.0, 0.8) }}>
            它只做一件事：证明旧应用的 HTTPS，在同一个局域网里，有多透明。
          </div>
        </div>
      </Act>

      {/* Act B: LAN map */}
      <Act from={T.b3} to={T.b9 + 0.2} fade={0.6}>
        <div style={{ position: "absolute", left: 90, top: 104 }}>
          <div className="kicker" style={{ color: "rgba(255,92,122,.7)" }}>SAME WI-FI · SAME LAYER 2</div>
          <div className="display" style={{ fontSize: 52, marginTop: 12 }}>一台 Mac，一部手机</div>
        </div>
        <div style={{ position: "absolute", left: 120, top: 220, width: 1680, height: 520, borderRadius: 24, border: "1px dashed rgba(79,227,255,.24)", background: "radial-gradient(ellipse at 50% 50%, rgba(79,227,255,.045), transparent 70%)", backgroundImage: "linear-gradient(rgba(79,227,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(79,227,255,.035) 1px, transparent 1px)", backgroundSize: "48px 48px" }}>
          <div className="mono" style={{ position: "absolute", left: 22, top: 16, fontSize: 9, color: "rgba(79,227,255,.38)", letterSpacing: ".16em" }}>LAN · 192.168.31.0/24</div>
        </div>

        <div style={{ position: "absolute", left: 150, top: 356, opacity: progress(local, T.b3, 0.8) }}>
          <LaptopNode t={local} />
        </div>
        <div style={{ position: "absolute", left: 1470, top: 292, opacity: progress(local, T.b3 + 0.2, 0.8) }}>
          <PhoneNode t={local} hasKey={forged} />
        </div>
        <div style={{ position: "absolute", left: 850, top: 250, opacity: progress(local, T.b3 + 0.3, 0.8), display: "flex", flexDirection: "column", alignItems: "center" }}>
          <RouterGlyph size={120} />
          <div className="mono" style={{ fontSize: 9, color: "rgba(79,227,255,.4)", marginTop: 8, letterSpacing: ".12em" }}>GATEWAY · 192.168.31.1</div>
        </div>
        <div style={{ position: "absolute", left: 1670, top: 110, opacity: progress(local, T.b3 + 0.4, 0.8) }}>
          <ServerGlyph size={90} />
          <div className="mono" style={{ fontSize: 9, color: "rgba(185,167,255,.4)", marginTop: 8, letterSpacing: ".12em", textAlign: "center" }}>feishu.cn</div>
        </div>

        <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <path d="M480 470 C 650 430, 760 350, 900 345 C 1180 335, 1500 230, 1690 190" fill="none" stroke="rgba(69,224,160,.28)" strokeWidth="1.6" strokeDasharray="4 6" opacity={1 - arp * 0.85} />
          <path d="M480 470 C 800 600, 1250 600, 1490 500 C 1580 450, 1620 320, 1690 190" fill="none" stroke="rgba(255,92,122,.55)" strokeWidth="1.8" strokeDasharray="5 7" opacity={arp} />
          {[0.25, 0.55, 0.8].map((u, i) => {
            const p = ((local * 0.12 + u) % 1);
            const x = 480 + (1690 - 480) * p;
            const y = 470 + (190 - 470) * p + Math.sin(p * Math.PI) * 100;
            return <circle key={i} cx={x} cy={y} r="3" fill={arp > 0.5 ? "#ff5c7a" : "#45e0a0"} opacity={0.7} />;
          })}
          <FlowArrow x1={1490} y1={470} x2={620} y2={455} color="rgba(255,92,122,.65)" progress={progress(local, T.b4, 0.8)} dash />
        </svg>
        <div style={{ position: "absolute", left: 650, top: 560, opacity: progress(local, T.b4, 0.8) }}>
          <div style={{ padding: "7px 11px", borderRadius: 6, border: "1px solid rgba(255,92,122,.3)", background: "rgba(255,92,122,.08)", fontFamily: "var(--mono)", fontSize: 10, color: "#ff8ba0", letterSpacing: ".08em" }}>
            ← “我是网关”
          </div>
        </div>
        <div style={{ position: "absolute", left: 1152, top: 404, opacity: handshake, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ width: 76, height: 76, borderRadius: "50%", display: "grid", placeItems: "center", background: accepted > 0.5 ? "rgba(69,224,160,.08)" : "rgba(255,92,122,.08)", border: `1px solid ${accepted > 0.5 ? "rgba(69,224,160,.35)" : "rgba(255,92,122,.35)"}`, boxShadow: accepted > 0.5 ? "0 0 40px rgba(69,224,160,.12)" : "0 0 40px rgba(255,92,122,.12)" }}>
            <LockGlyph size={44} color={accepted > 0.5 ? "#45e0a0" : "#ff5c7a"} open={accepted > 0.5 ? 0 : 0.2} />
          </div>
          <span className="mono" style={{ fontSize: 8, color: accepted > 0.5 ? "rgba(104,237,184,.7)" : "rgba(255,140,160,.7)", letterSpacing: ".14em" }}>{accepted > 0.5 ? "TLS · ACCEPTED" : "TLS · INTERCEPT"}</span>
        </div>

        <div style={{ position: "absolute", left: 500, top: 760, opacity: handshake }}>
          <TlsConsole t={local} stage={forged > 0.5 ? (accepted > 0.5 ? 2 : 1) : 0} />
        </div>

        <div style={{ position: "absolute", left: 1400, top: 760, width: 380, opacity: zeros }}>
          {["0 证书安装", "0 代理设置", "0 目标感知"].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.06)", opacity: clamp01(zeros * 1.2 - i * 0.15) }}>
              <span style={{ color: "#ff8ba0", fontSize: 14 }}>✕</span>
              <span style={{ fontSize: 16, color: "rgba(255,255,255,.66)" }}>{s}</span>
            </div>
          ))}
          <div className="mono" style={{ marginTop: 14, fontSize: 9, color: "rgba(255,255,255,.25)", letterSpacing: ".1em" }}>TARGET DEVICE · COMPLETELY UNAWARE</div>
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, bottom: 126, textAlign: "center", opacity: progress(local, T.b8 + 1.2, 0.7) }}>
          <span style={{ fontSize: 22, color: "rgba(255,255,255,.48)" }}>锁还是绿的。流量，已经不是原来那条了。</span>
        </div>
      </Act>

      {/* Act C: chat demo */}
      <Act from={T.b9} to={chapter.duration + 0.1} fade={0.5}>
        <div style={{ opacity: 1 - finalShot, position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", left: 96, top: 104 }}>
            <div className="kicker" style={{ color: "rgba(255,92,122,.7)" }}>LIVE INTERCEPTION · DEMO DATA</div>
            <div className="display" style={{ fontSize: 44, marginTop: 10 }}>你看到的是同一条消息，他看到的是明文</div>
          </div>
          <div style={{ position: "absolute", left: 100, top: 236, opacity: chat, transform: `translateY(${(1 - chat) * 20}px)` }}>
            <ChatPanel side="target" t={local - T.b9} injected={accuse} />
          </div>
          <div style={{ position: "absolute", left: 1010, top: 236, opacity: chat * 0.98, transform: `translateY(${(1 - chat) * 20}px)` }}>
            <ChatPanel side="attacker" t={local - T.b9 + 0.1} injected={accuse} />
          </div>
          <div style={{ position: "absolute", left: 906, top: 490, opacity: accuse, zIndex: 5 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <span style={{ width: 40, height: 1, background: "rgba(255,92,122,.5)" }} />
              <span className="mono" style={{ fontSize: 8.5, color: "rgba(255,92,122,.7)", letterSpacing: ".1em", writingMode: "vertical-rl" }}>REWRITE</span>
              <span style={{ width: 40, height: 1, background: "rgba(255,92,122,.5)" }} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 160, textAlign: "center", opacity: accuse, zIndex: 8 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "10px 18px", borderRadius: 99, border: "1px solid rgba(255,92,122,.28)", background: "rgba(255,92,122,.06)" }}>
              <span className="mono" style={{ fontSize: 10, color: "#ff8ba0", letterSpacing: ".12em" }}>这句话，你从没发过</span>
            </div>
          </div>
        </div>
        <div style={{ opacity: finalShot, position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(5,6,10,.86)" }}>
          <div style={{ width: 1450, height: 720, borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,.14)", boxShadow: "0 40px 130px rgba(0,0,0,.6)", transform: "rotate(-.5deg)", position: "relative" }}>
            <img src="/assets/admin-chats.png" alt="" style={{ width: 2250, marginLeft: -840, marginTop: -120, display: "block", opacity: 0.95 }} />
            <div style={{ position: "absolute", inset: 0, border: "1px solid rgba(255,255,255,.1)", pointerEvents: "none", boxShadow: "inset 0 0 80px rgba(0,0,0,.45)" }} />
            <div style={{ position: "absolute", right: 18, top: 16, padding: "6px 9px", borderRadius: 5, border: "1px solid rgba(255,92,122,.3)", background: "rgba(10,10,16,.8)", color: "#ff8ba0", fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".1em" }}>REAL UI · DEMO DATA</div>
          </div>
          <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 14 }}>
            <span className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,.3)", letterSpacing: ".16em" }}>DISTRUST · REAL UI · DEMO DATA</span>
            <span style={{ width: 40, height: 1, background: "rgba(255,255,255,.2)" }} />
            <span style={{ fontSize: 19, color: "rgba(255,255,255,.55)" }}>这还只是飞书。只是聊天记录。</span>
          </div>
        </div>
      </Act>
    </div>
  );
}
