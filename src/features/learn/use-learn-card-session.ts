import { useMemo, useState } from "react";

function clampRequestedIndex(value: string | null, maxIndex: number): number {
  if (value === null) return 0;

  const parsed = Number(value);
  if (Number.isNaN(parsed)) return 0;

  return Math.max(0, Math.min(maxIndex, parsed));
}

function wrapIndex(index: number, length: number): number {
  if (length === 0) return 0;
  return ((index % length) + length) % length;
}

interface NavigationState {
  entriesLength: number;
  offset: number;
  requestedIndex: string | null;
}

interface RevealState {
  entryId: string | null;
  revealed: boolean;
}

export function useLearnCardSession<T extends { id: string }>(
  entries: T[],
  requestedIndex: string | null,
) {
  const [navigation, setNavigation] = useState<NavigationState>({
    entriesLength: entries.length,
    offset: 0,
    requestedIndex,
  });
  const [revealState, setRevealState] = useState<RevealState>({
    entryId: null,
    revealed: false,
  });

  const baseIndex = useMemo(
    () => clampRequestedIndex(requestedIndex, Math.max(0, entries.length - 1)),
    [entries.length, requestedIndex],
  );

  const offset =
    navigation.entriesLength === entries.length &&
    navigation.requestedIndex === requestedIndex
      ? navigation.offset
      : 0;
  const index = wrapIndex(baseIndex + offset, entries.length);
  const currentEntry = entries[index];
  const revealed =
    currentEntry !== undefined &&
    revealState.entryId === currentEntry.id &&
    revealState.revealed;

  const moveBy = (delta: number) => {
    setRevealState({ entryId: null, revealed: false });
    setNavigation((prev) => {
      const currentOffset =
        prev.entriesLength === entries.length &&
        prev.requestedIndex === requestedIndex
          ? prev.offset
          : 0;

      return {
        entriesLength: entries.length,
        offset: currentOffset + delta,
        requestedIndex,
      };
    });
  };

  const goNext = () => {
    moveBy(1);
  };

  const goPrev = () => {
    moveBy(-1);
  };

  const toggleReveal = () => {
    if (currentEntry === undefined) return;

    setRevealState((prev) => ({
      entryId: currentEntry.id,
      revealed: prev.entryId === currentEntry.id ? !prev.revealed : true,
    }));
  };

  return {
    currentEntry,
    goNext,
    goPrev,
    index,
    revealed,
    toggleReveal,
  };
}
