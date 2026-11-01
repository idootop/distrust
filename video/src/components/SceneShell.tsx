import { useEffect, useState, type ReactNode } from "react";
import { useChapter } from "../lib/ChapterContext";
import { easeInOutCubic, easeOutCubic, progress } from "../lib/time";

/** 场景容器：统一处理章节淡入淡出与安全区。 */
export function SceneShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`scene ${className}`}>{children}</div>;
}

/** 一个轻量的渐显容器，供普通场景使用。 */
export function Reveal({
  at,
  duration = 0.8,
  y = 20,
  blur = 6,
  children,
  style,
  className,
}: {
  at: number;
  duration?: number;
  y?: number;
  blur?: number;
  children: ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  const { local } = useChapter();
  const p = progress(local, at, duration, easeOutCubic);
  return (
    <div
      className={className}
      style={{
        opacity: p,
        transform: `translate3d(0, ${(1 - p) * y}px, 0)`,
        filter: blur > 0 ? `blur(${(1 - p) * blur}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** 一个轻量的场景内“硬切”黑场，用于制造节奏。 */
export function Blackout({ until }: { until: number }) {
  const { local } = useChapter();
  const p = 1 - progress(local, until, 0.4, easeInOutCubic);
  if (p <= 0) return null;
  return <div style={{ position: "absolute", inset: 0, background: "#05060a", opacity: p, zIndex: 80 }} />;
}

export function useImageLoaded(src: string) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.onload = () => setOk(true);
    img.onerror = () => setOk(true);
    img.src = src;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);
  return ok;
}
