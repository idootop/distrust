import { useChapter } from "../lib/ChapterContext";
import { clamp01, easeInOutCubic, easeOutCubic, easeOutExpo, progress, spring } from "../lib/time";
import { LaptopFrame, LockGlyph, PhoneFrame, WifiGlyph } from "../components/devices";
import { mulberry32 } from "../lib/random";

const MESSAGES = [
  { side: "left", name: "王总", text: "这个季度奖金，周五到账。", time: "10:41", at: 6.9 },
  { side: "right", name: "我", text: "收到，先别对外说。", time: "10:42", at: 9.1 },
  { side: "left", name: "王总", text: "名单在附件里，你看一下。", time: "10:44", at: 12.6 },
] as const;

function Bubble({
  side,
  name,
  text,
  time,
  t,
  at,
  compact = false,
}: {
  side: "left" | "right";
  name: string;
  text: string;
  time: string;
  t: number;
  at: number;
  compact?: boolean;
}) {
  const p = progress(t, at, 0.55, easeOutCubic);
  const y = (1 - spring(t, at, { stiffness: 150, damping: 19 })) * 22;
  const isLeft = side === "left";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isLeft ? "row" : "row-reverse",
        gap: compact ? 8 : 12,
        alignItems: "flex-start",
        opacity: p,
        transform: `translateY(${y}px)`,
        marginBottom: compact ? 10 : 15,
      }}
    >
      <div
        style={{
          width: compact ? 26 : 32,
          height: compact ? 26 : 32,
          borderRadius: 8,
          flex: "0 0 auto",
          display: "grid",
          placeItems: "center",
          fontSize: compact ? 10 : 12,
          fontWeight: 600,
          background: isLeft ? "rgba(79,227,255,.14)" : "rgba(139,108,255,.2)",
          color: isLeft ? "#4fe3ff" : "#c4b5fd",
          border: "1px solid rgba(255,255,255,.08)",
        }}
      >
        {isLeft ? "王" : "我"}
      </div>
      <div style={{ maxWidth: compact ? "76%" : "72%" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 7,
            marginBottom: 4,
            justifyContent: isLeft ? "flex-start" : "flex-end",
            fontSize: compact ? 10 : 12,
            color: "rgba(255,255,255,.38)",
          }}
        >
          <span>{name}</span>
          <span className="mono" style={{ fontSize: compact ? 7.5 : 9, opacity: 0.65 }}>{time}</span>
        </div>
        <div
          style={{
            padding: compact ? "9px 12px" : "12px 17px",
            borderRadius: isLeft ? "4px 13px 13px 13px" : "13px 4px 13px 13px",
            background: isLeft ? "rgba(255,255,255,.065)" : "rgba(109,77,240,.26)",
            border: `1px solid ${isLeft ? "rgba(255,255,255,.07)" : "rgba(139,108,255,.2)"}`,
            color: "rgba(255,255,255,.9)",
            fontSize: compact ? 12.5 : 17,
            lineHeight: 1.55,
            letterSpacing: ".01em",
            boxShadow: "0 4px 14px rgba(0,0,0,.18)",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
}

function LockBadge({ t }: { t: number }) {
  const p = progress(t, 5.4, 0.7, easeOutCubic);
  const glow = 0.65 + 0.35 * Math.sin(t * 2.2);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 8px",
        borderRadius: 6,
        border: "1px solid rgba(69,224,160,.25)",
        background: "rgba(69,224,160,.07)",
        color: "#68edb8",
        fontFamily: "var(--mono)",
        fontSize: 8.5,
        letterSpacing: ".04em",
        opacity: p,
        boxShadow: `0 0 18px rgba(69,224,160,${0.08 * glow})`,
      }}
    >
      <LockGlyph size={12} color="#45e0a0" />
      HTTPS
    </div>
  );
}

function ChatWindow({ t, phone = false }: { t: number; phone?: boolean }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: phone ? "#080a10" : "#090a10" }}>
      <div
        style={{
          height: phone ? 66 : 58,
          flex: "0 0 auto",
          borderBottom: "1px solid rgba(255,255,255,.06)",
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: phone ? "18px 13px 0" : "0 18px",
          background: "rgba(255,255,255,.015)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: phone ? 12 : 15, fontWeight: 500, color: "rgba(255,255,255,.86)" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: phone ? "#ff5c7a" : "#45e0a0", boxShadow: `0 0 8px ${phone ? "#ff5c7a" : "#45e0a0"}` }} />
          {phone ? "DISTRUST · 消息审计" : "飞书 · 项目群（演示）"}
        </div>
        <div style={{ flex: 1 }} />
        {!phone && <LockBadge t={t} />}
        {phone && (
          <div className="mono" style={{ fontSize: 7.5, color: "#ff8ba0", border: "1px solid rgba(255,92,122,.25)", background: "rgba(255,92,122,.08)", borderRadius: 4, padding: "3px 5px", letterSpacing: ".1em" }}>
            LIVE
          </div>
        )}
      </div>
      <div style={{ flex: 1, padding: phone ? "13px 13px 10px" : "20px 26px", overflow: "hidden", position: "relative" }}>
        {!phone && (
          <div className="mono" style={{ fontSize: 8, color: "rgba(255,255,255,.24)", letterSpacing: ".08em", marginBottom: 14 }}>
            TUESDAY · 10:41 · 项目群
          </div>
        )}
        {phone && (
          <div className="mono" style={{ fontSize: 7, color: "rgba(255,92,122,.55)", letterSpacing: ".08em", marginBottom: 8 }}>
            实时镜像 · 演示数据
          </div>
        )}
        {MESSAGES.map((m, i) => (
          <Bubble
            key={i}
            side={m.side}
            name={phone ? (m.side === "left" ? "王总 →" : "我 →") : m.name}
            text={m.text}
            time={m.time}
            t={t}
            at={m.at + (phone ? 0.35 : 0)}
            compact={phone}
          />
        ))}
        {phone && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${((t * 0.11) % 1) * 100}%`,
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(255,92,122,.65), transparent)",
              boxShadow: "0 0 12px rgba(255,92,122,.55)",
              opacity: progress(t, 6.3, 1.0, easeOutCubic) * 0.9,
            }}
          />
        )}
      </div>
      <div style={{ flex: "0 0 auto", padding: phone ? "0 12px 14px" : "0 18px 16px" }}>
        <div
          style={{
            height: phone ? 30 : 36,
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,.07)",
            background: "rgba(255,255,255,.025)",
            display: "flex",
            alignItems: "center",
            padding: "0 10px",
            color: "rgba(255,255,255,.24)",
            fontSize: phone ? 9.5 : 11,
          }}
        >
          {phone ? "正在监听明文消息…" : "输入消息…"}
        </div>
      </div>
    </div>
  );
}

function PacketLink({ t }: { t: number }) {
  const p = progress(t, 6.0, 0.9, easeOutCubic);
  const pts = [
    { x: 1138, y: 542 },
    { x: 1222, y: 494 },
    { x: 1252, y: 494 },
    { x: 1326, y: 542 },
  ];
  const curve = (u: number) => {
    const [a, b, c, d] = pts;
    const v = 1 - u;
    return {
      x: v * v * v * a.x + 3 * v * v * u * b.x + 3 * v * u * u * c.x + u * u * u * d.x,
      y: v * v * v * a.y + 3 * v * v * u * b.y + 3 * v * u * u * c.y + u * u * u * d.y,
    };
  };
  const dots = Array.from({ length: 3 }, (_, i) => {
    const u = ((t * 0.22 + i / 3) % 1);
    return { ...curve(u), o: 0.35 + 0.65 * Math.sin(u * Math.PI) };
  });
  return (
    <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, opacity: p, pointerEvents: "none" }}>
      <path d="M1138 542 C 1222 494, 1252 494, 1326 542" fill="none" stroke="rgba(255,92,122,.32)" strokeWidth="1.4" strokeDasharray="4 7" />
      {dots.map((d, i) => (
        <g key={i} opacity={d.o}>
          <circle cx={d.x} cy={d.y} r="7" fill="rgba(255,92,122,.12)" />
          <circle cx={d.x} cy={d.y} r="2.6" fill="#ff5c7a" />
        </g>
      ))}
      <text x="1178" y="478" fill="rgba(255,92,122,.55)" fontSize="11" fontFamily="var(--mono)" letterSpacing=".14em">SAME LAN</text>
    </svg>
  );
}

function TitleCard({ t }: { t: number }) {
  const p = progress(t, 20.3, 1.6, easeOutExpo);
  const subP = progress(t, 21.3, 1.2, easeOutCubic);
  const crack = progress(t, 20.1, 1.8, easeInOutCubic);
  const shards = Array.from({ length: 7 }, (_, i) => {
    const rnd = mulberry32(220 + i * 11);
    return { x: 300 + rnd() * 1320, y: 120 + rnd() * 800, r: rnd() * 360, s: 30 + rnd() * 90, o: 0.06 + rnd() * 0.14 };
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(ellipse 60% 50% at 50% 48%, rgba(10,11,18,.35), rgba(5,6,10,.94) 78%)",
        opacity: Math.min(1, p * 1.1),
      }}
    >
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="crackGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgba(185,167,255,0)" />
            <stop offset=".35" stopColor="rgba(185,167,255,.7)" />
            <stop offset=".65" stopColor="rgba(255,255,255,.75)" />
            <stop offset="1" stopColor="rgba(139,108,255,0)" />
          </linearGradient>
        </defs>
        <path
          d="M760 90 L 845 260 L 790 365 L 900 470 L 815 610 L 930 720 L 880 860 L 1000 1010"
          fill="none"
          stroke="url(#crackGrad)"
          strokeWidth="2.4"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - crack}
          opacity=".8"
        />
        <path
          d="M760 90 L 845 260 L 790 365 L 900 470 L 815 610 L 930 720 L 880 860 L 1000 1010"
          fill="none"
          stroke="rgba(139,108,255,.18)"
          strokeWidth="14"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - crack}
          style={{ filter: "blur(10px)" }}
        />
      </svg>
      {shards.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: s.x,
            top: s.y,
            width: s.s,
            height: s.s * 0.6,
            background: "linear-gradient(135deg, rgba(185,167,255,.2), rgba(255,255,255,.01))",
            clipPath: "polygon(0 18%, 100% 0, 74% 100%, 8% 82%)",
            transform: `rotate(${s.r}deg) translateY(${Math.sin(t * 0.4 + i) * 8}px)`,
            opacity: s.o,
          }}
        />
      ))}
      <div style={{ position: "relative", textAlign: "center" }}>
        <div className="mono" style={{ fontSize: 14, letterSpacing: ".3em", color: "rgba(185,167,255,.75)", marginBottom: 26, opacity: p }}>
          A DISTRUST ORIGINAL · 2026.10
        </div>
        <h1
          className="display"
          style={{
            fontSize: 172,
            lineHeight: 0.98,
            letterSpacing: "-.075em",
            margin: 0,
            textShadow: "0 0 80px rgba(139,108,255,.28)",
            transform: `translateY(${(1 - p) * 26}px)`,
            filter: `blur(${(1 - p) * 12}px)`,
          }}
        >
          信任的裂缝
        </h1>
        <div
          style={{
            marginTop: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            opacity: subP,
            transform: `translateY(${(1 - subP) * 12}px)`,
          }}
        >
          <span style={{ height: 1, width: 64, background: "linear-gradient(90deg, transparent, rgba(255,255,255,.35))" }} />
          <p style={{ margin: 0, fontSize: 34, letterSpacing: ".02em", color: "rgba(255,255,255,.8)" }}>
            8 个数字，如何让整个局域网裸奔
          </p>
          <span style={{ height: 1, width: 64, background: "linear-gradient(90deg, rgba(255,255,255,.35), transparent)" }} />
        </div>
        <div className="mono" style={{ marginTop: 24, fontSize: 12, letterSpacing: ".16em", color: "rgba(255,255,255,.34)", opacity: subP }}>
          eMUDHRA INTERMEDIATE CA · 0x01—0x06
        </div>
      </div>
    </div>
  );
}

export function Prologue() {
  const { local } = useChapter();
  const deskIn = progress(local, 4.4, 1.2, easeInOutCubic);
  const lockIn = progress(local, 16.3, 0.9, easeOutCubic);
  const zoom = 1 + progress(local, 16.3, 3.2, easeInOutCubic) * 0.12;
  const title = local > 20.1;
  const fadeDesk = 1 - progress(local, 19.6, 1.4, easeInOutCubic);
  const chips = [
    { label: "0 证书安装", at: 12.0 },
    { label: "0 代理设置", at: 12.5 },
    { label: "0 目标感知", at: 13.0 },
  ];

  return (
    <div className="scene" style={{ padding: 0 }}>
      {/* Act I: Wi-Fi close-up */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: 1 - progress(local, 4.3, 1.0, easeInOutCubic),
          transform: `scale(${1 + progress(local, 1.2, 5, easeOutCubic) * 0.08})`,
        }}
      >
        <div style={{ position: "relative", width: 300, height: 300, display: "grid", placeItems: "center" }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 200 + i * 46,
                height: 200 + i * 46,
                borderRadius: "50%",
                border: "1px solid rgba(79,227,255,.09)",
                transform: `scale(${1 + Math.sin(local * 0.8 - i * 0.7) * 0.02})`,
              }}
            />
          ))}
          <div
            style={{
              width: 170,
              height: 170,
              borderRadius: 44,
              display: "grid",
              placeItems: "center",
              background: "radial-gradient(circle at 40% 30%, rgba(79,227,255,.12), rgba(79,227,255,.02))",
              border: "1px solid rgba(79,227,255,.16)",
              boxShadow: "0 0 100px rgba(79,227,255,.1)",
            }}
          >
            <WifiGlyph size={90} />
          </div>
        </div>
        <div className="mono" style={{ marginTop: 34, fontSize: 12, letterSpacing: ".26em", color: "rgba(79,227,255,.5)" }}>
          同一个 Wi-Fi · 同一段空气
        </div>
        <div style={{ marginTop: 14, fontSize: 19, color: "rgba(255,255,255,.3)" }}>你正在这里</div>
      </div>

      {/* Act II: desk scene */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: deskIn * fadeDesk * (1 - 0.62 * lockIn),
          transform: `scale(${zoom})`,
          transformOrigin: "55% 50%",
        }}
      >
        <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
          <circle cx="960" cy="520" r="560" fill="rgba(109,77,240,.035)" filter="blur(80px)" />
          <line x1="100" y1="900" x2="1820" y2="900" stroke="rgba(255,255,255,.06)" />
        </svg>

        <div style={{ position: "absolute", left: 142, top: 208 }}>
          <LaptopFrame width={986} tilt={5}>
            <ChatWindow t={local} />
          </LaptopFrame>
          <div className="mono" style={{ marginTop: 26, textAlign: "center", fontSize: 12, letterSpacing: ".2em", color: "rgba(255,255,255,.36)" }}>
            你的 Mac · 旧版桌面客户端
          </div>
        </div>

        <div style={{ position: "absolute", left: 1320, top: 158 }}>
          <PhoneFrame width={352} height={736} tilt={-5}>
            <ChatWindow t={local} phone />
          </PhoneFrame>
          <div className="mono" style={{ marginTop: 20, textAlign: "center", fontSize: 12, letterSpacing: ".2em", color: "rgba(255,92,122,.55)" }}>
            同一个 Wi-Fi · 攻击者
          </div>
        </div>

        <PacketLink t={local} />

        {chips.map((c, i) => {
          const p = progress(local, c.at, 0.6, easeOutCubic) * (1 - progress(local, 16.2, 0.7, easeOutCubic));
          return (
            <div
              key={c.label}
              style={{
                position: "absolute",
                left: 760 + i * 230,
                top: 940,
                padding: "9px 14px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,.1)",
                background: "rgba(255,255,255,.035)",
                color: "rgba(255,255,255,.62)",
                fontSize: 15,
                letterSpacing: ".04em",
                opacity: p,
                transform: `translateY(${(1 - p) * 10}px)`,
              }}
            >
              <span style={{ color: "#ff8ba0", marginRight: 8 }}>✕</span>
              {c.label}
            </div>
          );
        })}
      </div>

      {/* Act III: the green lock */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: lockIn * (1 - progress(local, 20.0, 1.2, easeInOutCubic)),
          transform: `scale(${0.9 + lockIn * 0.1})`,
          zIndex: 20,
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(5,6,10,.92) 0%, rgba(5,6,10,.82) 38%, rgba(5,6,10,.25) 66%, transparent 80%)" }} />
        <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
          <div style={{ position: "absolute", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(69,224,160,.14), transparent 68%)", filter: "blur(20px)" }} />
          <LockGlyph size={248} color="#45e0a0" />
          <div className="mono" style={{ position: "absolute", top: -54, fontSize: 13, letterSpacing: ".24em", color: "rgba(69,224,160,.6)" }}>
            TLS 1.3 · 证书有效
          </div>
          <div className="mono" style={{ position: "absolute", bottom: -58, fontSize: 14, letterSpacing: ".22em", color: "rgba(255,255,255,.5)" }}>
            锁，还是绿的
          </div>
        </div>
      </div>

      {title && <TitleCard t={local} />}
    </div>
  );
}
