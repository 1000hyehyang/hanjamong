import { useNavigate, useParams } from "react-router-dom";
import { getQuestionsByType } from "../../data";
import { ChoiceCard } from "../../shared/components/ChoiceCard";
import { EmptyState } from "../../shared/components/EmptyState";
import { Icon } from "../../shared/components/icons/Icon";
import { quizTypeIcons } from "../../shared/components/icons/quiz-type-icons";
import { Screen, ScreenTitle } from "../../shared/components/Screen";
import { SoundLink } from "../../shared/components/SoundLink";
import { type QuestionType } from "../../shared/types/quiz";
import {
  shouldUseQuestionSets,
  splitQuestionSets,
} from "../../shared/utils/split-question-sets";

function isQuestionType(value: string | undefined): value is QuestionType {
  return (
    value === "hanja_reading" ||
    value === "hanja_structure" ||
    value === "meaning_to_hanja" ||
    value === "vocabulary" ||
    value === "idiom" ||
    value === "reading_comp"
  );
}

export function QuizSetSelectPage() {
  const navigate = useNavigate();
  const { grade: gradeParam, type } = useParams<{ grade: string; type: string }>();
  const grade = Number(gradeParam);

  if (Number.isNaN(grade) || !isQuestionType(type)) {
    return (
      <Screen>
        <EmptyState
          title="유형을 찾을 수 없어요"
          action={
            <SoundLink to="/quiz">
              <span className="font-extrabold text-green">급수 선택으로</span>
            </SoundLink>
          }
        />
      </Screen>
    );
  }

  const questions = getQuestionsByType(type, grade);

  if (questions.length === 0 || !shouldUseQuestionSets(questions.length)) {
    return (
      <Screen>
        <EmptyState
          title="문제집이 없어요"
          action={
            <SoundLink to={`/quiz/${grade}`}>
              <span className="font-extrabold text-green">유형 선택으로</span>
            </SoundLink>
          }
        />
      </Screen>
    );
  }

  const sets = splitQuestionSets(questions);

  return (
    <Screen>
      <ScreenTitle>어떤 문제집을 풀까요?</ScreenTitle>

      <div className="space-y-3">
        {sets.map((set, index) => (
          <ChoiceCard
            key={index}
            onClick={() => navigate(`/quiz/${grade}/${type}/set/${index + 1}`)}
            icon={<Icon name={quizTypeIcons[type]} size={22} />}
            label={`${index + 1}번 문제집`}
            description={`${set.length}문제`}
          />
        ))}
      </div>
    </Screen>
  );
}
