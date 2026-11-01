import { Fragment, type CSSProperties, type ReactNode } from "react";
import { useChapter } from "../lib/ChapterContext";
import { clamp01, easeInOutCubic, easeOutBack, easeOutCubic, progress, spring } from "../lib/time";
import { LockGlyph, RouterGlyph } from "../components/devices";
import { Locky, PhoneBaddie } from "../components/mascots";
import { FloorGrid, SpeedLines, Vignette, World } from "../components/worlds";
import { LogoMark } from "../components/icons";

function Act({ from, to, children, style }: { from: number; to: number; children: ReactNode; fade?: number; style?: CSSProperties }) {
  const { local } = useChapter();
  if (local < from || local >= to) return null;
  return <div style={{ position: "absolute", inset: 0, ...style }}>{children}</div>;
}

function Mac({ children, scale = 1 }: { children: ReactNode; scale?: number }) {
  return (
    <div style={{ width: 800 * scale, height: 540 * scale, position: "relative", filter: "drop-shadow(0 50px 80px rgba(0,0,0,.6))" }}>
      <div style={{ position: "absolute", left: 20 * scale, top: 0, width: 760 * scale, height: 470 * scale, borderRadius: 18 * scale, padding: 10 * scale, background: "linear-gradient(160deg,#2a2c35,#0b0c11 60%,#050609)", border: "1px solid rgba(255,255,255,.16)" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 10 * scale, overflow: "hidden", background: "#05060a" }}>{children}</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 470 * scale, width: 800 * scale, height: 18 * scale, borderRadius: "0 0 14px 14px", background: "linear-gradient(180deg,#3a3d49,#15161d)", border: "1px solid rgba(255,255,255,.12)" }} />
      <div style={{ position: "absolute", left: 150 * scale, top: 476 * scale, width: 160 * scale, height: 6 * scale, borderRadius: 3, background: "rgba(0,0,0,.45)" }} />
    </div>
  );
}

function Phone({ children, scale = 1 }: { children: ReactNode; scale?: number }) {
  return (
    <div style={{ width: 390 * scale, height: 650 * scale, borderRadius: 46 * scale, border: "2px solid rgba(255,92,122,.32)", background: "#07080d", padding: 10 * scale, boxShadow: "0 40px 100px rgba(0,0,0,.65)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "50%", top: 12 * scale, width: 110 * scale, height: 24 * scale, marginLeft: -55 * scale, borderRadius: 20, background: "#05060a", zIndex: 5, border: "1px solid rgba(255,255,255,.05)" }} />
      <div style={{ height: "100%", borderRadius: 36 * scale, overflow: "hidden", background: "radial-gradient(ellipse at 70% 15%, #241a2c, #0a0b12 65%)" }}>{children}</div>
    </div>
  );
}

function DesktopScreen() {
  return (
    <div style={{ height: "100%", position: "relative", overflow: "hidden", background: "radial-gradient(ellipse at 30% 20%, #2b3350, #0a0d16 70%)" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 72% 62%, rgba(79,227,255,.14), transparent 45%), radial-gradient(circle at 22% 68%, rgba(109,77,240,.2), transparent 45%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 28, background: "rgba(4,6,12,.55)", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 18px", fontSize: 11, color: "rgba(255,255,255,.5)" }}>10:24</div>
      <div style={{ position: "absolute", left: 38, top: 64, display: "grid", gridTemplateColumns: "repeat(2, 72px)", gap: 26 }}>
        {["/logos/feishu.ico", "/logos/googlechrome.svg", "/logos/slack.svg", "/logos/curl.svg"].map((src) => (
          <div key={src} style={{ width: 64, height: 64, borderRadius: 15, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)", display: "grid", placeItems: "center" }}>
            <img src={src} alt="" style={{ width: 38, height: 38, objectFit: "contain", opacity: .82 }} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, display: "flex", justifyContent: "center", gap: 16 }}>
        {["/logos/openai.svg", "/logos/anthropic.svg", "/logos/go.svg"].map((src) => (
          <div key={src} style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.06)", display: "grid", placeItems: "center" }}>
            <img src={src} alt="" style={{ width: 28, height: 28, objectFit: "contain", opacity: .7 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatSurface({ t, early, incoming, inject, width = 640, attacker = false }: { t: number; early: number; incoming: number; inject: number; width?: number; attacker?: boolean }) {
  const big = width > 720;
  const bubble = (text: string, side: "l" | "r", p: number, tone: "normal" | "inject" | "dim" = "normal") => {
    const q = clamp01(p);
    return (
    <div style={{ alignSelf: side === "r" ? "flex-end" : "flex-start", maxWidth: "82%", opacity: q, transform: `translate${side === "r" ? "X" : "Y"}(${(1 - q) * 18}px) scale(${0.78 + q * 0.22})`, transformOrigin: side === "r" ? "100% 100%" : "0% 100%", position: "relative" }}>
      <div style={{
        padding: big ? "16px 22px" : "14px 18px",
        borderRadius: 7,
        background: tone === "inject" && attacker ? "#5a1f2b" : side === "r" ? "#95ec69" : "#ffffff",
        color: tone === "inject" && attacker ? "#ffd0d8" : "#111",
        fontSize: big ? 30 : 23,
        lineHeight: 1.45,
        boxShadow: "0 14px 40px rgba(0,0,0,.25)",
        position: "relative",
      }}>
        <div>{text}</div>
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ position: "absolute", [side === "r" ? "right" : "left"]: -9, bottom: 0, transform: side === "l" ? "scaleX(-1)" : undefined }}>
          <path d="M0 0 L14 14 L0 14 Z" fill={tone === "inject" && attacker ? "#5a1f2b" : side === "r" ? "#95ec69" : "#ffffff"} />
        </svg>
      </div>
    </div>
  ); };
  const items = [
    { text: "方案发你了", side: "r" as const, p: progress(t, early, 0.4), tone: "normal" as const },
    { text: "下午三点评审", side: "l" as const, p: progress(t, early + 0.5, 0.4), tone: "dim" as const },
    { text: "收到，我准备一下", side: "r" as const, p: progress(t, early + 0.9, 0.4), tone: "dim" as const },
    { text: "方案什么时候好？", side: "l" as const, p: progress(t, incoming, 0.4), tone: "normal" as const },
    { text: "老子不干了。", side: "r" as const, p: progress(t, inject, 0.4), tone: "inject" as const },
  ];
  return (
    <div style={{ height: "100%", padding: big ? "7% 7%" : "9% 8%", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: big ? 18 : 16, background: "radial-gradient(ellipse at 28% 18%, #222a44, #090c14 70%)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 2, background: "linear-gradient(90deg, transparent, rgba(109,77,240,.4), transparent)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 16, textAlign: "center", fontSize: 11, color: "rgba(255,255,255,.22)", letterSpacing: ".08em" }}>今天 10:24</div>
      {items.map((m, i) => m.p > 0.001 && (
        <Fragment key={i}>{bubble(m.text, m.side, m.p, m.tone)}</Fragment>
      ))}
    </div>
  );
}

export function S5Demo() {
  const { local, at, chapter } = useChapter();
  const useEnd = chapter.end;
  const d1 = at("d1"), d2 = at("d2"), d3 = at("d3"), d7 = at("d7"), d8 = at("d8"), d8b = at("d8b"), d9 = at("d9"), d10 = at("d10");
  const arp = progress(local, d3, 0.7, easeInOutCubic);
  const chat = 1;
  const inject = progress(local, d8b, 0.4, easeOutCubic);
  const unaware = progress(local, d9, 0.6, easeInOutCubic);
  const wall = progress(local, d10, 0.6, easeInOutCubic);

  return (
    <div className="scene" style={{ padding: 0 }}>
      <World variant="lan">
        <FloorGrid color="rgba(79,227,255,.12)" horizon={640} t={local} />
        <Vignette strength={0.55} />

        <Act from={0} to={d7}>
          {/* d1 tool title, centered inside the laptop screen */}
          <div style={{ position: "absolute", left: 170, top: 380, width: 760, height: 480, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 1 - progress(local, d2 - 0.2, 0.5), transform: `scale(${1 + progress(local, d2 - 0.2, 0.5) * 0.12})`, zIndex: 12 }}>
            <div style={{ position: "relative", textAlign: "center" }}>
              <div style={{ fontSize: 120, fontWeight: 800, letterSpacing: "-.045em", color: "#fff", textShadow: "4px 0 rgba(255,59,92,.45), -4px 0 rgba(79,227,255,.38), 0 0 50px rgba(109,77,240,.35)" }}>Distrust</div>
              <div style={{ position: "absolute", left: "8%", right: "8%", top: "54%", height: 2, background: "rgba(255,59,92,.65)", boxShadow: "0 0 18px rgba(255,59,92,.5)", transform: `translateY(${Math.sin(local * 14) * 10}px)` }} />
            </div>
            <div style={{ width: 220, height: 2, marginTop: 20, background: "linear-gradient(90deg, transparent, rgba(79,227,255,.7), transparent)" }} />
          </div>

          {/* router */}
          <div style={{ position: "absolute", left: 875, top: 175, opacity: progress(local, d1 - 0.1, 0.5), transform: `translateY(${arp * -30}px)` }}>
            <RouterGlyph size={180} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: arp > 0.4 ? "#ff5c7a" : "#45e0a0", margin: "8px auto 0", boxShadow: `0 0 20px ${arp > 0.4 ? "#ff5c7a" : "#45e0a0"}` }} />
          </div>

          {/* mac */}
          <div style={{ position: "absolute", left: 150, top: 380, opacity: progress(local, d1 - 0.1, 0.5), transform: "none" }}>
            <Mac>
              <DesktopScreen />
            </Mac>
          </div>

          {/* phone attacker */}
          <div style={{ position: "absolute", right: 230, top: 330, opacity: progress(local, d1 - 0.1, 0.5), transform: `translateY(${arp * 26}px)` }}>
            <PhoneBaddie size={230} mood={arp > 0.4 ? "smug" : "lurk"} t={local} lookX={-0.6} />
          </div>

          {/* paths */}
          <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <path d="M850 510 C 930 430, 960 340, 980 300" fill="none" stroke="rgba(69,224,160,.28)" strokeWidth="3" strokeDasharray="6 8" opacity={0.7 - arp * 0.7} />
            <path d="M850 510 C 1080 650, 1400 620, 1530 520 C 1610 460, 1630 360, 1640 320" fill="none" stroke="rgba(255,92,122,.65)" strokeWidth="3.4" strokeDasharray="7 9" opacity={arp} />
            {[0.2, 0.55, 0.85].map((u, i) => (
              <circle key={i} cx={850 + (1640 - 850) * u} cy={510 - Math.sin(u * Math.PI) * 120} r="5" fill="#ff5c7a" opacity={arp * (0.5 + i * 0.15)} />
            ))}
          </svg>

          {arp > 0.2 && (
            <div style={{ position: "absolute", left: 1050, top: 620, opacity: arp, padding: "14px 22px", borderRadius: 18, background: "rgba(255,92,122,.12)", border: "1px solid rgba(255,92,122,.45)", color: "#ffd0d8", fontSize: 24, transform: "rotate(-3deg)" }}>“我是网关。”</div>
          )}

        </Act>

        {/* chat mirror */}
        <Act from={d7} to={useEnd}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 65% 55% at 50% 48%, rgba(255,92,122,.05), transparent 70%)", transform: `scale(${1 + progress(local, d7, chapter.end - d7, easeInOutCubic) * 0.035})`, transformOrigin: "50% 55%" }}>
            <div style={{ position: "absolute", left: 90, top: 220, opacity: chat, transform: `translateY(${(1 - chat) * 30 + Math.sin(local * 0.8) * 3}px)` }}>
              <Mac>
                <ChatSurface t={local} early={d7} incoming={d8} inject={d8b} width={740} />
              </Mac>
              <div style={{ position: "absolute", left: "8%", right: "8%", bottom: -46, height: 40, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(79,227,255,.12), transparent 70%)", filter: "blur(10px)" }} />
            </div>
            <div style={{ position: "absolute", right: 150, top: 220, opacity: chat, transform: `translateY(${(1 - chat) * 30 + Math.sin(local * 0.8 + 2) * 4}px)` }}>
              <Phone>
                <ChatSurface t={local} early={d7 + 0.25} incoming={d8 + 0.25} inject={d8b + 0.25} width={380} attacker />
              </Phone>
              <div style={{ position: "absolute", left: "12%", right: "12%", bottom: -40, height: 34, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,92,122,.18), transparent 70%)", filter: "blur(10px)" }} />
            </div>
            <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5 }}>
              <path d="M850 560 C 1050 650, 1250 640, 1400 530" fill="none" stroke="rgba(255,92,122,.35)" strokeWidth="3" strokeDasharray="6 10" opacity={progress(local, d7 + 0.1, 0.6)} />
              {[0, 1, 2].map((i) => {
                const u = clamp01((local - d7 - 0.15 - i * 0.48) / 0.45);
                if (u <= 0 || u >= 1) return null;
                return <circle key={i} cx={850 + 550 * u} cy={560 + Math.sin(u * Math.PI) * 80} r="6" fill="#ff5c7a" opacity={0.85} />;
              })}
            </svg>
            {inject > 0.15 && (
              <div style={{ position: "absolute", right: 40, top: 170, width: 500, height: 500, borderRadius: "50%", border: `2px solid rgba(255,92,122,${0.5 * inject})`, transform: `scale(${0.7 + inject * 0.6})`, opacity: inject * 0.7, pointerEvents: "none" }} />
            )}

            {unaware > 0 && wall < 0.2 && (
              <div style={{ position: "absolute", left: 90, bottom: 60, opacity: unaware, display: "flex", alignItems: "flex-end", gap: 20 }}>
                <Locky size={210} mood="happy" t={local} color="#45e0a0" wave={1} />
                
              </div>
            )}

            {wall > 0 && (
              <div style={{ position: "absolute", inset: 0, background: "#05060a", zIndex: 20 }}>
                <div style={{ position: "absolute", inset: 0, opacity: wall, background: "radial-gradient(ellipse 55% 55% at 50% 48%, #10131c, #040509 72%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {["/logos/slack.svg", "/logos/googlechrome.svg", "/logos/electron.svg", "/logos/go.svg", "/logos/python.svg", "/logos/openai.svg", "/logos/anthropic.svg", "/logos/curl.svg"].map((src, i) => {
                  const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
                  return <img key={src} src={src} alt="" style={{ position: "absolute", left: 960 + Math.cos(a) * 390 - 40, top: 500 + Math.sin(a) * 300 - 40, width: 80, height: 80, objectFit: "contain", opacity: 0.28 + (i % 3) * 0.12, filter: "grayscale(.4)", transform: `translateY(${Math.sin(local * 1.45 + i * 1.2) * 12}px) rotate(${Math.sin(local * 1.1 + i) * 3}deg)` }} />;
                })}
                <div style={{ position: "relative", width: 300, height: 300, display: "grid", placeItems: "center", transform: `translateY(${Math.sin(local * 1.3) * 8}px)` }}>
                  <div style={{ position: "absolute", inset: -40, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,227,255,.18), transparent 68%)" }} />
                  <img src="/logos/feishu.ico" alt="" style={{ width: 190, height: 190, objectFit: "contain", filter: "drop-shadow(0 0 50px rgba(79,227,255,.3))" }} />
                  <svg width="300" height="300" style={{ position: "absolute", inset: 0 }}>
                    <path d="M150 20 L138 120 L172 150 L140 210 L166 280" fill="none" stroke="rgba(255,92,122,.7)" strokeWidth="3" />
                    <path d="M138 120 L90 150 M172 150 L225 130 M140 210 L100 245" fill="none" stroke="rgba(255,92,122,.45)" strokeWidth="2" />
                  </svg>
                </div>
                </div>
              </div>
            )}
          </div>
        </Act>
      </World>
    </div>
  );
}
