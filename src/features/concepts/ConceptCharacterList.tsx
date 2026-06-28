import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../shared/components/Badge";
import { EmptyState } from "../../shared/components/EmptyState";
import { HanjaListSearchField } from "../../shared/components/HanjaListSearchField";
import { HanjaMeaningLines } from "../../shared/components/HanjaMeaningLines";
import { Screen } from "../../shared/components/Screen";
import { StarButton } from "../../shared/components/StarButton";
import { useAppStorage } from "../../shared/storage/use-app-storage";
import { matchesHanjaSearch } from "../../shared/utils/matches-hanja-search";
import { LearnQuitFooter } from "../learn/LearnQuitFooter";
import {
  pressableChoiceSelected,
  pressableSurfaceCard,
} from "../../shared/styles/interactive";
import type { ConceptCharacterListEntry } from "./concept-characters";
import { ConceptListHeader } from "./ConceptListHeader";
import { buildConceptPath, type ConceptSlug } from "./concept-paths";

interface ConceptCharacterListProps {
  slug: ConceptSlug;
  sessionLabel: string;
  entries: ConceptCharacterListEntry[];
  currentSessionIndex: number | undefined;
  isInCurrentSession: (character: string) => boolean;
}

export function ConceptCharacterList({
  slug,
  sessionLabel,
  entries,
  currentSessionIndex,
  isInCurrentSession,
}: ConceptCharacterListProps) {
  const navigate = useNavigate();
  const { toggleBookmark, isBookmarked } = useAppStorage();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEntries = useMemo(
    () =>
      entries.filter((entry) =>
        matchesHanjaSearch(searchQuery, entry.character, entry.entry?.meanings),
      ),
    [entries, searchQuery],
  );

  const hasSearchQuery = searchQuery.trim().length > 0;
  const description = hasSearchQuery
    ? `검색 결과 ${filteredEntries.length}자 · 탭하면 카드 학습으로 이동`
    : `${entries.length}자 · 탭하면 카드 학습으로 이동`;

  return (
    <Screen noPadding className="pb-24">
      <div className="px-4 pt-4">
        <ConceptListHeader
          backPath={buildConceptPath(slug, currentSessionIndex)}
          title={`${sessionLabel} · 전체 목록`}
          description={description}
        />

        <HanjaListSearchField value={searchQuery} onChange={setSearchQuery} />

        {filteredEntries.length === 0 ? (
          <EmptyState
            plain
            icon="search"
            title="검색 결과가 없어요"
            description="한자, 훈, 음으로 다시 검색해 보세요."
          />
        ) : (
        <ul className="space-y-2 pb-4">
          {filteredEntries.map((entry) => {
            const isCurrent = isInCurrentSession(entry.character);
            const hanjaEntry = entry.entry;

            return (
              <li key={entry.character}>
                <div
                  className={`flex items-center gap-3 rounded-2xl border-2 border-b-4 p-4 ${
                    isCurrent
                      ? `border-selected-border border-b-selected-border bg-selected-bg ${pressableChoiceSelected}`
                      : `border-border border-b-border bg-surface ${pressableSurfaceCard}`
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => navigate(buildConceptPath(slug, entry.sessionIndex))}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <span className="w-14 shrink-0 text-center font-serif text-4xl font-black leading-none text-text-primary">
                      {entry.character}
                    </span>
                    {hanjaEntry ? (
                      <HanjaMeaningLines
                        entry={hanjaEntry}
                        className="min-w-0 flex-1 space-y-0.5"
                        lineClassName="text-sm font-bold leading-snug"
                      />
                    ) : (
                      <span className="min-w-0 flex-1 text-sm font-bold text-wrong">
                        등록된 한자 없음
                      </span>
                    )}
                  </button>
                  {isCurrent ? <Badge tone="blue">학습중</Badge> : null}
                  {hanjaEntry ? (
                    <StarButton
                      active={isBookmarked(hanjaEntry.id)}
                      onToggle={() => toggleBookmark(hanjaEntry.id)}
                      size="sm"
                    />
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
        )}
      </div>

      <LearnQuitFooter onQuit={() => navigate("/concepts")} />
    </Screen>
  );
}
