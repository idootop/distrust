import type { CSSProperties, ReactNode } from "react";
import { useChapter } from "../lib/ChapterContext";
import { clamp01, easeInOutCubic, easeOutBack, easeOutCubic, easeOutExpo, progress, spring } from "../lib/time";
import { BrowserFrame, CertCard, Seal } from "../components/cert";
import { BitGrid, CosmicDots, FlowArrow, KeyGlyph, LogScale, Moat, NumberBall } from "../components/visuals";
import { LockGlyph } from "../components/devices";

const BITS = [4, 56, 66, 115, 155, 156, 230, 237];

function Act({
  from,
  to,
  children,
  fade = 0.55,
  style,
}: {
  from: number;
  to: number;
  children: ReactNode;
  fade?: number;
  style?: CSSProperties;
}) {
  const { local } = useChapter();
  const a = progress(local, from, fade, easeInOutCubic);
  const b = 1 - progress(local, to - fade, fade, easeInOutCubic);
  const o = Math.min(a, b);
  if (o <= 0.001) return null;
  return <div style={{ position: "absolute", inset: 0, opacity: o, ...style }}>{children}</div>;
}

function Rise({
  at,
  children,
  y = 18,
  dur = 0.65,
  style,
  className,
}: {
  at: number;
  children: ReactNode;
  y?: number;
  dur?: number;
  style?: CSSProperties;
  className?: string;
}) {
  const { local } = useChapter();
  const p = progress(local, at, dur, easeOutCubic);
  return (
    <div
      className={className}
      style={{
        opacity: p,
        transform: `translate3d(0, ${(1 - p) * y}px, 0)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function BankPage() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at 30% 20%, #151a2b, #080a10 70%)",
        padding: "34px 44px",
        color: "rgba(255,255,255,.8)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,.07)", paddingBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg,#4fe3ff,#6d4df0)" }} />
          <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: ".06em" }}>EXAMPLE BANK</span>
        </div>
        <div style={{ display: "flex", gap: 26, fontSize: 12.5, color: "rgba(255,255,255,.38)" }}>
          <span>账户</span><span>转账</span><span>理财</span><span>安全中心</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 36 }}>
        <div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.36)", letterSpacing: ".08em" }}>账户总览 / ACCOUNT OVERVIEW</div>
          <div style={{ fontSize: 42, fontWeight: 600, letterSpacing: "-.03em", marginTop: 8 }}>早上好，Del</div>
        </div>
        <div className="mono" style={{ fontSize: 11, color: "rgba(69,224,160,.7)", border: "1px solid rgba(69,224,160,.2)", background: "rgba(69,224,160,.06)", padding: "6px 9px", borderRadius: 6 }}>
          SESSION · ENCRYPTED
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 18, marginTop: 28 }}>
        <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,.08)", background: "linear-gradient(150deg, rgba(79,227,255,.08), rgba(109,77,240,.08))", padding: 24 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.35)" }}>可用余额</div>
          <div className="mono" style={{ fontSize: 38, marginTop: 8, letterSpacing: "-.04em" }}>¥ 1,280,000.00</div>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            {["转账", "收款", "明细"].map((s) => (
              <div key={s} style={{ padding: "7px 12px", borderRadius: 7, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.07)", fontSize: 11.5, color: "rgba(255,255,255,.6)" }}>{s}</div>
            ))}
          </div>
        </div>
        <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.025)", padding: 22 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.35)" }}>最近交易</div>
          {[
            ["工资入账", "+ 42,800.00"],
            ["项目付款", "- 8,600.00"],
            ["理财赎回", "+ 12,300.00"],
          ].map(([a, b]) => (
            <div key={a} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid rgba(255,255,255,.05)", fontSize: 12 }}>
              <span style={{ color: "rgba(255,255,255,.5)" }}>{a}</span>
              <span className="mono" style={{ color: "rgba(255,255,255,.72)" }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Concept({
  n,
  title,
  desc,
  active,
  color,
}: {
  n: string;
  title: string;
  desc: string;
  active: number;
  color: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 13,
        padding: "15px 0",
        borderTop: "1px solid rgba(255,255,255,.08)",
        opacity: 0.35 + 0.65 * active,
        transform: `translateX(${(1 - active) * 12}px)`,
      }}
    >
      <div className="mono" style={{ fontSize: 10, color, paddingTop: 4, letterSpacing: ".08em" }}>{n}</div>
      <div>
        <div style={{ fontSize: 20, fontWeight: 600, color: "rgba(255,255,255,.86)" }}>{title}</div>
        <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.4)", marginTop: 5, lineHeight: 1.6 }}>{desc}</div>
      </div>
    </div>
  );
}

function Callout({
  x,
  y,
  w = 0,
  text,
  at,
  color = "#b9a7ff",
  align = "left",
}: {
  x: number;
  y: number;
  w?: number;
  text: string;
  at: number;
  color?: string;
  align?: "left" | "right";
}) {
  const { local } = useChapter();
  const p = progress(local, at, 0.6, easeOutCubic);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w || undefined,
        opacity: p,
        transform: `translateY(${(1 - p) * 8}px)`,
        display: "flex",
        alignItems: "center",
        gap: 10,
        color,
        fontFamily: "var(--mono)",
        fontSize: 11.5,
        letterSpacing: ".1em",
        whiteSpace: "nowrap",
      }}
    >
      {align === "right" && <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${color}66)` }} />}
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, boxShadow: `0 0 10px ${color}` }} />
      <span>{text}</span>
      {align === "left" && <span style={{ width: 60, height: 1, background: `linear-gradient(90deg, ${color}66, transparent)` }} />}
    </div>
  );
}

function MiniCert({ title, sub, danger, i }: { title: string; sub: string; danger?: number; i: number }) {
  const color = danger && danger > 0.5 ? "#ff5c7a" : "#45e0a0";
  return (
    <div
      style={{
        width: 188,
        height: 142,
        borderRadius: 12,
        border: `1px solid ${danger && danger > 0.5 ? "rgba(255,92,122,.36)" : "rgba(255,255,255,.1)"}`,
        background: "linear-gradient(160deg, rgba(26,27,39,.96), rgba(10,11,17,.98))",
        padding: 13,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: color, opacity: 0.8 }} />
      <div className="mono" style={{ fontSize: 7.5, letterSpacing: ".12em", color: `${color}aa` }}>INTERMEDIATE CA</div>
      <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 7, letterSpacing: "-.01em", lineHeight: 1.3 }}>{title}</div>
      <div className="mono" style={{ fontSize: 8, color: "rgba(255,255,255,.3)", marginTop: 5 }}>{sub}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 11 }}>
        <Seal size={24} color={color} rotate={i * 20} label="em" />
        <div className="mono" style={{ fontSize: 7.5, color: "rgba(255,255,255,.22)" }}>VALID</div>
      </div>
    </div>
  );
}

export function C1Keys() {
  const { at, local, chapter } = useChapter();
  const T = {
    b1: at("c1_b1"),
    b2: at("c1_b2"),
    b3: at("c1_b3"),
    b4: at("c1_b4"),
    b5: at("c1_b5"),
    b6: at("c1_b6"),
    b7: at("c1_b7"),
    b8: at("c1_b8"),
    b9: at("c1_b9"),
    b10: at("c1_b10"),
    b11: at("c1_b11"),
    b12: at("c1_b12"),
    b13: at("c1_b13"),
    b14: at("c1_b14"),
    b15: at("c1_b15"),
    b16: at("c1_b16"),
    b17: at("c1_b17"),
    b18: at("c1_b18"),
  };
  const chainP = progress(local, T.b4, 1.2, easeInOutCubic);
  const leakP = progress(local, T.b5 + 0.4, 1.3, easeInOutCubic);
  const bitGridP = progress(local, T.b8 + 0.2, 1.1, easeOutCubic);
  const logP = progress(local, T.b9, 1.2, easeInOutCubic);
  const cosmosP = progress(local, T.b10, 1.2, easeInOutCubic);
  const zeroP = progress(local, T.b11 + 0.2, 1.2, easeInOutCubic);
  const scanP = progress(local, T.b14 + 0.2, 4.4, easeInOutCubic);

  const scanIndex = Math.floor(scanP * 256);
  const hits = BITS.map((b) => b <= scanIndex);

  return (
    <div className="scene" style={{ padding: 0 }}>
      {/* ================= ACT A: browser + identity ================= */}
      <Act from={T.b1} to={T.b3 + 0.3} fade={0.6}>
        <div style={{ position: "absolute", left: 96, top: 116, opacity: 1 - 0.7 * progress(local, T.b2, 0.8, easeInOutCubic) }}>
          <BrowserFrame width={1248} height={770} url="https://bank.example/account">
            <BankPage />
          </BrowserFrame>
        </div>
        <div style={{ position: "absolute", left: 1412, top: 182, width: 400 }}>
          <Rise at={T.b1 + 0.2}>
            <div className="kicker">HTTPS</div>
            <div className="display" style={{ fontSize: 48, marginTop: 16, lineHeight: 1.15 }}>
              这把锁
              <br />
              到底在保证什么？
            </div>
          </Rise>
          <div style={{ marginTop: 30 }}>
            <Concept n="01" title="加密" desc="传输内容别人看不懂" active={progress(local, T.b1 + 1.0, 0.7)} color="#4fe3ff" />
            <Concept n="02" title="身份" desc="对面真的是它自称的那个人？" active={progress(local, T.b2, 0.7)} color="#b9a7ff" />
          </div>
        </div>
        <Callout x={498} y={252} text="TLS 1.3" at={T.b1 + 0.7} color="#68edb8" />
        <Rise at={T.b2 + 1.1} style={{ position: "absolute", left: 0, right: 0, top: 286, textAlign: "center" }}>
          <div style={{ fontSize: 26, color: "rgba(255,255,255,.72)", letterSpacing: ".02em" }}>
            所以，浏览器需要一张
            <span style={{ color: "#b9a7ff", borderBottom: "1px solid rgba(185,167,255,.4)", paddingBottom: 3, marginLeft: 10 }}>身份证</span>
          </div>
        </Rise>
        <div style={{ position: "absolute", left: 760, top: 366, width: 400, height: 244, borderRadius: 16, border: "1px dashed rgba(185,167,255,.28)", background: "rgba(10,11,18,.55)", opacity: progress(local, T.b2 + 1.5, 0.7), transform: `translateY(${(1 - progress(local, T.b2 + 1.5, 0.7)) * 12}px)` }}>
          <div className="mono" style={{ fontSize: 9, letterSpacing: ".16em", color: "rgba(185,167,255,.55)", padding: "20px 22px" }}>CERTIFICATE · X.509</div>
          <div style={{ textAlign: "center", marginTop: 6, fontSize: 64, color: "rgba(185,167,255,.35)", fontWeight: 600 }}>?</div>
          <div className="mono" style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,.25)", letterSpacing: ".1em", marginTop: 8 }}>WHO ARE YOU, REALLY?</div>
        </div>
      </Act>

      {/* ================= ACT B: certificate chain ================= */}
      <Act from={T.b3} to={T.b6 + 0.2} fade={0.6}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 45% at 50% 44%, rgba(109,77,240,.08), transparent 70%)" }} />
        <Rise at={T.b3} style={{ position: "absolute", left: 0, right: 0, top: 112, textAlign: "center" }}>
          <div className="kicker" style={{ justifyContent: "center" }}>X.509 · CERTIFICATE CHAIN</div>
          <div style={{ fontSize: 21, color: "rgba(255,255,255,.45)", marginTop: 14 }}>
            CA 用自己的私钥盖章，浏览器用公钥验章
          </div>
        </Rise>

        {/* signatures */}
        <div style={{ position: "absolute", left: 360, top: 480, width: 230, textAlign: "right", opacity: progress(local, T.b3 + 0.8, 0.6) }}>
          <div className="mono" style={{ fontSize: 10.5, color: "rgba(185,167,255,.6)", letterSpacing: ".14em" }}>CA PRIVATE KEY</div>
          <div style={{ fontSize: 15, color: "rgba(255,255,255,.52)", marginTop: 6 }}>盖章 →</div>
        </div>
        <div style={{ position: "absolute", left: 1330, top: 480, width: 230, opacity: progress(local, T.b3 + 1.2, 0.6) }}>
          <div className="mono" style={{ fontSize: 10.5, color: "rgba(69,224,160,.6)", letterSpacing: ".14em" }}>BROWSER PUBLIC KEY</div>
          <div style={{ fontSize: 15, color: "rgba(255,255,255,.52)", marginTop: 6 }}>← 验章</div>
        </div>

        {/* root card */}
        <div
          style={{
            position: "absolute",
            left: 180 + (1 - chainP) * -420,
            top: 336,
            opacity: chainP,
            transform: `scale(${0.94 + chainP * 0.06})`,
          }}
        >
          <CertCard
            kind="root"
            width={426}
            title="emSign Root TLS CA - G3"
            issuer="emSign Root CA"
            subject="emSign Root TLS CA - G3"
            meta="ROOT · TRUST ANCHOR"
            compact
          />
          <div className="mono" style={{ textAlign: "center", marginTop: 16, fontSize: 10, letterSpacing: ".16em", color: "rgba(69,224,160,.5)" }}>
            内置在系统 / 浏览器
          </div>
        </div>

        {/* intermediate card */}
        <div style={{ position: "absolute", left: 730 + chainP * 17, top: 312 - chainP * 4, width: 460 }}>
          <div style={{ position: "relative" }}>
            <CertCard
              kind="intermediate"
              width={460}
              title="EM DV TLS CA - G3B"
              issuer="emSign Root TLS CA - G3"
              subject="EM DV TLS CA - G3B"
              state={leakP > 0.55 ? "danger" : "ok"}
              seal={false}
              meta="P-384 · ECDSA · SHA-384"
            />
            <div
              style={{
                position: "absolute",
                right: 22,
                top: 20,
                transform: `scale(${spring(local, T.b3 + 1.05, { stiffness: 190, damping: 15 })}) rotate(${(1 - progress(local, T.b3 + 1.05, 0.5)) * -18}deg)`,
                opacity: progress(local, T.b3 + 0.95, 0.35),
              }}
            >
              <Seal size={92} color={leakP > 0.55 ? "#ff5c7a" : "#45e0a0"} rotate={12} />
            </div>
            {leakP > 0.2 && (
              <div
                style={{
                  position: "absolute",
                  left: 20,
                  bottom: -14,
                  padding: "5px 10px",
                  borderRadius: 5,
                  background: "rgba(255,92,122,.12)",
                  border: "1px solid rgba(255,92,122,.3)",
                  color: "#ff8ba0",
                  fontFamily: "var(--mono)",
                  fontSize: 9.5,
                  letterSpacing: ".12em",
                  opacity: leakP,
                }}
              >
                私钥已泄露
              </div>
            )}
          </div>
          <div className="mono" style={{ textAlign: "center", marginTop: 20, fontSize: 10, letterSpacing: ".16em", color: "rgba(255,255,255,.34)" }}>
            中间证书 · 由根证书签发
          </div>
        </div>

        {/* server card */}
        <div
          style={{
            position: "absolute",
            left: 1282 + (1 - chainP) * 440,
            top: 336,
            opacity: chainP * Math.max(0, 1 - leakP * 1.45),
            transform: `scale(${0.94 + chainP * 0.06})`,
          }}
        >
          <CertCard
            kind="server"
            width={426}
            title="bank.example"
            issuer="EM DV TLS CA - G3B"
            subject="CN=bank.example"
            meta="SERVER · LEAF"
            compact
          />
          <div className="mono" style={{ textAlign: "center", marginTop: 16, fontSize: 10, letterSpacing: ".16em", color: "rgba(255,255,255,.34)" }}>
            网站证书
          </div>
        </div>

        {/* links */}
        <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <FlowArrow x1={612} y1={470} x2={726} y2={470} color="rgba(69,224,160,.5)" progress={chainP} />
          <FlowArrow x1={1200} y1={470} x2={1278} y2={470} color={leakP > 0.5 ? "rgba(255,92,122,.55)" : "rgba(69,224,160,.5)"} progress={chainP} />
          <text x={654} y={452} textAnchor="middle" fill="rgba(255,255,255,.24)" fontSize="9" fontFamily="var(--mono)">签发</text>
          <text x={1238} y={452} textAnchor="middle" fill={leakP > 0.5 ? "rgba(255,92,122,.6)" : "rgba(255,255,255,.24)"} fontSize="9" fontFamily="var(--mono)">
            {leakP > 0.5 ? "伪造" : "签发"}
          </text>
        </svg>

        {/* forged cert */}
        <div
          style={{
            position: "absolute",
            left: 1282,
            top: 336 + (1 - leakP) * 90,
            opacity: leakP,
            transform: `scale(${0.96 + leakP * 0.04})`,
          }}
        >
          <CertCard
            kind="forged"
            width={426}
            title="bank.example"
            issuer="EM DV TLS CA - G3B"
            subject="CN=bank.example"
            state="danger"
            meta="SIGNED WITH STOLEN KEY"
            compact
          />
          <div className="mono" style={{ textAlign: "center", marginTop: 16, fontSize: 10, letterSpacing: ".16em", color: "rgba(255,92,122,.62)" }}>
            以假乱真 · 链上每一环都“有效”
          </div>
        </div>

        <div style={{ position: "absolute", left: 180, right: 180, top: 636, opacity: progress(local, T.b4 + 0.9, 0.7) }}>
          <div style={{ height: 1, background: "linear-gradient(90deg, rgba(69,224,160,.05), rgba(69,224,160,.28), rgba(69,224,160,.05))" }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
            {["信任锚点 · 内置", "由根证书签名", "由中间证书签名"].map((s, i) => (
              <div key={s} className="mono" style={{ fontSize: 10, letterSpacing: ".13em", color: i === 1 && leakP > 0.5 ? "rgba(255,92,122,.65)" : "rgba(255,255,255,.28)", width: 420, textAlign: "center" }}>{s}</div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 178, textAlign: "center", opacity: progress(local, T.b5 + 0.8, 0.7) }}>
          <div style={{ fontSize: 30, color: "rgba(255,255,255,.72)" }}>
            任何一环的私钥泄露，整条链都可以被<span style={{ color: "#ff8ba0" }}>伪造</span>
          </div>
        </div>
      </Act>

      {/* ================= ACT C: randomness + 8 certs ================= */}
      <Act from={T.b6} to={T.b8 + 0.3} fade={0.55}>
        <div style={{ position: "absolute", left: 120, top: 160, width: 690 }}>
          <Rise at={T.b6}>
            <div className="kicker">PRIVATE KEY = RANDOMNESS</div>
            <div className="display" style={{ fontSize: 58, marginTop: 18, lineHeight: 1.14 }}>
              私钥的安全性
              <br />
              全靠一个东西：
              <span style={{ color: "#b9a7ff" }}>随机性</span>
            </div>
          </Rise>
          <div style={{ position: "absolute", left: 150, top: 370, opacity: progress(local, T.b6 + 0.6, 0.8) }}>
            <KeyGlyph size={250} color="#b9a7ff" glow={0.7} />
          </div>
          <div style={{ position: "absolute", left: 180, top: 660, width: 520, opacity: progress(local, T.b6 + 0.9, 0.8) }}>
            <div style={{ fontSize: 16, color: "rgba(255,255,255,.45)", lineHeight: 1.7 }}>
              一个 384 位的私钥，本该是从 2^384 个可能值里，
              <br />
              均匀抽出的一个。
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", left: 850, top: 170, width: 980 }}>
          <Rise at={T.b7}>
            <div className="kicker" style={{ color: "rgba(255,196,102,.7)" }}>eMUDHRA · emSign</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginTop: 14 }}>
              <div style={{ fontSize: 40, fontWeight: 600 }}>8 张中间 CA 证书</div>
              <div className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,.3)", letterSpacing: ".1em" }}>TLS / CODE SIGNING</div>
            </div>
          </Rise>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 188px)", gap: 18, marginTop: 34 }}>
            {[
              ["EM DV TLS CA - G3B", "DOMAIN · TLS"],
              ["EM DV TLS CA - G3C", "DOMAIN · TLS"],
              ["EM OV TLS CA - G3B", "ORG · TLS"],
              ["EM OV TLS CA - G3C", "ORG · TLS"],
              ["EM EV TLS CA - G3B", "EXTENDED · TLS"],
              ["EM EV TLS CA - G3C", "EXTENDED · TLS"],
              ["EM OV CS CA - G3B", "CODE SIGNING"],
              ["EM OV CS CA - G3C", "CODE SIGNING"],
            ].map(([title, sub], i) => {
              const p = progress(local, T.b7 + 0.4 + i * 0.09, 0.55, easeOutCubic);
              return (
                <div key={title} style={{ opacity: p, transform: `translateY(${(1 - p) * 16}px)` }}>
                  <MiniCert title={title} sub={sub} i={i} />
                </div>
              );
            })}
          </div>
        </div>
      </Act>

      {/* ================= ACT D: 2^384 vs universe ================= */}
      <Act from={T.b8} to={T.b11 + 0.2} fade={0.55}>
        {/* D1 grid */}
        <div style={{ opacity: 1 - logP, position: "absolute", inset: 0 }}>
          <Rise at={T.b8} style={{ position: "absolute", left: 0, right: 0, top: 118, textAlign: "center" }}>
            <div className="kicker" style={{ justifyContent: "center" }}>THE KEY SPACE</div>
            <div style={{ fontSize: 22, color: "rgba(255,255,255,.42)", marginTop: 14 }}>一个 P-384 私钥，可能的取值有</div>
          </Rise>
          <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
            <div className="display mono" style={{ fontSize: 106, letterSpacing: "-.06em", color: "#e9e4ff" }}>
              2<sup style={{ fontSize: 52, verticalAlign: "super" }}>384</sup>
            </div>
            <div className="mono" style={{ fontSize: 20, color: "rgba(185,167,255,.62)", marginTop: -2, letterSpacing: ".1em" }}>
              ≈ 3.9 × 10¹¹⁵
            </div>
          </div>
          <div style={{ position: "absolute", left: 564, top: 404, opacity: bitGridP, transform: `scale(${0.92 + bitGridP * 0.08})` }}>
            <BitGrid rows={16} cols={24} cell={28} gap={5} t={local} seed={31} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 356, textAlign: "center", opacity: progress(local, T.b8 + 1.6, 0.8) }}>
            <div style={{ fontSize: 18, color: "rgba(255,255,255,.36)", letterSpacing: ".02em" }}>
              每一位都是 0 或 1 的随机选择 · 384 位
            </div>
          </div>
        </div>

        {/* D2 log scale */}
        <div style={{ opacity: logP * (1 - cosmosP), position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 128, textAlign: "center" }}>
            <div className="kicker" style={{ justifyContent: "center" }}>SCALE</div>
            <div className="display h2" style={{ fontSize: 58, marginTop: 12 }}>把它和宇宙，放在同一把尺子上</div>
          </div>
          <LogScale t={local} progress={logP} />
          <div style={{ position: "absolute", left: 180, right: 180, bottom: 170, display: "flex", justifyContent: "space-between", fontSize: 19, color: "rgba(255,255,255,.4)", opacity: logP }}>
            <span>可观测宇宙的原子：约 <span className="mono" style={{ color: "#8beeff" }}>10⁸⁰</span> 个</span>
            <span>私钥的可能取值：约 <span className="mono" style={{ color: "#cbbdff" }}>10¹¹⁵</span> 种</span>
          </div>
        </div>

        {/* D3 cosmic computer */}
        <div style={{ opacity: cosmosP, position: "absolute", inset: 0 }}>
          <div style={{ opacity: 0.5 }}>
            <CosmicDots t={local} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 140, textAlign: "center" }}>
            <div className="kicker" style={{ justifyContent: "center" }}>COSMIC BRUTE FORCE</div>
            <div className="display" style={{ fontSize: 54, marginTop: 14 }}>把全宇宙的原子，都变成计算机</div>
            <div style={{ fontSize: 20, color: "rgba(255,255,255,.42)", marginTop: 14 }}>从宇宙大爆炸算到今天，也猜不完</div>
          </div>
          <div style={{ position: "absolute", left: 460, right: 460, top: 452, padding: "34px 40px", borderRadius: 20, border: "1px solid rgba(255,255,255,.1)", background: "rgba(8,9,15,.78)", backdropFilter: "blur(8px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div className="mono" style={{ fontSize: 11, letterSpacing: ".16em", color: "rgba(255,196,102,.6)" }}>尝试进度</div>
                <div className="mono" style={{ fontSize: 52, marginTop: 6, color: "#ffd28a", letterSpacing: "-.04em" }}>
                  0.0000001<span style={{ fontSize: 26 }}>%</span>
                </div>
              </div>
              <div style={{ textAlign: "right", fontSize: 14, color: "rgba(255,255,255,.36)", lineHeight: 1.8 }}>
                <div>已尝试 <span className="mono" style={{ color: "rgba(255,255,255,.7)" }}>10¹⁰⁶</span> 次</div>
                <div>还需要 <span className="mono" style={{ color: "rgba(255,255,255,.7)" }}>10¹¹⁵</span> 次</div>
              </div>
            </div>
            <div style={{ height: 6, borderRadius: 6, background: "rgba(255,255,255,.08)", marginTop: 24, overflow: "hidden" }}>
              <div style={{ width: "0.0001%", height: "100%", background: "linear-gradient(90deg,#ffc466,#ff5c7a)", boxShadow: "0 0 12px rgba(255,196,102,.6)" }} />
            </div>
            <div className="mono" style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 10, color: "rgba(255,255,255,.26)", letterSpacing: ".08em" }}>
              <span>0</span>
              <span>2^384 ≈ 10^115</span>
            </div>
          </div>
        </div>
      </Act>

      {/* ================= ACT E: actual keys ================= */}
      <Act from={T.b11} to={T.b14 + 0.2} fade={0.5}>
        <div style={{ opacity: 1 - progress(local, T.b12 + 0.4, 0.8, easeInOutCubic), position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 140, textAlign: "center" }}>
            <div className="kicker" style={{ justifyContent: "center" }}>THE ACTUAL KEYS</div>
            <div className="display h2" style={{ fontSize: 56, marginTop: 12 }}>但这 8 把私钥，实际长这样</div>
          </div>
          <div style={{ position: "absolute", left: 588, top: 330, opacity: zeroP, transform: `scale(${1.12 - zeroP * 0.12})` }}>
            <BitGrid rows={16} cols={24} cell={24} gap={4} t={local} mode="zero" seed={31} highlight={[383, 382, 381, 380, 379, 378, 377, 376]} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 190, textAlign: "center", opacity: progress(local, T.b11 + 2.0, 0.8) }}>
            <div className="mono" style={{ fontSize: 20, color: "rgba(255,255,255,.34)", letterSpacing: ".14em" }}>
              00000000 00000000 … <span style={{ color: "#ffd28a" }}>00000100</span>
            </div>
            <div style={{ fontSize: 18, color: "rgba(255,255,255,.4)", marginTop: 14 }}>384 位里，有效位数：≤ 8</div>
          </div>
        </div>

        <div style={{ opacity: progress(local, T.b12 + 0.2, 0.8, easeInOutCubic), position: "absolute", inset: 0 }}>
          <Rise at={T.b12} style={{ position: "absolute", left: 0, right: 0, top: 116, textAlign: "center" }}>
            <div className="kicker" style={{ justifyContent: "center" }}>8 × PRIVATE KEY</div>
            <div className="display h2" style={{ fontSize: 52, marginTop: 12 }}>不是 384 位。是个位数、两位数。</div>
          </Rise>
          <div style={{ position: "absolute", left: 198, top: 292, display: "flex", gap: 46 }}>
            {BITS.map((n, i) => {
              const p = spring(local, T.b12 + 0.3 + i * 0.13, { stiffness: 150, damping: 17 });
              return (
                <div key={n} style={{ opacity: clamp01(p * 1.5), transform: `translateY(${(1 - p) * 42}px) scale(${0.9 + p * 0.1})` }}>
                  <NumberBall n={n} i={i} size={110} />
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", left: 250, right: 250, top: 520, opacity: progress(local, T.b12 + 1.6, 0.9) }}>
            <div style={{ position: "relative", height: 2, background: "rgba(255,255,255,.1)" }}>
              {BITS.map((n) => (
                <div key={n} style={{ position: "absolute", left: `${(n / 255) * 100}%`, top: -4, width: 10, height: 10, borderRadius: "50%", background: "#b9a7ff", boxShadow: "0 0 12px rgba(185,167,255,.6)", transform: "translateX(-50%)" }} />
              ))}
              <div className="mono" style={{ position: "absolute", left: 0, top: 22, fontSize: 11, color: "rgba(255,255,255,.3)" }}>0</div>
              <div className="mono" style={{ position: "absolute", right: 0, top: 22, fontSize: 11, color: "rgba(255,255,255,.3)" }}>255</div>
              <div className="mono" style={{ position: "absolute", left: "50%", top: 22, transform: "translateX(-50%)", fontSize: 11, color: "rgba(255,255,255,.3)" }}>128</div>
            </div>
            <div style={{ textAlign: "center", marginTop: 64 }}>
              <span className="mono" style={{ fontSize: 13, color: "rgba(255,196,102,.7)", letterSpacing: ".14em" }}>
                256 种可能 · 8 张证书的私钥全部落在这个范围
              </span>
            </div>
          </div>
          <div style={{ position: "absolute", left: 250, right: 250, top: 664, display: "flex", alignItems: "center", justifyContent: "center", gap: 34, opacity: progress(local, T.b13, 0.8) }}>
            <div style={{ textAlign: "right" }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: ".14em", color: "rgba(255,255,255,.28)" }}>理论搜索空间</div>
              <div className="mono" style={{ fontSize: 34, color: "rgba(255,255,255,.32)", textDecoration: "line-through", textDecorationColor: "rgba(255,92,122,.5)" }}>2^384</div>
            </div>
            <div style={{ fontSize: 28, color: "rgba(255,92,122,.7)" }}>→</div>
            <div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: ".14em", color: "rgba(255,196,102,.55)" }}>实际搜索空间</div>
              <div className="mono" style={{ fontSize: 42, color: "#ffd28a" }}>256</div>
            </div>
          </div>
        </div>
      </Act>

      {/* ================= ACT F: brute force + moat ================= */}
      <Act from={T.b14} to={T.b16 + 0.3} fade={0.55}>
        <div style={{ opacity: 1 - progress(local, T.b15, 0.7, easeInOutCubic), position: "absolute", inset: 0 }}>
          <Rise at={T.b14} style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center" }}>
            <div className="kicker" style={{ justifyContent: "center" }}>BRUTE FORCE · 0 → 255</div>
            <div className="display h2" style={{ fontSize: 52, marginTop: 12 }}>攻击者不需要“破解”</div>
            <div style={{ fontSize: 20, color: "rgba(255,255,255,.42)", marginTop: 12 }}>他只要把不到 256 种可能，挨个试一遍</div>
          </Rise>
          <div style={{ position: "absolute", left: 660, top: 300 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(16, 34px)", gap: 5 }}>
              {Array.from({ length: 256 }, (_, i) => {
                const hit = BITS.includes(i);
                const scanned = i <= scanIndex;
                const pulse = hit && scanned ? 0.6 + 0.4 * Math.sin(local * 8) : 0;
                return (
                  <div
                    key={i}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 5,
                      display: "grid",
                      placeItems: "center",
                      fontFamily: "var(--mono)",
                      fontSize: 9,
                      color: hit && scanned ? "#07110c" : scanned ? "rgba(255,255,255,.25)" : "rgba(255,255,255,.12)",
                      background: hit && scanned ? "#45e0a0" : scanned ? "rgba(255,255,255,.06)" : "rgba(255,255,255,.025)",
                      border: `1px solid ${hit && scanned ? "rgba(69,224,160,.8)" : "rgba(255,255,255,.055)"}`,
                      boxShadow: hit && scanned ? `0 0 ${18 * pulse}px rgba(69,224,160,.5)` : undefined,
                      transform: hit && scanned ? `scale(${1 + 0.1 * pulse})` : undefined,
                    }}
                  >
                    {hit && scanned ? i : ""}
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
              <div className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,.3)" }}>0x00</div>
              <div className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,.3)" }}>0xFF</div>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1380, top: 360, width: 340 }}>
            <div className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,.35)", letterSpacing: ".12em" }}>ATTEMPT</div>
            <div className="mono" style={{ fontSize: 58, color: "#fff", letterSpacing: "-.04em" }}>{String(Math.min(scanIndex, 255)).padStart(3, "0")} <span style={{ fontSize: 22, color: "rgba(255,255,255,.3)" }}>/ 256</span></div>
            <div style={{ marginTop: 18, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {BITS.map((n, i) => (
                <span key={n} className="mono" style={{ fontSize: 11, padding: "4px 7px", borderRadius: 4, border: "1px solid rgba(69,224,160,.25)", color: hits[i] ? "#68edb8" : "rgba(255,255,255,.2)", background: hits[i] ? "rgba(69,224,160,.08)" : "transparent" }}>{n}</span>
              ))}
            </div>
            <div style={{ marginTop: 22, display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 7, border: "1px solid rgba(69,224,160,.25)", background: "rgba(69,224,160,.06)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#45e0a0", boxShadow: "0 0 8px #45e0a0" }} />
              <span className="mono" style={{ fontSize: 11, color: "#68edb8", letterSpacing: ".1em" }}>HIT {BITS.filter((b) => b <= scanIndex).length} / 8</span>
            </div>
          </div>
        </div>
        <div style={{ opacity: progress(local, T.b15, 0.8, easeInOutCubic), position: "absolute", inset: 0 }}>
          <Moat t={local} reveal={progress(local, T.b15 + 0.2, 1.4)} />
        </div>
      </Act>

      {/* ================= ACT G: the bug ================= */}
      <Act from={T.b16} to={chapter.duration + 0.1} fade={0.5}>
        <div style={{ opacity: 1 - progress(local, T.b18 - 0.2, 0.6, easeInOutCubic), position: "absolute", inset: 0 }}>
          <Rise at={T.b16} style={{ position: "absolute", left: 0, right: 0, top: 112, textAlign: "center" }}>
            <div className="kicker" style={{ justifyContent: "center" }}>KEY CEREMONY · 2025.04</div>
            <div className="display h2" style={{ fontSize: 52, marginTop: 12 }}>一次“特批流程”，多生成了一对弱密钥</div>
          </Rise>
          <div style={{ position: "absolute", left: 170, top: 260, width: 1580, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: 1 - 0.68 * progress(local, T.b17, 0.6, easeInOutCubic) }}>
            {[
              { t: "1", title: "密钥生成仪式", sub: "HSM · key wrap test", color: "#b9a7ff" },
              { t: "2", title: "测试流程", sub: "special approval", color: "#ffc466" },
              { t: "3", title: "弱密钥", sub: "value < 256", color: "#ff5c7a" },
            ].map((s, i) => (
              <div key={s.t} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: 380, padding: "28px 28px", borderRadius: 16, border: "1px solid rgba(255,255,255,.11)", background: "rgba(255,255,255,.03)" }}>
                  <div className="mono" style={{ fontSize: 10, color: `${s.color}aa`, letterSpacing: ".16em" }}>STEP 0{s.t}</div>
                  <div style={{ fontSize: 26, fontWeight: 600, marginTop: 11 }}>{s.title}</div>
                  <div className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,.3)", marginTop: 6 }}>{s.sub}</div>
                </div>
                {i < 2 && (
                  <div style={{ width: 110, display: "grid", placeItems: "center" }}>
                    <FlowArrow x1={0} y1={0} x2={70} y2={0} color="rgba(255,255,255,.25)" progress={progress(local, T.b16 + 0.8 + i * 0.3, 0.6)} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", left: 760, top: 500, width: 400, height: 190, borderRadius: 16, border: "1px solid rgba(255,255,255,.1)", background: "rgba(10,11,18,.65)", opacity: progress(local, T.b16 + 1.0, 0.8) * (1 - progress(local, T.b17 - 0.25, 0.55, easeInOutCubic)) }}>
            <div className="mono" style={{ display: "flex", justifyContent: "space-between", padding: "14px 18px", fontSize: 9, letterSpacing: ".14em", color: "rgba(255,196,102,.6)", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
              <span>HSM · KEY WRAP TEST</span>
              <span className="green">RUNNING</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "20px 24px" }}>
              <KeyGlyph size={92} color="#ffc466" glow={0.4} />
              <div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.38)", lineHeight: 1.7 }}>标签：emSign TLS CA G3B</div>
                <div className="mono" style={{ fontSize: 24, color: "#ffd28a", marginTop: 6 }}>value = 4</div>
                <div className="mono" style={{ fontSize: 9, color: "rgba(255,92,122,.6)", marginTop: 6, letterSpacing: ".1em" }}>NOT 384-BIT RANDOM</div>
              </div>
            </div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 190, textAlign: "center", opacity: progress(local, T.b16 + 1.6, 0.7) * (1 - progress(local, T.b17, 0.5)) }}>
            <div style={{ fontSize: 22, color: "rgba(255,255,255,.45)" }}>设备上另外生成了一对更弱的密钥，标签名字却几乎一样</div>
          </div>

          {/* labels flow */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 620, display: "flex", justifyContent: "center", gap: 22, opacity: progress(local, T.b17, 0.8) }}>
            {[
              { label: "emSign TLS CA G3B · PROD", color: "#45e0a0", tag: "生产" },
              { label: "emSign TLS CA G3B · TEST", color: "#ffc466", tag: "测试" },
            ].map((l, i) => (
              <div key={l.label} style={{ padding: "14px 18px", borderRadius: 10, border: `1px solid ${i === 1 ? "rgba(255,196,102,.35)" : "rgba(255,255,255,.12)"}`, background: i === 1 ? "rgba(255,196,102,.06)" : "rgba(255,255,255,.03)", display: "flex", alignItems: "center", gap: 14 }}>
                <span className="mono" style={{ fontSize: 13, color: "rgba(255,255,255,.7)" }}>{l.label}</span>
                <span className="mono" style={{ fontSize: 9, color: l.color, border: `1px solid ${l.color}55`, borderRadius: 4, padding: "3px 6px" }}>{l.tag}</span>
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 730, textAlign: "center", opacity: progress(local, T.b17 + 0.8, 0.7) }}>
            <span className="mono" style={{ fontSize: 12, color: "#ff8ba0", letterSpacing: ".14em" }}>标签名字太像 → CSR 选错了密钥</span>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 786, display: "flex", alignItems: "center", justifyContent: "center", gap: 20, opacity: progress(local, T.b17 + 1.5, 0.7) }}>
            <div className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,.28)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 5, padding: "5px 8px" }}>CSR</div>
            <span style={{ fontSize: 18, color: "rgba(255,92,122,.5)" }}>→</span>
            <div style={{ display: "flex", gap: 7 }}>
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} style={{ width: 42, height: 30, borderRadius: 4, border: "1px solid rgba(255,92,122,.35)", background: "rgba(255,92,122,.07)", display: "grid", placeItems: "center" }}>
                  <span className="mono" style={{ fontSize: 7, color: "rgba(255,140,160,.7)" }}>{i + 1}</span>
                </div>
              ))}
            </div>
            <span className="mono" style={{ fontSize: 10, color: "rgba(255,92,122,.55)", letterSpacing: ".08em" }}>8 × CERT</span>
          </div>
        </div>

        {/* final: 8 certs fall */}
        <div style={{ opacity: progress(local, T.b18 - 0.2, 0.6, easeInOutCubic), position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 116, textAlign: "center" }}>
            <div className="mono" style={{ fontSize: 12, color: "rgba(255,92,122,.65)", letterSpacing: ".22em" }}>ONE LABEL · EIGHT CERTIFICATES</div>
            <div className="display h1" style={{ fontSize: 86, marginTop: 20 }}>
              一个标签写错，<span style={{ color: "#ff5c7a" }}>八张证书沦陷</span>
            </div>
          </div>
          <div style={{ position: "absolute", left: 170, top: 400, display: "flex", gap: 20 }}>
            {Array.from({ length: 8 }, (_, i) => {
              const p = spring(local, T.b18 - 0.2 + i * 0.09, { stiffness: 130, damping: 16 });
              return (
                <div key={i} style={{ opacity: clamp01(p), transform: `translateY(${(1 - p) * -30}px)`, filter: "drop-shadow(0 20px 40px rgba(255,92,122,.12))" }}>
                  <MiniCert title={["DV G3B", "DV G3C", "OV G3B", "OV G3C", "EV G3B", "EV G3C", "CS G3B", "CS G3C"][i]} sub="COMPROMISED" danger={1} i={i} />
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", left: 170, right: 170, top: 640 }}>
            <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,92,122,.35), transparent)" }} />
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: 26 }}>
              {[
                ["8", "张中间证书"],
                ["2", "类用途 · TLS / 代码签名"],
                ["1", "个标签错误"],
              ].map(([n, label]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div className="mono" style={{ fontSize: 54, color: "#ff8ba0", letterSpacing: "-.04em", lineHeight: 1 }}>{n}</div>
                  <div className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,.32)", letterSpacing: ".14em", marginTop: 9 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 65%, rgba(255,92,122,.12), transparent 55%)", pointerEvents: "none" }} />
        </div>
      </Act>
    </div>
  );
}
