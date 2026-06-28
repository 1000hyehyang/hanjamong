import { createContext } from "react";
import type { AppStorage } from "../types/storage";

export interface AppStorageContextValue {
  storage: AppStorage;
  toggleBookmark: (hanjaId: string) => void;
  markQuestionWrong: (questionId: string) => void;
  removeWrong: (questionId: string) => void;
  clearAllWrong: () => void;
  clearAllBookmarks: () => void;
  isBookmarked: (hanjaId: string) => boolean;
}

export const AppStorageContext =
  createContext<AppStorageContextValue | null>(null);
