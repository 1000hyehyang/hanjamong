import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getHanjaByCharacter, homophoneItems } from "../../data";
import { Button } from "../../shared/components/Button";
import { Screen } from "../../shared/components/Screen";
import { playSound } from "../../shared/sounds/play-sound";
import { useAppStorage } from "../../shared/storage/use-app-storage";
import type { HomophoneWordEntry } from "../../shared/types/concepts";
import { LearnQuitFooter } from "../learn/LearnQuitFooter";
import { useLearnCardSession } from "../learn/use-learn-card-session";
import { ConceptSessionHeader } from "./ConceptSessionHeader";
import { buildConceptListPath, CONCEPT_IDS } from "./concept-paths";

const SESSION_LABEL = "동음이의어";

function HomophoneEntryBlock({ entry }: { entry: HomophoneWordEntry }) {
  const characterReadings = entry.hanjaComposition.map((character) => ({
    character,
    hanjaEntry: getHanjaByCharacter(character),
  }));

  return (
    <article className="rounded-2xl border-2 border-b-4 border-border border-b-border bg-surface px-4 py-5">
      <p className="text-center font-serif text-4xl font-black tracking-wide text-text-primary">
        {entry.word}
      </p>

      <div className="mt-3 flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1">
        {characterReadings.map(({ character, hanjaEntry }) => {
          const meaning = hanjaEntry?.meanings[0];

          return (
            <p key={character} className="text-base font-extrabold">
              <span className="font-serif text-lg text-text-primary">{character}</span>
              {meaning ? (
                <>
                  <span className="text-text-primary"> {meaning.meaning}</span>
                  <span className="text-green-dark"> {meaning.reading}</span>
                </>
              ) : null}
            </p>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl bg-page px-4 py-3">
        <p className="text-sm font-bold leading-relaxed text-text-primary">
          {entry.definition}
        </p>
      </div>
    </article>
  );
}

export function HomophonesPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setConceptProgress } = useAppStorage();

  const sessionEntries = useMemo(
    () => homophoneItems.map((item) => ({ ...item, id: String(item.id) })),
    [],
  );

  const { goNext, goPrev, index } = useLearnCardSession(
    sessionEntries,
    searchParams.get("index"),
  );
  const item = sessionEntries[index];

  useEffect(() => {
    setConceptProgress(CONCEPT_IDS.homophones, index);
  }, [index, setConceptProgress]);

  const handleNext = () => {
    playSound("click");
    goNext();
  };

  const handlePrev = () => {
    playSound("click");
    goPrev();
  };

  return (
    <Screen noPadding className="pb-24">
      <div className="px-4 pt-4">
        <ConceptSessionHeader
          label={SESSION_LABEL}
          index={index}
          total={sessionEntries.length}
          listPath={buildConceptListPath(CONCEPT_IDS.homophones, index)}
        />

        <div className="mb-6 text-center">
          <p className="text-4xl font-black tracking-wide text-green-dark">{item.sound}</p>
        </div>

        <div className="space-y-3">
          {item.entries.map((entry) => (
            <HomophoneEntryBlock key={`${item.id}-${entry.word}`} entry={entry} />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <Button variant="secondary" size="md" onClick={handlePrev}>
            이전
          </Button>
          <Button variant="primary" size="md" onClick={handleNext}>
            다음
          </Button>
        </div>
      </div>

      <LearnQuitFooter onQuit={() => navigate("/concepts")} />
    </Screen>
  );
}
