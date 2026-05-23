import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getGradeInfo, getHanjaByGrade, getHanjaById } from "../../data";
import {
  buildBookmarkListPath,
  buildListPath,
  bookmarkSessionLabel,
  filterBookmarkEntries,
  isBookmarkReviewRoute,
  parseBookmarkGradeFilter,
} from "./learn-paths";
import { Button } from "../../shared/components/Button";
import { EmptyState } from "../../shared/components/EmptyState";
import { HanjaFlashCard } from "../../shared/components/HanjaFlashCard";
import { Icon } from "../../shared/components/icons/Icon";
import { Screen } from "../../shared/components/Screen";
import { playSound } from "../../shared/sounds/play-sound";
import { pressableIconButton } from "../../shared/styles/interactive";
import { useAppStorage } from "../../shared/storage/use-app-storage";
import type { HanjaEntry } from "../../shared/types/hanja";

export function LearnPage() {
  const { grade: gradeParam } = useParams<{ grade: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { storage, toggleBookmark, isBookmarked } = useAppStorage();

  const isBookmarkReview = isBookmarkReviewRoute(gradeParam);
  const grade = isBookmarkReview ? NaN : Number(gradeParam);
  const gradeInfo = isBookmarkReview ? undefined : getGradeInfo(grade);
  const allEntries = isBookmarkReview ? [] : getHanjaByGrade(grade);

  const bookmarkOnly =
    isBookmarkReview ||
    searchParams.get("bookmarks") === "1" ||
    searchParams.get("filter") === "bookmarked";

  const bookmarkGradeFilter = parseBookmarkGradeFilter(searchParams.get("grade"));

  const handleQuit = () => {
    if (bookmarkOnly) {
      navigate("/bookmarks");
      return;
    }

    navigate("/");
  };

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

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const requestedIndex = searchParams.get("index");

  useEffect(() => {
    if (entries.length === 0) return;

    if (requestedIndex === null) return;

    const parsed = Number(requestedIndex);
    if (Number.isNaN(parsed)) return;

    setIndex(Math.max(0, Math.min(entries.length - 1, parsed)));
    setRevealed(false);
  }, [entries.length, requestedIndex]);

  useEffect(() => {
    setIndex((prev) => Math.min(prev, Math.max(0, entries.length - 1)));
  }, [entries.length]);

  const currentEntry = entries[index];
  const sessionLabel = isBookmarkReview
    ? bookmarkSessionLabel(bookmarkGradeFilter, (g) => getGradeInfo(g)?.label)
    : (gradeInfo?.label ?? `${grade}급`);

  const goNext = () => {
    playSound("click");
    setRevealed(false);
    setIndex((prev) => (prev + 1 >= entries.length ? 0 : prev + 1));
  };

  const goPrev = () => {
    playSound("click");
    setRevealed(false);
    setIndex((prev) => (prev - 1 + entries.length) % entries.length);
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

  if (!isBookmarkReview && allEntries.length === 0) {
    return (
      <Screen noPadding className="pb-24">
        <div className="px-4 pt-4">
          <EmptyState
            title="한자 데이터가 없어요"
            description={`hanja-${grade}.json 파일에 데이터를 추가해 주세요.`}
            action={
              <Link to="/">
                <Button variant="secondary" fullWidth>
                  급수 선택으로
                </Button>
              </Link>
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

  if (entries.length === 0) {
    return (
      <Screen noPadding className="pb-24">
        <div className="px-4 pt-4">
          <EmptyState
            icon="star"
            title="별표한 한자가 없어요"
            description={
              isBookmarkReview
                ? bookmarkGradeFilter === "all"
                  ? "별표한 한자가 없습니다."
                  : "이 급수에 저장된 별표가 없습니다."
                : "이 급수에 저장된 별표가 없습니다."
            }
            action={
              isBookmarkReview ? (
                <Link to="/bookmarks">
                  <Button fullWidth>별표 모음으로</Button>
                </Link>
              ) : (
                <Link to={`/learn/${grade}`}>
                  <Button fullWidth>전체 학습하기</Button>
                </Link>
              )
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

  const cardGradeLabel =
    isBookmarkReview && currentEntry
      ? (getGradeInfo(currentEntry.grade)?.label ?? `${currentEntry.grade}급`)
      : sessionLabel;

  const listPath = isBookmarkReview
    ? buildBookmarkListPath(bookmarkGradeFilter)
    : buildListPath(grade, bookmarkOnly);

  return (
    <Screen noPadding className="pb-24">
      <div className="px-4 pt-4">
        <header className="mb-4 flex items-center gap-3 pt-1">
          <div className="h-10 w-10 shrink-0" />
          <p className="flex-1 text-center text-sm font-extrabold text-text-secondary">
            {sessionLabel} · {index + 1}/{entries.length}
          </p>
          <button
            type="button"
            aria-label="전체 목록"
            onClick={() => navigate(listPath)}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-secondary ${pressableIconButton}`}
          >
            <Icon name="menu" size={24} />
          </button>
        </header>
      </div>

      {currentEntry ? (
        <div className="px-4">
          <HanjaFlashCard
            entry={currentEntry}
            gradeLabel={cardGradeLabel}
            revealed={revealed}
            onToggleReveal={() => setRevealed((prev) => !prev)}
            bookmarked={isBookmarked(currentEntry.id)}
            onToggleBookmark={() => toggleBookmark(currentEntry.id)}
          />

          <div className="mt-6 grid grid-cols-2 gap-2">
            <Button variant="secondary" size="md" onClick={goPrev}>
              이전
            </Button>
            <Button variant="primary" size="md" onClick={goNext}>
              다음
            </Button>
          </div>
        </div>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[420px] border-t-2 border-border bg-surface px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button variant="grapefruit" fullWidth onClick={handleQuit}>
          그만하기
        </Button>
      </div>
    </Screen>
  );
}
