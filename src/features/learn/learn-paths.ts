export const BOOKMARK_REVIEW_GRADE = "bookmarks";

export type BookmarkGradeFilter = number | "all";

export function isBookmarkReviewRoute(gradeParam: string | undefined): boolean {
  return gradeParam === BOOKMARK_REVIEW_GRADE;
}

export function parseBookmarkGradeFilter(
  value: string | null,
): BookmarkGradeFilter {
  if (value === null || value === "all") return "all";
  const grade = Number(value);
  return Number.isNaN(grade) ? "all" : grade;
}

function appendBookmarkGradeFilter(
  params: URLSearchParams,
  gradeFilter: BookmarkGradeFilter,
) {
  params.set("filter", "bookmarked");
  params.set("grade", gradeFilter === "all" ? "all" : String(gradeFilter));
}

export function buildLearnPath(grade: number | string, bookmarkOnly: boolean) {
  const params = new URLSearchParams();
  if (bookmarkOnly) {
    params.set("filter", "bookmarked");
  }
  const query = params.toString();
  return query ? `/learn/${grade}?${query}` : `/learn/${grade}`;
}

export function buildListPath(grade: number | string, bookmarkOnly: boolean) {
  const params = new URLSearchParams();
  if (bookmarkOnly) {
    params.set("filter", "bookmarked");
  }
  const query = params.toString();
  return query ? `/learn/${grade}/list?${query}` : `/learn/${grade}/list`;
}

export function buildBookmarkReviewPath(
  index?: number,
  gradeFilter: BookmarkGradeFilter = "all",
) {
  const params = new URLSearchParams();
  appendBookmarkGradeFilter(params, gradeFilter);
  if (index !== undefined) {
    params.set("index", String(index));
  }
  return `/learn/${BOOKMARK_REVIEW_GRADE}?${params}`;
}

export function buildBookmarkListPath(gradeFilter: BookmarkGradeFilter = "all") {
  const params = new URLSearchParams();
  appendBookmarkGradeFilter(params, gradeFilter);
  return `/learn/${BOOKMARK_REVIEW_GRADE}/list?${params}`;
}

export function filterBookmarkEntries<T extends { grade: number }>(
  entries: T[],
  gradeFilter: BookmarkGradeFilter,
): T[] {
  if (gradeFilter === "all") return entries;
  return entries.filter((entry) => entry.grade === gradeFilter);
}

export function bookmarkSessionLabel(
  gradeFilter: BookmarkGradeFilter,
  getLabel: (grade: number) => string | undefined,
): string {
  if (gradeFilter === "all") return "별표 복습";
  return `${getLabel(gradeFilter) ?? `${gradeFilter}급`} · 별표`;
}
