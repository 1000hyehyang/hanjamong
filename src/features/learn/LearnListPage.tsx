import { useMemo } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getGradeInfo, getHanjaByGrade, getHanjaById } from "../../data";
import { Button } from "../../shared/components/Button";
import { EmptyState } from "../../shared/components/EmptyState";
import { HanjaMeaningLines } from "../../shared/components/HanjaMeaningLines";
import { Icon } from "../../shared/components/icons/Icon";
import { Screen } from "../../shared/components/Screen";
import { StarButton } from "../../shared/components/StarButton";
import { pressableIconButton, pressableSurfaceCard } from "../../shared/styles/interactive";
import { useAppStorage } from "../../shared/storage/use-app-storage";
import type { HanjaEntry } from "../../shared/types/hanja";

import {
  buildBookmarkReviewPath,
  buildLearnPath,
  bookmarkSessionLabel,
  filterBookmarkEntries,
  isBookmarkReviewRoute,
  parseBookmarkGradeFilter,
} from "./learn-paths";

export function LearnListPage() {
  const { grade: gradeParam } = useParams<{ grade: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { storage, toggleBookmark, isBookmarked } = useAppStorage();

  const isBookmarkReview = isBookmarkReviewRoute(gradeParam);
  const grade = isBookmarkReview ? NaN : Number(gradeParam);
  const gradeInfo = isBookmarkReview ? undefined : getGradeInfo(grade);
  const allEntries = isBookmarkReview ? [] : getHanjaByGrade(grade);
  const bookmarkGradeFilter = parseBookmarkGradeFilter(searchParams.get("grade"));

  const bookmarkOnly =
    isBookmarkReview ||
    searchParams.get("bookmarks") === "1" ||
    searchParams.get("filter") === "bookmarked";

  const entries = useMemo(() => {
    if (isBookmarkReview) {
      const bookmarked = storage.bookmarks.hanja
        .map((id) => getHanjaById(id))
        .filter((entry): entry is HanjaEntry => entry !== undefined);

      return filterBookmarkEntries(bookmarked, bookmarkGradeFilter);
    }

    if (!bookmarkOnly) return allEntries;

    return allEntries.filter((entry) =>
      storage.bookmarks.hanja.includes(entry.id),
    );
  }, [
    allEntries,
    bookmarkGradeFilter,
    bookmarkOnly,
    isBookmarkReview,
    storage.bookmarks.hanja,
  ]);

  const sessionLabel = isBookmarkReview
    ? bookmarkSessionLabel(bookmarkGradeFilter, (g) => getGradeInfo(g)?.label)
    : (gradeInfo?.label ?? `${grade}급`);

  const handleQuit = () => {
    if (bookmarkOnly) {
      navigate("/bookmarks");
      return;
    }

    navigate("/");
  };

  const openCardAt = (entryIndex: number) => {
    if (isBookmarkReview) {
      navigate(buildBookmarkReviewPath(entryIndex, bookmarkGradeFilter));
      return;
    }

    const params = new URLSearchParams();
    if (bookmarkOnly) {
      params.set("filter", "bookmarked");
    }
    params.set("index", String(entryIndex));
    navigate(`/learn/${grade}?${params.toString()}`);
  };

  if (!isBookmarkReview && (!gradeInfo || Number.isNaN(grade))) {
    return (
      <Screen>
        <EmptyState
          plain
          title="급수를 찾을 수 없어요"
          description="올바른 급수를 선택해 주세요."
          action={
            <Link to="/">
              <Button fullWidth>급수 선택으로</Button>
            </Link>
          }
        />
      </Screen>
    );
  }

  if (entries.length === 0) {
    return (
      <Screen noPadding className="pb-24">
        <div className="px-4 pt-4">
          <header className="mb-4 flex items-center gap-3 pt-1">
            <button
              type="button"
              aria-label="카드 학습으로"
              onClick={() =>
                navigate(
                  isBookmarkReview
                    ? buildBookmarkReviewPath(undefined, bookmarkGradeFilter)
                    : buildLearnPath(grade, bookmarkOnly),
                )
              }
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-secondary ${pressableIconButton}`}
            >
              <Icon name="chevron-left" size={24} />
            </button>
            <h1 className="flex-1 text-center text-base font-extrabold text-text-primary">
              {sessionLabel} · 전체 목록
            </h1>
            <div className="h-10 w-10 shrink-0" />
          </header>

          <EmptyState
            plain
            icon="star"
            title="표시할 한자가 없어요"
            description={
              bookmarkOnly
                ? "저장된 별표가 없습니다."
                : "한자 데이터를 확인해 주세요."
            }
          />
        </div>
        <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[420px] border-t-2 border-border bg-surface px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button variant="grapefruit" fullWidth onClick={handleQuit}>
            그만하기
          </Button>
        </div>
      </Screen>
    );
  }

  return (
    <Screen noPadding className="pb-24">
      <div className="px-4 pt-4">
        <header className="mb-4 flex items-center gap-3 pt-1">
          <button
            type="button"
            aria-label="카드 학습으로"
            onClick={() =>
              navigate(
                isBookmarkReview
                  ? buildBookmarkReviewPath(undefined, bookmarkGradeFilter)
                  : buildLearnPath(grade, bookmarkOnly),
              )
            }
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-secondary ${pressableIconButton}`}
          >
            <Icon name="chevron-left" size={24} />
          </button>
          <div className="min-w-0 flex-1 text-center">
            <h1 className="text-base font-extrabold text-text-primary">
              {sessionLabel} · 전체 목록
            </h1>
            <p className="mt-1 text-sm font-semibold text-text-secondary">
              {entries.length}자 · 탭하면 카드 학습으로 이동
            </p>
          </div>
          <div className="h-10 w-10 shrink-0" />
        </header>

        <ul className="space-y-2 pb-4">
          {entries.map((entry, entryIndex) => (
            <li key={entry.id}>
              <div
                className={`flex items-center gap-3 rounded-2xl border-2 border-b-4 border-border bg-surface p-4 ${pressableSurfaceCard}`}
              >
                <button
                  type="button"
                  onClick={() => openCardAt(entryIndex)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  {isBookmarkReview ? (
                    <span className="w-10 shrink-0 text-center text-[10px] font-extrabold uppercase text-text-secondary">
                      {entry.grade}급
                    </span>
                  ) : null}
                  <span className="w-14 shrink-0 text-center font-serif text-4xl font-black leading-none text-text-primary">
                    {entry.character}
                  </span>
                  <HanjaMeaningLines
                    entry={entry}
                    className="min-w-0 flex-1 space-y-0.5"
                    lineClassName="text-sm font-bold leading-snug"
                  />
                </button>
                <StarButton
                  active={isBookmarked(entry.id)}
                  onToggle={() => toggleBookmark(entry.id)}
                  size="sm"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[420px] border-t-2 border-border bg-surface px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button variant="grapefruit" fullWidth onClick={handleQuit}>
          그만하기
        </Button>
      </div>
    </Screen>
  );
}
