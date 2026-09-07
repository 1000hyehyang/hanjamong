export interface AppStorage {
  version: 1;
  bookmarks: {
    hanja: string[];
  };
  conceptProgress: Record<string, number>;
  learnProgress: Record<string, number>;
  wrongQuestions: string[];
}

export const STORAGE_KEY = "hanja-app:v1";

export const DEFAULT_STORAGE: AppStorage = {
  version: 1,
  bookmarks: {
    hanja: [],
  },
  conceptProgress: {},
  learnProgress: {},
  wrongQuestions: [],
};
