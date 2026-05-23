import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addWrongQuestion,
  loadAppStorage,
  removeWrongQuestion,
  saveAppStorage,
  toggleHanjaBookmark,
} from "./app-storage";
import type { AppStorage } from "../types/storage";

interface AppStorageContextValue {
  storage: AppStorage;
  toggleBookmark: (hanjaId: string) => void;
  markQuestionWrong: (questionId: string) => void;
  removeWrong: (questionId: string) => void;
  isBookmarked: (hanjaId: string) => boolean;
}

const AppStorageContext = createContext<AppStorageContextValue | null>(null);

export function AppStorageProvider({ children }: { children: ReactNode }) {
  const [storage, setStorage] = useState<AppStorage>(() => loadAppStorage());

  const commit = useCallback((updater: (prev: AppStorage) => AppStorage) => {
    setStorage((prev) => {
      const next = updater(prev);
      saveAppStorage(next);
      return next;
    });
  }, []);

  const toggleBookmark = useCallback(
    (hanjaId: string) => {
      commit((prev) => toggleHanjaBookmark(prev, hanjaId));
    },
    [commit],
  );

  const markQuestionWrong = useCallback(
    (questionId: string) => {
      commit((prev) => addWrongQuestion(prev, questionId));
    },
    [commit],
  );

  const removeWrong = useCallback(
    (questionId: string) => {
      commit((prev) => removeWrongQuestion(prev, questionId));
    },
    [commit],
  );

  const isBookmarked = useCallback(
    (hanjaId: string) => storage.bookmarks.hanja.includes(hanjaId),
    [storage.bookmarks.hanja],
  );

  const value = useMemo<AppStorageContextValue>(
    () => ({
      storage,
      toggleBookmark,
      markQuestionWrong,
      removeWrong,
      isBookmarked,
    }),
    [storage, toggleBookmark, markQuestionWrong, removeWrong, isBookmarked],
  );

  return (
    <AppStorageContext.Provider value={value}>
      {children}
    </AppStorageContext.Provider>
  );
}

export function useAppStorage(): AppStorageContextValue {
  const context = useContext(AppStorageContext);
  if (!context) {
    throw new Error("useAppStorage must be used within AppStorageProvider");
  }
  return context;
}
