import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getHanjaById, grades } from "../../data";
import { Button } from "../../shared/components/Button";
import { EmptyState } from "../../shared/components/EmptyState";
import { HanjaMeaningLines } from "../../shared/components/HanjaMeaningLines";
import { PillButton } from "../../shared/components/PillButton";
import { Screen, ScreenTitle } from "../../shared/components/Screen";
import { StarButton } from "../../shared/components/StarButton";
import { pressableBookmarkTile } from "../../shared/styles/interactive";
import { useAppStorage } from "../../shared/storage/use-app-storage";
import type { HanjaEntry } from "../../shared/types/hanja";
import { buildBookmarkReviewPath } from "../learn/learn-paths";

export function BookmarksPage() {
  const navigate = useNavigate();
  const { storage, toggleBookmark, isBookmarked, clearAllBookmarks } =
    useAppStorage();
  const [gradeFilter, setGradeFilter] = useState<number | "all">("all");

  const bookmarkedEntries = useMemo(() => {
    return storage.bookmarks.hanja
      .map((id) => getHanjaById(id))
      .filter((entry): entry is HanjaEntry => entry !== undefined)
      .filter((entry) =>
        gradeFilter === "all" ? true : entry.grade === gradeFilter,
      );
  }, [gradeFilter, storage.bookmarks.hanja]);

  return (
    <Screen
      footerAboveNav
      footer={
        storage.bookmarks.hanja.length > 0 ? (
          <div className="space-y-3">
            <Link
              className="block w-full"
              to={buildBookmarkReviewPath(undefined, gradeFilter)}
            >
              <Button fullWidth disabled={bookmarkedEntries.length === 0}>
                복습하기
              </Button>
            </Link>
            <Button variant="secondary" fullWidth onClick={clearAllBookmarks}>
              별표 모두 해제
            </Button>
          </div>
        ) : undefined
      }
    >
      <ScreenTitle>별표 모음</ScreenTitle>

      <div className="-mx-4 mb-5 overflow-x-auto overscroll-x-contain touch-pan-x">
        <div className="flex w-max min-w-full gap-2 px-4 pb-1">
          <PillButton
            active={gradeFilter === "all"}
            onClick={() => setGradeFilter("all")}
            label="전체"
          />
          {grades.map((gradeInfo) => (
            <PillButton
              key={gradeInfo.grade}
              active={gradeFilter === gradeInfo.grade}
              onClick={() => setGradeFilter(gradeInfo.grade)}
              label={gradeInfo.label}
            />
          ))}
        </div>
      </div>

      {bookmarkedEntries.length === 0 ? (
        <EmptyState
          plain
          icon="star"
          title="별표한 한자가 없어요"
          description="학습 중 ☆ 버튼을 눌러 중요한 한자를 저장해 보세요."
          action={
            <Link className="block w-full" to="/">
              <Button fullWidth>학습하러 가기</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {bookmarkedEntries.map((entry, entryIndex) => (
            <div
              key={entry.id}
              role="button"
              tabIndex={0}
              onClick={() =>
                navigate(buildBookmarkReviewPath(entryIndex, gradeFilter))
              }
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigate(buildBookmarkReviewPath(entryIndex, gradeFilter));
                }
              }}
              className={`rounded-2xl border-2 border-b-4 border-border bg-surface p-4 ${pressableBookmarkTile}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="rounded-full bg-page px-2 py-0.5 text-[10px] font-extrabold uppercase text-text-secondary">
                  {entry.grade}급
                </span>
                <StarButton
                  active={isBookmarked(entry.id)}
                  onToggle={() => toggleBookmark(entry.id)}
                  size="sm"
                />
              </div>
              <div className="mt-3 text-center font-serif text-5xl font-black text-text-primary">
                {entry.character}
              </div>
              <HanjaMeaningLines
                entry={entry}
                className="mt-3 space-y-1 text-center"
                lineClassName="text-xs font-bold leading-snug text-text-secondary"
              />
            </div>
          ))}
        </div>
      )}
    </Screen>
  );
}
