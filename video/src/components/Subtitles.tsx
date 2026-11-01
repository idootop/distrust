import { timeline } from "../lib/timeline";
import { clamp01, easeInOutCubic } from "../lib/time";

function renderText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <em key={i}>{part.slice(2, -2)}</em>;
    }
    return <span key={i}>{part}</span>;
  });
}

export function Subtitles({ t, enabled }: { t: number; enabled: boolean }) {
  if (!enabled) return null;
  const beat = timeline.beats.find(
    (b) =>
      b.audioStart !== null &&
      b.text.trim().length > 0 &&
      t >= b.audioStart &&
      t <= b.audioStart + b.audioDuration + 0.18,
  );
  if (!beat || beat.audioStart === null) return null;
  const fadeIn = 1;
  const fadeOut = clamp01((beat.audioStart + beat.audioDuration + 0.18 - t) / 0.18);
  const opacity = fadeOut;
  const y = 0;
  return (
    <div className="subtitles" style={{ opacity, transform: `translateX(-50%) translateY(${y}px)` }}>
      <span className="line">{renderText(beat.text)}</span>
    </div>
  );
}
