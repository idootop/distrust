import type { CSSProperties, ReactNode } from "react";
import { useChapter } from "../lib/ChapterContext";
import { clamp01, easeInOutCubic, easeOutBack, easeOutCubic, progress, spring } from "../lib/time";
import { Locky } from "../components/mascots";
import { LogoMark } from "../components/icons";
import { LockGlyph, WifiGlyph } from "../components/devices";
import { Spotlight, Vignette, World } from "../components/worlds";

function Act({ from, to, children, style }: { from: number; to: number; children: ReactNode; fade?: number; style?: CSSProperties }) {
  const { local } = useChapter();
  if (local < from || local >= to) return null;
  return <div style={{ position: "absolute", inset: 0, ...style }}>{children}</div>;
}

function RefreshIcon({ size = 180, color = "#45e0a0", p = 1 }: { size?: number; color?: string; p?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ opacity: 0.85 + p * 0.15 }}>
      <circle cx="50" cy="50" r="38" stroke={color} strokeWidth="2.2" opacity=".22" />
      <path d="M50 24v34" stroke={color} strokeWidth="7" strokeLinecap="round" />
      <path d="M35 45l15 15 15-15" stroke={color} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M31 73h38" stroke={color} strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

function Link({ i, weak, repair }: { i: number; weak: boolean; repair: number }) {
  const bad = weak && repair < 0.55;
  return (
    <div style={{ position: "relative", width: 250, height: 150, marginLeft: i === 0 ? 0 : -96, transform: `rotate(${i % 2 ? 8 : -8}deg) translateY(${i % 2 ? 12 : -12}px)`, zIndex: i }}>
      <svg width="250" height="150" viewBox="0 0 236 150" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id={`m${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={bad ? "#ff8ba0" : repair > 0.55 && weak ? "#a8ffd8" : "#e4ddff"} />
            <stop offset=".5" stopColor={bad ? "#b01f3c" : weak && repair > 0.55 ? "#45e0a0" : "#8b7ac9"} />
            <stop offset="1" stopColor={bad ? "#5c0a1a" : "#33285c"} />
          </linearGradient>
        </defs>
        <rect x="34" y="40" width="168" height="70" rx="35" fill="none" stroke={`url(#m${i})`} strokeWidth="22" />
        <rect x="44" y="50" width="148" height="50" rx="25" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="3" />
        {bad && <path d="M100 50 l14 20 -16 16 14 18" fill="none" stroke="#ff3159" strokeWidth="3" />}
        {weak && repair > 0.55 && <rect x="34" y="40" width="168" height="70" rx="35" fill="none" stroke="rgba(69,224,160,.65)" strokeWidth="5" style={{ filter: "blur(10px)" }} />}
      </svg>
    </div>
  );
}

function UpdateRing({ t, at }: { t: number; at: number }) {
  const logos = ["/logos/googlechrome.svg", "/logos/feishu.ico", "/logos/electron.svg", "/logos/go.svg", "/logos/python.svg", "/logos/curl.svg"];
  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
      <div style={{ position: "relative", width: 600, height: 600 }}>
        <div style={{ position: "absolute", inset: 60, borderRadius: "50%", border: "1px dashed rgba(69,224,160,.22)", transform: `rotate(${t * 18}deg)` }} />
        <div style={{ position: "absolute", inset: 150, borderRadius: "50%", background: "radial-gradient(circle, rgba(69,224,160,.16), transparent 70%)", filter: "blur(10px)" }} />
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <RefreshIcon size={180} p={progress(t, at, 1.2)} />
        </div>
        {logos.map((src, i) => {
          const a = (i / logos.length) * Math.PI * 2 - Math.PI / 2 + t * 0.55;
          return <img key={src} src={src} alt="" style={{ position: "absolute", left: 300 + Math.cos(a) * 240 - 27, top: 300 + Math.sin(a) * 240 - 27, width: 54, height: 54, objectFit: "contain", opacity: 0.82, filter: "drop-shadow(0 0 12px rgba(255,255,255,.12))" }} />;
        })}
      </div>
    </div>
  );
}

function NoWifi({ t, at }: { t: number; at: number }) {
  const reject = progress(t, at + 0.15, 0.45, easeOutBack);
  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
      <div style={{ position: "relative", width: 420, height: 620, borderRadius: 52, border: "3px solid rgba(255,92,122,.35)", background: "#08090f", padding: 12, transform: "rotate(-6deg)", boxShadow: "0 50px 110px rgba(0,0,0,.6)" }}>
        <div style={{ position: "absolute", left: "50%", top: 14, width: 120, height: 26, marginLeft: -60, borderRadius: 20, background: "#05060a", zIndex: 3 }} />
        <div style={{ height: "100%", borderRadius: 40, background: "radial-gradient(ellipse at 50% 30%, #24101a, #08090f 68%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, position: "relative", overflow: "hidden" }}>
          <WifiGlyph size={150} color="rgba(255,92,122,.7)" />
          <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", border: "2px solid rgba(255,92,122,.5)", opacity: 1 - reject, transform: `scale(${0.55 + reject * 0.6})` }} />
          <div style={{ position: "absolute", width: 200, height: 200, transform: `scale(${0.4 + reject * 0.6}) rotate(${(1 - reject) * -20}deg)`, opacity: reject }}>
            <div style={{ position: "absolute", left: "50%", top: "50%", width: 235, height: 12, marginLeft: -117, marginTop: -6, borderRadius: 8, background: "#ff5c7a", boxShadow: "0 0 34px rgba(255,92,122,.7)", transform: "rotate(45deg)" }} />
            <div style={{ position: "absolute", left: "50%", top: "50%", width: 235, height: 12, marginLeft: -117, marginTop: -6, borderRadius: 8, background: "#ff5c7a", boxShadow: "0 0 34px rgba(255,92,122,.7)", transform: "rotate(-45deg)" }} />
          </div>
          <div style={{ marginTop: 90, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", border: "2px solid rgba(255,92,122,.5)", display: "grid", placeItems: "center" }}><LockGlyph size={20} color="#ff5c7a" /></div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export function S7Fix() {
  const { local, at } = useChapter();
  const f1 = at("f1"), f2 = at("f2"), f3 = at("f3"), f4 = at("f4"), fEnd = at("f_end");
  const repair = progress(local, f4 + 0.4, 0.7, easeInOutCubic);
  const endcard = progress(local, fEnd + 0.15, 0.9, easeInOutCubic);
  return (
    <div className="scene" style={{ padding: 0 }}>
      <World variant="chain">
        <Spotlight x={960} y={420} size={1300} color="rgba(185,167,255,.08)" />
        <Vignette strength={0.6} />

        <Act from={0} to={f2}>
          <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 120 }}>
            <div style={{ textAlign: "center", opacity: 1, transform: `scale(${0.9 + progress(local, f1, 0.5) * 0.1})` }}>
              <RefreshIcon size={220} p={1} />
              
            </div>
            <div style={{ width: 2, height: 260, background: "rgba(255,255,255,.1)" }} />
            <div style={{ textAlign: "center", opacity: 1 }}>
              <div style={{ width: 220, height: 220, borderRadius: 46, border: "3px solid rgba(255,92,122,.4)", background: "radial-gradient(ellipse at 50% 30%, #24101a, #08090f 70%)", display: "grid", placeItems: "center", position: "relative" }}>
                <WifiGlyph size={120} color="rgba(255,92,122,.75)" />
                <div style={{ position: "absolute", width: 190, height: 8, borderRadius: 6, background: "#ff5c7a", transform: "rotate(-38deg)" }} />
              </div>
              
            </div>
          </div>
        </Act>

        <Act from={f2} to={f4}>
          <div style={{ position: "absolute", inset: 0, opacity: 1 - progress(local, f3, 0.5) }}><UpdateRing t={local} at={f2} /></div>
          <div style={{ position: "absolute", inset: 0, opacity: progress(local, f3, 0.5) }}><NoWifi t={local} at={f3} /></div>
        </Act>

        <Act from={f4} to={fEnd}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26 }}>
            <Locky size={280} mood="happy" t={local} color="#45e0a0" wave={1} />
            <div style={{ fontSize: 96, fontWeight: 800, color: "#fff", letterSpacing: "-.06em" }}>现在，<span style={{ color: "#68edb8" }}>去更新。</span></div>
          </div>
        </Act>

        {endcard > 0 && (
          <div style={{ position: "absolute", inset: 0, zIndex: 40, background: "radial-gradient(ellipse 55% 55% at 50% 45%, rgba(60,8,18,.75), rgba(3,4,8,.99) 72%)", opacity: endcard, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, opacity: 0.18, backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,.12) 0 1px, transparent 1px 5px)" }} />
            <div style={{ position: "absolute", width: 920, height: 920, borderRadius: "50%", border: "1px solid rgba(255,59,92,.16)", boxShadow: "0 0 180px rgba(255,30,70,.08)" }} />
            <div style={{ position: "relative", textAlign: "center", transform: `translateX(${Math.sin(local * 22) * 1.4}px)` }}>
              <div style={{ fontSize: 96, fontWeight: 800, color: "#ff3b5c", letterSpacing: "-.03em", textShadow: "3px 0 rgba(0,255,255,.18), -3px 0 rgba(255,0,80,.35), 0 0 50px rgba(255,30,70,.55)", opacity: 0.88 + Math.sin(local * 18) * 0.07 }}>Don&apos;t Trust Anyone</div>
              <div style={{ position: "absolute", left: "8%", right: "8%", top: "52%", height: 2, background: "rgba(255,59,92,.45)", boxShadow: "0 0 18px rgba(255,59,92,.5)", transform: `translateY(${Math.sin(local * 13) * 18}px)` }} />
            </div>
            <div style={{ marginTop: 58, fontSize: 15, color: "rgba(255,190,200,.32)", textAlign: "center", lineHeight: 1.9, position: "relative" }}>本视频仅用于安全科普与已授权测试。演示数据均为虚构。<br />请勿在未授权网络中使用 ARP 劫持或证书解密。</div>
          </div>
        )}
      </World>
    </div>
  );
}
