import { XIcon } from "./icons";

const ROWS: [string, string][] = [
  ["Space", "播放 / 暂停"],
  ["← / →", "后退 / 前进 1 秒"],
  ["Shift + ← / →", "后退 / 前进 5 秒"],
  [", / .", "逐帧后退 / 前进"],
  ["1 – 7", "跳到第 N 章"],
  ["S", "显示 / 隐藏字幕"],
  ["M", "静音"],
  ["D", "安全区 / 调试叠加"],
  ["F", "全屏"],
  ["R", "复制当前时间码"],
  ["Home / End", "回到开头 / 结尾"],
];

export function HelpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="help-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h3>审阅快捷键</h3>
            <div className="mono" style={{ fontSize: 9.5, color: "var(--faint)", letterSpacing: ".08em" }}>
              LANDSCAPE CUT · 1920 × 1080 · 30 FPS
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <XIcon />
          </button>
        </div>
        <div className="help-grid" style={{ marginTop: 20 }}>
          {ROWS.map(([k, v]) => (
            <div key={k} style={{ display: "contents" }}>
              <b className="mono" style={{ fontSize: 11 }}>{k}</b>
              <span>{v}</span>
            </div>
          ))}
        </div>
        <div className="hint">
          网址参数：<span className="mono">?t=42.5</span> 从指定秒数开始；<span className="mono">?chapter=c4</span> 从某章开始；
          <span className="mono">?debug=1</span> 打开安全区；<span className="mono">?sub=0</span> 关闭字幕；
          <span className="mono">?record=1</span> 进入无界面录制模式。
        </div>
      </div>
    </div>
  );
}
