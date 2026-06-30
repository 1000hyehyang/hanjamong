import type { ConfusingHanjaGroup, HomophoneItem, SynonymItem } from "../shared/types/concepts";
import type { HanjaEntry, GradeInfo } from "../shared/types/hanja";
import type { HanjaWordEntry } from "../shared/types/hanja-word";
import type { QuizQuestion } from "../shared/types/quiz";
import confusingHanjaGroupsData from "./concepts/confusing-hanja.json";
import homophoneItemsData from "./concepts/homophones.json";
import antonymItemsData from "./concepts/antonyms.json";
import synonymItemsData from "./concepts/synonyms.json";
import gradesData from "./hanja/grades.json";
import hanja9 from "./hanja/hanja-9.json";
import hanja8 from "./hanja/hanja-8.json";
import hanja7 from "./hanja/hanja-7.json";
import hanja6 from "./hanja/hanja-6.json";
import hanja5 from "./hanja/hanja-5.json";
import hanja4 from "./hanja/hanja-4.json";
import hanja3 from "./hanja/hanja-3.json";
import hanja2 from "./hanja/hanja-2.json";
import hanjaWordsData from "./words/hanja-words.json";
import questions2 from "./questions/questions-2.json";
import questions3 from "./questions/questions-3.json";
import questions4 from "./questions/questions-4.json";
import questions5 from "./questions/questions-5.json";
import questions6 from "./questions/questions-6.json";
import questions7 from "./questions/questions-7.json";
import questions8 from "./questions/questions-8.json";
import questions9 from "./questions/questions-9.json";

export const grades = gradesData as GradeInfo[];
export const confusingHanjaGroups = confusingHanjaGroupsData as ConfusingHanjaGroup[];
export const synonymItems = synonymItemsData as SynonymItem[];
export const antonymItems = antonymItemsData as SynonymItem[];
export const homophoneItems = homophoneItemsData as HomophoneItem[];
export const hanjaWords = hanjaWordsData as HanjaWordEntry[];

const supplementalHanjaByGrade: Record<number, HanjaEntry[]> = {
  2: hanja2 as HanjaEntry[],
};

const hanjaByGrade: Record<number, HanjaEntry[]> = {
  9: hanja9 as HanjaEntry[],
  8: hanja8 as HanjaEntry[],
  7: hanja7 as HanjaEntry[],
  6: hanja6 as HanjaEntry[],
  5: hanja5 as HanjaEntry[],
  4: hanja4 as HanjaEntry[],
  3: hanja3 as HanjaEntry[],
};

const questionsByGrade: Record<number, QuizQuestion[]> = {
  2: questions2 as QuizQuestion[],
  3: questions3 as QuizQuestion[],
  4: questions4 as QuizQuestion[],
  5: questions5 as QuizQuestion[],
  6: questions6 as QuizQuestion[],
  7: questions7 as QuizQuestion[],
  8: questions8 as QuizQuestion[],
  9: questions9 as QuizQuestion[],
};

const questionGradeSets: Record<number, { grades: number[]; label: string; badge: string }> = {
  7: { grades: [7, 8, 9], label: "7~9급", badge: "7~9" },
  6: { grades: [6], label: "6급", badge: "6" },
  5: { grades: [5], label: "5급", badge: "5" },
  3: { grades: [2, 3, 4], label: "3~4급", badge: "3~4" },
};

const questionTypeOrder: QuizQuestion["type"][] = [
  "hanja_reading",
  "hanja_structure",
  "meaning_to_hanja",
  "vocabulary",
  "idiom",
  "reading_comp",
];

export const allQuestions = Object.values(questionsByGrade).flat();

export function getHanjaByGrade(grade: number): HanjaEntry[] {
  return supplementalHanjaByGrade[grade] ?? hanjaByGrade[grade] ?? [];
}

export function getAllHanja(): HanjaEntry[] {
  return [
    ...Object.values(supplementalHanjaByGrade).flat(),
    ...grades.flatMap((gradeInfo) => hanjaByGrade[gradeInfo.grade] ?? []),
  ];
}

export function getHanjaById(id: string): HanjaEntry | undefined {
  return getAllHanja().find((entry) => entry.id === id);
}

const hanjaByCharacter = new Map<string, HanjaEntry>();

for (const entry of getAllHanja()) {
  if (!hanjaByCharacter.has(entry.character)) {
    hanjaByCharacter.set(entry.character, entry);
  }
  if (!hanjaByCharacter.has(entry.normalizedCharacter)) {
    hanjaByCharacter.set(entry.normalizedCharacter, entry);
  }
  const normalized = entry.character.normalize("NFKC");
  if (!hanjaByCharacter.has(normalized)) {
    hanjaByCharacter.set(normalized, entry);
  }
}

export function getHanjaByCharacter(character: string): HanjaEntry | undefined {
  return hanjaByCharacter.get(character) ?? hanjaByCharacter.get(character.normalize("NFKC"));
}

export function getQuestionsByGrade(grade: number): QuizQuestion[] {
  const set =
    questionGradeSets[grade] ??
    Object.values(questionGradeSets).find((item) => item.grades.includes(grade));

  if (set) {
    return set.grades.flatMap((itemGrade) => questionsByGrade[itemGrade] ?? []);
  }

  return questionsByGrade[grade] ?? [];
}

export function getAvailableQuestionGrades(): number[] {
  return Object.keys(questionGradeSets)
    .map(Number)
    .filter((grade) => getQuestionsByGrade(grade).length > 0)
    .sort((a, b) => b - a);
}

export function getQuestionsByType(
  type: QuizQuestion["type"],
  grade?: number,
): QuizQuestion[] {
  const pool = grade !== undefined ? getQuestionsByGrade(grade) : allQuestions;
  return pool.filter((question) => question.type === type);
}

export function getQuestionsByIds(ids: string[]): QuizQuestion[] {
  const idSet = new Set(ids);
  return allQuestions.filter((question) => idSet.has(question.id));
}

export function getAvailableQuestionTypes(grade?: number): QuizQuestion["type"][] {
  const pool = grade !== undefined ? getQuestionsByGrade(grade) : allQuestions;
  const types = new Set(pool.map((question) => question.type));
  return questionTypeOrder.filter((type) => types.has(type));
}

export function getGradeInfo(grade: number): GradeInfo | undefined {
  return grades.find((info) => info.grade === grade);
}

export function getQuestionGradeLabel(grade: number): string {
  const set =
    questionGradeSets[grade] ??
    Object.values(questionGradeSets).find((item) => item.grades.includes(grade));

  return set?.label ?? getGradeInfo(grade)?.label ?? `${grade}급`;
}

export function getQuestionGradeBadgeLabel(grade: number): string {
  const set =
    questionGradeSets[grade] ??
    Object.values(questionGradeSets).find((item) => item.grades.includes(grade));

  return set?.badge ?? String(grade);
}
