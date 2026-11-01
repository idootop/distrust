/** 小型可复现随机数生成器（mulberry32），保证每次渲染粒子位置一致。 */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function range(seed: number, n: number) {
  const rnd = mulberry32(seed);
  return Array.from({ length: n }, () => rnd());
}

/** 围绕中心的圆盘随机点，返回 [-1,1] 范围。 */
export function discPoint(rnd: () => number) {
  const a = rnd() * Math.PI * 2;
  const r = Math.sqrt(rnd());
  return { x: Math.cos(a) * r, y: Math.sin(a) * r };
}
