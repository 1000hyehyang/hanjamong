import { useMemo, useState } from "react";
import { getAllHanja, getHanjaByGrade, grades } from "../../data";
import { HanjaListSearchField } from "../../shared/components/HanjaListSearchField";
import { HanjaMeaningLines } from "../../shared/components/HanjaMeaningLines";
import { Screen, ScreenTitle } from "../../shared/components/Screen";
import { SoundLink } from "../../shared/components/SoundLink";
import { useAppStorage } from "../../shared/storage/use-app-storage";
import { pressableSurfaceCard } from "../../shared/styles/interactive";
import {
  choiceCardBase,
  choiceCardHover,
  choiceCardStates,
  gradeBadgeClassName,
} from "../../shared/styles/ui";
import { matchesHanjaSearch } from "../../shared/utils/matches-hanja-search";
import { buildLearnPath } from "./learn-paths";

function getClampedLearnIndex(index: number, entryCount: number): number {
  return Math.min(Math.max(0, entryCount - 1), Math.max(0, index));
}

export function LearnSelectPage() {
  const { storage } = useAppStorage();
  const [searchQuery, setSearchQuery] = useState("");
  const learnGrades = useMemo(
    () =>
      grades.map((gradeInfo) => ({
        ...gradeInfo,
        entries: getHanjaByGrade(gradeInfo.grade),
      })),
    [],
  );
  const gradeIndexByHanjaId = useMemo(() => {
    const indexById = new Map<string, number>();

    for (const { entries } of learnGrades) {
      entries.forEach((entry, entryIndex) => {
        indexById.set(entry.id, entryIndex);
      });
    }

    return indexById;
  }, [learnGrades]);
  const allEntries = useMemo(
    () =>
      getAllHanja().map((entry) => ({
        entry,
        gradeIndex: gradeIndexByHanjaId.get(entry.id) ?? 0,
      })),
    [gradeIndexByHanjaId],
  );

  const filteredEntries = useMemo(
    () =>
      allEntries.filter(({ entry }) =>
        matchesHanjaSearch(searchQuery, entry.character, entry.meanings),
      ),
    [allEntries, searchQuery],
  );

  const hasSearchQuery = searchQuery.trim().length > 0;

  return (
    <Screen>
      <ScreenTitle>어떤 급수를 공부할까요?</ScreenTitle>

      <HanjaListSearchField
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="전체 급수에서 한자·훈·음 검색"
      />

      {hasSearchQuery ? (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-text-secondary">
            검색 결과 {filteredEntries.length}자
          </p>

          {filteredEntries.length === 0 ? (
            <p className="rounded-2xl border-2 border-border bg-surface p-4 text-sm font-bold text-text-secondary">
              검색 결과가 없어요.
            </p>
          ) : (
            <ul className="space-y-2">
              {filteredEntries.map(({ entry, gradeIndex }) => (
                <li key={entry.id}>
                  <SoundLink
                    to={buildLearnPath(entry.grade, false, gradeIndex)}
                    className={`flex items-center gap-3 rounded-2xl border-2 border-b-4 border-border border-b-border bg-surface p-4 no-underline ${pressableSurfaceCard}`}
                  >
                    <span className="w-10 shrink-0 text-center text-[10px] font-extrabold uppercase text-text-secondary">
                      {entry.grade}급
                    </span>
                    <span className="w-14 shrink-0 text-center font-serif text-4xl font-black leading-none text-text-primary">
                      {entry.character}
                    </span>
                    <HanjaMeaningLines
                      entry={entry}
                      className="min-w-0 flex-1 space-y-0.5"
                      lineClassName="text-sm font-bold leading-snug"
                    />
                  </SoundLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {learnGrades.map((gradeInfo) => {
            const savedIndex = storage.learnProgress[String(gradeInfo.grade)];
            const hasProgress =
              typeof savedIndex === "number" && gradeInfo.entries.length > 0;
            const progressIndex = hasProgress
              ? getClampedLearnIndex(savedIndex, gradeInfo.entries.length)
              : 0;
            const targetPath = hasProgress
              ? buildLearnPath(gradeInfo.grade, false, progressIndex)
              : buildLearnPath(gradeInfo.grade, false);

            return (
              <SoundLink
                key={gradeInfo.grade}
                to={targetPath}
                className={`${choiceCardBase} ${choiceCardStates.default} ${choiceCardHover.default} block no-underline`}
              >
                <div className="flex items-center gap-3">
                  <span className={gradeBadgeClassName}>
                    {gradeInfo.grade}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-base leading-snug">{gradeInfo.label}</div>
                    <p className="mt-1 text-sm font-semibold text-text-secondary">
                      {gradeInfo.entries.length}자
                    </p>
                  </div>
                </div>
              </SoundLink>
            );
          })}
        </div>
      )}
    </Screen>
  );
}
