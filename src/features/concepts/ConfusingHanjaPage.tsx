import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { confusingHanjaGroups, getHanjaByCharacter } from "../../data";
import { Button } from "../../shared/components/Button";
import { HanjaMeaningLines } from "../../shared/components/HanjaMeaningLines";
import { Screen } from "../../shared/components/Screen";
import { playSound } from "../../shared/sounds/play-sound";
import { useAppStorage } from "../../shared/storage/use-app-storage";
import { pressableFlashCard } from "../../shared/styles/interactive";
import type { HanjaEntry } from "../../shared/types/hanja";
import { LearnQuitFooter } from "../learn/LearnQuitFooter";
import { useLearnCardSession } from "../learn/use-learn-card-session";
import { ConceptSessionHeader } from "./ConceptSessionHeader";
import { buildConceptListPath, CONCEPT_IDS } from "./concept-paths";

const SESSION_LABEL = "헷갈리는 한자";
const cardFaceClassName =
  "absolute inset-0 flex flex-col items-center justify-center bg-surface px-4 py-4 text-center [-webkit-backface-visibility:hidden] [backface-visibility:hidden]";

function GradeBadge({ grade }: { grade: number }) {
  if (grade <= 2) {
    return null;
  }

  return (
    <span className="inline-flex rounded-full bg-grapefruit-light px-3 py-1 text-xs font-extrabold text-grapefruit">
      {grade}급
    </span>
  );
}

function ConfusingHanjaCard({
  character,
  entry,
}: {
  character: string;
  entry: HanjaEntry | undefined;
}) {
  const [revealed, setRevealed] = useState(false);

  const toggleReveal = () => {
    playSound("click");
    setRevealed((prev) => !prev);
  };

  return (
    <button
      type="button"
      onClick={toggleReveal}
      disabled={!entry}
      className={`block w-full min-w-0 overflow-hidden rounded-2xl border-2 border-b-4 border-border border-b-border bg-surface p-0 text-center disabled:cursor-not-allowed ${entry ? pressableFlashCard : ""}`}
    >
      <div className="relative h-[200px] w-full [perspective:1000px]">
        <div
          className={[
            "relative h-full w-full [transform-style:preserve-3d] transition-transform duration-500",
            revealed ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]",
          ].join(" ")}
        >
          <div className={`${cardFaceClassName} [transform:rotateY(0deg)_translateZ(1px)]`}>
            {entry ? (
              <div className="absolute inset-x-0 top-4 flex justify-center">
                <GradeBadge grade={entry.grade} />
              </div>
            ) : null}
            <div className="w-full text-center font-serif text-7xl font-black leading-none text-text-primary">
              {character}
            </div>
            {entry ? (
              <p className="absolute inset-x-0 bottom-6 text-xs font-bold text-text-secondary">
                탭해서 뒤집기
              </p>
            ) : null}
          </div>

          <div className={`${cardFaceClassName} [transform:rotateY(180deg)_translateZ(1px)]`}>
            {entry ? (
              <>
                <div className="absolute inset-x-0 top-4 flex justify-center">
                  <GradeBadge grade={entry.grade} />
                </div>
                <HanjaMeaningLines
                  entry={entry}
                  className="w-full space-y-2"
                  lineClassName="text-center text-xl font-extrabold text-text-primary"
                />
                <p className="absolute inset-x-0 bottom-6 text-xs font-bold text-text-secondary">
                  탭해서 앞면으로
                </p>
              </>
            ) : (
              <p className="text-sm font-bold text-wrong">등록된 한자 없음</p>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

export function ConfusingHanjaPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setConceptProgress } = useAppStorage();

  const sessionEntries = useMemo(
    () => confusingHanjaGroups.map((group) => ({ ...group, id: group.id })),
    [],
  );

  const { goNext, goPrev, index } = useLearnCardSession(
    sessionEntries,
    searchParams.get("index"),
  );
  const group = sessionEntries[index];
  const groupEntries = useMemo(
    () =>
      group.characters.map((character) => ({
        character,
        entry: getHanjaByCharacter(character),
      })),
    [group],
  );

  useEffect(() => {
    setConceptProgress(CONCEPT_IDS.confusingHanja, index);
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
          listPath={buildConceptListPath(CONCEPT_IDS.confusingHanja, index)}
        />

        <div className="grid grid-cols-2 gap-2">
          {groupEntries.map((item) => (
            <ConfusingHanjaCard
              key={`${group.id}-${item.character}`}
              character={item.character}
              entry={item.entry}
            />
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
