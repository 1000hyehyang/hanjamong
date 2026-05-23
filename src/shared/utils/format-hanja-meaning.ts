import type { HanjaEntry, HanjaMeaning } from "../types/hanja";

export function formatMeaningLine(item: HanjaMeaning): string {
  return `${item.meaning} ${item.reading}`;
}

export function formatMeaningsLines(entry: HanjaEntry): string[] {
  return entry.meanings.map(formatMeaningLine);
}

export function formatMeaningsText(entry: HanjaEntry, separator = "\n"): string {
  return formatMeaningsLines(entry).join(separator);
}
