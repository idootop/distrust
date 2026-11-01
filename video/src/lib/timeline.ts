import raw from "../generated/timeline.json";
import type { Chapter, Timeline } from "./types";

export const timeline = raw as Timeline;

export const CHAPTERS = timeline.chapters;
export const DURATION = timeline.duration;
export const FPS = timeline.meta.fps;

export const chapterById = (id: string): Chapter | undefined => CHAPTERS.find((c) => c.id === id);

export function chapterAt(t: number): Chapter | undefined {
  return CHAPTERS.find((c) => t >= c.start && t < c.end);
}
