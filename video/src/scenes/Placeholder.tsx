import { useChapter } from "../lib/ChapterContext";

export function Placeholder() {
  const { chapter, local, duration } = useChapter();
  const p = Math.min(1, Math.max(0, local / duration));
  return (
    <div className="scene center">
      <div className="kicker plain">{chapter.tag} · {chapter.index}</div>
      <h1 className="display h1" style={{ marginTop: 28 }}>{chapter.title}</h1>
      <p className="sub" style={{ marginTop: 18 }}>{chapter.subtitle}</p>
      <div style={{ marginTop: 70, width: 560, height: 3, background: "rgba(255,255,255,.1)", borderRadius: 9, overflow: "hidden" }}>
        <div style={{ width: `${p * 100}%`, height: "100%", background: "var(--purple)" }} />
      </div>
      <div className="mono faint" style={{ marginTop: 14, fontSize: 14 }}>SCENE IN PROGRESS · {local.toFixed(1)}s / {duration.toFixed(1)}s</div>
    </div>
  );
}
