import type { CSSProperties, ReactNode } from "react";
import { useChapter } from "../lib/ChapterContext";
import { clamp01, easeInOutCubic, easeOutBack, easeOutCubic, progress } from "../lib/time";
import { Locky } from "../components/mascots";
import { LockGlyph } from "../components/devices";
import { SpeedLines, Vignette, World } from "../components/worlds";

function Act({ from, to, children, style }: { from: number; to: number; children: ReactNode; fade?: number; style?: CSSProperties }) {
  const { local } = useChapter();
  if (local < from || local >= to) return null;
  return <div style={{ position: "absolute", inset: 0, ...style }}>{children}</div>;
}

function BigLogo({ src, p, x, label }: { src: string; p: number; x: number; label: string }) {
  return (
    <div style={{ position: "absolute", left: x, top: 250, textAlign: "center", opacity: 0.2 + p * 0.8, transform: `scale(${0.9 + p * 0.1})` }}>
      <div style={{ width: 200, height: 200, borderRadius: "50%", border: `2px solid rgba(255,255,255,${0.1 + p * 0.12})`, background: "rgba(255,255,255,.03)", display: "grid", placeItems: "center", boxShadow: p > 0.4 ? "0 0 70px rgba(139,238,255,.12)" : "none" }}>
        <img src={src} alt="" style={{ width: 110, height: 110, objectFit: "contain", opacity: 0.35 + p * 0.65 }} />
      </div>
      <div style={{ fontSize: 20, color: "rgba(255,255,255,.5)", marginTop: 12 }}>{label}</div>
    </div>
  );
}

function BrowserBlock({ t, s2, s3, s4, s5 }: { t: number; s2: number; s3: number; s4: number; s5: number }) {
  const chrome = progress(t, s2, 0.5);
  const firefox = progress(t, s3, 0.5);
  const next = progress(t, s4 - 0.5, 0.5);
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 55% at 50% 45%, #0a1420, #05060a 72%)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center" }}>
        <div style={{ fontSize: 50, fontWeight: 700, color: "#fff", opacity: 0.8 }}>浏览器拉黑</div>
      </div>

      <BigLogo src="/logos/googlechrome.svg" p={chrome} x={230} label="Chrome" />
      <BigLogo src="/logos/firefox.svg" p={firefox} x={1490} label="Firefox" />

      {/* cert stack */}
      <div style={{ position: "absolute", left: "50%", top: 300, transform: "translateX(-50%)" }}>
        <div style={{ position: "relative", width: 620, height: 260 }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} style={{ position: "absolute", left: i * 14, top: i * 6, width: 520, height: 170, borderRadius: 8, background: "linear-gradient(165deg,#f4e5cc,#cdb58b)", border: "1px solid rgba(80,55,30,.45)", transform: `rotate(${-3 + i * 0.8}deg)`, boxShadow: "0 16px 30px rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 28px", opacity: 0.85 - i * 0.05 }}>
              <div style={{ width: 1, height: 1 }} />
              <div style={{ width: 72, height: 72, borderRadius: "50%", border: "3px solid rgba(160,30,55,.5)", display: "grid", placeItems: "center", color: "rgba(160,30,55,.8)", fontSize: 15, transform: "rotate(-10deg)" }}>CA</div>
            </div>
          ))}
          {chrome > 0.3 && (
            <div style={{ position: "absolute", left: 260, top: 40, transform: `rotate(-14deg) scale(${0.8 + chrome * 0.2})`, padding: "8px 18px", border: "4px solid rgba(255,92,122,.7)", color: "rgba(255,110,135,.95)", fontSize: 22, fontWeight: 700, letterSpacing: ".12em", background: "rgba(10,5,8,.25)" }}>已封禁</div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 120, marginTop: 10 }}>
          <div style={{ textAlign: "center", opacity: chrome }}>
            <div className="mono" style={{ fontSize: 54, color: "#8beeff" }}>100</div>
            <div style={{ fontSize: 18, color: "rgba(255,255,255,.45)" }}>分钟</div>
          </div>
          <div style={{ textAlign: "center", opacity: firefox }}>
            <div className="mono" style={{ fontSize: 54, color: "#ffd28a" }}>3</div>
            <div style={{ fontSize: 18, color: "rgba(255,255,255,.45)" }}>小时</div>
          </div>
          <div style={{ textAlign: "center", opacity: next }}>
            <div style={{ fontSize: 44, fontWeight: 700, color: "#ff8ba0" }}>第二天</div>
            <div style={{ fontSize: 18, color: "rgba(255,255,255,.4)" }}>正式吊销</div>
          </div>
        </div>
      </div>

    </div>
  );
}

function Fastest({ t, at }: { t: number; at: number }) {
  const p = 1;
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 50% at 50% 48%, #241a10, #05060a 72%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <SpeedLines color="rgba(255,196,102,.18)" count={30} opacity={p} />
      <div style={{ fontSize: 120, fontWeight: 800, color: "#fff", letterSpacing: "-.05em", opacity: p, transform: `scale(${0.92 + p * 0.08})`, textShadow: "0 0 70px rgba(255,196,102,.25)" }}>史上最快</div>
      <div style={{ width: 520, height: 3, background: "linear-gradient(90deg, transparent, rgba(255,196,102,.7), transparent)", marginTop: 18, opacity: p }} />
    </div>
  );
}

function SafeWall({ t, at }: { t: number; at: number }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 55% at 50% 48%, #08130e, #04060a 72%)" }}>
      {Array.from({ length: 48 }, (_, i) => {
        const x = 80 + (i * 137) % 1800;
        const y = 120 + ((i * 211) % 760);
        const p = progress(t, at + (i % 12) * 0.05, 0.4);
        return <div key={i} style={{ position: "absolute", left: x, top: y, opacity: p * (0.35 + (i % 5) * 0.1), transform: `scale(${0.7 + (i % 4) * 0.2})`, color: "#68edb8", fontFamily: "var(--mono)", fontSize: 28 + (i % 5) * 6 }}>✓</div>;
      })}
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}>
        <div style={{ width: 340, height: 340, borderRadius: "50%", border: "2px solid rgba(69,224,160,.4)", background: "radial-gradient(circle, rgba(69,224,160,.12), transparent 68%)", display: "grid", placeItems: "center", boxShadow: "0 0 120px rgba(69,224,160,.15)" }}>
          <LockGlyph size={170} color="#45e0a0" />
        </div>
      </div>
      <div style={{ position: "absolute", left: 120, bottom: 200 }}>
        <Locky size={230} mood="happy" t={t} color="#45e0a0" wave={1} />
      </div>
    </div>
  );
}

export function S3Response() {
  const { local, at } = useChapter();
  const s1 = at("s1"), s2 = at("s2"), s3 = at("s3"), s4 = at("s4"), s5 = at("s5"), s6 = at("s6"), s7 = at("s7");
  const freeze = progress(local, s7, 0.3, easeOutCubic);
  const red = progress(local, s7 + 0.1, 0.6, easeInOutCubic);
  return (
    <div className="scene" style={{ padding: 0 }}>
      <World variant="alarm">
        <Vignette strength={0.58} />
        <Act from={0} to={s2}>
          <SpeedLines color="rgba(255,92,122,.18)" count={30} opacity={progress(local, s1, 0.5)} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center" }}>
            <div style={{ fontSize: 58, fontWeight: 700, color: "#fff" }}>一份无法反驳的证明</div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center", alignItems: "center", gap: 100 }}>
            <div style={{ transform: `translateX(${(1 - progress(local, s1 + 0.1, 0.9)) * -800}px) rotate(-9deg)`, opacity: progress(local, s1 + 0.1, 0.5) }}>
              <div style={{ width: 440, height: 300, borderRadius: 10, background: "linear-gradient(150deg,#f4e5cc,#c9b48c)", color: "#3a2a18", padding: 28, boxShadow: "0 50px 100px rgba(0,0,0,.55)", position: "relative" }}>
                <div style={{ fontSize: 15, letterSpacing: ".2em", color: "rgba(60,40,20,.45)" }}>机密材料</div>
                <div style={{ fontSize: 38, fontWeight: 700, marginTop: 14 }}>私钥证明</div>
                <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ width: 300, height: 3, borderRadius: 2, background: "rgba(60,40,20,.18)" }} />
                  <div style={{ width: 240, height: 3, borderRadius: 2, background: "rgba(60,40,20,.14)" }} />
                  <div style={{ width: 280, height: 3, borderRadius: 2, background: "rgba(60,40,20,.14)" }} />
                </div>
                <div style={{ position: "absolute", right: 24, bottom: 22, width: 92, height: 92, borderRadius: "50%", border: "4px solid rgba(180,50,70,.7)", display: "grid", placeItems: "center", transform: "rotate(-12deg)", color: "rgba(180,50,70,.9)", fontSize: 16, fontWeight: 700 }}>已泄露</div>
              </div>
            </div>
            <Locky size={280} mood={progress(local, s1 + 1.2, 0.4) > 0.5 ? "shock" : "confused"} t={local} color="#45e0a0" />
          </div>
        </Act>

        <Act from={s2} to={s5}>
          <BrowserBlock t={local} s2={s2} s3={s3} s4={s4} s5={s5} />
        </Act>

        <Act from={s5} to={s6}>
          <Fastest t={local} at={s5} />
        </Act>

        <Act from={s6} to={s7}>
          <SafeWall t={local} at={s6} />
        </Act>

        {freeze > 0 && (
          <div style={{ position: "absolute", inset: 0, zIndex: 30, background: `rgba(5,6,10,${freeze * 0.55})` }}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 50%, transparent 20%, rgba(255,92,122,${red * 0.24}) 100%)` }} />
            <div style={{ position: "absolute", left: "50%", top: "45%", transform: `translate(-50%,-50%) scale(${0.9 + freeze * 0.1}) rotate(${freeze * -2}deg)`, opacity: freeze }}>
              <div style={{ fontSize: 180, fontWeight: 700, color: "#fff", letterSpacing: "-.07em", textShadow: `0 0 80px rgba(255,92,122,${red * 0.6})` }}>真的<span style={{ color: "#ff5c7a" }}>吗？</span></div>
            </div>
            <div style={{ position: "absolute", right: 150, top: 520, opacity: red }}>
              <Locky size={330} mood="scared" t={local} color="#ff5c7a" />
            </div>
          </div>
        )}
      </World>
    </div>
  );
}
