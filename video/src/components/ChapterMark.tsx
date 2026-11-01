import { useChapter } from "../lib/ChapterContext";
import { easeInOutCubic, progress } from "../lib/time";

export function ChapterMark({ t }: { t: number }) {
  const { chapter } = useChapter();
  const start = chapter.start;
  const inP = progress(t, start + 0.25, 0.6, easeInOutCubic);
  const outP = 1 - progress(t, start + 5.2, 1.0, easeInOutCubic);
  const opacity = Math.min(inP, outP);
  if (opacity <= 0.001) return null;
  return (
    <div className="chapter-mark" style={{ opacity }}>
      <span className="idx">{chapter.tag}</span>
      <span className="bar" />
      <span className="name">{chapter.title}</span>
    </div>
  );
}
