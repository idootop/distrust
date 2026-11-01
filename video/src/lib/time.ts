export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const clamp01 = (x: number) => clamp(x, 0, 1);
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const invLerp = (a: number, b: number, x: number) => clamp01((x - a) / (b - a || 1));

export type Ease = (x: number) => number;

export const linear: Ease = (x) => x;
export const easeInQuad: Ease = (x) => x * x;
export const easeOutQuad: Ease = (x) => 1 - (1 - x) * (1 - x);
export const easeInOutQuad: Ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
export const easeInCubic: Ease = (x) => x * x * x;
export const easeOutCubic: Ease = (x) => 1 - Math.pow(1 - x, 3);
export const easeInOutCubic: Ease = (x) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
export const easeOutQuint: Ease = (x) => 1 - Math.pow(1 - x, 5);
export const easeInOutQuint: Ease = (x) =>
  x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
export const easeOutExpo: Ease = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
export const easeInExpo: Ease = (x) => (x <= 0 ? 0 : Math.pow(2, 10 * x - 10));
export const easeInOutExpo: Ease = (x) =>
  x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
export const easeOutBack: Ease = (x) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
export const easeOutElastic: Ease = (x) => {
  if (x === 0 || x === 1) return x;
  const c4 = (2 * Math.PI) / 3;
  return Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
};
export const easeInOutSine: Ease = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
export const smoothstep: Ease = (x) => x * x * (3 - 2 * x);

/** 从 start 开始、持续 duration 秒的 0→1 进度。 */
export function progress(t: number, start: number, duration: number, ease: Ease = easeOutCubic): number {
  if (duration <= 0) return t >= start ? 1 : 0;
  return ease(clamp01((t - start) / duration));
}

/** 对称的进入/退出包络，用于镜头、字幕。 */
export function envelope(t: number, start: number, end: number, fadeIn = 0.4, fadeOut = 0.4, ease: Ease = easeInOutCubic) {
  const a = progress(t, start, fadeIn, ease);
  const b = 1 - progress(t, end - fadeOut, fadeOut, ease);
  return Math.min(a, b);
}

/** 阻尼弹簧的解析解，可用于确定性的 UI 弹入。 */
export function spring(
  t: number,
  start = 0,
  { stiffness = 140, damping = 18 }: { stiffness?: number; damping?: number } = {},
): number {
  const tau = t - start;
  if (tau <= 0) return 0;
  const w0 = Math.sqrt(stiffness);
  const zeta = damping / (2 * w0);
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * w0 * tau) * (Math.cos(wd * tau) + ((zeta * w0) / wd) * Math.sin(wd * tau));
  }
  if (Math.abs(zeta - 1) < 1e-6) {
    return 1 - Math.exp(-w0 * tau) * (1 + w0 * tau);
  }
  const root = Math.sqrt(zeta * zeta - 1);
  const r1 = -w0 * (zeta - root);
  const r2 = -w0 * (zeta + root);
  const c2 = (1 - r1) / (r2 - r1);
  const c1 = 1 - c2;
  return 1 - (c1 * Math.exp(r1 * tau) + c2 * Math.exp(r2 * tau));
}

/** 按 index 依次错开的进度。 */
export function stagger(
  t: number,
  start: number,
  index: number,
  step = 0.07,
  duration = 0.6,
  ease: Ease = easeOutCubic,
): number {
  return progress(t, start + index * step, duration, ease);
}

export function blink(t: number, period = 1.1, duty = 0.55): number {
  const p = ((t % period) + period) % period;
  return p < period * duty ? 1 : 0;
}

/** 衰减脉冲，从 start 开始指数衰减。 */
export function decay(t: number, start: number, rate = 5): number {
  const tau = t - start;
  return tau < 0 ? 0 : Math.exp(-rate * tau);
}

/** 供 CSS 过渡使用的进入参数。 */
export function reveal(
  t: number,
  start: number,
  { duration = 0.8, distance = 24, blur = 8, ease = easeOutCubic } = {},
) {
  const p = progress(t, start, duration, ease);
  return {
    p,
    opacity: p,
    transform: `translate3d(0, ${(1 - p) * distance}px, 0)`,
    filter: blur > 0 ? `blur(${(1 - p) * blur}px)` : undefined,
  };
}

export const fmtTime = (sec: number, withFrames = false, fps = 30) => {
  const s = Math.max(0, sec);
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  if (!withFrames) return `${m}:${String(ss).padStart(2, "0")}`;
  const f = Math.floor((s % 1) * fps);
  return `${m}:${String(ss).padStart(2, "0")}.${String(f).padStart(2, "0")}`;
};

export const fmtNumber = (n: number) => new Intl.NumberFormat("en-US").format(n);

export const mod = (n: number, m: number) => ((n % m) + m) % m;
