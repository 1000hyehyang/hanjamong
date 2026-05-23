import type { HanjaEntry, GradeInfo } from "../shared/types/hanja";
import type { QuizQuestion } from "../shared/types/quiz";
import gradesData from "./hanja/grades.json";
import hanja9 from "./hanja/hanja-9.json";
import hanja8 from "./hanja/hanja-8.json";
import hanja7 from "./hanja/hanja-7.json";
import hanja6 from "./hanja/hanja-6.json";
import hanja5 from "./hanja/hanja-5.json";
import hanja4 from "./hanja/hanja-4.json";
import hanja3 from "./hanja/hanja-3.json";
import questions3 from "./questions/questions-3.json";
import questions4 from "./questions/questions-4.json";
import questions5 from "./questions/questions-5.json";
import questions6 from "./questions/questions-6.json";
import questions7 from "./questions/questions-7.json";

export const grades = gradesData as GradeInfo[];

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
  3: questions3 as QuizQuestion[],
  4: questions4 as QuizQuestion[],
  5: questions5 as QuizQuestion[],
  6: questions6 as QuizQuestion[],
  7: questions7 as QuizQuestion[],
};

export const allQuestions = Object.values(questionsByGrade).flat();

export function getHanjaByGrade(grade: number): HanjaEntry[] {
  return hanjaByGrade[grade] ?? [];
}

export function getAllHanja(): HanjaEntry[] {
  return grades.flatMap((gradeInfo) => getHanjaByGrade(gradeInfo.grade));
}

export function getHanjaById(id: string): HanjaEntry | undefined {
  return getAllHanja().find((entry) => entry.id === id);
}

export function getQuestionsByGrade(grade: number): QuizQuestion[] {
  return questionsByGrade[grade] ?? [];
}

export function getAvailableQuestionGrades(): number[] {
  return Object.keys(questionsByGrade)
    .map(Number)
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
  return [...types];
}

export function getGradeInfo(grade: number): GradeInfo | undefined {
  return grades.find((info) => info.grade === grade);
}

export function getQuestionGradeLabel(grade: number): string {
  return getGradeInfo(grade)?.label ?? `${grade}급`;
}
