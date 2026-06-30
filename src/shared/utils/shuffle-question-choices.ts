import type { QuizQuestion } from "../types/quiz";
import {
  getChoiceAnnotations,
  type ResolvedChoiceAnnotation,
} from "./choice-annotations";
import { shuffle } from "./shuffle";

export interface ShuffledQuestionChoices {
  choices: string[];
  answerIndex: number;
  choiceAnnotations?: (ResolvedChoiceAnnotation | undefined)[];
}

export function shuffleQuestionChoices(
  question: QuizQuestion,
): ShuffledQuestionChoices {
  const annotations = getChoiceAnnotations(question);
  const entries = question.choices.map((choice, index) => ({
    choice,
    annotation: annotations?.[index],
    isAnswer: index === question.answerIndex,
  }));

  const shuffled = shuffle(entries);

  return {
    choices: shuffled.map((entry) => entry.choice),
    answerIndex: shuffled.findIndex((entry) => entry.isAnswer),
    choiceAnnotations: annotations
      ? shuffled.map((entry) => entry.annotation)
      : undefined,
  };
}
