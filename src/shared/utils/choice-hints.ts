import type { QuizQuestion } from "../types/quiz";

export interface ChoiceHint {
  meaning: string;
  reading: string;
}

function parseStoredChoiceHint(hint: string): ChoiceHint | undefined {
  if (!hint.trim()) {
    return undefined;
  }

  const parenMatch = hint.match(/\(([^)]+)\)/);
  const inner = parenMatch ? parenMatch[1] : hint;
  const lastSpace = inner.lastIndexOf(" ");

  if (lastSpace <= 0) {
    return { meaning: "", reading: inner.trim() };
  }

  return {
    meaning: inner.slice(0, lastSpace),
    reading: inner.slice(lastSpace + 1),
  };
}

export function getChoiceHints(
  question: QuizQuestion,
): (ChoiceHint | undefined)[] | undefined {
  if (question.choiceHints?.length !== question.choices.length) {
    return undefined;
  }

  const hints = question.choiceHints.map(parseStoredChoiceHint);
  return hints.some(Boolean) ? hints : undefined;
}
