export interface ConfusingHanjaGroup {
  id: string;
  characters: string[];
}

export interface SynonymCharacter {
  hanja: string;
  meaning: string;
  sound: string;
}

export interface SynonymItem {
  id: number;
  word: string;
  characters: SynonymCharacter[];
}

export interface HomophoneWordEntry {
  word: string;
  hanjaComposition: string[];
  definition: string;
}

export interface HomophoneItem {
  id: number;
  sound: string;
  entries: HomophoneWordEntry[];
}
