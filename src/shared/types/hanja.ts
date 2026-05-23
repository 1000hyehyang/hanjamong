export interface HanjaMeaning {
  meaning: string;
  reading: string;
}

export interface HanjaEntry {
  id: string;
  grade: number;
  character: string;
  normalizedCharacter: string;
  meanings: HanjaMeaning[];
  examples?: string[];
}

export interface GradeInfo {
  grade: number;
  label: string;
  hanjaCount: number;
}
