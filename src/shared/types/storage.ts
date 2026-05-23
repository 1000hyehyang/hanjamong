export type CardStatus = "unknown" | "known";

export interface AppStorage {
  version: 1;
  bookmarks: {
    hanja: string[];
    questions: string[];
  };
  cardProgress: Record<string, CardStatus>;
  wrongQuestions: string[];
  dailyStats: Record<string, number>;
}

export const STORAGE_KEY = "hanja-app:v1";

export const DEFAULT_STORAGE: AppStorage = {
  version: 1,
  bookmarks: {
    hanja: [],
    questions: [],
  },
  cardProgress: {},
  wrongQuestions: [],
  dailyStats: {},
};
