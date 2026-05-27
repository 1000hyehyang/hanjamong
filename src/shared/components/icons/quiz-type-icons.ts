import type { IconName } from "./Icon";

export const quizTypeIcons: Record<
  "hanja_reading" | "meaning_to_hanja" | "vocabulary" | "idiom" | "reading_comp",
  IconName
> = {
  hanja_reading: "hanja",
  meaning_to_hanja: "pen-line",
  vocabulary: "book-open",
  idiom: "quote",
  reading_comp: "file-text",
};
