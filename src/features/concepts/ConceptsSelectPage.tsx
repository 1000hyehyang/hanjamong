import {
  antonymItems,
  confusingHanjaGroups,
  homophoneItems,
  synonymItems,
} from "../../data";
import { Icon } from "../../shared/components/icons/Icon";
import { Screen, ScreenTitle } from "../../shared/components/Screen";
import { useAppStorage } from "../../shared/storage/use-app-storage";
import { gradeBadgeClassName } from "../../shared/styles/ui";
import { ConceptLinkCard } from "./ConceptLinkCard";
import { buildConceptPath, CONCEPT_IDS } from "./concept-paths";

function buildResumePath(
  slug: (typeof CONCEPT_IDS)[keyof typeof CONCEPT_IDS],
  count: number,
  savedIndex: number | undefined,
) {
  if (typeof savedIndex !== "number" || count === 0) {
    return buildConceptPath(slug);
  }

  return buildConceptPath(slug, Math.min(count - 1, Math.max(0, savedIndex)));
}

export function ConceptsSelectPage() {
  const { storage } = useAppStorage();

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
        <ConceptLinkCard
          to={buildResumePath(
            CONCEPT_IDS.confusingHanja,
            confusingHanjaGroups.length,
            storage.conceptProgress[CONCEPT_IDS.confusingHanja],
          )}
          title="헷갈리는 한자"
          description="모양이 비슷한 한자를 구분해요"
          badge={
            <span className={`${gradeBadgeClassName} text-base`}>
              <Icon name="search" size={20} />
            </span>
          }
        />
        <ConceptLinkCard
          to={buildResumePath(
            CONCEPT_IDS.synonyms,
            synonymItems.length,
            storage.conceptProgress[CONCEPT_IDS.synonyms],
          )}
          title="유의자"
          description="뜻이 비슷한 한자가 한 단어를 이루는 경우"
          badge={
            <span className={`${gradeBadgeClassName} text-base`}>
              <Icon name="scale" size={20} />
            </span>
          }
        />
        <ConceptLinkCard
          to={buildResumePath(
            CONCEPT_IDS.antonyms,
            antonymItems.length,
            storage.conceptProgress[CONCEPT_IDS.antonyms],
          )}
          title="상대자"
          description="뜻이 반대인 한자가 한 단어를 이루는 경우"
          badge={
            <span className={`${gradeBadgeClassName} text-base`}>
              <Icon name="arrow-left-right" size={20} />
            </span>
          }
        />
        <ConceptLinkCard
          to={buildResumePath(
            CONCEPT_IDS.homophones,
            homophoneItems.length,
            storage.conceptProgress[CONCEPT_IDS.homophones],
          )}
          title="동음이의어"
          description="소리는 같지만 뜻이 다른 한자어"
          badge={
            <span className={`${gradeBadgeClassName} text-base`}>
              <Icon name="volume-2" size={20} />
            </span>
          }
        />
      </div>
    </Screen>
  );
}
