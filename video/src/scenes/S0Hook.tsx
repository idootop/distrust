import { useChapter } from "../lib/ChapterContext";
import { clamp01, easeInOutCubic, easeOutBack, easeOutCubic, progress, spring } from "../lib/time";
import { WifiGlyph, LockGlyph } from "../components/devices";
import { PhoneBaddie, Keyy } from "../components/mascots";
import { Bokeh, SpeedLines, Vignette, World } from "../components/worlds";

const NUMS = [4, 56, 66, 115, 155, 156, 230, 237];

function Laptop({ children, t }: { children: React.ReactNode; t: number }) {
  return (
    <div style={{ width: 880, height: 590, position: "relative", filter: "drop-shadow(0 60px 90px rgba(0,0,0,.65))" }}>
      <div style={{ position: "absolute", left: 18, top: 0, width: 844, height: 520, borderRadius: 22, padding: 12, background: "linear-gradient(160deg,#2a2c35,#0c0d12 55%,#050609)", border: "1px solid rgba(255,255,255,.16)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.12)" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 12, overflow: "hidden", background: "#05060a", position: "relative" }}>
          {children}
          <div style={{ position: "absolute", left: "50%", top: 7, width: 6, height: 6, marginLeft: -3, borderRadius: "50%", background: "#0a0b10", boxShadow: "inset 0 0 3px rgba(255,255,255,.15)" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 520, width: 880, height: 22, borderRadius: "0 0 16px 16px", background: "linear-gradient(180deg,#383b46,#16171e 55%,#08090d)", border: "1px solid rgba(255,255,255,.12)", boxShadow: "0 18px 40px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 150, top: 527, width: 180, height: 7, borderRadius: 3, background: "rgba(0,0,0,.45)", boxShadow: "inset 0 1px 2px rgba(255,255,255,.08)" }} />
      <div style={{ position: "absolute", left: "50%", top: 552, width: 260, height: 3, marginLeft: -130, borderRadius: 3, background: "radial-gradient(ellipse, rgba(255,255,255,.18), transparent 70%)", opacity: .5 }} />
    </div>
  );
}

function Avatar({ size = 42 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "linear-gradient(135deg,#6d4df0,#b9a7ff)", display: "grid", placeItems: "center", flexShrink: 0, boxShadow: "0 8px 20px rgba(109,77,240,.3)" }}>
      <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,.95)" />
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="rgba(255,255,255,.95)" />
      </svg>
    </div>
  );
}

function ChatBubble({ text, size = 38, tone = "sent" }: { text: string; size?: number; tone?: "sent" | "mirror" }) {
  const out = tone === "sent";
  const bg = out ? "#95ec69" : "#ffffff";
  return (
    <div style={{ position: "relative", display: "inline-block", maxWidth: size * 13, padding: `${size * 0.38}px ${size * 0.6}px`, borderRadius: 7, background: bg, color: "#111", fontSize: size, lineHeight: 1.45, boxShadow: "0 18px 44px rgba(0,0,0,.35)" }}>
      {text}
      <svg width={size * 0.3} height={size * 0.3} viewBox="0 0 14 14" fill="none" style={{ position: "absolute", right: -size * 0.22, bottom: 0 }}>
        <path d="M0 0 L14 14 L0 14 Z" fill={bg} />
      </svg>
    </div>
  );
}

function ChatScreen({ t, sendAt }: { t: number; sendAt: number }) {
  const show = progress(t, sendAt, 0.3, easeOutCubic);
  return (
    <div style={{ height: "100%", position: "relative", background: "radial-gradient(ellipse at 30% 20%, #1b2130, #07090e 72%)", overflow: "hidden", display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: "0 42px 54px" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 72% 26%, rgba(255,170,80,.12), transparent 50%)" }} />
      <div style={{ position: "relative", opacity: show, transform: `translateY(${(1 - show) * 14}px)` }}>
        <ChatBubble text="方案发你了" size={40} />
      </div>
    </div>
  );
}

function TitleCard({ t, at }: { t: number; at: number }) {
  const p = progress(t, at, 0.9, easeOutCubic);
  const slam = spring(t, at + 0.15, { stiffness: 180, damping: 14 });
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 50, background: "radial-gradient(ellipse 62% 56% at 50% 48%, rgba(24,14,42,.86), rgba(3,4,8,.99) 74%)", opacity: p }}>
      <SpeedLines color="rgba(185,167,255,.18)" count={40} opacity={p} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 760, height: 760, marginLeft: -380, marginTop: -380, borderRadius: "50%", border: "1px solid rgba(185,167,255,.12)", transform: `scale(${0.7 + slam * 0.3})` }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 1000, height: 1000, marginLeft: -500, marginTop: -500, borderRadius: "50%", border: "1px dashed rgba(185,167,255,.07)", transform: `rotate(${t * 4}deg)` }} />
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, opacity: p }}>
        <path d="M1050 140 L1010 380 L1060 520 L980 700 L1040 900 L1010 1020" fill="none" stroke="rgba(255,92,122,.42)" strokeWidth="2.5" />
        <path d="M1010 380 L850 460 M1060 520 L1240 450 M980 700 L800 780 M1040 900 L1210 950" fill="none" stroke="rgba(255,92,122,.25)" strokeWidth="1.5" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.9 + slam * 0.1})` }}>
          <div style={{ position: "absolute", fontSize: 560, fontWeight: 800, lineHeight: 1, color: "rgba(139,108,255,.14)", letterSpacing: "-.1em", transform: `rotate(${-6 + p * 6}deg)` }}>8</div>
          <div style={{ fontSize: 156, fontWeight: 700, letterSpacing: "-.065em", lineHeight: 0.95, color: "#fff", textShadow: "0 0 90px rgba(139,108,255,.35)", zIndex: 2 }}>8 个数字</div>
        </div>
        <div style={{ fontSize: 64, color: "rgba(255,255,255,.9)", marginTop: 18, letterSpacing: ".02em", zIndex: 2 }}>
          干翻 <span style={{ color: "#b9a7ff", textShadow: "0 0 40px rgba(185,167,255,.6)" }}>HTTPS</span>
        </div>
      </div>
    </div>
  );
}

export function S0Hook() {
  const { local, at } = useChapter();
  const h1 = at("h1"), h2 = at("h2"), h3 = at("h3"), h4 = at("h4");
  const intro = 1 - progress(local, h2 - 0.15, 0.7);
  const introPop = spring(local, 0.02, { stiffness: 150, damping: 13 });
  const cafe = progress(local, h2 - 0.3, 0.9, easeInOutCubic);
  const phone = progress(local, h2 + 0.9, 0.7, easeOutCubic);
  const link = progress(local, h3 + 0.2, 0.8, easeInOutCubic);
  const lock = progress(local, h4, 0.8);
  const titleP = false;

  return (
    <div className="scene" style={{ padding: 0 }}>
      {!titleP && (
        <World variant="cafe">
          <Bokeh count={22} seed={12} t={local} color="rgba(255,180,90,.12)" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,.2), transparent 32%, rgba(0,0,0,.58))" }} />
          <Vignette strength={0.5} />

          {/* h1: the line, alone in the dark */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: intro, zIndex: 8 }}>
            <div style={{ transform: `scale(${0.52 + introPop * 0.48})`, transformOrigin: "50% 50%" }}>
              <ChatBubble text="方案发你了" size={62} />
            </div>
          </div>

          <div style={{ position: "absolute", inset: 0, opacity: cafe }}>
            {/* desk */}
            <div style={{ position: "absolute", left: 80, right: 80, bottom: 95, height: 280, borderRadius: "50% 50% 0 0 / 16% 16% 0 0", background: "linear-gradient(180deg, rgba(80,57,36,.5), rgba(22,16,12,.9))", boxShadow: "0 -20px 80px rgba(255,180,90,.07)" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 760, background: "linear-gradient(180deg, rgba(255,170,90,.06), transparent 55%)" }} />

            {/* wifi rings */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 80, display: "flex", justifyContent: "center", opacity: progress(local, h2 + 0.2, 0.7) }}>
              <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ position: "absolute", width: 70 + i * 54, height: 70 + i * 54, borderRadius: "50%", border: `1px solid rgba(125,233,255,${0.26 - i * 0.06})`, transform: `scale(${0.9 + Math.sin(local * 2 - i) * 0.05})` }} />
                ))}
                <WifiGlyph size={44} color="#7de9ff" />
              </div>
            </div>

            <div style={{ position: "absolute", left: 210, top: 300, opacity: progress(local, h2 - 0.2, 0.8), transform: `translateY(${(1 - cafe) * 18}px)` }}>
              <Laptop t={local}><ChatScreen t={local - h2} sendAt={0.35} /></Laptop>
            </div>

            {/* attacker phone */}
            <div style={{ position: "absolute", right: 150, top: 330, opacity: phone, transform: `translateY(${(1 - phone) * 40}px)` }}>
              <PhoneBaddie size={230} mood={link > 0.2 ? "smug" : "lurk"} t={local} lookX={-1} />
              <div style={{ position: "absolute", left: -205, top: 40, width: 210, opacity: progress(local, h2 + 1.4, 0.6), transform: `translateX(${(1 - link) * 30}px) scale(${0.5 + link * 0.5})`, transformOrigin: "0% 50%" }}>
                <div style={{ position: "relative", padding: "14px 20px", borderRadius: "16px 4px 16px 16px", background: "rgba(255,92,122,.15)", border: "1px solid rgba(255,92,122,.4)", color: "#ffd0d8", fontSize: 22, lineHeight: 1.4, boxShadow: "0 0 50px rgba(255,92,122,.15)" }}>方案发你了</div>
                <div style={{ marginTop: 8, width: 54, height: 4, borderRadius: 2, background: "rgba(255,92,122,.5)" }} />
              </div>
            </div>

            {/* red path */}
            <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: link }}>
              <path d="M1010 560 C 1160 520, 1280 540, 1420 560" fill="none" stroke="rgba(255,92,122,.55)" strokeWidth="2.5" strokeDasharray="8 10" />
              {[0, 1, 2].map((i) => {
                const p = (local * 0.5 + i * 0.33) % 1;
                const x = 1010 + p * 410;
                const y = 560 - Math.sin(p * Math.PI) * 40;
                return <circle key={i} cx={x} cy={y} r="4" fill="#ff5c7a" opacity={0.5 + p * 0.5} />;
              })}
            </svg>
          </div>
        </World>
      )}

      {/* lock */}
      {!titleP && (
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, #170b12, #05060a 72%)", opacity: lock, zIndex: 25 }}>
          <SpeedLines color="rgba(255,92,122,.18)" count={36} opacity={lock} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "relative", width: 620, height: 620, display: "grid", placeItems: "center" }}>
              <LockGlyph size={340} color="#45e0a0" open={progress(local, h4 + 2.3, 0.6)} />
              <div style={{ position: "absolute", left: 350, top: 280, transform: `rotate(${45 + progress(local, h4 + 1.2, 0.8) * 80}deg)`, opacity: progress(local, h4 + 0.7, 0.6) }}>
                <Keyy size={260} color="#b9a7ff" />
              </div>
              <div style={{ position: "absolute", width: 420, height: 2, background: "rgba(255,92,122,.4)", transform: "rotate(-24deg)", opacity: progress(local, h4 + 1.6, 0.7) }} />
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
}
