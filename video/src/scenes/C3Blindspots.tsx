import type { CSSProperties, ReactNode } from "react";
import { useChapter } from "../lib/ChapterContext";
import { clamp01, easeInOutCubic, easeOutBack, easeOutCubic, easeOutExpo, progress, spring } from "../lib/time";
import { CertCard, Seal } from "../components/cert";
import { FlowArrow } from "../components/visuals";
import { EyeIcon, EyeOffIcon } from "../components/icons";
import { LockGlyph } from "../components/devices";

function Act({ from, to, children, fade = 0.55, style }: { from: number; to: number; children: ReactNode; fade?: number; style?: CSSProperties }) {
  const { local } = useChapter();
  const o = Math.min(progress(local, from, fade, easeInOutCubic), 1 - progress(local, to - fade, fade, easeInOutCubic));
  if (o <= 0.001) return null;
  return <div style={{ position: "absolute", inset: 0, opacity: o, ...style }}>{children}</div>;
}

function Poster({ t }: { t: number }) {
  return (
    <div
      style={{
        width: 640,
        borderRadius: 8,
        border: "1px solid rgba(255,92,122,.28)",
        background: "linear-gradient(170deg, rgba(32,16,24,.92), rgba(12,10,16,.98))",
        boxShadow: "0 40px 120px rgba(0,0,0,.55), 0 0 80px rgba(255,92,122,.06)",
        padding: "26px 30px 30px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,92,122,.18)", paddingBottom: 14 }}>
        <div>
          <div className="mono" style={{ fontSize: 9, letterSpacing: ".22em", color: "rgba(255,92,122,.72)" }}>REVOCATION LIST · WANTED</div>
          <div style={{ fontSize: 26, fontWeight: 600, marginTop: 7 }}>证书通缉令</div>
        </div>
        <div className="mono" style={{ fontSize: 9, color: "rgba(255,92,122,.55)", border: "1px solid rgba(255,92,122,.3)", padding: "5px 8px", borderRadius: 4, letterSpacing: ".12em" }}>
          ca_compromise
        </div>
      </div>
      <div style={{ marginTop: 22, padding: "18px 18px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,.09)", background: "rgba(0,0,0,.22)", position: "relative" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <Seal size={54} color="#ff5c7a" label="em" rotate={28} />
          <div>
            <div className="mono" style={{ fontSize: 8.5, color: "rgba(255,255,255,.3)", letterSpacing: ".1em" }}>INTERMEDIATE CA · REVOKED</div>
            <div style={{ fontSize: 20, fontWeight: 600, marginTop: 6 }}>EM DV TLS CA - G3B</div>
            <div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,.28)", marginTop: 5 }}>serial 88:6f:2a:1c … 4d:1e</div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 10,
            top: 18,
            transform: `rotate(-11deg) scale(${progress(t, 0.7, 0.5, easeOutBack)})`,
            border: "2px solid rgba(255,92,122,.6)",
            color: "rgba(255,140,160,.9)",
            fontFamily: "var(--mono)",
            fontSize: 13,
            letterSpacing: ".16em",
            padding: "5px 9px",
            borderRadius: 4,
            opacity: progress(t, 0.6, 0.4),
          }}
        >
          REVOKED
        </div>
      </div>
      <div style={{ marginTop: 18 }}>
        {["EM DV TLS CA - G3C", "EM OV TLS CA - G3B", "EM EV TLS CA - G3B", "EM OV CS CA - G3B"].map((n, i) => (
          <div key={n} className="mono" style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,.055)", fontSize: 10, color: "rgba(255,255,255,.4)", opacity: 0.55 + i * 0.08 }}>
            <span>{n}</span>
            <span style={{ color: "rgba(255,92,122,.55)" }}>REVOKED</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ fontSize: 17, color: "rgba(255,255,255,.62)", lineHeight: 1.55 }}>
          证书还在。
          <br />
          只是所有<span style={{ color: "#ff8ba0" }}>守规矩</span>的客户端，
          <br />
          都应该拒绝它。
        </div>
        <div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,.22)", letterSpacing: ".1em", textAlign: "right" }}>
          STILL ONLINE<br />NOT DELETED
        </div>
      </div>
    </div>
  );
}

function ClientRow({
  name,
  detail,
  good,
  at,
  t,
  command,
}: {
  name: string;
  detail: string;
  good: boolean;
  at: number;
  t: number;
  command?: string;
}) {
  const p = progress(t, at, 0.6, easeOutCubic);
  const color = good ? "#45e0a0" : "#ff5c7a";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "15px 16px",
        borderRadius: 10,
        border: `1px solid ${good ? "rgba(69,224,160,.16)" : "rgba(255,92,122,.18)"}`,
        background: good ? "rgba(69,224,160,.035)" : "rgba(255,92,122,.035)",
        opacity: p,
        transform: `translateX(${(1 - p) * 18}px)`,
        marginBottom: 10,
      }}
    >
      <div style={{ width: 40, height: 40, borderRadius: 9, display: "grid", placeItems: "center", background: `${color}12`, border: `1px solid ${color}33`, color }}>
        {good ? <EyeIcon style={{ width: 19, height: 19 }} /> : <EyeOffIcon style={{ width: 19, height: 19 }} />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ fontSize: 17, fontWeight: 600 }}>{name}</span>
          {command && <span className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,.26)" }}>{command}</span>}
        </div>
        <div className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,.3)", marginTop: 4 }}>{detail}</div>
      </div>
      <div className="mono" style={{ fontSize: 10, letterSpacing: ".1em", color, border: `1px solid ${color}33`, background: `${color}0d`, borderRadius: 5, padding: "4px 8px" }}>
        {good ? "拒绝" : "放行"}
      </div>
    </div>
  );
}

function Ledger({ t }: { t: number }) {
  return (
    <div style={{ width: 690, height: 500, display: "flex", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,.1)", boxShadow: "0 40px 100px rgba(0,0,0,.45)" }}>
      <div style={{ flex: 1, background: "linear-gradient(160deg, rgba(28,25,34,.96), rgba(12,11,16,.98))", padding: "26px 24px", borderRight: "1px solid rgba(255,255,255,.06)" }}>
        <div className="mono" style={{ fontSize: 9, color: "rgba(255,196,102,.6)", letterSpacing: ".16em" }}>SYSTEM TRUST STORE</div>
        <div className="mono" style={{ fontSize: 13, color: "rgba(255,255,255,.62)", marginTop: 12 }}>/etc/ssl/cert.pem</div>
        <div style={{ fontSize: 19, fontWeight: 600, marginTop: 18 }}>根证书账本</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,.35)", marginTop: 8, lineHeight: 1.7 }}>只记录根证书。中间证书的吊销状态，不在这里。</div>
        <div style={{ marginTop: 22 }}>
          {["DigiCert Global Root G2", "ISRG Root X1", "emSign Root TLS CA - G3", "AAA Certificate Services"].map((n, i) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,.05)", opacity: 0.3 + i * 0.1 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(69,224,160,.6)" }} />
              <span className="mono" style={{ fontSize: 9.5, color: "rgba(255,255,255,.5)" }}>{n}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, background: "linear-gradient(160deg, rgba(22,20,28,.96), rgba(10,9,14,.98))", padding: "26px 24px", position: "relative" }}>
        <div className="mono" style={{ fontSize: 9, color: "rgba(255,92,122,.55)", letterSpacing: ".16em" }}>LAST UPDATED</div>
        <div className="mono" style={{ fontSize: 42, color: "rgba(255,255,255,.72)", marginTop: 18, letterSpacing: "-.04em" }}>2026.09</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,.35)", marginTop: 8 }}>macOS 27.2 随系统更新前</div>
        <div style={{ marginTop: 34, padding: "16px", borderRadius: 10, border: "1px solid rgba(255,196,102,.22)", background: "rgba(255,196,102,.05)" }}>
          <div className="mono" style={{ fontSize: 9, color: "rgba(255,196,102,.7)", letterSpacing: ".12em" }}>STALE</div>
          <div style={{ fontSize: 15, color: "rgba(255,255,255,.66)", marginTop: 7, lineHeight: 1.6 }}>curl / git / python3<br />不会等下一次系统更新</div>
        </div>
        <div style={{ position: "absolute", right: 24, bottom: 22 }} className="mono">
          <div style={{ fontSize: 8, color: "rgba(255,255,255,.2)", letterSpacing: ".1em" }}>TRUST ANCHORS</div>
          <div style={{ fontSize: 28, color: "rgba(255,255,255,.3)" }}>142</div>
        </div>
      </div>
    </div>
  );
}

function MiniNode({ title, sub, status, color, note }: { title: string; sub: string; status: string; color: string; note: string }) {
  return (
    <div style={{ width: 230, padding: "16px 16px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,.1)", background: `linear-gradient(170deg, ${color}0a, rgba(255,255,255,.02))`, height: 242, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}` }} />
        <span className="mono" style={{ fontSize: 8, color: `${color}aa`, letterSpacing: ".08em" }}>{status}</span>
      </div>
      <div style={{ fontSize: 15.5, fontWeight: 600, marginTop: 12, lineHeight: 1.3 }}>{title}</div>
      <div className="mono" style={{ fontSize: 8.5, color: "rgba(255,255,255,.27)", marginTop: 5, lineHeight: 1.5 }}>{sub}</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 7, marginTop: 14, flex: 1 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ height: 3, borderRadius: 2, width: `${88 - i * 16}%`, background: color, opacity: 0.13 + i * 0.1 }} />
          ))}
        </div>
        <LockGlyph size={22} color={color} />
      </div>
      <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)", lineHeight: 1.55, minHeight: 30 }}>{note}</div>
      <div style={{ height: 26, borderRadius: 5, border: "1px solid rgba(255,255,255,.06)", background: "rgba(0,0,0,.16)", display: "flex", alignItems: "center", padding: "0 7px", gap: 6, marginTop: 8 }}>
        <span style={{ width: 4, height: 4, borderRadius: "50%", background: color, opacity: 0.75 }} />
        <span className="mono" style={{ fontSize: 7, color: "rgba(255,255,255,.25)", letterSpacing: ".06em" }}>TRUST STORE</span>
      </div>
    </div>
  );
}

function House({ t, red }: { t: number; red: number }) {
  const windows = Array.from({ length: 20 }, (_, i) => {
    const col = i % 5;
    const row = Math.floor(i / 5);
    return { x: 270 + col * 112, y: 420 + row * 66, i, open: [2, 7, 9, 13, 17].includes(i) };
  });
  return (
    <svg width="900" height="620" viewBox="0 0 900 620" style={{ position: "absolute", left: 110, top: 280 }}>
      <defs>
        <linearGradient id="roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(139,108,255,.16)" />
          <stop offset="1" stopColor="rgba(139,108,255,.02)" />
        </linearGradient>
      </defs>
      <path d="M100 300 L450 80 L800 300" fill="url(#roof)" stroke="rgba(185,167,255,.82)" strokeWidth="2" />
      <rect x="140" y="300" width="620" height="270" fill="rgba(255,255,255,.025)" stroke="rgba(255,255,255,.38)" strokeWidth="2" />
      <rect x="410" y="430" width="110" height="140" fill="rgba(69,224,160,.075)" stroke="rgba(69,224,160,.65)" strokeWidth="1.5" />
      <circle cx="500" cy="500" r="3" fill="rgba(69,224,160,.8)" />
      <g transform="translate(448 410) scale(.7)">
        <LockGlyph size={72} color="#45e0a0" />
      </g>
      <text x="465" y="590" textAnchor="middle" fill="rgba(69,224,160,.55)" fontSize="10" fontFamily="var(--mono)">BROWSER · UPDATED</text>
      {windows.map((w) => (
        <g key={w.i}>
          <rect x={w.x} y={w.y} width="56" height="36" fill={w.open ? "rgba(255,92,122,.15)" : "rgba(255,255,255,.035)"} stroke={w.open ? "rgba(255,92,122,.75)" : "rgba(255,255,255,.24)"} strokeWidth="1.2" />
          {w.open && (
            <>
              <rect x={w.x + 4} y={w.y + 4} width="48" height="28" fill="rgba(255,92,122,.06)" />
              <path d={`M${w.x + 28} ${w.y + 36} q 18 22 8 44 q -12 20 12 34`} fill="none" stroke="rgba(255,92,122,.4)" strokeWidth="1.4" strokeDasharray="3 5" />
            </>
          )}
        </g>
      ))}
      <path d="M700 480 C 760 520, 800 540, 840 540" fill="none" stroke="rgba(255,92,122,.3)" strokeWidth="1.4" strokeDasharray="4 7" />
      <text x="745" y="585" fill="rgba(255,92,122,.5)" fontSize="10" fontFamily="var(--mono)">OLD CLIENT · UNAWARE</text>
      <text x="450" y="625" textAnchor="middle" fill="rgba(255,255,255,.22)" fontSize="10" fontFamily="var(--mono)" letterSpacing=".18em">ONE LOCKED DOOR · MANY OPEN WINDOWS</text>
    </svg>
  );
}

export function C3Blindspots() {
  const { at, local, chapter } = useChapter();
  const T = {
    b1: at("c3_b1"), b2: at("c3_b2"), b3: at("c3_b3"), b4: at("c3_b4"),
    b5: at("c3_b5"), b6: at("c3_b6"), b7: at("c3_b7"), b8: at("c3_b8"),
    b9: at("c3_b9"), b10: at("c3_b10"), b11: at("c3_b11"), b12: at("c3_b12"),
  };
  const houseP = progress(local, T.b10, 1.0, easeOutCubic);
  const degrade = progress(local, T.b11, 1.0, easeInOutCubic);
  const collapse = progress(local, T.b12, 1.4, easeInOutCubic);
  const pct = 99 * (1 - collapse);
  const nodeAt = (i: number) => progress(local, T.b6 + 0.2 + i * 0.12, 0.55, easeOutCubic);

  return (
    <div className="scene" style={{ padding: 0 }}>
      {/* Act A: revocation list + clients */}
      <Act from={T.b1} to={T.b3 + 0.2} fade={0.55}>
        <div style={{ position: "absolute", left: 96, top: 104 }}>
          <div className="kicker" style={{ color: "rgba(255,92,122,.7)" }}>REVOCATION</div>
          <div className="display" style={{ fontSize: 60, marginTop: 12 }}>吊销，不是删除</div>
          <div style={{ fontSize: 19, color: "rgba(255,255,255,.4)", marginTop: 10 }}>证书还在互联网上。它需要的，是每个客户端主动去看一眼。</div>
        </div>
        <div style={{ position: "absolute", left: 96, top: 280, opacity: progress(local, T.b1, 0.8) }}>
          <Poster t={local - T.b1} />
        </div>
        <div style={{ position: "absolute", left: 840, top: 296, width: 980 }}>
          <div style={{ fontSize: 26, fontWeight: 600, marginBottom: 20 }}>谁，会去看这张通缉令？</div>
          <ClientRow name="浏览器" detail="Chrome / Firefox / Safari · 强制检查 CRLSet / OneCRL" good at={T.b2} t={local} />
          <ClientRow name="curl" detail="macOS 自带 · 只验证证书链，不查吊销状态" good={false} at={T.b2 + 1.0} t={local} command="$ curl https://…" />
          <ClientRow name="git" detail="命令行工具 · 不查 CRL / OCSP" good={false} at={T.b2 + 1.8} t={local} />
          <ClientRow name="python3" detail="urllib / requests 默认信任系统根证书" good={false} at={T.b2 + 2.6} t={local} />
          <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, opacity: progress(local, T.b2 + 3.4, 0.7) }}>
            <span style={{ width: 28, height: 1, background: "rgba(255,92,122,.5)" }} />
            <span className="mono" style={{ fontSize: 10, color: "rgba(255,92,122,.65)", letterSpacing: ".14em" }}>在同一条局域网上，它们都是“合法”的入口</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: 96, bottom: 150, opacity: progress(local, T.b2 + 3, 0.8) }}>
          <div className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,.24)", letterSpacing: ".16em" }}>REVOCATION ONLY WORKS IF THE CLIENT ASKS</div>
        </div>
      </Act>

      {/* Act B: the ledger + chain */}
      <Act from={T.b3} to={T.b5 + 0.2} fade={0.55}>
        <div style={{ position: "absolute", left: 96, top: 104 }}>
          <div className="kicker" style={{ color: "rgba(255,196,102,.7)" }}>THE ROOT LEDGER</div>
          <div className="display" style={{ fontSize: 56, marginTop: 12 }}>它们只检查根证书账本</div>
          <div style={{ fontSize: 19, color: "rgba(255,255,255,.4)", marginTop: 10 }}>只要证书链能连到账本上的根，就一路放行。</div>
        </div>
        <div style={{ position: "absolute", left: 96, top: 286, opacity: progress(local, T.b3, 0.8) }}>
          <Ledger t={local - T.b3} />
        </div>
        <div style={{ position: "absolute", left: 850, top: 286, width: 960, opacity: progress(local, T.b3 + 0.5, 0.8) }}>
          <div className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,.3)", letterSpacing: ".14em", marginBottom: 16 }}>CERTIFICATE CHAIN · VERIFICATION</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {[
              { t: "ROOT", n: "emSign Root", c: "#45e0a0" },
              { t: "INTERMEDIATE", n: "EM DV TLS CA - G3B", c: "#ff5c7a" },
              { t: "SERVER", n: "feishu.cn", c: "#b9a7ff" },
            ].map((x, i) => (
              <div key={x.t} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: 260, padding: "17px 16px", borderRadius: 10, border: `1px solid ${x.c}33`, background: `${x.c}08`, position: "relative" }}>
                  <div className="mono" style={{ fontSize: 8, color: `${x.c}aa`, letterSpacing: ".12em" }}>{x.t}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginTop: 7 }}>{x.n}</div>
                  {i === 1 && (
                    <div className="mono" style={{ position: "absolute", right: 10, top: 10, fontSize: 7.5, color: "#ff8ba0", border: "1px solid rgba(255,92,122,.3)", padding: "2px 4px", borderRadius: 3 }}>REVOKED</div>
                  )}
                  <div className="mono" style={{ fontSize: 8, color: "rgba(255,255,255,.22)", marginTop: 8 }}>{i === 0 ? "trust anchor" : i === 1 ? "signature valid" : "signature valid"}</div>
                </div>
                {i < 2 && (
                  <div style={{ width: 46, display: "grid", placeItems: "center" }}>
                    <FlowArrow x1={0} y1={0} x2={34} y2={0} color={i === 1 ? "rgba(255,92,122,.6)" : "rgba(69,224,160,.55)"} progress={progress(local, T.b3 + 0.8 + i * 0.4, 0.5)} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 7, border: "1px solid rgba(69,224,160,.25)", background: "rgba(69,224,160,.06)" }}>
              <span style={{ color: "#68edb8", fontSize: 13 }}>✓</span>
              <span className="mono" style={{ fontSize: 10, color: "#68edb8", letterSpacing: ".08em" }}>CHAIN VALID → PASS</span>
            </div>
            <span className="mono" style={{ fontSize: 9.5, color: "rgba(255,92,122,.55)" }}>中间证书已被吊销，但没有被检查</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: 850, top: 690, width: 780, opacity: progress(local, T.b4, 0.8) }}>
          <div style={{ borderRadius: 12, border: "1px solid rgba(255,196,102,.18)", background: "rgba(255,196,102,.04)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 18 }}>
            <div className="mono" style={{ fontSize: 28, color: "rgba(255,196,102,.8)", letterSpacing: "-.04em" }}>09 / 2026</div>
            <div>
              <div style={{ fontSize: 15, color: "rgba(255,255,255,.72)" }}>macOS 27.2 · cert.pem 依然是旧的</div>
              <div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,.3)", marginTop: 4 }}>APPLE SECURITY NOTICE · SYSTEM UPDATE PENDING</div>
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 1660, top: 680, opacity: progress(local, T.b4 + 1.2, 0.7) }}>
          <div className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,.22)", writingMode: "vertical-rl", letterSpacing: ".2em" }}>STALE ROOT STORE</div>
        </div>
      </Act>

      {/* Act C: ecosystem map */}
      <Act from={T.b5} to={T.b10 + 0.2} fade={0.55}>
        <div style={{ position: "absolute", left: 96, top: 104, right: 96 }}>
          <div className="kicker">THE TRUST SUPPLY CHAIN</div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 10 }}>
            <div className="display" style={{ fontSize: 56 }}>很多工具，根本不看系统的账本</div>
            <div className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,.28)", letterSpacing: ".1em" }}>EACH ONE SHIPS ITS OWN STORE</div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 96, top: 260, display: "flex", gap: 14 }}>
          {[
            { title: "系统信任库", sub: "/etc/ssl/cert.pem", status: "STALE", color: "#ffc466", note: "142 个根证书，等待系统更新" },
            { title: "浏览器", sub: "Chrome / Firefox", status: "UPDATED", color: "#45e0a0", note: "自己查 CRLSet / OneCRL" },
            { title: "curl / git / python3", sub: "命令行工具", status: "NO CRL", color: "#ff5c7a", note: "只验链，不查吊销状态" },
            { title: "Go 二进制", sub: "crypto/x509", status: "REBUILD", color: "#ff5c7a", note: "信任库被编进了程序里" },
            { title: "certifi / webpki", sub: "Python / Rust", status: "UPGRADE", color: "#ffc466", note: "打包时冻结的证书副本" },
            { title: "Electron 应用", sub: "飞书 / Slack / AI", status: "UPSTREAM", color: "#ff5c7a", note: "自带一份 Chromium 信任库" },
            { title: "旧容器 / IoT", sub: "停更镜像 / 嵌入式", status: "FROZEN", color: "#ff5c7a", note: "构建之后，再也不会变" },
          ].map((n, i) => (
            <div key={n.title} style={{ opacity: i === 0 ? 1 : nodeAt(i), transform: `translateY(${(1 - (i === 0 ? 1 : nodeAt(i))) * 18}px)` }}>
              <MiniNode title={n.title} sub={n.sub} status={n.status} color={n.color} note={n.note} />
              {i > 0 && i < 6 && (
                <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
                  <div className="mono" style={{ fontSize: 8, color: "rgba(255,255,255,.24)", letterSpacing: ".06em" }}>{i === 1 ? "SELF" : i === 2 ? "SKIP" : "BUNDLED"}</div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 110, right: 110, top: 570, opacity: progress(local, T.b6, 0.7) }}>
          <div style={{ height: 1, background: "linear-gradient(90deg, rgba(255,196,102,.18), rgba(255,92,122,.4), rgba(255,92,122,.15))", position: "relative" }}>
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} style={{ position: "absolute", left: `${(i + 1) * 14.2}%`, top: -3, width: 6, height: 6, borderRadius: "50%", background: i > 0 ? "#ff5c7a" : "#45e0a0", opacity: 0.7 }} />
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", left: 96, right: 96, top: 552, opacity: progress(local, T.b7, 0.8) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="mono" style={{ fontSize: 9, color: "rgba(255,196,102,.65)", letterSpacing: ".14em" }}>SYSTEM UPDATE</span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(255,196,102,.28), rgba(255,92,122,.18))" }} />
            <span className="mono" style={{ fontSize: 8, color: "rgba(255,255,255,.22)", letterSpacing: ".1em" }}>ONLY REACHES THE BROWSER</span>
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 6 }}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{ width: 230, display: "flex", justifyContent: "center" }}>
                <div style={{ width: 1, height: 26, background: i === 1 ? "rgba(69,224,160,.6)" : "rgba(255,92,122,.35)", borderLeft: i === 1 ? undefined : "1px dashed rgba(255,92,122,.35)" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
            {[
              ["system", "update", "#ffc466"],
              ["self", "check", "#45e0a0"],
              ["no", "CRL", "#ff5c7a"],
              ["go", "build", "#ff5c7a"],
              ["pip -U", "certifi", "#ffc466"],
              ["wait", "upstream", "#ff5c7a"],
              ["replace", "image", "#ff5c7a"],
            ].map(([a, b, c], i) => (
              <div key={a} style={{ width: 230, textAlign: "center" }}>
                <span className="mono" style={{ fontSize: 8.5, color: c, border: `1px solid ${c}33`, background: `${c}08`, padding: "3px 6px", borderRadius: 4, letterSpacing: ".04em" }}>{a} {b}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", left: 96, top: 700, width: 760, opacity: progress(local, T.b7 + 0.3, 0.8) }}>
          <div style={{ fontSize: 20, color: "rgba(255,255,255,.46)", lineHeight: 1.7 }}>
            系统升级了，它们不会自动变。<br />
            你必须<span style={{ color: "#ffd28a" }}>重新编译</span>，或者<span style={{ color: "#ffd28a" }}>升级依赖</span>。
          </div>
        </div>
        <div style={{ position: "absolute", right: 96, top: 700, width: 760, opacity: progress(local, T.b8, 0.8) }}>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
            {["Slack", "Discord", "飞书", "桌面 AI", "旧版 Electron"].map((s, i) => (
              <span key={s} className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,.42)", border: "1px solid rgba(255,92,122,.18)", background: "rgba(255,92,122,.035)", borderRadius: 6, padding: "7px 10px", opacity: 0.5 + i * 0.1 }}>{s}</span>
            ))}
          </div>
          <div className="mono" style={{ fontSize: 9, color: "rgba(255,92,122,.55)", textAlign: "right", marginTop: 10, letterSpacing: ".12em" }}>WAITING FOR UPSTREAM RELEASE</div>
        </div>
        <div style={{ position: "absolute", left: 96, top: 820, opacity: progress(local, T.b9, 0.8) }}>
          <div className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,.26)", letterSpacing: ".12em" }}>
            旧容器 · 旧安装包 · 嵌入式设备 · IoT · 三年前下载的镜像
          </div>
        </div>
      </Act>

      {/* Act D: house + 99% */}
      <Act from={T.b10} to={chapter.duration + 0.1} fade={0.5}>
        <div style={{ opacity: 1 - 0.55 * degrade, position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", left: 96, top: 104 }}>
            <div className="kicker">THE LOCKED DOOR</div>
            <div className="display" style={{ fontSize: 54, marginTop: 12 }}>浏览器换了锁</div>
          </div>
          <div style={{ opacity: houseP, transform: `translateY(${(1 - houseP) * 20}px)` }}>
            <House t={local} red={degrade} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 1080, top: 220, width: 720 }}>
          <div style={{ opacity: progress(local, T.b10 + 1.0, 0.8) }}>
            <div style={{ fontSize: 38, fontWeight: 600, lineHeight: 1.35 }}>
              但你家还有
              <span style={{ color: "#ff5c7a" }}>无数扇窗</span>
              <br />
              开着。
            </div>
            <div style={{ fontSize: 18, color: "rgba(255,255,255,.4)", marginTop: 14, lineHeight: 1.7 }}>
              旧命令行、旧 SDK、旧 Electron、旧容器、旧 IoT。<br />
              它们不会跟着浏览器一起更新。
            </div>
          </div>
          <div style={{ marginTop: 54, opacity: progress(local, T.b11, 0.8) }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 12 }}>
              <span className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,.35)", letterSpacing: ".12em" }}>SECURITY POSTURE</span>
              <span className="mono" style={{ fontSize: 11, color: "rgba(255,196,102,.6)" }}>{pct.toFixed(0)}%</span>
            </div>
            <div style={{ height: 18, borderRadius: 9, background: "rgba(255,255,255,.06)", overflow: "hidden", position: "relative" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #45e0a0, #ffc466)", opacity: 1 - collapse * 0.8, transition: "none" }} />
              <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: collapse > 0.2 ? `${Math.min(8, collapse * 20)}%` : "1%", background: "#ff5c7a", boxShadow: "0 0 16px rgba(255,92,122,.7)" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
              <span className="mono" style={{ fontSize: 9, color: "rgba(69,224,160,.55)" }}>已更新 99%</span>
              <span className="mono" style={{ fontSize: 9, color: "rgba(255,92,122,.65)" }}>旧组件 1%</span>
            </div>
          </div>
        </div>
        {collapse > 0 && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 120, backdropFilter: `blur(${collapse * 10}px)`, background: `rgba(5,6,10,${collapse * 0.9})`, zIndex: 30 }}>
            <div className="mono" style={{ fontSize: 12, color: "rgba(255,92,122,.6)", letterSpacing: ".24em", opacity: collapse }}>SECURITY IS NOT A PERCENTAGE</div>
            <div className="display" style={{ fontSize: 88, marginTop: 18, opacity: collapse, transform: `scale(${0.94 + collapse * 0.06})` }}>
              99% + 1% = <span style={{ color: "#ff5c7a" }}>0</span>
            </div>
            <div style={{ marginTop: 18, fontSize: 22, color: "rgba(255,255,255,.45)", opacity: collapse }}>
              安全不是百分比，它是布尔值。
            </div>
          </div>
        )}
      </Act>
    </div>
  );
}
