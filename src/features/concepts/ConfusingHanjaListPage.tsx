import { useSearchParams } from "react-router-dom";
import {
  getConfusingHanjaCharacterList,
  isCharacterInConfusingHanjaSession,
} from "./concept-characters";
import { ConceptCharacterList } from "./ConceptCharacterList";
import { CONCEPT_IDS, parseConceptIndex } from "./concept-paths";
import { confusingHanjaGroups } from "../../data";

const SESSION_LABEL = "헷갈리는 한자";

export function ConfusingHanjaListPage() {
  const [searchParams] = useSearchParams();
  const entries = getConfusingHanjaCharacterList();
  const currentSessionIndex = parseConceptIndex(
    searchParams.get("index"),
    Math.max(0, confusingHanjaGroups.length - 1),
  );

  return (
    <ConceptCharacterList
      slug={CONCEPT_IDS.confusingHanja}
      sessionLabel={SESSION_LABEL}
      entries={entries}
      currentSessionIndex={currentSessionIndex}
      isInCurrentSession={(character) =>
        isCharacterInConfusingHanjaSession(character, currentSessionIndex)
      }
    />
  );
}
