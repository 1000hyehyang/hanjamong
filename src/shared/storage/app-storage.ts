import {
  DEFAULT_STORAGE,
  STORAGE_KEY,
  type AppStorage,
  type CardStatus,
} from "../types/storage";

const STORAGE_RESET_MARKER_KEY =
  "hanja-app:storage-reset:2026-06-28-question-id-renumber";
const STORAGE_KEYS_TO_RESET = [STORAGE_KEY];

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
  const conceptProgress = isRecord(parsed.conceptProgress) ? parsed.conceptProgress : {};
  const learnProgress = isRecord(parsed.learnProgress) ? parsed.learnProgress : {};
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

  const normalizedLearnProgress: Record<string, number> = {};
  for (const [key, value] of Object.entries(learnProgress)) {
    if (typeof value === "number" && Number.isInteger(value) && value >= 0) {
      normalizedLearnProgress[key] = value;
    }
  }

  const normalizedConceptProgress: Record<string, number> = {};
  for (const [key, value] of Object.entries(conceptProgress)) {
    if (typeof value === "number" && Number.isInteger(value) && value >= 0) {
      normalizedConceptProgress[key] = value;
    }
  }

  return {
    version: 1,
    bookmarks: {
      hanja: isStringArray(bookmarks.hanja) ? bookmarks.hanja : [],
      questions: isStringArray(bookmarks.questions) ? bookmarks.questions : [],
    },
    cardProgress: normalizedCardProgress,
    conceptProgress: normalizedConceptProgress,
    learnProgress: normalizedLearnProgress,
    wrongQuestions: isStringArray(parsed.wrongQuestions)
      ? parsed.wrongQuestions
      : [],
    dailyStats: normalizedDailyStats,
  };
}

function resetAppStorageOnce(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (window.localStorage.getItem(STORAGE_RESET_MARKER_KEY) === "1") {
      return;
    }

    for (const key of STORAGE_KEYS_TO_RESET) {
      window.localStorage.removeItem(key);
    }
    window.localStorage.setItem(STORAGE_RESET_MARKER_KEY, "1");
  } catch {
    // Ignore blocked storage access in private or restricted browser modes.
  }
}

export function loadAppStorage(): AppStorage {
  if (typeof window === "undefined") {
    return { ...DEFAULT_STORAGE };
  }

  resetAppStorageOnce();

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

export function updateLearnProgress(
  storage: AppStorage,
  grade: number,
  index: number,
): AppStorage {
  if (!Number.isInteger(grade) || grade <= 0 || !Number.isFinite(index)) {
    return storage;
  }

  const key = String(grade);
  const normalizedIndex = Math.max(0, Math.floor(index));
  const nextIndex = Math.max(storage.learnProgress[key] ?? -1, normalizedIndex);
  if (storage.learnProgress[key] === nextIndex) {
    return storage;
  }

  return {
    ...storage,
    learnProgress: {
      ...storage.learnProgress,
      [key]: nextIndex,
    },
  };
}

export function updateConceptProgress(
  storage: AppStorage,
  conceptId: string,
  index: number,
): AppStorage {
  if (conceptId.trim() === "" || !Number.isFinite(index)) {
    return storage;
  }

  const normalizedIndex = Math.max(0, Math.floor(index));
  if (storage.conceptProgress[conceptId] === normalizedIndex) {
    return storage;
  }

  return {
    ...storage,
    conceptProgress: {
      ...storage.conceptProgress,
      [conceptId]: normalizedIndex,
    },
  };
}

export function clearAllWrongQuestions(storage: AppStorage): AppStorage {
  if (storage.wrongQuestions.length === 0) {
    return storage;
  }

  return {
    ...storage,
    wrongQuestions: [],
  };
}

export function clearAllHanjaBookmarks(storage: AppStorage): AppStorage {
  if (storage.bookmarks.hanja.length === 0) {
    return storage;
  }

  return {
    ...storage,
    bookmarks: {
      ...storage.bookmarks,
      hanja: [],
    },
  };
}

export function clearAllStorage(): AppStorage {
  saveAppStorage({ ...DEFAULT_STORAGE });
  return { ...DEFAULT_STORAGE };
}
