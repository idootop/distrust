import type { CSSProperties, ReactNode } from "react";
import { useChapter } from "../lib/ChapterContext";
import { clamp01, easeInOutCubic, easeOutBack, easeOutCubic, easeOutExpo, progress, spring } from "../lib/time";
import { LogoMark } from "../components/icons";
import { LockGlyph, WifiGlyph } from "../components/devices";
import { FlowArrow } from "../components/visuals";

function Act({ from, to, children, fade = 0.55, style }: { from: number; to: number; children: ReactNode; fade?: number; style?: CSSProperties }) {
  const { local } = useChapter();
  const o = Math.min(progress(local, from, fade, easeInOutCubic), 1 - progress(local, to - fade, fade, easeInOutCubic));
  if (o <= 0.001) return null;
  return <div style={{ position: "absolute", inset: 0, opacity: o, ...style }}>{children}</div>;
}

function CheckItem({ index, label, note, active, done, at, t }: { index: string; label: string; note: string; active: number; done: number; at: number; t: number }) {
  const p = progress(t, at, 0.6, easeOutCubic);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        padding: "16px 16px",
        borderRadius: 10,
        border: `1px solid ${done > 0.5 ? "rgba(69,224,160,.24)" : active > 0.5 ? "rgba(255,196,102,.22)" : "rgba(255,255,255,.07)"}`,
        background: done > 0.5 ? "rgba(69,224,160,.045)" : active > 0.5 ? "rgba(255,196,102,.035)" : "rgba(255,255,255,.018)",
        opacity: p,
        transform: `translateX(${(1 - p) * 18}px)`,
        marginBottom: 10,
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 7,
          flex: "0 0 auto",
          display: "grid",
          placeItems: "center",
          border: `1px solid ${done > 0.5 ? "rgba(69,224,160,.5)" : "rgba(255,255,255,.16)"}`,
          background: done > 0.5 ? "rgba(69,224,160,.12)" : "rgba(0,0,0,.15)",
          color: done > 0.5 ? "#68edb8" : "rgba(255,255,255,.25)",
          fontSize: 12,
        }}
      >
        {done > 0.5 ? "✓" : index}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: done > 0.5 ? "#c9f7e3" : "rgba(255,255,255,.82)", lineHeight: 1.4 }}>{label}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,.32)", marginTop: 4, lineHeight: 1.5 }}>{note}</div>
      </div>
      <span className="mono" style={{ fontSize: 8, color: done > 0.5 ? "rgba(104,237,184,.7)" : active > 0.5 ? "rgba(255,196,102,.65)" : "rgba(255,255,255,.16)", letterSpacing: ".08em", paddingTop: 2 }}>
        {done > 0.5 ? "DONE" : active > 0.5 ? "NOW" : "TODO"}
      </span>
    </div>
  );
}

function MacUpdate({ t, at }: { t: number; at: number }) {
  return (
    <div style={{ width: 980 }}>
      <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,.12)", background: "linear-gradient(165deg, rgba(24,25,36,.96), rgba(10,11,17,.98))", overflow: "hidden", boxShadow: "0 30px 90px rgba(0,0,0,.4)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 18px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.7 }} />)}
          <span className="mono" style={{ fontSize: 9.5, color: "rgba(255,255,255,.3)", marginLeft: 10 }}>系统设置 / 软件更新</span>
        </div>
        <div style={{ padding: "26px 30px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,.3)", letterSpacing: ".12em" }}>SOFTWARE UPDATE</div>
              <div style={{ fontSize: 40, fontWeight: 600, marginTop: 8, letterSpacing: "-.03em" }}>macOS 27.2</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,.36)", marginTop: 8 }}>系统已是最新版本 · 2026 年 10 月</div>
            </div>
            <div className="mono" style={{ fontSize: 10, color: "#68edb8", border: "1px solid rgba(69,224,160,.3)", background: "rgba(69,224,160,.07)", padding: "6px 9px", borderRadius: 5, letterSpacing: ".08em" }}>UP TO DATE</div>
          </div>
          <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,.08)", marginTop: 26, overflow: "hidden" }}>
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(90deg,#45e0a0,#4fe3ff)" }} />
          </div>
        </div>
      </div>
      <div style={{ marginTop: 18, borderRadius: 14, border: "1px solid rgba(255,92,122,.25)", background: "linear-gradient(165deg, rgba(38,17,24,.92), rgba(11,10,16,.98))", padding: "20px 24px", opacity: progress(t, at, 0.7), transform: `translateY(${(1 - progress(t, at, 0.7)) * 12}px)` }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
          <div>
            <div className="mono" style={{ fontSize: 9, color: "rgba(255,92,122,.7)", letterSpacing: ".12em" }}>BUT · STILL STALE</div>
            <div style={{ fontSize: 23, fontWeight: 600, marginTop: 8 }}>curl、git、python3 依然是旧的</div>
            <div className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginTop: 9 }}>/etc/ssl/cert.pem · 不随浏览器更新 · 不查吊销</div>
          </div>
          <div className="mono" style={{ fontSize: 9, color: "#ff8ba0", border: "1px solid rgba(255,92,122,.3)", padding: "5px 8px", borderRadius: 4, whiteSpace: "nowrap" }}>需要手动替换</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18 }}>
          <div style={{ flex: 1, padding: "9px 12px", borderRadius: 6, border: "1px solid rgba(255,255,255,.07)", background: "rgba(0,0,0,.2)", fontFamily: "var(--mono)", fontSize: 10, color: "rgba(255,255,255,.4)" }}>
            $ curl --version <span style={{ color: "rgba(255,92,122,.65)" }}>· cert store: 2026.09</span>
          </div>
          <FlowArrow x1={0} y1={0} x2={40} y2={0} color="rgba(255,196,102,.6)" />
          <div style={{ padding: "9px 12px", borderRadius: 6, border: "1px solid rgba(255,196,102,.25)", background: "rgba(255,196,102,.05)", fontFamily: "var(--mono)", fontSize: 10, color: "#ffd28a", whiteSpace: "nowrap" }}>
            按披露页教程替换
          </div>
        </div>
      </div>
    </div>
  );
}

function VersionBoard({ t }: { t: number }) {
  const rows = [
    { name: "Go", sub: "CVE-2026-111943", versions: "1.27.3 / 1.26.10", action: "重新编译", color: "#4fe3ff" },
    { name: "Python · certifi", sub: "独立证书包", versions: "2026.10.19", action: "升级依赖", color: "#ffc466" },
    { name: "Rust · webpki-roots", sub: "编译进二进制", versions: "1.0.10", action: "升级依赖", color: "#b9a7ff" },
    { name: "Node.js", sub: "三个维护分支", versions: "22.23.4 / 24.22.1 / 26.12.1", action: "升级运行时", color: "#45e0a0" },
    { name: "Electron", sub: "桌面客户端底座", versions: "42.11.16 / 43.8.1 / 44.9.1", action: "等上游发版", color: "#ff5c7a" },
  ];
  return (
    <div style={{ width: 1050 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <div>
          <div className="mono" style={{ fontSize: 9.5, color: "rgba(255,196,102,.65)", letterSpacing: ".14em" }}>PATCH LIST · MINIMUM SAFE VERSIONS</div>
          <div style={{ fontSize: 34, fontWeight: 600, marginTop: 8 }}>工具链，要重新构建才算数</div>
        </div>
        <span className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,.28)", letterSpacing: ".08em" }}>2026.10</span>
      </div>
      <div style={{ marginTop: 22, borderRadius: 14, border: "1px solid rgba(255,255,255,.1)", overflow: "hidden", background: "rgba(10,11,17,.78)" }}>
        {rows.map((r, i) => {
          const p = progress(t, 0.3 + i * 0.16, 0.55, easeOutCubic);
          return (
            <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderBottom: i < 4 ? "1px solid rgba(255,255,255,.055)" : undefined, opacity: p, transform: `translateY(${(1 - p) * 10}px)` }}>
              <div style={{ width: 260 }}>
                <div style={{ fontSize: 17, fontWeight: 600 }}>{r.name}</div>
                <div className="mono" style={{ fontSize: 8.5, color: "rgba(255,255,255,.3)", marginTop: 3 }}>{r.sub}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="mono" style={{ fontSize: 13, color: r.color, letterSpacing: ".02em" }}>{r.versions}</div>
                <div style={{ height: 3, borderRadius: 3, background: "rgba(255,255,255,.06)", marginTop: 8 }}>
                  <div style={{ width: `${60 + i * 8}%`, height: "100%", background: r.color, opacity: 0.6 }} />
                </div>
              </div>
              <div className="mono" style={{ fontSize: 8.5, color: r.color, border: `1px solid ${r.color}33`, background: `${r.color}0a`, padding: "5px 8px", borderRadius: 4, whiteSpace: "nowrap" }}>{r.action}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <span className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,.26)", letterSpacing: ".08em" }}>系统升级 ≠ 依赖升级</span>
        <span className="mono" style={{ fontSize: 9, color: "rgba(255,196,102,.55)", letterSpacing: ".08em" }}>· 用 Go 编好的程序，必须重新构建</span>
      </div>
    </div>
  );
}

function CleanupPanel({ t }: { t: number }) {
  const items = [
    ["旧容器镜像", "base image 里的 CA 包"],
    ["旧安装包", "三年前下载的 .dmg / .exe"],
    ["停更软件", "不再发版的客户端"],
    ["IoT / 嵌入式", "固件里的信任库"],
  ];
  return (
    <div style={{ width: 1000 }}>
      <div className="mono" style={{ fontSize: 9.5, color: "rgba(255,196,102,.65)", letterSpacing: ".14em" }}>CLEAN UP · REPLACE</div>
      <div style={{ fontSize: 34, fontWeight: 600, marginTop: 8 }}>清理那些“不会自己更新”的东西</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 24 }}>
        {items.map(([a, b], i) => {
          const p = progress(t, 0.5 + i * 0.16, 0.55, easeOutCubic);
          return (
            <div key={a} style={{ padding: "20px 20px", borderRadius: 12, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.025)", opacity: p, transform: `translateY(${(1 - p) * 12}px)`, position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{a}</div>
                <span className="mono" style={{ fontSize: 8, color: "#ff8ba0", border: "1px solid rgba(255,92,122,.25)", padding: "3px 5px", borderRadius: 3 }}>STALE</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.32)", marginTop: 7 }}>{b}</div>
              <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8, color: "rgba(255,196,102,.65)", fontFamily: "var(--mono)", fontSize: 9 }}>
                <span>→</span><span>替换 / 重建 / 下线</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 20, fontSize: 16, color: "rgba(255,255,255,.42)" }}>不要等上游；先把自己能控制的那一环，换掉。</div>
    </div>
  );
}

function AlarmsPanel({ t }: { t: number }) {
  const items = [
    ["CRL", "证书吊销列表"],
    ["OCSP", "在线吊销查询"],
    ["Pinning", "证书固定"],
    ["CT", "证书透明度监控"],
  ];
  return (
    <div style={{ width: 1000 }}>
      <div className="mono" style={{ fontSize: 9.5, color: "rgba(69,224,160,.65)", letterSpacing: ".14em" }}>DON&apos;T TURN THEM OFF</div>
      <div style={{ fontSize: 34, fontWeight: 600, marginTop: 8 }}>它们不是兼容性负担，是报警器</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 24 }}>
        {items.map(([a, b], i) => {
          const p = progress(t, 0.4 + i * 0.14, 0.55, easeOutCubic);
          return (
            <div key={a} style={{ padding: "20px 20px", borderRadius: 12, border: "1px solid rgba(69,224,160,.16)", background: "rgba(69,224,160,.035)", opacity: p, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 600 }}>{a}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.32)", marginTop: 4 }}>{b}</div>
              </div>
              <div style={{ width: 46, height: 25, borderRadius: 99, background: "rgba(69,224,160,.2)", border: "1px solid rgba(69,224,160,.35)", position: "relative" }}>
                <div style={{ position: "absolute", right: 2, top: 2, width: 19, height: 19, borderRadius: "50%", background: "#68edb8", boxShadow: "0 0 12px rgba(69,224,160,.4)" }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 20, fontSize: 16, color: "rgba(255,255,255,.42)" }}>为了“兼容”把校验关掉，等于把报警器拆了，然后继续睡觉。</div>
    </div>
  );
}

function UntrustedPanel({ t }: { t: number }) {
  return (
    <div style={{ width: 1000, display: "flex", alignItems: "center", gap: 60 }}>
      <div style={{ position: "relative", width: 420, height: 360, display: "grid", placeItems: "center" }}>
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(255,92,122,.15)", background: "radial-gradient(circle, rgba(255,92,122,.06), transparent 65%)" }} />
        <WifiGlyph size={150} color="#ff5c7a" />
        <div style={{ position: "absolute", width: 220, height: 2, background: "rgba(255,92,122,.7)", transform: "rotate(-38deg)", boxShadow: "0 0 18px rgba(255,92,122,.4)" }} />
        <div className="mono" style={{ position: "absolute", bottom: 10, fontSize: 10, color: "rgba(255,92,122,.6)", letterSpacing: ".18em" }}>UNTRUSTED NETWORK</div>
      </div>
      <div style={{ flex: 1 }}>
        <div className="mono" style={{ fontSize: 9.5, color: "rgba(255,92,122,.65)", letterSpacing: ".14em" }}>PUBLIC WI-FI</div>
        <div style={{ fontSize: 36, fontWeight: 600, marginTop: 10, lineHeight: 1.35 }}>别在不可信的网络里，<br />做敏感操作。</div>
        <div style={{ marginTop: 24 }}>
          {["不登录网银 / 交易所", "不传敏感文件 / 凭据", "不连陌生热点", "警惕 ARP / DNS 劫持"].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", opacity: progress(t, 0.5 + i * 0.12, 0.5) }}>
              <span style={{ color: "#ff8ba0", fontSize: 12 }}>✕</span>
              <span style={{ fontSize: 16, color: "rgba(255,255,255,.55)" }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChainLink({ label, color, weak }: { label: string; color: string; weak?: number }) {
  return (
    <div style={{ width: 230, height: 120, borderRadius: 20, border: `2px solid ${weak && weak > 0.3 ? "#ff5c7a" : color}`, background: weak && weak > 0.3 ? "rgba(40,14,22,.7)" : `${color}0d`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 0 ${weak && weak > 0.3 ? 40 : 24}px ${weak && weak > 0.3 ? "rgba(255,92,122,.18)" : `${color}12`}`, position: "relative" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: weak && weak > 0.3 ? "#ff5c7a" : color, boxShadow: `0 0 10px ${weak && weak > 0.3 ? "#ff5c7a" : color}` }} />
      <span style={{ fontSize: 16, fontWeight: 500, color: "rgba(255,255,255,.78)" }}>{label}</span>
      <span className="mono" style={{ fontSize: 8, color: "rgba(255,255,255,.26)", letterSpacing: ".1em" }}>{weak && weak > 0.3 ? "WEAKEST LINK" : "UPDATED"}</span>
    </div>
  );
}

export function C6Update() {
  const { at, local, chapter } = useChapter();
  const T = {
    b1: at("c6_b1"), b2: at("c6_b2"), b3: at("c6_b3"), b4: at("c6_b4"),
    b5: at("c6_b5"), b6: at("c6_b6"), b7: at("c6_b7"), b8: at("c6_b8"),
    b9: at("c6_b9"), b10: at("c6_b10"),
  };
  const done1 = progress(local, T.b2 + 1.2, 0.6);
  const done2 = progress(local, T.b3 + 5.0, 0.6);
  const done3 = progress(local, T.b4 + 3.0, 0.6);
  const done4 = progress(local, T.b5 + 3.0, 0.6);
  const done5 = progress(local, T.b6 + 3.0, 0.6);
  const allDone = Math.min(done1, done2, done3, done4, done5);
  const chain = progress(local, T.b7, 0.8);
  const repair = progress(local, T.b8, 1.2, easeInOutCubic);
  const finale = progress(local, T.b9, 0.9, easeInOutCubic);
  const endcard = progress(local, T.b10 + 4.0, 1.0, easeInOutCubic);

  return (
    <div className="scene" style={{ padding: 0 }}>
      <div style={{ opacity: 1 - progress(local, T.b7, 0.55, easeInOutCubic) }}> 
        <div style={{ position: "absolute", left: 96, top: 104 }}>
          <div className="kicker" style={{ color: "rgba(69,224,160,.7)" }}>NOW PATCH</div>
          <div className="display" style={{ fontSize: 54, marginTop: 10 }}>现在，去更新</div>
          <div style={{ fontSize: 18, color: "rgba(255,255,255,.4)", marginTop: 8 }}>把信任链上的每一环，都更新到最新。</div>
        </div>
        <div style={{ position: "absolute", left: 96, top: 246, width: 500 }}>
          <CheckItem index="01" label="系统与浏览器" note="但 macOS 27.2 的 curl 仍是旧的" active={progress(local, T.b1, 0.5)} done={done1} at={T.b1} t={local} />
          <CheckItem index="02" label="工具链与依赖" note="Go / Python / Rust / Node / Electron" active={progress(local, T.b3, 0.5)} done={done2} at={T.b1 + 0.1} t={local} />
          <CheckItem index="03" label="旧容器 / 停更软件" note="不会自己更新的东西，先换掉" active={progress(local, T.b4, 0.5)} done={done3} at={T.b1 + 0.2} t={local} />
          <CheckItem index="04" label="CRL / OCSP / Pinning / CT" note="别为了兼容，把报警器关掉" active={progress(local, T.b5, 0.5)} done={done4} at={T.b1 + 0.3} t={local} />
          <CheckItem index="05" label="不可信网络" note="公共 Wi-Fi 上，不做敏感操作" active={progress(local, T.b6, 0.5)} done={done5} at={T.b1 + 0.4} t={local} />
          <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 10, opacity: allDone }}>
            <span style={{ color: "#68edb8", fontSize: 14 }}>✓</span>
            <span className="mono" style={{ fontSize: 10, color: "rgba(104,237,184,.7)", letterSpacing: ".12em" }}>ALL LINKS PATCHED · 2026.10</span>
          </div>
        </div>

        <Act from={T.b1} to={T.b3 + 0.2} fade={0.5}>
          <div style={{ position: "absolute", left: 700, top: 188 }}>
            <MacUpdate t={local - T.b1} at={T.b2} />
          </div>
        </Act>
        <Act from={T.b3} to={T.b4 + 0.2} fade={0.5}>
          <div style={{ position: "absolute", left: 700, top: 200 }}>
            <VersionBoard t={local - T.b3} />
          </div>
        </Act>
        <Act from={T.b4} to={T.b6 + 0.2} fade={0.5}>
          <div style={{ position: "absolute", left: 700, top: 230 }}>
            {local < T.b5 ? <CleanupPanel t={local - T.b4} /> : <AlarmsPanel t={local - T.b5} />}
          </div>
        </Act>
        <Act from={T.b6} to={T.b7 + 0.2} fade={0.5}>
          <div style={{ position: "absolute", left: 700, top: 280 }}>
            <UntrustedPanel t={local - T.b6} />
          </div>
        </Act>
      </div>

      {/* chain + finale */}
      <Act from={T.b7} to={chapter.duration + 0.1} fade={0.7}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(69,224,160,${0.03 + repair * 0.04}), transparent 70%)` }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 118, textAlign: "center", opacity: chain }}>
            <div className="kicker" style={{ justifyContent: "center", color: "rgba(69,224,160,.75)" }}>TRUST IS A CHAIN</div>
            <div className="display" style={{ fontSize: 56, marginTop: 14 }}>信任不是一道门，是一条链。</div>
            <div style={{ fontSize: 22, color: "rgba(255,255,255,.42)", marginTop: 12, opacity: repair }}>而一条链的强度，永远取决于最落后的那一环。</div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 420, display: "flex", justifyContent: "center", alignItems: "center", gap: 16, opacity: chain }}>
            {["系统", "浏览器", "工具链", "Electron", "旧容器"].map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <ChainLink label={s} color={i === 4 ? (repair > 0.5 ? "#45e0a0" : "#ff5c7a") : ["#45e0a0", "#4fe3ff", "#b9a7ff", "#ffc466", "#ff5c7a"][i]} weak={i === 4 ? 1 - repair : 0} />
                {i < 4 && (
                  <div style={{ width: 34, height: 2, background: `linear-gradient(90deg, ${i === 4 ? "rgba(255,92,122,.5)" : "rgba(255,255,255,.2)"}, ${i === 4 ? "rgba(255,92,122,.5)" : "rgba(255,255,255,.2)"})`, opacity: 0.8 }} />
                )}
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 620, textAlign: "center", opacity: progress(local, T.b8 + 0.8, 0.8) }}>
            {repair > 0.5 ? (
              <span className="mono" style={{ fontSize: 10, color: "rgba(104,237,184,.7)", letterSpacing: ".2em" }}>WEAKEST LINK REPLACED · CHAIN INTACT</span>
            ) : (
              <span className="mono" style={{ fontSize: 10, color: "rgba(255,92,122,.65)", letterSpacing: ".2em" }}>ONE OLD LINK IS ENOUGH</span>
            )}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 740, textAlign: "center", opacity: finale }}>
            <div className="display" style={{ fontSize: 76, letterSpacing: "-.05em" }}>
              现在，<span style={{ color: "#68edb8" }}>去更新。</span>
            </div>
            <div style={{ fontSize: 20, color: "rgba(255,255,255,.4)", marginTop: 18, opacity: progress(local, T.b10, 0.8) }}>
              别等出事，才想起那台三年没重启的电脑。
            </div>
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#05060a", opacity: endcard, zIndex: 20 }}>
            <div style={{ position: "absolute", width: 900, height: 520, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(109,77,240,.14), transparent 68%)", filter: "blur(40px)" }} />
            <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <LogoMark size={86} />
              <div style={{ fontSize: 48, fontWeight: 700, marginTop: 22, letterSpacing: "-.045em", color: "#fff" }}>Distrust</div>
              <div className="mono" style={{ fontSize: 11, color: "rgba(185,167,255,.7)", letterSpacing: ".34em", marginTop: 10 }}>DON&apos;T TRUST ANYONE</div>
              <div style={{ display: "flex", gap: 18, alignItems: "center", marginTop: 40 }}>
                <span className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,.42)", letterSpacing: ".14em" }}>del.wang</span>
                <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,.3)" }} />
                <span className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,.42)", letterSpacing: ".14em" }}>2026.10</span>
              </div>
              <div style={{ marginTop: 34, padding: "9px 16px", borderRadius: 99, border: "1px solid rgba(69,224,160,.25)", background: "rgba(69,224,160,.05)", color: "#68edb8", fontSize: 14, letterSpacing: ".04em" }}>
                现在，去更新。
              </div>
            </div>
            <div className="mono" style={{ position: "absolute", bottom: 50, fontSize: 8.5, color: "rgba(255,255,255,.22)", letterSpacing: ".08em", textAlign: "center", lineHeight: 1.9 }}>
              本视频仅用于安全科普与已授权测试。演示数据均为虚构。<br />
              ARP 劫持与证书解密会直接影响他人的网络，请勿在未授权环境中使用。
            </div>
          </div>
        </div>
      </Act>
    </div>
  );
}
