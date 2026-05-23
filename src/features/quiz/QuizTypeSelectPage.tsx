import { useNavigate, useParams } from "react-router-dom";
import {
  getAvailableQuestionTypes,
  getQuestionsByGrade,
  getQuestionsByType,
} from "../../data";
import { ChoiceCard } from "../../shared/components/ChoiceCard";
import { EmptyState } from "../../shared/components/EmptyState";
import { Icon, quizTypeIcons } from "../../shared/components/icons/Icon";
import { Screen, ScreenTitle } from "../../shared/components/Screen";
import { SoundLink } from "../../shared/components/SoundLink";
import { QUESTION_TYPE_LABELS } from "../../shared/types/quiz";

export function QuizTypeSelectPage() {
  const navigate = useNavigate();
  const { grade: gradeParam } = useParams<{ grade: string }>();
  const grade = Number(gradeParam);
  const questions = getQuestionsByGrade(grade);
  const types = getAvailableQuestionTypes(grade);

  if (Number.isNaN(grade) || questions.length === 0) {
    return (
      <Screen>
        <EmptyState
          title="급수를 찾을 수 없어요"
          action={
            <SoundLink to="/quiz">
              <span className="font-extrabold text-green">급수 선택으로</span>
            </SoundLink>
          }
        />
      </Screen>
    );
  }

  if (types.length === 0) {
    return (
      <Screen>
        <EmptyState
          title="문제가 없어요"
          description={`questions-${grade}.json에 문제를 추가해 주세요.`}
          action={
            <SoundLink to="/quiz">
              <span className="font-extrabold text-green">급수 선택으로</span>
            </SoundLink>
          }
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenTitle>어떤 유형을 연습할까요?</ScreenTitle>

      <div className="space-y-3">
        {types.map((type) => {
          const count = getQuestionsByType(type, grade).length;

          return (
            <ChoiceCard
              key={type}
              onClick={() => navigate(`/quiz/${grade}/${type}`)}
              icon={<Icon name={quizTypeIcons[type]} size={22} />}
              label={QUESTION_TYPE_LABELS[type]}
              description={`${count}문제`}
            />
          );
        })}
      </div>
    </Screen>
  );
}
