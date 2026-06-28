import { useSearchParams } from "react-router-dom";
import { antonymItems } from "../../data";
import {
  getAntonymCharacterList,
  isCharacterInAntonymSession,
} from "./concept-characters";
import { ConceptCharacterList } from "./ConceptCharacterList";
import { CONCEPT_IDS, parseConceptIndex } from "./concept-paths";

const SESSION_LABEL = "상대자";

export function AntonymsListPage() {
  const [searchParams] = useSearchParams();
  const entries = getAntonymCharacterList();
  const currentSessionIndex = parseConceptIndex(
    searchParams.get("index"),
    Math.max(0, antonymItems.length - 1),
  );

  return (
    <ConceptCharacterList
      slug={CONCEPT_IDS.antonyms}
      sessionLabel={SESSION_LABEL}
      entries={entries}
      currentSessionIndex={currentSessionIndex}
      isInCurrentSession={(character) =>
        isCharacterInAntonymSession(character, currentSessionIndex)
      }
    />
  );
}
