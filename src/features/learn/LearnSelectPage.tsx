import { getHanjaByGrade, grades } from "../../data";
import { Screen, ScreenTitle } from "../../shared/components/Screen";
import { SoundLink } from "../../shared/components/SoundLink";
import { choiceCardBase, choiceCardHover, choiceCardStates, gradeBadgeClassName } from "../../shared/styles/ui";

export function LearnSelectPage() {
  return (
    <Screen>
      <ScreenTitle>어떤 급수를 공부할까요?</ScreenTitle>

      <div className="space-y-3">
        {grades.map((gradeInfo) => {
          const entries = getHanjaByGrade(gradeInfo.grade);

          return (
            <SoundLink
              key={gradeInfo.grade}
              to={`/learn/${gradeInfo.grade}`}
              className={`${choiceCardBase} ${choiceCardStates.default} ${choiceCardHover.default} block no-underline`}
            >
              <div className="flex items-center gap-3">
                <span className={gradeBadgeClassName}>
                  {gradeInfo.grade}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-base leading-snug">{gradeInfo.label}</div>
                  <p className="mt-1 text-sm font-semibold text-text-secondary">
                    {entries.length}자
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
