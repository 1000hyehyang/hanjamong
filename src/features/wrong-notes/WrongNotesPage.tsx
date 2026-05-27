import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getQuestionsByIds } from "../../data";
import { Badge } from "../../shared/components/Badge";
import { Button } from "../../shared/components/Button";
import { EmptyState } from "../../shared/components/EmptyState";
import { PillButton } from "../../shared/components/PillButton";
import { Screen, ScreenTitle } from "../../shared/components/Screen";
import { choiceCardBase, choiceCardStates } from "../../shared/styles/ui";
import { useAppStorage } from "../../shared/storage/use-app-storage";
import {
  QUESTION_TYPE_LABELS,
  type QuestionType,
} from "../../shared/types/quiz";

const QUESTION_TYPE_ORDER: QuestionType[] = [
  "hanja_reading",
  "meaning_to_hanja",
  "vocabulary",
  "idiom",
  "reading_comp",
];

export function WrongNotesPage() {
  const navigate = useNavigate();
  const { storage, removeWrong } = useAppStorage();
  const [typeFilter, setTypeFilter] = useState<QuestionType | "all">("all");

  const wrongQuestions = useMemo(
    () => getQuestionsByIds(storage.wrongQuestions),
    [storage.wrongQuestions],
  );

  const typeCounts = useMemo(() => {
    const counts = new Map<QuestionType, number>();
    for (const question of wrongQuestions) {
      counts.set(question.type, (counts.get(question.type) ?? 0) + 1);
    }
    return counts;
  }, [wrongQuestions]);

  const availableTypes = useMemo(
    () => QUESTION_TYPE_ORDER.filter((type) => typeCounts.has(type)),
    [typeCounts],
  );

  const filteredQuestions = useMemo(() => {
    if (typeFilter === "all") {
      return wrongQuestions;
    }
    return wrongQuestions.filter((question) => question.type === typeFilter);
  }, [typeFilter, wrongQuestions]);

  const handleRetry = () => {
    const questionIds = filteredQuestions.map((question) => question.id);
    if (questionIds.length === 0) {
      return;
    }
    navigate("/quiz/review", {
      state: { questionIds },
    });
  };

  return (
    <Screen
      footerAboveNav
      footer={
        filteredQuestions.length > 0 ? (
          <Button fullWidth onClick={handleRetry}>
            {typeFilter === "all" ? "전체 다시 풀기" : "이 유형 다시 풀기"}
          </Button>
        ) : undefined
      }
    >
      <ScreenTitle>오답 노트</ScreenTitle>

      {wrongQuestions.length === 0 ? (
        <EmptyState
          plain
          icon="check-circle"
          title="틀린 문제가 없어요"
          description="문제를 풀다 틀리면 자동으로 저장됩니다."
          action={
            <Link className="block w-full" to="/quiz">
              <Button fullWidth>문제 풀러 가기</Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="-mx-4 mb-5 overflow-x-auto overscroll-x-contain touch-pan-x">
            <div className="flex w-max min-w-full gap-2 px-4 pb-1">
              <PillButton
                active={typeFilter === "all"}
                onClick={() => setTypeFilter("all")}
                label={`전체 ${wrongQuestions.length}`}
              />
              {availableTypes.map((type) => (
                <PillButton
                  key={type}
                  active={typeFilter === type}
                  onClick={() => setTypeFilter(type)}
                  label={`${QUESTION_TYPE_LABELS[type]} ${typeCounts.get(type) ?? 0}`}
                />
              ))}
            </div>
          </div>

          {filteredQuestions.length === 0 ? (
            <EmptyState
              plain
              icon="notebook"
              title="이 유형의 오답이 없어요"
              description="다른 유형을 선택해 보세요."
            />
          ) : (
            <div className="space-y-3">
              {filteredQuestions.map((question) => (
                <div
                  key={question.id}
                  className={`${choiceCardBase} ${choiceCardStates.default} cursor-default`}
                >
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="slate">{QUESTION_TYPE_LABELS[question.type]}</Badge>
                    {question.points ? (
                      <Badge tone="blue">{question.points}점</Badge>
                    ) : null}
                  </div>
                  <p className="mt-3 whitespace-pre-line text-sm font-bold leading-relaxed text-text-primary">
                    {question.question}
                  </p>
                  <p className="mt-2 text-sm font-extrabold text-green-dark">
                    정답: {question.choices[question.answerIndex]}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        navigate("/quiz/review", {
                          state: { questionIds: [question.id] },
                        })
                      }
                    >
                      풀기
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => removeWrong(question.id)}
                    >
                      제거
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Screen>
  );
}
