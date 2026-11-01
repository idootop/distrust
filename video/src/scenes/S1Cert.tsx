import type { CSSProperties, ReactNode } from "react";
import { useChapter } from "../lib/ChapterContext";
import { clamp01, easeInOutCubic, easeOutBack, easeOutCubic, progress, spring } from "../lib/time";
import { Certy, Keyy, Locky, PhoneBaddie } from "../components/mascots";
import { Seal } from "../components/cert";
import { LockGlyph } from "../components/devices";
import { BitGrid } from "../components/visuals";
import { Bokeh, BigWord, Spotlight, Vignette, World } from "../components/worlds";

function Act({ from, to, children, style }: { from: number; to: number; children: ReactNode; fade?: number; style?: CSSProperties }) {
  const { local } = useChapter();
  if (local < from || local >= to) return null;
  return <div style={{ position: "absolute", inset: 0, ...style }}>{children}</div>;
}

function BrowserBuddy({ t, size = 500 }: { t: number; size?: number }) {
  const blink = Math.abs(Math.sin(t * 1.7)) > 0.96 ? 0.1 : 1;
  return (
    <div style={{ width: size, borderRadius: 20, border: "1px solid rgba(255,255,255,.16)", background: "#0b0c12", boxShadow: "0 40px 120px rgba(0,0,0,.5)", overflow: "hidden" }}>
      <div style={{ height: 44, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.7 }} />)}
        <div className="mono" style={{ marginLeft: 10, fontSize: 9, color: "rgba(255,255,255,.3)" }}>search.example</div>
        <span style={{ flex: 1 }} />
        <span className="mono" style={{ fontSize: 8, color: "#68edb8" }}>HTTPS</span>
      </div>
      <div style={{ padding: "26px 30px", display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 30, fontWeight: 600, color: "rgba(255,255,255,.85)" }}>我的账户</div>
          <div className="mono" style={{ fontSize: 13, color: "rgba(255,255,255,.35)", marginTop: 8 }}>¥ 1,280,000.00</div>
          <div style={{ height: 8, borderRadius: 6, background: "rgba(255,255,255,.08)", marginTop: 22, width: "80%" }} />
          <div style={{ height: 8, borderRadius: 6, background: "rgba(255,255,255,.05)", marginTop: 10, width: "55%" }} />
        </div>
        <div style={{ position: "relative", width: 150, height: 150 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle, rgba(69,224,160,.16), transparent 65%)" }} />
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <LockGlyph size={104} color="#45e0a0" />
          </div>
        </div>
      </div>
    </div>
  );
}

function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: 660, height: 460, borderRadius: 18, overflow: "hidden", background: "linear-gradient(160deg,#1b2230,#080b10)", border: "2px solid rgba(180,220,255,.22)", boxShadow: "0 50px 110px rgba(0,0,0,.6), 0 0 80px rgba(79,227,255,.06)" }}>
      <div style={{ height: 46, display: "flex", alignItems: "center", gap: 10, padding: "0 18px", borderBottom: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.025)" }}>
        <LockGlyph size={20} color="#45e0a0" />
        <div style={{ flex: 1, height: 26, borderRadius: 7, background: "rgba(255,255,255,.055)", border: "1px solid rgba(255,255,255,.06)", display: "flex", alignItems: "center", padding: "0 12px", fontFamily: "var(--mono)", fontSize: 12, color: "rgba(255,255,255,.45)", letterSpacing: ".04em" }}>search.example</div>
      </div>
      <div style={{ height: "calc(100% - 46px)", display: "grid", placeItems: "center", padding: 22 }}>{children}</div>
    </div>
  );
}

function BankCard({ t }: { t: number }) {
  return (
    <div style={{ width: 540 }}>
      <div style={{ width: "100%", height: 330, borderRadius: 26, background: "linear-gradient(145deg, #223044, #0a0f16 62%, #06080c)", border: "2px solid rgba(180,220,255,.22)", boxShadow: "0 50px 110px rgba(0,0,0,.6), 0 0 80px rgba(79,227,255,.06)", padding: "30px 34px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(125deg, rgba(255,255,255,.12), transparent 28%, transparent 72%, rgba(79,227,255,.06))" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg,#4fe3ff,#6d4df0)" }} />
            <span style={{ fontSize: 15, letterSpacing: ".16em", color: "rgba(255,255,255,.6)" }}>示例银行</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            
            <LockGlyph size={26} color="#45e0a0" />
          </div>
        </div>
        <div style={{ marginTop: 46, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)", letterSpacing: ".12em" }}>可用余额</div>
            <div className="mono" style={{ fontSize: 46, color: "rgba(255,255,255,.9)", letterSpacing: "-.03em", marginTop: 4 }}>¥ 1,280,000</div>
          </div>
          <div style={{ width: 56, height: 42, borderRadius: 8, background: "linear-gradient(135deg,#d8c08a,#8f7440)", border: "1px solid rgba(255,255,255,.3)", boxShadow: "inset 0 0 12px rgba(0,0,0,.25)" }} />
        </div>
        <div style={{ position: "absolute", left: 34, right: 34, bottom: 26, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="mono" style={{ fontSize: 12, color: "rgba(255,255,255,.32)", letterSpacing: ".16em" }}>•••• 8842</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,.3)" }}>DEL WANG</span>
        </div>
      </div>
    </div>
  );
}

function ChainIcon({ type, color }: { type: "root" | "van" | "shop"; color: string }) {
  return (
    <svg width="86" height="86" viewBox="0 0 100 100" fill="none">
      {type === "root" && (
        <g stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 38 L50 16 L84 38" />
          <path d="M22 42 h56 v42 H22 z" />
          <path d="M34 46 v34 M50 46 v34 M66 46 v34" opacity=".6" />
          <path d="M16 84 h68" />
        </g>
      )}
      {type === "van" && (
        <g stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 32 h44 v40 H14 z" />
          <path d="M58 46 h18 l10 12 v14 H58 z" />
          <circle cx="30" cy="78" r="8" />
          <circle cx="72" cy="78" r="8" />
        </g>
      )}
      {type === "shop" && (
        <g stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 38 L26 22 h48 l8 16" />
          <path d="M22 38 v42 h56 V38" />
          <path d="M40 80 V56 h20 v24" />
          <path d="M26 38 h48" opacity=".6" />
        </g>
      )}
    </svg>
  );
}

function Stamp({ hit }: { hit: number }) {
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, display: "flex", justifyContent: "center", pointerEvents: "none", transform: `translateY(${-340 + hit * 520}px) rotate(${-8 + hit * 8}deg)`, opacity: 1 - Math.max(0, hit - 0.92) * 12 }}>
      <div style={{ position: "relative", width: 210, height: 210, borderRadius: "50%", border: "4px solid rgba(180,85,46,.85)", background: "rgba(255,240,215,.9)", display: "grid", placeItems: "center", boxShadow: "0 30px 60px rgba(0,0,0,.3)" }}>
        <div style={{ position: "absolute", inset: 14, borderRadius: "50%", border: "2px dashed rgba(180,85,46,.6)" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--serif)", fontSize: 54, fontWeight: 700, color: "rgba(150,65,35,.9)", lineHeight: 1 }}>CA</div>
          <div className="mono" style={{ fontSize: 9, letterSpacing: ".16em", color: "rgba(150,65,35,.65)", marginTop: 6 }}>VERIFIED</div>
        </div>
      </div>
    </div>
  );
}

function Randomness({ t, at }: { t: number; at: number }) {
  const p = progress(t, at, 0.5);
  const weak = progress(t, at + 1.1, 0.6);
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 55% at 50% 48%, #101a2c, #05070c 72%)", display: "grid", placeItems: "center" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.5, backgroundImage: "radial-gradient(rgba(139,238,255,.3) 1px, transparent 1px)", backgroundSize: "46px 46px", WebkitMaskImage: "radial-gradient(ellipse 60% 55% at 50% 48%, #000 20%, transparent 78%)", maskImage: "radial-gradient(ellipse 60% 55% at 50% 48%, #000 20%, transparent 78%)" }} />
      <div style={{ position: "relative", width: 760, height: 508, opacity: p }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(24, 26px)", gridTemplateRows: "repeat(16, 26px)", gap: 4 }}>
          {Array.from({ length: 384 }, (_, i) => {
            const on = Math.sin(t * 4 + i * 0.37) > 0;
            const hot = weak > 0.4 && i > 360;
            return <div key={i} style={{ width: 26, height: 26, borderRadius: 3, background: hot ? "rgba(255,92,122,.3)" : on ? "rgba(79,227,255,.22)" : "rgba(255,255,255,.025)", border: `1px solid ${hot ? "rgba(255,92,122,.55)" : "rgba(79,227,255,.12)"}`, boxShadow: hot ? "0 0 12px rgba(255,92,122,.2)" : undefined }} />;
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: "50%", textAlign: "center", transform: "translateY(-50%)", fontSize: 92, fontWeight: 800, color: "rgba(255,255,255,.9)", textShadow: "0 0 50px rgba(79,227,255,.3)", letterSpacing: ".1em" }}>随机性</div>
      </div>
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, opacity: weak }}>
        <path d="M960 180 L930 420 L980 560 L900 760 L970 940" fill="none" stroke="rgba(255,92,122,.5)" strokeWidth="3" />
        <path d="M930 420 L760 500 M980 560 L1180 500 M900 760 L720 830" fill="none" stroke="rgba(255,92,122,.28)" strokeWidth="2" />
      </svg>
    </div>
  );
}

function SearchPage() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#f5f6f8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
      <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: "-.05em", fontFamily: "Inter, sans-serif" }}>
        <span style={{ color: "#4285f4" }}>S</span><span style={{ color: "#ea4335" }}>e</span><span style={{ color: "#fbbc05" }}>a</span><span style={{ color: "#4285f4" }}>r</span><span style={{ color: "#34a853" }}>c</span><span style={{ color: "#ea4335" }}>h</span>
      </div>
      <div style={{ width: 380, height: 48, borderRadius: 24, background: "#fff", border: "1px solid #dfe1e5", boxShadow: "0 2px 10px rgba(0,0,0,.08)", display: "flex", alignItems: "center", gap: 10, padding: "0 16px" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.5" stroke="#9aa0a6" strokeWidth="2" /><path d="M16 16l5 5" stroke="#9aa0a6" strokeWidth="2" strokeLinecap="round" /></svg>
        <span style={{ fontSize: 15, color: "#9aa0a6" }}>搜索</span>
      </div>
    </div>
  );
}

function Key384({ t }: { t: number }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 50% at 50% 48%, #141126, #05060a 72%)" }}>
      <div style={{ position: "absolute", left: 300, top: 220, opacity: 0.22 }}>
        <BitGrid rows={16} cols={24} cell={18} gap={3} t={t} seed={19} mode="random" />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center" }}>
        <Keyy size={520} t={t} color="#b9a7ff" />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center" }}>
        <div style={{ fontSize: 56, fontWeight: 700, color: "#fff" }}>384 位</div>
      </div>
    </div>
  );
}

function WeakKey({ t, at }: { t: number; at: number }) {
  const p = 1;
  const open = progress(t, at + 0.9, 0.4);
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 50% at 50% 48%, #1c0c12, #05060a 72%)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 140, textAlign: "center", opacity: p }}>
        <div style={{ fontSize: 56, fontWeight: 700, color: "#fff" }}>实际只有 8 位</div>
      </div>
      <div style={{ position: "absolute", left: "50%", top: 300, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 46, opacity: p }}>
        <div style={{ display: "flex", gap: 14 }}>
          {[4, 56, 66, 115, 155, 156, 230, 237].map((n, i) => {
            const q = spring(t, at - 0.1 + i * 0.04, { stiffness: 160, damping: 15 });
            return <span key={n} className="mono" style={{ fontSize: 54, color: "#ffd0d8", opacity: clamp01(q), transform: `translateY(${(1 - q) * 20}px)` }}>{n}</span>;
          })}
        </div>
        <div style={{ position: "relative", width: 220, height: 240, display: "grid", placeItems: "center" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle, rgba(69,224,160,.18), transparent 68%)", opacity: open }} />
          <LockGlyph size={190} color={open > 0.4 ? "#68edb8" : "#ffc466"} open={open} />
          <div style={{ position: "absolute", width: 180 + open * 70, height: 180 + open * 70, borderRadius: "50%", border: `2px solid rgba(69,224,160,${0.5 * (1 - open)})`, opacity: 1 - open }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 620, textAlign: "center", opacity: p }}>
        <span className="mono" style={{ fontSize: 24, color: "rgba(255,140,160,.6)" }}>0.003 秒</span>
      </div>
    </div>
  );
}

function Domains({ t, at }: { t: number; at: number }) {
  const bank = progress(t, at + 1.25, 0.6, easeOutCubic);
  const domains = ["bank.com", "mail.com", "shop.com", "pay.com", "cloud.com", "video.com", "gov.com"];
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 58% 52% at 50% 46%, #1a1710, #05060a 72%)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 395, display: "flex", justifyContent: "center", gap: 20 }}>
        {domains.map((s, i) => {
          const d = Math.abs(i - 3);
          const p = spring(t, at - 0.22 + d * 0.08, { stiffness: 100, damping: 15 });
          const baseX = (i - 3) * 205;
          return (
            <div key={s} style={{ width: 190, height: 128, flexShrink: 0, borderRadius: 9, background: "linear-gradient(165deg,#f6e8d0,#cdb58b)", color: "#3a2a18", padding: "14px 16px", opacity: clamp01(p), transform: `translate(${(1 - p) * -baseX}px, ${(1 - p) * 40 + Math.sin(t * 1.8 + i) * 3}px) scale(${0.4 + p * 0.6}) rotate(${-8 + i * 2.4}deg)`, boxShadow: "0 26px 56px rgba(0,0,0,.45)", position: "relative", willChange: "transform" }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", border: "2.5px solid rgba(160,30,55,.65)", display: "grid", placeItems: "center", position: "absolute", right: 10, bottom: 10, transform: "rotate(-12deg)", color: "rgba(160,30,55,.85)", fontSize: 11, fontWeight: 700 }}>伪造</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 19, marginTop: 6 }}>{s}</div>
              <div style={{ width: 64, height: 2, borderRadius: 2, background: "rgba(60,40,20,.25)", marginTop: 10 }} />
              <div style={{ width: 96, height: 2, borderRadius: 2, background: "rgba(60,40,20,.18)", marginTop: 7 }} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: "50%", top: 650, width: 360, height: 210, borderRadius: 18, background: "linear-gradient(145deg,#263244,#0c1118 62%,#070a0e)", border: "2px solid rgba(180,220,255,.2)", padding: "22px 26px", boxShadow: "0 40px 90px rgba(0,0,0,.5)", opacity: bank, transform: `translateX(-50%) translateY(${(1 - bank) * 60}px) scale(${0.86 + bank * 0.14}) rotate(${4 - bank * 4}deg)` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, letterSpacing: ".12em", color: "rgba(255,255,255,.45)" }}>
          <span>示例银行</span>
          <LockGlyph size={20} color="#45e0a0" />
        </div>
        <div className="mono" style={{ fontSize: 32, marginTop: 36, color: "rgba(255,255,255,.85)" }}>¥ 1,280,000</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, fontSize: 11, color: "rgba(255,255,255,.35)" }}><span>DEL WANG</span><span>•••• 8842</span></div>
      </div>
    </div>
  );
}


export function S1Cert() {
  const { local, at, chapter } = useChapter();
  const c1 = at("c1"), c2 = at("c2"), c3 = at("c3"), c4 = at("c4"), c5 = at("c5"), c6 = at("c6"), c7 = at("c7"), c8 = at("c8"), c9 = at("c9");
  const reveal = progress(local, c2 - 0.2, 0.7);
  const zoom = progress(local, c2, 1.0, easeInOutCubic);
  const stamp = progress(local, c3 - 0.2, 0.5, easeOutBack);
  const slam = Math.exp(-Math.max(0, local - c3 - 0.25) * 9) * (local > c3 + 0.2 ? 1 : 0);
  const shake = slam * Math.sin(local * 90) * 10;
  const steal = progress(local, c4 + 0.4, 0.8, easeInOutCubic);
  const fan = progress(local, c6, 0.8, easeOutCubic);
  const chain = progress(local, c6, 0.8, easeOutCubic);
  const keyP = progress(local, c7, 0.8);
  const focus = progress(local, c1 + 0.4, 1.1, easeInOutCubic);

  return (
    <div className="scene" style={{ padding: 0 }}>
      <World variant="passport">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(60,45,25,.16), rgba(5,6,10,.2) 55%, rgba(5,6,10,.7))" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 760, opacity: 0.35, backgroundImage: "linear-gradient(90deg, rgba(255,220,170,.05) 1px, transparent 1px)", backgroundSize: "190px 100%" }} />
        <div style={{ position: "absolute", right: 70, top: 70, opacity: 0.1 }}>
          <Seal size={300} color="#ffd28a" label="CA" rotate={12} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 280, background: "linear-gradient(180deg, rgba(48,36,24,.75), rgba(13,11,9,.98))", borderTop: "1px solid rgba(255,220,170,.12)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 250, height: 3, background: "linear-gradient(90deg, transparent, rgba(255,220,170,.2), transparent)" }} />
        <Bokeh count={16} seed={21} t={local} color="rgba(255,220,160,.1)" />
        <Spotlight x={960} y={420} size={1100} color="rgba(255,230,190,.08)" />
        <Vignette strength={0.55} />
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${shake}px)` }}>
          {/* Act A: ID check + stamp */}
          <Act from={0} to={c4}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 92, textAlign: "center" }}>
              
              <div style={{ fontSize: 64, fontWeight: 700, color: "#fff2dc", marginTop: 12, letterSpacing: "-.04em" }}>它只认章，不认人</div>
            </div>
            <div style={{ position: "absolute", left: 150, top: 240, transform: `scale(${0.98 + zoom * 0.02 + progress(local, c1, 1.0) * 0.05})`, transformOrigin: "0% 0%", opacity: 1 - zoom * 0.35 }}>
              <BrowserFrame><SearchPage /></BrowserFrame>
            </div>
            <div style={{ position: "absolute", left: 163, top: 248, width: 30, height: 30, borderRadius: "50%", border: "2px solid rgba(69,224,160,.6)", boxShadow: "0 0 20px rgba(69,224,160,.25)", opacity: progress(local, c1, 0.3) * (1 - progress(local, c2 - 0.1, 0.4)) }} />
            <div style={{ position: "absolute", left: 790, top: 300, transform: `scale(${1 + zoom * 0.55}) rotate(${zoom * 2}deg)`, opacity: reveal }}>
              <Certy size={430} t={local} stamp={stamp} sealLabel="CA" />
            </div>
            <div style={{ position: "absolute", left: 1330, top: 300, opacity: reveal }}>
              <Locky size={330} mood={stamp > 0.7 ? "happy" : "proud"} t={local} color="#45e0a0" wave={stamp > 0.7 ? 1 : 0} />
            </div>
            <Stamp hit={stamp} />
            {stamp > 0.8 && (
              <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", opacity: slam, transform: `scale(${1 + slam * 0.2})` }}>
                <span style={{ fontSize: 42, color: "#68edb8", fontWeight: 700 }}>通过 ✓</span>
              </div>
            )}
            
          </Act>

          {/* Act B: conveyor + stamp stolen */}
          <Act from={c4} to={c5}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 100, textAlign: "center" }}>
              
              <div style={{ fontSize: 54, fontWeight: 700, color: "#fff2dc", marginTop: 10 }}>一排身份证，一个章</div>
            </div>
            <div style={{ position: "absolute", left: 110, right: 110, top: 620, height: 22, borderRadius: 11, background: "linear-gradient(180deg,#3b3124,#1a1611)", boxShadow: "0 12px 30px rgba(0,0,0,.4)" }} />
            {[0, 1, 2, 3, 4].map((i) => {
              const x = 180 + i * 330 + Math.sin(local * 0.8 + i) * 8;
              return (
                <div key={i} style={{ position: "absolute", left: x, top: 430 + (i % 2) * 10, transform: `rotate(${-4 + i * 2}deg)`, opacity: 0.55 + (i === 2 ? 0.45 : 0) }}>
                  <Certy size={260} t={local + i} stamp={i === 0 ? 0.2 : 1} fake={i === 2 ? 1 : 0} sealLabel="CA" />
                </div>
              );
            })}
            <div style={{ position: "absolute", right: 40, top: 250, transform: `translate(${steal * -160}px, ${-steal * 180}px) rotate(${steal * 24}deg)`, opacity: steal }}>
              <Seal size={160} color="#ffc466" label="CA" rotate={20} />
            </div>
          </Act>

          {/* Act C: 8 certs + subcontractor chain */}
          <Act from={c5} to={c7}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 100, textAlign: "center" }}>
              <div style={{ fontSize: 58, fontWeight: 700, color: "#fff2dc", marginTop: 10 }}>8 张中间证书</div>
            </div>
            <div style={{ position: "absolute", left: 120, top: 210, display: "flex", alignItems: "center", gap: 12, opacity: 0.5 }}>
              <svg width="34" height="42" viewBox="0 0 34 42"><path d="M17 40 C 6 27, 2 20, 2 14 A 15 15 0 0 1 32 14 C 32 20, 28 27, 17 40 Z" fill="none" stroke="#ffc466" strokeWidth="2" /><circle cx="17" cy="14" r="5" fill="#ffc466" /></svg>
              <span style={{ fontSize: 30, color: "rgba(255,220,170,.75)" }}>印度 · eMudhra</span>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", gap: -10 }}>
              {Array.from({ length: 8 }, (_, i) => {
                const p = spring(local, c5 - 0.1 + i * 0.02, { stiffness: 170, damping: 16 });
                const angle = -24 + i * 6.5;
                return (
                  <div key={i} style={{ position: "absolute", left: 470 + i * 128, top: 70 + Math.abs(i - 3.5) * 34, transform: `rotate(${angle}deg) translateY(${(1 - p) * 50}px)`, opacity: clamp01(p) }}>
                    <Certy size={260} t={local + i} stamp={1} sealLabel="CA" />
                  </div>
                );
              })}
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 620, display: "flex", justifyContent: "center", alignItems: "center", gap: 40, opacity: chain }}>
              {[
                { label: "根", icon: "root", color: "#45e0a0", bad: false },
                { label: "中间", icon: "van", color: "#ff5c7a", bad: true },
                { label: "网站", icon: "shop", color: "#b9a7ff", bad: false },
              ].map((s, i) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 40 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: 160, height: 160, borderRadius: "50%", border: `2px solid ${s.color}77`, background: `${s.color}0e`, display: "grid", placeItems: "center", position: "relative", boxShadow: s.bad ? "0 0 60px rgba(255,92,122,.18)" : "none" }}>
                      <ChainIcon type={s.icon as "root" | "van" | "shop"} color={s.color} />
                      {s.bad && <div style={{ position: "absolute", inset: -8, borderRadius: "50%", border: "2px dashed rgba(255,92,122,.5)" }} />}
                    </div>
                    <div style={{ fontSize: 22, color: s.bad ? "#ff8ba0" : "rgba(255,240,215,.75)", marginTop: 12 }}>{s.label}</div>
                  </div>
                  {i < 2 && <div style={{ width: 90, height: 2, background: i === 1 ? "rgba(255,92,122,.5)" : "rgba(255,240,215,.25)", transform: i === 1 ? "rotate(-8deg)" : undefined }} />}
                </div>
              ))}
            </div>

          </Act>

          <Act from={c7} to={c8}>
            <Key384 t={local} />
          </Act>

          <Act from={c8} to={c9}>
            <WeakKey t={local} at={c8} />
          </Act>

          <Act from={c9} to={chapter.duration + 0.1}>
            <Domains t={local} at={c9} />
          </Act>
        </div>
      </World>
    </div>
  );
}
