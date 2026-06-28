import type { HanjaMeaning } from "../types/hanja";

export function matchesHanjaSearch(
  query: string,
  character: string,
  meanings: HanjaMeaning[] | undefined,
): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  if (character.includes(normalized)) {
    return true;
  }

  if (!meanings) {
    return false;
  }

  return meanings.some(
    (meaning) =>
      meaning.meaning.toLowerCase().includes(normalized) ||
      meaning.reading.toLowerCase().includes(normalized),
  );
}
