import type { CSSProperties, ReactNode } from "react";
import { useChapter } from "../lib/ChapterContext";
import { clamp01, easeInOutCubic, easeOutBack, easeOutCubic, progress, spring } from "../lib/time";
import { Locky } from "../components/mascots";
import { BitGrid } from "../components/visuals";
import { SpeedLines, Starfield, Vignette, World } from "../components/worlds";

function Act({ from, to, children, fade = 0.35, style }: { from: number; to: number; children: ReactNode; fade?: number; style?: CSSProperties }) {
  const { local } = useChapter();
  const o = Math.min(progress(local, from, fade, easeInOutCubic), 1 - progress(local, to - fade, fade, easeInOutCubic));
  if (o <= 0.001) return null;
  return <div style={{ position: "absolute", inset: 0, opacity: o, ...style }}>{children}</div>;
}

const NUMS = [4, 56, 66, 115, 155, 156, 230, 237];

function KeyMatrix({ t, at }: { t: number; at: number }) {
  const p = progress(t, at, 0.7, easeOutCubic);
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 50% at 50% 42%, #14102a, #05060a 72%)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center", opacity: p }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 14, marginTop: 8 }}>
          <span className="mono" style={{ fontSize: 96, color: "#e9e4ff", letterSpacing: "-.05em" }}>2<sup style={{ fontSize: 42 }}>384</sup></span>
          <span className="mono" style={{ fontSize: 22, color: "rgba(185,167,255,.65)" }}>≈ 3.9 × 10<sup>115</sup></span>
        </div>
      </div>
      <div style={{ position: "absolute", left: "50%", top: 300, transform: `translateX(-50%) scale(${0.92 + p * 0.08})`, opacity: p }}>
        <BitGrid rows={16} cols={24} cell={26} gap={4} t={t} seed={31} />
      </div>
    </div>
  );
}

function Universe({ t, at }: { t: number; at: number }) {
  const p = progress(t, at, 0.7, easeOutCubic);
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 55% at 50% 48%, #081426, #04050a 74%)" }}>
      <Starfield count={220} seed={44} t={t} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center", opacity: p }}>
        </div>
      <div style={{ position: "absolute", left: 170, right: 170, top: 380, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: p }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #8beeff, #1c4f7a 55%, #07101c 80%)", boxShadow: "0 0 120px rgba(79,227,255,.25)" }} />
          <div style={{ fontSize: 24, color: "rgba(139,238,255,.7)", marginTop: 18 }}>宇宙原子</div>
          <div className="mono" style={{ fontSize: 64, color: "#8beeff" }}>10<sup style={{ fontSize: 30 }}>80</sup></div>
        </div>
        <div style={{ flex: 1, textAlign: "center", padding: "0 40px" }}>
          <div style={{ fontSize: 20, color: "rgba(255,255,255,.35)" }}>差</div>
          <div className="mono" style={{ fontSize: 56, color: "#ffc466" }}>10<sup style={{ fontSize: 26 }}>35</sup></div>
          <div style={{ fontSize: 20, color: "rgba(255,255,255,.35)" }}>倍</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 360, height: 300, borderRadius: 20, background: "radial-gradient(ellipse at 50% 50%, rgba(185,167,255,.22), rgba(20,14,40,.7) 60%, transparent 75%)", border: "1px solid rgba(185,167,255,.2)", display: "grid", placeItems: "center" }}>
            <div className="mono" style={{ fontSize: 92, color: "#d8ccff" }}>10<sup style={{ fontSize: 38 }}>115</sup></div>
          </div>
          <div style={{ fontSize: 24, color: "rgba(185,167,255,.65)", marginTop: 18 }}>私钥可能值</div>
        </div>
      </div>
    </div>
  );
}

function KeyReceipt({ t, at }: { t: number; at: number }) {
  const p = progress(t, at, 0.7, easeOutCubic);
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 55% at 50% 50%, #1a1710, #06070a 72%)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", opacity: p }}>
        <div style={{ fontSize: 56, fontWeight: 700, color: "#fff" }}>实际生成的私钥</div>
      </div>
      <div style={{ position: "absolute", left: "50%", top: 280, transform: "translateX(-50%)", opacity: p }}>
        <div style={{ width: 1080, height: 330, borderRadius: 10, background: "linear-gradient(165deg,#f4e5cc,#c9b48c)", color: "#3a2a18", padding: "34px 46px", boxShadow: "0 50px 110px rgba(0,0,0,.6)", position: "relative", transform: `rotate(${-2 + p * 2}deg)` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ fontSize: 16, letterSpacing: ".18em", color: "rgba(60,40,20,.45)" }}>私钥清单</div>
            <div style={{ width: 120, height: 120, borderRadius: "50%", border: "5px solid rgba(170,30,55,.7)", display: "grid", placeItems: "center", transform: "rotate(-12deg)", color: "rgba(170,30,55,.9)", fontSize: 26, fontWeight: 800 }}>8 位</div>
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 44, alignItems: "center", justifyContent: "center" }}>
            {NUMS.map((n, i) => {
              const q = spring(t, at + 0.2 + i * 0.1, { stiffness: 150, damping: 15 });
              return <span key={n} className="mono" style={{ fontSize: 58, fontWeight: 700, color: "rgba(40,28,16,.85)", opacity: clamp01(q), transform: `translateY(${(1 - q) * 26}px)` }}>{n}</span>;
            })}
          </div>
          <div style={{ position: "absolute", left: 46, right: 46, bottom: 26, height: 2, background: "rgba(60,40,20,.15)" }} />
        </div>
      </div>
    </div>
  );
}

function LabelCrash({ t, at }: { t: number; at: number }) {
  const p = progress(t, at, 0.6, easeOutCubic);
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 50% at 50% 50%, #1c0c12, #05060a 72%)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 160, display: "flex", justifyContent: "center", gap: 80 }}>
        {[{ label: "PROD", color: "#45e0a0" }, { label: "TEST", color: "#ff5c7a" }].map((s, i) => (
          <div key={s.label} style={{ width: 460, padding: "40px 38px", borderRadius: 16, border: `3px solid ${s.color}66`, background: "rgba(255,255,255,.03)", transform: `rotate(${i ? 3 : -3}deg)` }}>
            <div className="mono" style={{ fontSize: 18, letterSpacing: ".2em", color: s.color }}>{s.label}</div>
            <div style={{ fontSize: 30, marginTop: 14, color: "rgba(255,255,255,.8)" }}>emSign TLS CA G3B</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 480, display: "flex", justifyContent: "center", gap: 12, opacity: progress(t, at - 0.5, 0.3) }}>
        {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ width: 130, height: 90, borderRadius: 8, background: "linear-gradient(165deg,#f4e5cc,#cdb58b)", border: "2px solid rgba(255,92,122,.5)", transform: `rotate(${-8 + i * 2.3}deg)`, display: "grid", placeItems: "center", color: "rgba(160,30,55,.8)", fontSize: 16, fontWeight: 700 }}>已吊销</div>)}
      </div>
    </div>
  );
}

function LuggageLock({ t, at }: { t: number; at: number }) {
  const open = progress(t, at + 1.0, 0.5, easeOutBack);
  const count = Math.floor(progress(t, at, 1.0) * 256);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 50% 50% at 50% 55%, rgba(255,196,102,.08), transparent 70%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center" }}>
        <div className="mono" style={{ fontSize: 92, color: "#ffd28a", letterSpacing: "-.05em" }}>{String(count).padStart(3, "0")}<span style={{ fontSize: 34, color: "rgba(255,255,255,.25)" }}> / 256</span></div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 440, height: 420 }}>
          <div style={{ position: "absolute", left: 80, top: open * -60, width: 280, height: 220, borderRadius: "150px 150px 0 0", border: "26px solid #c8b48a", borderBottom: "none", transformOrigin: "bottom center", transform: `rotate(${open * -14}deg)` }} />
          <div style={{ position: "absolute", left: 30, top: 200, width: 380, height: 210, borderRadius: 40, background: "linear-gradient(160deg,#e8d6b0,#a98f63)", border: "2px solid rgba(80,60,30,.4)", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }} />
          <div style={{ position: "absolute", left: 150, top: 250, width: 140, height: 56, borderRadius: 10, background: "#2a2118", border: "2px solid #5c4a2e", display: "flex", gap: 6, alignItems: "center", justifyContent: "center" }}>
            {["2", "5", "6"].map((s, i) => <span key={i} className="mono" style={{ width: 34, height: 40, borderRadius: 5, background: "rgba(255,255,255,.12)", display: "grid", placeItems: "center", color: "#ffd28a", fontSize: 20 }}>{s}</span>)}
          </div>
          <div style={{ position: "absolute", left: 130, top: 330, width: 180, height: 6, borderRadius: 6, background: "rgba(80,60,30,.35)" }} />
        </div>
      </div>
    </div>
  );
}

export function S2Random() {
  const { local, at, chapter } = useChapter();
  const r1 = at("r1"), r2 = at("r2"), r3 = at("r3"), r10 = at("r10"), r6 = at("r6"), r7 = at("r7");
  return (
    <div className="scene" style={{ padding: 0 }}>
      <World variant="cosmos">
        <Vignette strength={0.55} />
        <Act from={r1} to={r2} fade={0.25}><KeyMatrix t={local} at={r1} /></Act>
        <Act from={r2} to={r3} fade={0.25}><Universe t={local} at={r2} /></Act>
        <Act from={r3} to={r10 + 0.1} fade={0.25}><KeyReceipt t={local} at={r3} /></Act>
        <Act from={r10 - 0.25} to={r6 + 0.1} fade={0.2}><LabelCrash t={local} at={r10} /></Act>
        <Act from={r6} to={chapter.duration + 0.1} fade={0.25}>
          <LuggageLock t={local} at={r6} />
        </Act>
        <div style={{ position: "absolute", left: 140, bottom: 90, opacity: progress(local, r7, 0.5) }}>
          <Locky size={170} mood="shock" t={local} color="#ffc466" />
        </div>
      </World>
    </div>
  );
}
