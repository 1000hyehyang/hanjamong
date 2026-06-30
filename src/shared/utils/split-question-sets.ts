const SET_SIZE = 10;
const MERGE_REMAINDER_THRESHOLD = 9;
export const QUESTION_SET_MIN_COUNT = 21;

export function shouldUseQuestionSets(questionCount: number): boolean {
  return questionCount >= QUESTION_SET_MIN_COUNT;
}

export function splitQuestionSets<T>(items: readonly T[]): T[][] {
  if (items.length < QUESTION_SET_MIN_COUNT) {
    return items.length > 0 ? [items.slice()] : [];
  }

  const sets: T[][] = [];
  let index = 0;

  while (index < items.length) {
    const remaining = items.length - index;

    if (remaining <= MERGE_REMAINDER_THRESHOLD && sets.length > 0) {
      sets[sets.length - 1].push(...items.slice(index));
      break;
    }

    if (remaining <= SET_SIZE) {
      sets.push(items.slice(index));
      break;
    }

    sets.push(items.slice(index, index + SET_SIZE));
    index += SET_SIZE;
  }

  return sets;
}
