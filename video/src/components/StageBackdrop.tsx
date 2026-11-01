import { mulberry32 } from "../lib/random";

export function StageBackdrop({ t }: { t: number }) {
  const motes = Array.from({ length: 26 }, (_, i) => {
    const rnd = mulberry32(900 + i * 37);
    const x = rnd() * 1920;
    const y = rnd() * 1080;
    const size = 0.8 + rnd() * 1.8;
    const speed = 3 + rnd() * 9;
    const phase = rnd() * Math.PI * 2;
    return {
      x,
      y: y - ((t * speed) % 120),
      size,
      opacity: 0.05 + rnd() * 0.16,
      phase,
    };
  });

  return (
    <div className="stage-bg">
      <div
        className="bg-grid"
        style={{
          transform: `translate3d(${Math.sin(t * 0.035) * 14}px, ${Math.cos(t * 0.028) * 10}px, 0)`,
        }}
      />
      <div
        className="bg-aurora a"
        style={{
          transform: `translate3d(${Math.sin(t * 0.045) * 40}px, ${Math.cos(t * 0.032) * 26}px, 0) scale(${1 + Math.sin(t * 0.02) * 0.04})`,
        }}
      />
      <div
        className="bg-aurora b"
        style={{
          transform: `translate3d(${Math.cos(t * 0.038) * 34}px, ${Math.sin(t * 0.03) * 22}px, 0) scale(${1 + Math.cos(t * 0.024) * 0.05})`,
        }}
      />
      <div className="bg-vignette" />
      {motes.map((m, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: m.x,
            top: m.y,
            width: m.size,
            height: m.size,
            borderRadius: "50%",
            background: i % 7 === 0 ? "#b9a7ff" : "#dce2ff",
            opacity: m.opacity * (0.7 + 0.3 * Math.sin(t * 0.6 + m.phase)),
            boxShadow: i % 5 === 0 ? "0 0 8px rgba(185,167,255,.5)" : undefined,
          }}
        />
      ))}
      <div className="bg-grain" />
      <div className="bg-bottom-fade" />
    </div>
  );
}
