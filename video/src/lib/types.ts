export type Beat = {
  id: string;
  text: string;
  speak?: string | null;
  voice?: string;
  start: number;
  audioStart: number | null;
  audioDuration: number;
  end: number;
  duration: number;
  hold: boolean;
};

export type Chapter = {
  id: string;
  tag: string;
  index: string;
  title: string;
  subtitle: string;
  mood: string;
  start: number;
  end: number;
  duration: number;
  leadIn: number;
  tail: number;
  beats: Beat[];
};

export type TimelineMeta = {
  title: string;
  subtitle: string;
  series: string;
  fps: number;
  width: number;
  height: number;
  date: string;
};

export type Timeline = {
  meta: TimelineMeta;
  duration: number;
  chapters: Chapter[];
  beats: Beat[];
};
