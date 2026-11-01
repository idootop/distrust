import { AnimatePresence, motion } from "framer-motion";
import { timeline } from "../lib/timeline";
import { fmtTime } from "../lib/time";
import { RichText } from "./RichText";
import { XIcon } from "./icons";

export function ReviewDrawer({
  open,
  t,
  onClose,
  onSeek,
}: {
  open: boolean;
  t: number;
  onClose: () => void;
  onSeek: (t: number) => void;
}) {
  const active = timeline.beats.find((b) => t >= b.start && t < b.end);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="drawer-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.aside
            className="drawer"
            initial={{ x: 440 }}
            animate={{ x: 0 }}
            exit={{ x: 440 }}
            transition={{ type: "tween", duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="drawer-head">
              <div>
                <div className="drawer-title">旁白与分镜</div>
                <div className="drawer-sub">CLICK A LINE TO SEEK · {timeline.beats.filter((b) => b.text).length} LINES</div>
              </div>
              <button className="icon-btn" onClick={onClose}>
                <XIcon />
              </button>
            </div>
            <div className="drawer-body">
              {timeline.chapters.map((c) => (
                <div key={c.id}>
                  <div className="drawer-chapter">
                    <span className="idx">{c.tag}</span>
                    <span className="name">{c.title}</span>
                    <span className="time">{fmtTime(c.start)}</span>
                  </div>
                  {c.beats
                    .filter((b) => b.text.trim())
                    .map((b) => (
                      <button
                        key={b.id}
                        className={`drawer-line ${active?.id === b.id ? "active" : ""}`}
                        onClick={() => onSeek(b.start + 0.01)}
                      >
                        <span className="t">{fmtTime(b.start)}</span>
                        <span>
                          <RichText text={b.text} />
                        </span>
                      </button>
                    ))}
                </div>
              ))}
              <div className="drawer-note">
                视觉稿 v6：2:37，按概念拆分场景，浏览器锁特写，红色片尾。叙事仍对齐 docs/blog.md 的六个章节：事件本身 → 各方响应 → “真的安全吗” → Distrust 演示 → 更大风险 → 行动建议。
                配音为 AI 草稿（+16% 语速，2:37），可在 <span className="mono">scripts/tts.py</span> 里替换 voice / rate，或直接替换{" "}
                <span className="mono">public/audio/vo/*.wav</span>。
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
