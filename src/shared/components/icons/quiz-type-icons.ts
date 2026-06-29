import type { IconName } from "./Icon";

export const quizTypeIcons: Record<
  | "hanja_reading"
  | "hanja_structure"
  | "meaning_to_hanja"
  | "vocabulary"
  | "idiom"
  | "reading_comp",
  IconName
> = {
  hanja_reading: "hanja",
  hanja_structure: "layers",
  meaning_to_hanja: "pen-line",
  vocabulary: "book-open",
  idiom: "quote",
  reading_comp: "file-text",
};
