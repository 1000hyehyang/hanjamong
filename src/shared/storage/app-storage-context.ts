import { createContext } from "react";
import type { AppStorage } from "../types/storage";

export interface AppStorageContextValue {
  storage: AppStorage;
  toggleBookmark: (hanjaId: string) => void;
  markQuestionWrong: (questionId: string) => void;
  removeWrong: (questionId: string) => void;
  setConceptProgress: (conceptId: string, index: number) => void;
  setLearnProgress: (grade: number, index: number) => void;
  clearAllWrong: () => void;
  clearAllBookmarks: () => void;
  isBookmarked: (hanjaId: string) => boolean;
}

export const AppStorageContext =
  createContext<AppStorageContextValue | null>(null);
