import { CHAPTERS, timeline } from "../lib/timeline";
import { ChapterProvider, useChapter } from "../lib/ChapterContext";
import { easeInOutCubic, easeInOutSine, progress } from "../lib/time";
import { SCENES } from "../scenes";
import { StageBackdrop } from "./StageBackdrop";
import { Subtitles } from "./Subtitles";

function SceneFade({ chapter, t }: { chapter: (typeof CHAPTERS)[number]; t: number }) {
  const Comp = SCENES[chapter.id];
  if (!Comp) return null;
  if (t < chapter.start || t >= chapter.end) return null;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.018 * progress(t, chapter.start, chapter.duration, easeInOutSine)})`, transformOrigin: "50% 50%" }}>
        <ChapterProvider chapter={chapter} t={t}>
          <Comp />
        </ChapterProvider>
      </div>
    </div>
  );
}

function DebugOverlay({ t }: { t: number }) {
  const current = timeline.chapters.find((c) => t >= c.start && t < c.end);
  return (
    <div className="debug-overlay">
      <div className="safe" />
      <div className="subsafe" />
      <div className="cross-h" />
      <div className="cross-v" />
      <div className="meta">
        t = {t.toFixed(2)}s · f = {Math.round(t * timeline.meta.fps)} · {current?.tag ?? "—"} {current?.title ?? ""}
        <br />
        1920 × 1080 · {timeline.meta.fps} fps · subtitle safe 150px
      </div>
    </div>
  );
}

function StageFooter({ t }: { t: number }) {
  const current = timeline.chapters.find((c) => t >= c.start && t < c.end);
  return (
    <div className="stage-footer">
      <span className="brand">DISTRUST</span>
      <span className="sep" />
      <span>信任的裂缝</span>
      <span className="sep" />
      <span>2026</span>
      <span style={{ marginLeft: 14, opacity: 0.6 }}>{current ? `${current.tag} / ${current.title}` : ""}</span>
    </div>
  );
}

export function Stage({
  t,
  subtitles,
  debug,
}: {
  t: number;
  subtitles: boolean;
  debug: boolean;
}) {
  const visible = timeline.chapters.filter((c) => t >= c.start - 0.2 && t <= c.end + 0.6);
  const current = timeline.chapters.find((c) => t >= c.start && t < c.end) ?? timeline.chapters[timeline.chapters.length - 1];

  return (
    <div className="stage">
      <StageBackdrop t={t} />
      <div className="stage-content">
        {visible.map((c) => (
          <SceneFade key={c.id} chapter={c} t={t} />
        ))}
      </div>
      <Subtitles t={t} enabled={subtitles} />
      {debug && <DebugOverlay t={t} />}
    </div>
  );
}
