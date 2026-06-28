import { useSearchParams } from "react-router-dom";
import { homophoneItems } from "../../data";
import {
  getHomophoneCharacterList,
  isCharacterInHomophoneSession,
} from "./concept-characters";
import { ConceptCharacterList } from "./ConceptCharacterList";
import { CONCEPT_IDS, parseConceptIndex } from "./concept-paths";

const SESSION_LABEL = "동음이의어";

export function HomophonesListPage() {
  const [searchParams] = useSearchParams();
  const entries = getHomophoneCharacterList();
  const currentSessionIndex = parseConceptIndex(
    searchParams.get("index"),
    Math.max(0, homophoneItems.length - 1),
  );

  return (
    <ConceptCharacterList
      slug={CONCEPT_IDS.homophones}
      sessionLabel={SESSION_LABEL}
      entries={entries}
      currentSessionIndex={currentSessionIndex}
      isInCurrentSession={(character) =>
        isCharacterInHomophoneSession(character, currentSessionIndex)
      }
    />
  );
}
