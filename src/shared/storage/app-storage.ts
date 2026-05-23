import {
  DEFAULT_STORAGE,
  STORAGE_KEY,
  type AppStorage,
  type CardStatus,
} from "../types/storage";
import questionIdMigration from "../../data/questions/id-migration.json";

const migratedQuestionIds = questionIdMigration as Record<string, string>;

function migrateQuestionId(id: string): string {
  return migratedQuestionIds[id] ?? id;
}

function migrateQuestionIds(ids: string[]): string[] {
  const next = ids.map(migrateQuestionId);
  return [...new Set(next)];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCardStatus(value: unknown): value is CardStatus {
  return value === "unknown" || value === "known";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function parseStorage(raw: string): AppStorage {
  const parsed: unknown = JSON.parse(raw);

  if (!isRecord(parsed) || parsed.version !== 1) {
    return { ...DEFAULT_STORAGE };
  }

  const bookmarks = isRecord(parsed.bookmarks) ? parsed.bookmarks : {};
  const cardProgress = isRecord(parsed.cardProgress) ? parsed.cardProgress : {};
  const dailyStats = isRecord(parsed.dailyStats) ? parsed.dailyStats : {};

  const normalizedCardProgress: Record<string, CardStatus> = {};
  for (const [key, value] of Object.entries(cardProgress)) {
    if (value === "learning") {
      normalizedCardProgress[key] = "unknown";
    } else if (isCardStatus(value)) {
      normalizedCardProgress[key] = value;
    }
  }

  const normalizedDailyStats: Record<string, number> = {};
  for (const [key, value] of Object.entries(dailyStats)) {
    if (typeof value === "number" && value >= 0) {
      normalizedDailyStats[key] = value;
    }
  }

  return {
    version: 1,
    bookmarks: {
      hanja: isStringArray(bookmarks.hanja) ? bookmarks.hanja : [],
      questions: isStringArray(bookmarks.questions)
        ? migrateQuestionIds(bookmarks.questions)
        : [],
    },
    cardProgress: normalizedCardProgress,
    wrongQuestions: isStringArray(parsed.wrongQuestions)
      ? migrateQuestionIds(parsed.wrongQuestions)
      : [],
    dailyStats: normalizedDailyStats,
  };
}

export function loadAppStorage(): AppStorage {
  if (typeof window === "undefined") {
    return { ...DEFAULT_STORAGE };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_STORAGE };
    }
    return parseStorage(raw);
  } catch {
    return { ...DEFAULT_STORAGE };
  }
}

export function saveAppStorage(storage: AppStorage): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  } catch {
    // Ignore quota or privacy mode errors.
  }
}

export function toggleHanjaBookmark(
  storage: AppStorage,
  hanjaId: string,
): AppStorage {
  const exists = storage.bookmarks.hanja.includes(hanjaId);
  const hanja = exists
    ? storage.bookmarks.hanja.filter((id) => id !== hanjaId)
    : [...storage.bookmarks.hanja, hanjaId];

  return {
    ...storage,
    bookmarks: {
      ...storage.bookmarks,
      hanja,
    },
  };
}

export function addWrongQuestion(
  storage: AppStorage,
  questionId: string,
): AppStorage {
  if (storage.wrongQuestions.includes(questionId)) {
    return storage;
  }

  return {
    ...storage,
    wrongQuestions: [...storage.wrongQuestions, questionId],
  };
}

export function removeWrongQuestion(
  storage: AppStorage,
  questionId: string,
): AppStorage {
  return {
    ...storage,
    wrongQuestions: storage.wrongQuestions.filter((id) => id !== questionId),
  };
}

export function clearAllStorage(): AppStorage {
  saveAppStorage({ ...DEFAULT_STORAGE });
  return { ...DEFAULT_STORAGE };
}
