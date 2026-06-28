import { useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Badge } from "../../shared/components/Badge";
import { Button } from "../../shared/components/Button";
import { EmptyState } from "../../shared/components/EmptyState";
import { HanjaListSearchField } from "../../shared/components/HanjaListSearchField";
import { HanjaMeaningLines } from "../../shared/components/HanjaMeaningLines";
import { Icon } from "../../shared/components/icons/Icon";
import { Screen } from "../../shared/components/Screen";
import { StarButton } from "../../shared/components/StarButton";
import {
  pressableChoiceSelected,
  pressableIconButton,
  pressableSurfaceCard,
} from "../../shared/styles/interactive";
import { useAppStorage } from "../../shared/storage/use-app-storage";
import { matchesHanjaSearch } from "../../shared/utils/matches-hanja-search";

import {
  buildBookmarkReviewPath,
  buildLearnPath,
} from "./learn-paths";
import { LearnQuitFooter } from "./LearnQuitFooter";
import { useLearnEntries } from "./use-learn-entries";

export function LearnListPage() {
  const { grade: gradeParam } = useParams<{ grade: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { storage, toggleBookmark, isBookmarked } = useAppStorage();
  const currentIndexParam = searchParams.get("index");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    bookmarkGradeFilter,
    bookmarkOnly,
    entries,
    grade,
    gradeInfo,
    isBookmarkReview,
    sessionLabel,
  } = useLearnEntries({
    gradeParam,
    searchParams,
    bookmarkedHanjaIds: storage.bookmarks.hanja,
  });

  const handleQuit = () => {
    if (bookmarkOnly) {
      navigate("/bookmarks");
      return;
    }

    navigate("/");
  };

  const currentIndex = (() => {
    if (currentIndexParam === null) return undefined;
    const parsed = Number(currentIndexParam);
    if (!Number.isInteger(parsed) || parsed < 0 || parsed >= entries.length) {
      return undefined;
    }
    return parsed;
  })();

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

  const filteredEntries = useMemo(
    () =>
      entries
        .map((entry, entryIndex) => ({ entry, entryIndex }))
        .filter(({ entry }) =>
          matchesHanjaSearch(searchQuery, entry.character, entry.meanings),
        ),
    [entries, searchQuery],
  );

  const hasSearchQuery = searchQuery.trim().length > 0;
  const listDescription = hasSearchQuery
    ? `검색 결과 ${filteredEntries.length}자 · 탭하면 카드 학습으로 이동`
    : `${entries.length}자 · 탭하면 카드 학습으로 이동`;

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
        <LearnQuitFooter onQuit={handleQuit} />
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
              {listDescription}
            </p>
          </div>
          <div className="h-10 w-10 shrink-0" />
        </header>

        <HanjaListSearchField value={searchQuery} onChange={setSearchQuery} />

        {filteredEntries.length === 0 ? (
          <EmptyState
            plain
            icon="search"
            title="검색 결과가 없어요"
            description="한자, 훈, 음으로 다시 검색해 보세요."
          />
        ) : (
        <ul className="space-y-2 pb-4">
          {filteredEntries.map(({ entry, entryIndex }) => {
            const isCurrentEntry = entryIndex === currentIndex;

            return (
              <li key={entry.id}>
                <div
                  className={`flex items-center gap-3 rounded-2xl border-2 border-b-4 p-4 ${
                    isCurrentEntry
                      ? `border-selected-border border-b-selected-border bg-selected-bg ${pressableChoiceSelected}`
                      : `border-border border-b-border bg-surface ${pressableSurfaceCard}`
                  }`}
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
                {isCurrentEntry ? (
                  <Badge tone="blue">학습중</Badge>
                ) : null}
                <StarButton
                  active={isBookmarked(entry.id)}
                  onToggle={() => toggleBookmark(entry.id)}
                  size="sm"
                />
              </div>
            </li>
            );
          })}
        </ul>
        )}
      </div>

      <LearnQuitFooter onQuit={handleQuit} />
    </Screen>
  );
}
