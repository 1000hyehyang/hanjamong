import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addWrongQuestion,
  clearAllHanjaBookmarks,
  clearAllWrongQuestions,
  loadAppStorage,
  removeWrongQuestion,
  saveAppStorage,
  toggleHanjaBookmark,
  updateConceptProgress,
  updateLearnProgress,
} from "./app-storage";
import {
  AppStorageContext,
  type AppStorageContextValue,
} from "./app-storage-context";
import type { AppStorage } from "../types/storage";

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

  const setLearnProgress = useCallback(
    (grade: number, index: number) => {
      commit((prev) => updateLearnProgress(prev, grade, index));
    },
    [commit],
  );

  const setConceptProgress = useCallback(
    (conceptId: string, index: number) => {
      commit((prev) => updateConceptProgress(prev, conceptId, index));
    },
    [commit],
  );

  const clearAllWrong = useCallback(() => {
    commit(clearAllWrongQuestions);
  }, [commit]);

  const clearAllBookmarks = useCallback(() => {
    commit(clearAllHanjaBookmarks);
  }, [commit]);

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
      setConceptProgress,
      setLearnProgress,
      clearAllWrong,
      clearAllBookmarks,
      isBookmarked,
    }),
    [
      storage,
      toggleBookmark,
      markQuestionWrong,
      removeWrong,
      setConceptProgress,
      setLearnProgress,
      clearAllWrong,
      clearAllBookmarks,
      isBookmarked,
    ],
  );

  return (
    <AppStorageContext.Provider value={value}>
      {children}
    </AppStorageContext.Provider>
  );
}
