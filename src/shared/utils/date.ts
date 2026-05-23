export function getTodayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function calculateStreak(dailyStats: Record<string, number>): number {
  const datesWithStudy = Object.entries(dailyStats)
    .filter(([, count]) => count > 0)
    .map(([date]) => date)
    .sort((a, b) => b.localeCompare(a));

  if (datesWithStudy.length === 0) {
    return 0;
  }

  let streak = 0;
  const cursor = new Date();

  for (;;) {
    const key = formatDateKey(cursor);
    const studiedToday = (dailyStats[key] ?? 0) > 0;

    if (studiedToday) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }

    if (streak === 0 && key === getTodayKey()) {
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }

    break;
  }

  return streak;
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
