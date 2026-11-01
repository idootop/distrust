import { createContext, useContext, type ReactNode } from "react";
import type { Beat, Chapter } from "./types";

export type ChapterApi = {
  chapter: Chapter;
  t: number;
  local: number;
  duration: number;
  /** 章节内某个 beat 的开始时间（可加偏移） */
  at: (beatId: string, offset?: number) => number;
  /** 章节内某个 beat 的结束时间（可加偏移） */
  after: (beatId: string, offset?: number) => number;
  beat: (beatId: string) => Beat;
  /** 当前是否已经进入某个 beat */
  entered: (beatId: string) => boolean;
};

const Ctx = createContext<ChapterApi | null>(null);

export function ChapterProvider({ chapter, t, children }: { chapter: Chapter; t: number; children: ReactNode }) {
  const local = t - chapter.start;
  const beat = (id: string) => {
    const b = chapter.beats.find((x) => x.id === id);
    if (!b) throw new Error(`Unknown beat ${id} in chapter ${chapter.id}`);
    return b;
  };
  const api: ChapterApi = {
    chapter,
    t,
    local,
    duration: chapter.duration,
    at: (id, offset = 0) => beat(id).start - chapter.start + offset,
    after: (id, offset = 0) => beat(id).end - chapter.start + offset,
    beat,
    entered: (id) => local >= beat(id).start - chapter.start,
  };
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useChapter(): ChapterApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useChapter must be used inside ChapterProvider");
  return ctx;
}
