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
  strokeCount?: number;
  radical?: string;
  formation?: string;
  examples?: string[];
}

export interface GradeInfo {
  grade: number;
  label: string;
  hanjaCount: number;
}
