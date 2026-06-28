import { useEffect } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getGradeInfo } from "../../data";
import { buildBookmarkListPath, buildListPath } from "./learn-paths";
import { LearnQuitFooter } from "./LearnQuitFooter";
import { useLearnCardSession } from "./use-learn-card-session";
import { useLearnEntries } from "./use-learn-entries";
import { Button } from "../../shared/components/Button";
import { EmptyState } from "../../shared/components/EmptyState";
import { HanjaFlashCard } from "../../shared/components/HanjaFlashCard";
import { Icon } from "../../shared/components/icons/Icon";
import { Screen } from "../../shared/components/Screen";
import { playSound } from "../../shared/sounds/play-sound";
import { pressableIconButton } from "../../shared/styles/interactive";
import { useAppStorage } from "../../shared/storage/use-app-storage";

export function LearnPage() {
  const { grade: gradeParam } = useParams<{ grade: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { storage, toggleBookmark, isBookmarked, setLearnProgress } = useAppStorage();

  const {
    allEntries,
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

  const { currentEntry, goNext, goPrev, index, revealed, toggleReveal } =
    useLearnCardSession(entries, searchParams.get("index"));

  useEffect(() => {
    if (
      isBookmarkReview ||
      bookmarkOnly ||
      Number.isNaN(grade) ||
      currentEntry === undefined
    ) {
      return;
    }

    setLearnProgress(grade, index);
  }, [
    bookmarkOnly,
    currentEntry,
    grade,
    index,
    isBookmarkReview,
    setLearnProgress,
  ]);

  const handleNext = () => {
    playSound("click");
    goNext();
  };

  const handlePrev = () => {
    playSound("click");
    goPrev();
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
        <LearnQuitFooter onQuit={handleQuit} />
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
        <LearnQuitFooter onQuit={handleQuit} />
      </Screen>
    );
  }

  const cardGradeLabel =
    isBookmarkReview && currentEntry
      ? (getGradeInfo(currentEntry.grade)?.label ?? `${currentEntry.grade}급`)
      : sessionLabel;

  const listPath = isBookmarkReview
    ? buildBookmarkListPath(bookmarkGradeFilter, index)
    : buildListPath(grade, bookmarkOnly, index);

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
            key={currentEntry.id}
            entry={currentEntry}
            gradeLabel={cardGradeLabel}
            revealed={revealed}
            onToggleReveal={toggleReveal}
            bookmarked={isBookmarked(currentEntry.id)}
            onToggleBookmark={() => toggleBookmark(currentEntry.id)}
          />

          <div className="mt-6 grid grid-cols-2 gap-2">
            <Button variant="secondary" size="md" onClick={handlePrev}>
              이전
            </Button>
            <Button variant="primary" size="md" onClick={handleNext}>
              다음
            </Button>
          </div>
        </div>
      ) : null}

      <LearnQuitFooter onQuit={handleQuit} />
    </Screen>
  );
}
