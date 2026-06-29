export type QuestionType =
  | "hanja_reading"
  | "hanja_structure"
  | "meaning_to_hanja"
  | "vocabulary"
  | "idiom"
  | "reading_comp";

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  grade: number;
  points?: 4 | 6 | 8;
  question: string;
  choices: string[];
  answerIndex: number;
  explanation?: string;
  choiceHints?: string[];
  relatedHanjaIds?: string[];
  source?: string;
}

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  hanja_reading: "한자 읽기",
  hanja_structure: "한자 구조",
  meaning_to_hanja: "뜻 → 한자",
  vocabulary: "한자어",
  idiom: "사자성어",
  reading_comp: "독해",
};
