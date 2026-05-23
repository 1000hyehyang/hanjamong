export function normalizeHanjaCharacter(character: string): string {
  return character.normalize("NFKC").trim();
}
