import { useMemo } from "react";
import { getGradeInfo, getHanjaByGrade, getHanjaById } from "../../data";
import type { HanjaEntry } from "../../shared/types/hanja";
import {
  bookmarkSessionLabel,
  filterBookmarkEntries,
  isBookmarkReviewRoute,
  parseBookmarkGradeFilter,
} from "./learn-paths";

interface UseLearnEntriesParams {
  gradeParam: string | undefined;
  searchParams: URLSearchParams;
  bookmarkedHanjaIds: string[];
}

export function useLearnEntries({
  gradeParam,
  searchParams,
  bookmarkedHanjaIds,
}: UseLearnEntriesParams) {
  const isBookmarkReview = isBookmarkReviewRoute(gradeParam);
  const grade = isBookmarkReview ? NaN : Number(gradeParam);
  const gradeInfo = isBookmarkReview ? undefined : getGradeInfo(grade);
  const allEntries = useMemo(
    () => (isBookmarkReview ? [] : getHanjaByGrade(grade)),
    [grade, isBookmarkReview],
  );
  const bookmarkGradeFilter = parseBookmarkGradeFilter(searchParams.get("grade"));

  const bookmarkOnly =
    isBookmarkReview ||
    searchParams.get("bookmarks") === "1" ||
    searchParams.get("filter") === "bookmarked";

  const entries = useMemo(() => {
    if (isBookmarkReview) {
      const bookmarked = bookmarkedHanjaIds
        .map((id) => getHanjaById(id))
        .filter((entry): entry is HanjaEntry => entry !== undefined);

      return filterBookmarkEntries(bookmarked, bookmarkGradeFilter);
    }

    if (!bookmarkOnly) return allEntries;

    const bookmarkedIds = new Set(bookmarkedHanjaIds);
    return allEntries.filter((entry) => bookmarkedIds.has(entry.id));
  }, [
    allEntries,
    bookmarkGradeFilter,
    bookmarkOnly,
    bookmarkedHanjaIds,
    isBookmarkReview,
  ]);

  const sessionLabel = isBookmarkReview
    ? bookmarkSessionLabel(bookmarkGradeFilter, (g) => getGradeInfo(g)?.label)
    : (gradeInfo?.label ?? `${grade}급`);

  return {
    allEntries,
    bookmarkGradeFilter,
    bookmarkOnly,
    entries,
    grade,
    gradeInfo,
    isBookmarkReview,
    sessionLabel,
  };
}
