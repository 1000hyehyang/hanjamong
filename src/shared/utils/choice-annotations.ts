import hanjaWordsData from "../../data/words/hanja-words.json";
import type { HanjaWordEntry } from "../types/hanja-word";
import type { ChoiceAnnotation, QuizQuestion } from "../types/quiz";

export interface ResolvedChoiceAnnotation {
  meaning: string;
  reading: string;
}

const hanjaWords = hanjaWordsData as HanjaWordEntry[];
const wordById = new Map(hanjaWords.map((word) => [word.id, word]));

function resolveChoiceAnnotation(
  annotation: ChoiceAnnotation,
): ResolvedChoiceAnnotation | undefined {
  if (annotation.wordId) {
    const word = wordById.get(annotation.wordId);
    return word ? { meaning: "", reading: word.reading } : undefined;
  }

  const reading = annotation.reading?.trim();
  const meaning = annotation.meaning?.trim() ?? "";

  return reading ? { meaning, reading } : undefined;
}

export function getChoiceAnnotations(
  question: QuizQuestion,
): (ResolvedChoiceAnnotation | undefined)[] | undefined {
  if (question.choiceAnnotations?.length !== question.choices.length) {
    return undefined;
  }

  const annotations = question.choiceAnnotations.map(resolveChoiceAnnotation);
  return annotations.some(Boolean) ? annotations : undefined;
}
