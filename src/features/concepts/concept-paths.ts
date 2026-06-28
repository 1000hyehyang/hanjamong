export const CONCEPT_IDS = {
  confusingHanja: "confusing-hanja",
  synonyms: "synonyms",
  antonyms: "antonyms",
  homophones: "homophones",
} as const;

export type ConceptSlug =
  | typeof CONCEPT_IDS.confusingHanja
  | typeof CONCEPT_IDS.synonyms
  | typeof CONCEPT_IDS.antonyms
  | typeof CONCEPT_IDS.homophones;

export function buildConceptPath(slug: ConceptSlug, index?: number) {
  const params = new URLSearchParams();
  if (index !== undefined) {
    params.set("index", String(index));
  }
  const query = params.toString();
  return query ? `/concepts/${slug}?${query}` : `/concepts/${slug}`;
}

export function buildConceptListPath(slug: ConceptSlug, index?: number) {
  const params = new URLSearchParams();
  if (index !== undefined) {
    params.set("index", String(index));
  }
  const query = params.toString();
  return query ? `/concepts/${slug}/list?${query}` : `/concepts/${slug}/list`;
}

export function parseConceptIndex(
  value: string | null,
  maxIndex: number,
): number | undefined {
  if (value === null) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > maxIndex) {
    return undefined;
  }

  return parsed;
}
