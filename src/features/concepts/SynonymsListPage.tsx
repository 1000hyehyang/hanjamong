import { useSearchParams } from "react-router-dom";
import { synonymItems } from "../../data";
import {
  getSynonymCharacterList,
  isCharacterInSynonymSession,
} from "./concept-characters";
import { ConceptCharacterList } from "./ConceptCharacterList";
import { CONCEPT_IDS, parseConceptIndex } from "./concept-paths";

const SESSION_LABEL = "유의자";

export function SynonymsListPage() {
  const [searchParams] = useSearchParams();
  const entries = getSynonymCharacterList();
  const currentSessionIndex = parseConceptIndex(
    searchParams.get("index"),
    Math.max(0, synonymItems.length - 1),
  );

  return (
    <ConceptCharacterList
      slug={CONCEPT_IDS.synonyms}
      sessionLabel={SESSION_LABEL}
      entries={entries}
      currentSessionIndex={currentSessionIndex}
      isInCurrentSession={(character) =>
        isCharacterInSynonymSession(character, currentSessionIndex)
      }
    />
  );
}
