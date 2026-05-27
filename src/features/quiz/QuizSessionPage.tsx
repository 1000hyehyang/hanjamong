import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getQuestionGradeLabel,
  getQuestionsByIds,
  getQuestionsByType,
} from "../../data";
import { BottomFeedback } from "../../shared/components/BottomFeedback";
import { Button } from "../../shared/components/Button";
import { ChoiceCard, type ChoiceCardState } from "../../shared/components/ChoiceCard";
import { EmptyState } from "../../shared/components/EmptyState";
import { Icon } from "../../shared/components/icons/Icon";
import { QuestionPrompt } from "../../shared/components/QuestionPrompt";
import { Screen } from "../../shared/components/Screen";
import { useAppStorage } from "../../shared/storage/use-app-storage";
import {
  QUESTION_TYPE_LABELS,
  type QuestionType,
} from "../../shared/types/quiz";
import { shuffleQuestionChoices } from "../../shared/utils/shuffle-question-choices";
import { shuffle } from "../../shared/utils/shuffle";
import { playSound } from "../../shared/sounds/play-sound";

interface QuizLocationState {
  questionIds?: string[];
}

function isQuestionType(value: string | undefined): value is QuestionType {
  return (
    value === "hanja_reading" ||
    value === "meaning_to_hanja" ||
    value === "vocabulary" ||
    value === "idiom" ||
    value === "reading_comp"
  );
}

function getChoiceState(
  isAnswered: boolean,
  choiceIndex: number,
  selectedIndex: number | null,
  answerIndex: number,
): ChoiceCardState {
  if (!isAnswered) return "default";
  if (choiceIndex === answerIndex) return "correct";
  if (choiceIndex === selectedIndex) return "wrong";
  return "muted";
}

function getSessionScore(correctCount: number, questionCount: number): number {
  if (questionCount === 0) return 0;
  return Math.round((correctCount / questionCount) * 100);
}

export function QuizSessionPage() {
  const { grade: gradeParam, type } = useParams<{ grade?: string; type?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { markQuestionWrong, removeWrong } = useAppStorage();
  const locationState = location.state as QuizLocationState | null;
  const isReview = gradeParam === "review";
  const grade = isReview ? undefined : Number(gradeParam);
  const questionIds = locationState?.questionIds;

  const questions = useMemo(() => {
    if (questionIds && questionIds.length > 0) {
      return shuffle(getQuestionsByIds(questionIds));
    }
    if (!isQuestionType(type) || grade === undefined || Number.isNaN(grade)) {
      return [];
    }
    return shuffle(getQuestionsByType(type, grade));
  }, [grade, questionIds, type]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [attemptKey, setAttemptKey] = useState(0);

  const sessionScore = getSessionScore(correctCount, questions.length);

  const currentQuestion = questions[currentIndex];
  const shuffledChoices = useMemo(() => {
    if (!currentQuestion) return null;
    return shuffleQuestionChoices(currentQuestion);
  }, [attemptKey, currentQuestion]);
  const isAnswered = selectedIndex !== null;
  const isCorrect =
    isAnswered && selectedIndex === shuffledChoices?.answerIndex;

  if (
    !isReview &&
    !questionIds?.length &&
    (!isQuestionType(type) || grade === undefined || Number.isNaN(grade))
  ) {
    return (
      <Screen>
        <EmptyState
          title="유형을 찾을 수 없어요"
          action={
            <Link to="/quiz">
              <Button fullWidth>급수 선택으로</Button>
            </Link>
          }
        />
      </Screen>
    );
  }

  if (questions.length === 0) {
    return (
      <Screen>
        <EmptyState
          title="풀 문제가 없어요"
          description={
            grade !== undefined && !Number.isNaN(grade)
              ? `questions-${grade}.json에 해당 유형 문제를 추가해 주세요.`
              : "문제 데이터를 확인해 주세요."
          }
          action={
            <Link to={grade !== undefined && !Number.isNaN(grade) ? `/quiz/${grade}` : "/quiz"}>
              <Button variant="secondary" fullWidth>
                돌아가기
              </Button>
            </Link>
          }
        />
      </Screen>
    );
  }

  if (finished) {
    return (
      <Screen
        footerPlain
        footer={
          <div className="space-y-3">
            <Button
              fullWidth
              onClick={() => {
                setCurrentIndex(0);
                setSelectedIndex(null);
                setCorrectCount(0);
                setFinished(false);
                setAttemptKey((prev) => prev + 1);
              }}
            >
              다시 풀기
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() =>
                navigate(
                  isReview || grade === undefined || Number.isNaN(grade)
                    ? "/quiz"
                    : `/quiz/${grade}`,
                )
              }
            >
              {isReview ? "급수 선택으로" : "유형 선택으로"}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col items-center py-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-grapefruit-light text-grapefruit shadow-[0_4px_0_0_#FFD4C4]">
            <Icon name="trophy" size={40} />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold text-text-primary">
            세션 완료!
          </h1>
          <p className="mt-6 text-4xl font-extrabold text-grapefruit">{sessionScore}점</p>
          <p className="mt-3 text-lg font-bold text-text-secondary">
            {correctCount} / {questions.length}
          </p>
        </div>
      </Screen>
    );
  }

  const handleSelect = (choiceIndex: number) => {
    if (isAnswered || !currentQuestion || !shuffledChoices) return;

    setSelectedIndex(choiceIndex);
    const correct = choiceIndex === shuffledChoices.answerIndex;

    if (correct) {
      playSound("correct");
      removeWrong(currentQuestion.id);
      setCorrectCount((prev) => prev + 1);
    } else {
      playSound("error");
      markQuestionWrong(currentQuestion.id);
    }
  };

  const handleContinue = () => {
    if (currentIndex + 1 >= questions.length) {
      playSound("sessionFinish");
      setFinished(true);
      return;
    }

    playSound("click");
    setCurrentIndex((prev) => prev + 1);
    setSelectedIndex(null);
  };

  const handleQuit = () => {
    if (isReview) {
      navigate("/wrong");
      return;
    }

    if (grade !== undefined && !Number.isNaN(grade)) {
      navigate(`/quiz/${grade}`);
      return;
    }

    navigate("/quiz");
  };

  const sessionTitle = isReview
    ? "오답 복습"
    : isQuestionType(type)
      ? `${grade !== undefined && !Number.isNaN(grade) ? getQuestionGradeLabel(grade) + " · " : ""}${QUESTION_TYPE_LABELS[type]}`
      : "오답 복습";

  const completedCount = isAnswered ? currentIndex + 1 : currentIndex;

  return (
    <Screen noPadding className={isAnswered ? "pb-64" : "pb-24"}>
      <div className="px-4 pt-4">
        <p className="mb-4 text-center text-sm font-extrabold text-text-secondary">
          {sessionTitle} · {currentIndex + 1}/{questions.length}
          {completedCount > 0 ? (
            <>
              {" · "}
              <span className="text-green-dark">
                정답 {correctCount}개
              </span>
            </>
          ) : null}
        </p>

        {currentQuestion && shuffledChoices ? (
          <>
            <QuestionPrompt question={currentQuestion} />

            <div className="mt-6 space-y-3">
              {shuffledChoices.choices.map((choice, choiceIndex) => (
                <ChoiceCard
                  key={`${currentQuestion.id}-${choiceIndex}`}
                  state={getChoiceState(
                    isAnswered,
                    choiceIndex,
                    selectedIndex,
                    shuffledChoices.answerIndex,
                  )}
                  disabled={isAnswered}
                  onClick={() => handleSelect(choiceIndex)}
                  label={choice}
                  hint={
                    isAnswered ? shuffledChoices.choiceHints?.[choiceIndex] : undefined
                  }
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {isAnswered ? (
        <BottomFeedback
          variant={isCorrect ? "success" : "error"}
          title={isCorrect ? "정답!" : "오답"}
          explanation={currentQuestion?.explanation}
          onAction={handleContinue}
          actionLabel={
            currentIndex + 1 >= questions.length ? "결과 보기" : "계속하기"
          }
          secondaryActionLabel="그만하기"
          secondaryActionVariant="grapefruit"
          onSecondaryAction={handleQuit}
        />
      ) : (
        <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[420px] border-t-2 border-border bg-surface px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button variant="grapefruit" fullWidth onClick={handleQuit}>
            그만하기
          </Button>
        </div>
      )}
    </Screen>
  );
}
