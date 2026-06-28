import {
  antonymItems,
  confusingHanjaGroups,
  getHanjaByCharacter,
  homophoneItems,
  synonymItems,
} from "../../data";
import type { HanjaEntry } from "../../shared/types/hanja";

export interface ConceptCharacterListEntry {
  character: string;
  sessionIndex: number;
  entry: HanjaEntry | undefined;
}

function pushUniqueCharacters(
  result: ConceptCharacterListEntry[],
  seen: Set<string>,
  characters: string[],
  sessionIndex: number,
) {
  for (const character of characters) {
    if (seen.has(character)) {
      continue;
    }

    seen.add(character);
    result.push({
      character,
      sessionIndex,
      entry: getHanjaByCharacter(character),
    });
  }
}

export function getConfusingHanjaCharacterList(): ConceptCharacterListEntry[] {
  const seen = new Set<string>();
  const result: ConceptCharacterListEntry[] = [];

  confusingHanjaGroups.forEach((group, groupIndex) => {
    pushUniqueCharacters(result, seen, group.characters, groupIndex);
  });

  return result;
}

export function getSynonymCharacterList(): ConceptCharacterListEntry[] {
  const seen = new Set<string>();
  const result: ConceptCharacterListEntry[] = [];

  synonymItems.forEach((item, itemIndex) => {
    pushUniqueCharacters(
      result,
      seen,
      item.characters.map((character) => character.hanja),
      itemIndex,
    );
  });

  return result;
}

export function getAntonymCharacterList(): ConceptCharacterListEntry[] {
  const seen = new Set<string>();
  const result: ConceptCharacterListEntry[] = [];

  antonymItems.forEach((item, itemIndex) => {
    pushUniqueCharacters(
      result,
      seen,
      item.characters.map((character) => character.hanja),
      itemIndex,
    );
  });

  return result;
}

export function getHomophoneCharacterList(): ConceptCharacterListEntry[] {
  const seen = new Set<string>();
  const result: ConceptCharacterListEntry[] = [];

  homophoneItems.forEach((item, itemIndex) => {
    for (const entry of item.entries) {
      pushUniqueCharacters(result, seen, entry.hanjaComposition, itemIndex);
    }
  });

  return result;
}

export function isCharacterInConfusingHanjaSession(
  character: string,
  sessionIndex: number | undefined,
): boolean {
  if (sessionIndex === undefined) {
    return false;
  }

  return confusingHanjaGroups[sessionIndex]?.characters.includes(character) ?? false;
}

export function isCharacterInSynonymSession(
  character: string,
  sessionIndex: number | undefined,
): boolean {
  if (sessionIndex === undefined) {
    return false;
  }

  return (
    synonymItems[sessionIndex]?.characters.some((item) => item.hanja === character) ??
    false
  );
}

export function isCharacterInAntonymSession(
  character: string,
  sessionIndex: number | undefined,
): boolean {
  if (sessionIndex === undefined) {
    return false;
  }

  return (
    antonymItems[sessionIndex]?.characters.some((item) => item.hanja === character) ??
    false
  );
}

export function isCharacterInHomophoneSession(
  character: string,
  sessionIndex: number | undefined,
): boolean {
  if (sessionIndex === undefined) {
    return false;
  }

  return (
    homophoneItems[sessionIndex]?.entries.some((entry) =>
      entry.hanjaComposition.includes(character),
    ) ?? false
  );
}
