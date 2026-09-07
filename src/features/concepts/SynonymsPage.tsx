import { synonymItems } from "../../data";
import { PairedCharactersPage } from "./PairedCharactersPage";
import { CONCEPT_IDS } from "./concept-paths";

export function SynonymsPage() {
  return (
    <PairedCharactersPage
      items={synonymItems}
      label="유의자"
      slug={CONCEPT_IDS.synonyms}
    />
  );
}
