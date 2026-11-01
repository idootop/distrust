import { useRef, useState } from "react";
import { CHAPTERS } from "../lib/timeline";
import { clamp01, fmtTime } from "../lib/time";
import { CaptionsIcon, BugIcon, ExpandIcon, MuteIcon, PauseIcon, PlayIcon, VolumeIcon } from "./icons";

type PlayerProps = {
  time: number;
  duration: number;
  playing: boolean;
  currentChapterId?: string;
  muted: boolean;
  subtitles: boolean;
  debug: boolean;
  audioAvailable: boolean;
  onToggle: () => void;
  onSeek: (t: number) => void;
  onMute: () => void;
  onSubtitles: () => void;
  onDebug: () => void;
  onFullscreen: () => void;
};

export function Player({
  time,
  duration,
  playing,
  currentChapterId,
  muted,
  subtitles,
  debug,
  audioAvailable,
  onToggle,
  onSeek,
  onMute,
  onSubtitles,
  onDebug,
  onFullscreen,
}: PlayerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const pct = clamp01(time / duration) * 100;

  const seekFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    onSeek(clamp01((clientX - rect.left) / rect.width) * duration);
  };

  return (
    <div className="controls">
      <div className="control-panel">
        <div className="control-top">
          <div className="control-note">
            <span className="kbd">SPACE</span> 播放
            <span className="kbd">← →</span> 逐秒
            <span className="kbd">, .</span> 逐帧
            <span className="kbd">S</span> 字幕
            <span className="kbd">?</span> 全部快捷键
          </div>
          <div className="control-right">
            <button className={`icon-btn ${subtitles ? "active" : ""}`} onClick={onSubtitles} title="字幕 (S)">
              <CaptionsIcon />
            </button>
            <button className={`icon-btn ${debug ? "active" : ""}`} onClick={onDebug} title="安全区 / 调试 (D)">
              <BugIcon />
            </button>
            <button className="icon-btn" onClick={onFullscreen} title="全屏 (F)">
              <ExpandIcon />
            </button>
          </div>
        </div>
        <div className="scrub-row">
          <button className="play-btn" onClick={onToggle} title={playing ? "暂停 (Space)" : "播放 (Space)"}>
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <div className="time-readout">
            <b>{fmtTime(time)}</b> / {fmtTime(duration)}
          </div>
          <div
            className="timeline-wrap"
            ref={trackRef}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              setDragging(true);
              seekFromClientX(e.clientX);
            }}
            onPointerMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setHover(clamp01((e.clientX - rect.left) / rect.width) * duration);
              if (dragging) seekFromClientX(e.clientX);
            }}
            onPointerUp={(e) => {
              setDragging(false);
              try {
                e.currentTarget.releasePointerCapture(e.pointerId);
              } catch {
                /* noop */
              }
            }}
            onPointerLeave={() => {
              if (!dragging) setHover(null);
            }}
          >
            <div className="timeline-track">
              <div className="timeline-fill" style={{ width: `${pct}%` }} />
              <div className="timeline-chapters">
                {CHAPTERS.map((c) => (
                  <span key={c.id} className="timeline-chapter" style={{ left: `${(c.start / duration) * 100}%` }} />
                ))}
              </div>
              <div className="timeline-head" style={{ left: `${pct}%` }} />
            </div>
            {hover !== null && (
              <div className="timeline-hover" style={{ left: `${clamp01(hover / duration) * 100}%` }}>
                {fmtTime(hover)}
                {(() => {
                  const c = CHAPTERS.find((x) => hover >= x.start && hover < x.end);
                  return c ? ` · ${c.tag} ${c.title}` : "";
                })()}
              </div>
            )}
          </div>
          <button className="icon-btn" onClick={onMute} title={muted ? "取消静音 (M)" : "静音 (M)"} disabled={!audioAvailable}>
            {muted || !audioAvailable ? <MuteIcon /> : <VolumeIcon />}
          </button>
        </div>
        <div className="chapter-strip">
          {CHAPTERS.map((c) => (
            <button
              key={c.id}
              className={`chapter-chip ${currentChapterId === c.id ? "active" : ""}`}
              onClick={() => onSeek(c.start + 0.01)}
              title={`${c.title} · ${fmtTime(c.start)}`}
            >
              <span className="n">{c.tag}</span>
              <span>{c.title}</span>
            </button>
          ))}
          <span style={{ flex: 1 }} />
          <span className="mono" style={{ fontSize: 9, color: "var(--faint)", letterSpacing: ".08em", paddingRight: 4 }}>
            {audioAvailable ? "AUDIO READY" : "SILENT PREVIEW"}
          </span>
        </div>
      </div>
    </div>
  );
}
