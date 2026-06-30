import { SoundLink } from "../../shared/components/SoundLink";
import {
  getAvailableQuestionGrades,
  getQuestionGradeBadgeLabel,
  getQuestionsByGrade,
  getQuestionGradeLabel,
} from "../../data";
import { EmptyState } from "../../shared/components/EmptyState";
import { Screen, ScreenTitle } from "../../shared/components/Screen";
import { choiceCardBase, choiceCardHover, choiceCardStates, gradeBadgeClassName } from "../../shared/styles/ui";

export function QuizSelectPage() {
  const questionGrades = getAvailableQuestionGrades();

  if (questionGrades.length === 0) {
    return (
      <Screen>
        <EmptyState
          icon="file-text"
          title="문제 데이터가 없어요"
          description="questions-{급수}.json 파일에 문제를 추가해 주세요."
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenTitle>어떤 급수를 연습할까요?</ScreenTitle>

      <div className="space-y-3">
        {questionGrades.map((grade) => {
          const count = getQuestionsByGrade(grade).length;

          return (
            <SoundLink
              key={grade}
              to={`/quiz/${grade}`}
              className={`${choiceCardBase} ${choiceCardStates.default} ${choiceCardHover.default} block no-underline`}
            >
              <div className="flex items-center gap-3">
                <span className={gradeBadgeClassName}>
                  {getQuestionGradeBadgeLabel(grade)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-base leading-snug">
                    {getQuestionGradeLabel(grade)}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-text-secondary">
                    {count}문제
                  </p>
                </div>
              </div>
            </SoundLink>
          );
        })}
      </div>
    </Screen>
  );
}
