import type { CSSProperties, ReactNode } from "react";
import { useChapter } from "../lib/ChapterContext";
import { clamp01, easeInOutCubic, easeOutBack, easeOutCubic, progress, spring } from "../lib/time";
import { Locky } from "../components/mascots";
import { LockGlyph, RouterGlyph } from "../components/devices";
import { SpeedLines, Starfield, Vignette, World } from "../components/worlds";

function Act({ from, to, children, style }: { from: number; to: number; children: ReactNode; fade?: number; style?: CSSProperties }) {
  const { local } = useChapter();
  if (local < from || local >= to) return null;
  return <div style={{ position: "absolute", inset: 0, ...style }}>{children}</div>;
}

function CrackIntro({ t, at }: { t: number; at: number }) {
  const p = progress(t, at, 0.8);
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 55% at 50% 50%, #1a0a10, #05060a 72%)" }}>
      <SpeedLines color="rgba(255,92,122,.2)" count={26} opacity={p} />
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <path d="M960 120 L930 360 L990 470 L920 640 L1010 830 L980 980" fill="none" stroke="rgba(255,92,122,.55)" strokeWidth="2.5" strokeDasharray="1000" strokeDashoffset={1000 * (1 - p)} style={{ filter: "drop-shadow(0 0 12px rgba(255,92,122,.4))" }} />
        <path d="M930 360 L760 430 M990 470 L1180 390 M920 640 L740 720 M1010 830 L1210 900" fill="none" stroke="rgba(255,92,122,.32)" strokeWidth="1.5" strokeDasharray="500" strokeDashoffset={500 * (1 - progress(t, at + 0.2, 0.9))} />
      </svg>
      
    </div>
  );
}

function AiAgent({ t, at }: { t: number; at: number }) {
  const hit = progress(t, at + 0.7, 0.45, easeOutBack);
  const shake = hit > 0.4 ? Math.sin(t * 70) * 3 * (1 - progress(t, at + 1.4, 0.8)) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 55% at 50% 45%, #0b2230 0%, #070b12 45%, #05060a 100%)", transform: `translateX(${shake}px)` }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.5, backgroundImage: "radial-gradient(rgba(79,227,255,.35) 1px, transparent 1px)", backgroundSize: "46px 46px", maskImage: "radial-gradient(ellipse 55% 50% at 50% 45%, #000 10%, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse 55% 50% at 50% 45%, #000 10%, transparent 75%)" }} />
      <div style={{ position: "absolute", left: 430, top: 270, width: 460, height: 460 }}>
        <div style={{ position: "absolute", inset: -30, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,227,255,.16), transparent 65%)", filter: "blur(20px)" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(79,227,255,.25)", transform: `rotate(${t * 8}deg)` }} />
        <div style={{ position: "absolute", inset: 44, borderRadius: "50%", border: "1px dashed rgba(79,227,255,.18)", transform: `rotate(${-t * 12}deg)` }} />
        <div style={{ position: "absolute", inset: 96, borderRadius: "50%", background: "radial-gradient(circle at 36% 30%, #b8f6ff, #1d8ba8 32%, #0b2230 64%, #05080d 78%)", border: "2px solid rgba(139,238,255,.35)", boxShadow: "0 0 90px rgba(79,227,255,.25), inset 0 0 60px rgba(5,10,18,.7)" }}>
          <div style={{ position: "absolute", left: "50%", top: "50%", width: 58, height: 80, marginLeft: -29, marginTop: -40, borderRadius: "50%", background: "#05080d", boxShadow: "0 0 30px rgba(0,0,0,.8)" }} />
          <div style={{ position: "absolute", left: "46%", top: "38%", width: 12, height: 12, borderRadius: "50%", background: "rgba(255,255,255,.9)", boxShadow: "0 0 10px #fff" }} />
        </div>
        {["{ }", "</>", "λ", "▶"].map((g, i) => {
          const a = t * (0.5 + i * 0.1) + i * 1.57;
          return <div key={g} className="mono" style={{ position: "absolute", left: 230 + Math.cos(a) * 270, top: 230 + Math.sin(a) * 270, fontSize: 22, color: "rgba(139,238,255,.35)" }}>{g}</div>;
        })}
      </div>

      <div style={{ position: "absolute", left: 780, top: 260, width: 460, height: 300, opacity: progress(t, at + 0.15, 0.55), transform: `translateX(${(1 - progress(t, at + 0.15, 0.55)) * 100}px)` }}>
        <svg width="460" height="300" viewBox="0 0 460 300">
          <g stroke="rgba(200,215,230,.5)" strokeWidth="15" strokeLinecap="round" fill="none">
            <path d="M460 20 L360 80 L300 150" />
            <path d="M360 80 L390 170" />
          </g>
          <g transform={`translate(270 160) rotate(${hit * 18})`}>
            <rect x="-38" y="-42" width="90" height="66" rx="6" fill="#d9475f" stroke="rgba(255,190,200,.5)" strokeWidth="2" />
            <rect x="-38" y="-42" width="90" height="18" rx="6" fill="#a92b43" />
            <text x="7" y="6" textAnchor="middle" fill="rgba(255,230,235,.85)" fontSize="11" fontFamily="var(--mono)">工具返回</text>
            <path d="M-58 -10 h20 M-58 6 h20" stroke="rgba(200,215,230,.6)" strokeWidth="6" strokeLinecap="round" />
          </g>
        </svg>
      </div>
      <div style={{ position: "absolute", left: 600, top: 540, opacity: hit, transform: `translateX(${(1 - hit) * -70}px) rotate(-6deg)`, padding: "14px 24px", borderRadius: 8, background: "rgba(255,92,122,.12)", border: "2px solid rgba(255,92,122,.5)", boxShadow: "0 0 70px rgba(255,92,122,.18)" }}>
        <span className="mono" style={{ fontSize: 38, color: "#ff8ba0" }}>$ rm -rf ~/work</span>
      </div>
      <div style={{ position: "absolute", left: 170, bottom: 140 }}>
        <Locky size={190} mood="scared" t={t} color="#45e0a0" />
      </div>
    </div>
  );
}

function ProxyNode({ t, at }: { t: number; at: number }) {
  const p = progress(t, at, 0.6);
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 55% at 50% 50%, rgba(255,196,102,.07), transparent 70%)" }}>
      <Starfield count={60} seed={66} t={t} color="#ffd7a0" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, opacity: p }}>
        <div style={{ padding: "14px 24px", borderRadius: 12, border: "2px solid rgba(255,196,102,.55)", background: "rgba(255,196,102,.08)", color: "#ffd28a", fontSize: 26, letterSpacing: ".06em", boxShadow: "0 0 40px rgba(255,196,102,.12)" }}>免费 Wi-Fi</div>
        <WifiMini />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 220, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 720, height: 640 }}>
          {/* phone left */}
          <div style={{ position: "absolute", left: 0, top: 150, width: 220, height: 380, borderRadius: 34, border: "2px solid rgba(79,227,255,.3)", background: "#07090f", padding: 8, transform: "rotate(-8deg)", opacity: p }}>
            <div style={{ height: "100%", borderRadius: 26, background: "radial-gradient(ellipse at 50% 30%, #12202a, #07090f 68%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid rgba(79,227,255,.5)", display: "grid", placeItems: "center" }}><LockGlyph size={24} color="#4fe3ff" /></div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,.55)" }}>已连接</div>
              <div style={{ padding: "8px 12px", borderRadius: 6, background: "rgba(255,255,255,.06)", fontFamily: "var(--mono)", fontSize: 13, color: "rgba(255,255,255,.6)" }}>••••••</div>
            </div>
          </div>
          {/* portal center */}
          <div style={{ position: "absolute", left: 270, top: 70, width: 340, height: 340, borderRadius: "50%", border: "2px solid rgba(255,92,122,.5)", background: "radial-gradient(circle, #05060a 28%, rgba(255,92,122,.15) 52%, transparent 70%)", boxShadow: "0 0 100px rgba(255,92,122,.14)", display: "grid", placeItems: "center", opacity: p }}>
            <div style={{ position: "absolute", inset: 20, borderRadius: "50%", border: "1px dashed rgba(255,140,160,.3)" }} />
            <div style={{ width: 110, height: 110, borderRadius: "50%", background: "#000", border: "1px solid rgba(255,92,122,.5)", display: "grid", placeItems: "center" }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(255,92,122,.8)", boxShadow: "0 0 20px rgba(255,92,122,.8)" }} />
            </div>
            {[0, 1, 2, 3].map((i) => {
              const u = ((t * 0.4 + i * 0.25) % 1);
              return <div key={i} style={{ position: "absolute", left: 120 + Math.cos(i * 1.7) * (40 + u * 90), top: 120 + Math.sin(i * 1.7) * (40 + u * 90), width: 8, height: 8, borderRadius: "50%", background: "#ff8ba0", opacity: 0.8 - u * 0.6 }} />;
            })}
          </div>
          {/* attacker phone right */}
          <div style={{ position: "absolute", right: 0, top: 190, width: 230, height: 390, borderRadius: 34, border: "2px solid rgba(255,92,122,.35)", background: "#07080d", padding: 8, transform: "rotate(7deg)", opacity: p }}>
            <div style={{ height: "100%", borderRadius: 26, background: "radial-gradient(ellipse at 50% 30%, #201018, #07080d 68%)", padding: 18, display: "flex", flexDirection: "column", gap: 14, justifyContent: "center" }}>
              <div style={{ fontSize: 13, color: "rgba(255,140,160,.7)" }}>已截获</div>
              <div style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(255,255,255,.06)", fontFamily: "var(--mono)", fontSize: 14, color: "#ffd0d8" }}>密码</div>
              <div style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(255,92,122,.12)", border: "1px solid rgba(255,92,122,.3)", fontFamily: "var(--mono)", fontSize: 12, color: "rgba(255,180,195,.8)" }}>凭证: 9f2c…</div>
            </div>
          </div>
          <svg width="720" height="640" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <path d="M225 370 C 300 380, 340 380, 390 380" fill="none" stroke="rgba(255,196,102,.4)" strokeWidth="2" strokeDasharray="5 7" />
            <path d="M500 380 C 560 380, 590 420, 620 450" fill="none" stroke="rgba(255,92,122,.4)" strokeWidth="2" strokeDasharray="5 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function WifiMini() {
  return <svg width="42" height="32" viewBox="0 0 42 32"><path d="M4 12 Q21 -2 38 12 M10 19 Q21 8 32 19 M16 26 Q21 20 26 26" fill="none" stroke="rgba(255,196,102,.6)" strokeWidth="2.5" strokeLinecap="round" /><circle cx="21" cy="29" r="2.5" fill="#ffc466" /></svg>;
}

function BankLeak({ t, at }: { t: number; at: number }) {
  const p = progress(t, at, 0.6);
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 55% at 50% 50%, rgba(255,92,122,.08), transparent 70%)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 280, display: "flex", justifyContent: "center", alignItems: "center", gap: 50 }}>
        <div style={{ width: 440, height: 270, borderRadius: 22, background: "linear-gradient(145deg,#263244,#0c1118 62%,#070a0e)", border: "2px solid rgba(180,220,255,.2)", padding: 28, boxShadow: "0 40px 90px rgba(0,0,0,.5)", transform: `translateX(${-p * 20}px) rotate(-4deg)` }}>
          <div style={{ fontSize: 14, letterSpacing: ".18em", color: "rgba(255,255,255,.4)" }}>示例银行</div>
          <div className="mono" style={{ fontSize: 34, marginTop: 36, color: "rgba(255,255,255,.82)", letterSpacing: ".1em" }}>···· 8842</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30, fontSize: 12, color: "rgba(255,255,255,.35)" }}><span>DEL WANG</span><span>09/29</span></div>
        </div>
        <div style={{ position: "relative", width: 250, height: 460, borderRadius: 36, border: "2px solid rgba(255,92,122,.35)", background: "#07080d", padding: 8, transform: `translateY(${-p * 10}px) rotate(5deg)` }}>
          <div style={{ height: "100%", borderRadius: 28, background: "radial-gradient(ellipse at 50% 30%, #1b202a, #07080d 68%)", position: "relative", overflow: "hidden", display: "grid", placeItems: "center" }}>
            <div style={{ position: "absolute", left: 20, right: 20, top: 150, height: 2, background: "rgba(255,92,122,.7)", boxShadow: "0 0 20px rgba(255,92,122,.6)", transform: `translateY(${Math.sin(t * 4) * 60}px)` }} />
            <div style={{ width: 70, height: 70, borderRadius: "50%", border: "2px solid rgba(255,92,122,.4)", display: "grid", placeItems: "center" }}><LockGlyph size={38} color="#ff5c7a" /></div>
          </div>
        </div>

      </div>
    </div>
  );
}

function OldClient({ t, at }: { t: number; at: number }) {
  const p = progress(t, at, 0.6);
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 50% 50% at 50% 50%, #16120c, #05060a 72%)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 620, height: 460, opacity: p }}>
          <div style={{ position: "absolute", left: 60, top: 0, width: 500, height: 360, borderRadius: 26, background: "linear-gradient(160deg,#3a3428,#14110c)", border: "3px solid rgba(255,220,170,.2)", boxShadow: "0 40px 90px rgba(0,0,0,.55)", padding: 22 }}>
            <div style={{ height: "100%", borderRadius: 14, background: "radial-gradient(ellipse at 50% 35%, #1a2430, #07090e 70%)", display: "grid", placeItems: "center", position: "relative", overflow: "hidden" }}>
              <img src="/logos/googlechrome.svg" alt="" style={{ width: 120, height: 120, opacity: 0.35, filter: "grayscale(.4)" }} />
              {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: `${10 + i * 16}%`, top: `${-20 + ((t * 8 + i * 30) % 120)}%`, width: 1, height: 80, background: "linear-gradient(180deg, transparent, rgba(255,255,255,.12))" }} />)}
              <div style={{ position: "absolute", right: 18, top: 18, padding: "8px 12px", border: "2px solid rgba(255,92,122,.5)", color: "#ff8ba0", fontSize: 16, transform: "rotate(8deg)" }}>旧</div>
            </div>
          </div>
          <div style={{ position: "absolute", left: 260, top: 360, width: 100, height: 70, background: "linear-gradient(180deg,#2a2620,#0c0a08)" }} />
          <div style={{ position: "absolute", left: 130, top: 428, width: 360, height: 20, borderRadius: 10, background: "linear-gradient(180deg,#3a3428,#14110c)", border: "1px solid rgba(255,255,255,.1)" }} />
          <svg width="620" height="460" style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.5 }}>
            <path d="M80 80 Q 300 10 540 60 M100 400 Q 380 440 560 300" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="1" />
            <path d="M90 90 q 30 20 10 40 q -30 20 -10 40" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="1" />
          </svg>
          <div style={{ position: "absolute", right: -110, top: 120, opacity: maybe(progress(t, at + 0.2, 0.6)) }}>
            <Locky size={220} mood="confused" t={t} color="#ffc466" />
          </div>
        </div>
      </div>
    </div>
  );
}

function maybe(v: number) { return v; }

function EyesQuote({ t, at }: { t: number; at: number }) {
  const p = progress(t, at, 0.6);
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 50% at 50% 50%, #1a0810, #05060a 72%)" }}>
      <div style={{ position: "absolute", inset: 0, opacity: p }}>
        {Array.from({ length: 22 }, (_, i) => {
          const x = 100 + (i * 173) % 1720;
          const y = 90 + (i * 131) % 820;
          return <div key={i} style={{ position: "absolute", left: x, top: y, width: 52, height: 26, borderRadius: "50%", background: "rgba(255,92,122,.14)", border: "1px solid rgba(255,92,122,.2)", transform: `scale(${0.7 + (i % 4) * 0.2})`, opacity: 0.4 + (i % 5) * 0.1 }}><div style={{ position: "absolute", left: "42%", top: "24%", width: 10, height: 10, borderRadius: "50%", background: "rgba(255,92,122,.8)" }} /></div>;
        })}
      </div>
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", opacity: p }}>
        <Locky size={250} mood="scared" t={t} color="#ff5c7a" />
      </div>
    </div>
  );
}

export function S6Risk() {
  const { local, at } = useChapter();
  const x2 = at("x2"), x3 = at("x3"), x4 = at("x4"), x5 = at("x5"), x6 = at("x6");
  return (
    <div className="scene" style={{ padding: 0 }}>
      <World variant="risk">
        <Vignette strength={0.6} />
        <Act from={0} to={x3}><AiAgent t={local} at={x2} /></Act>
        <Act from={x3} to={x4}><ProxyNode t={local} at={x3} /></Act>
        <Act from={x4} to={x5}><BankLeak t={local} at={x4} /></Act>
        <Act from={x5} to={x6}><OldClient t={local} at={x5} /></Act>
        {local >= x6 && <EyesQuote t={local} at={x6} />}
      </World>
    </div>
  );
}
