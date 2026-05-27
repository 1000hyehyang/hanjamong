import { Icon } from "../../shared/components/icons/Icon";
import { Screen, ScreenTitle } from "../../shared/components/Screen";
import { gradeBadgeClassName } from "../../shared/styles/ui";
import { ConceptLinkCard } from "./ConceptLinkCard";

export function ConceptsSelectPage() {
  return (
    <Screen>
      <ScreenTitle>어떤 개념을 볼까요?</ScreenTitle>

      <div className="space-y-3">
        <ConceptLinkCard
          to="/concepts/stroke-order"
          title="한자의 필순"
          description="글자를 쓸 때 획을 긋는 순서"
          badge={
            <span className={`${gradeBadgeClassName} text-base`}>
              <Icon name="brush" size={20} />
            </span>
          }
        />
        <ConceptLinkCard
          to="/concepts/formation"
          title="한자의 짜임"
          description="한자의 구성 원리 6가지"
          badge={
            <span className={`${gradeBadgeClassName} text-base`}>
              <Icon name="layers" size={20} />
            </span>
          }
        />
      </div>
    </Screen>
  );
}
