import type { QuizQuestion } from "../types/quiz";
import { getChoiceHints, type ChoiceHint } from "./choice-hints";
import { shuffle } from "./shuffle";

export interface ShuffledQuestionChoices {
  choices: string[];
  answerIndex: number;
  choiceHints?: (ChoiceHint | undefined)[];
}

export function shuffleQuestionChoices(
  question: QuizQuestion,
): ShuffledQuestionChoices {
  const hints = getChoiceHints(question);
  const entries = question.choices.map((choice, index) => ({
    choice,
    hint: hints?.[index],
    isAnswer: index === question.answerIndex,
  }));

  const shuffled = shuffle(entries);

  return {
    choices: shuffled.map((entry) => entry.choice),
    answerIndex: shuffled.findIndex((entry) => entry.isAnswer),
    choiceHints: hints ? shuffled.map((entry) => entry.hint) : undefined,
  };
}
