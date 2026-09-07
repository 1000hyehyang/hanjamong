import { antonymItems } from "../../data";
import { PairedCharactersPage } from "./PairedCharactersPage";
import { CONCEPT_IDS } from "./concept-paths";

export function AntonymsPage() {
  return (
    <PairedCharactersPage
      items={antonymItems}
      label="상대자"
      slug={CONCEPT_IDS.antonyms}
    />
  );
}
