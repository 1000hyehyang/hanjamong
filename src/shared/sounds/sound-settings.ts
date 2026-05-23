const SOUND_SETTINGS_KEY = "hanjamong:sound-settings";

export interface SoundSettings {
  volume: number;
  muted: boolean;
}

const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  volume: 0.7,
  muted: false,
};

let cachedSettings: SoundSettings | null = null;

function clampVolume(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function getSoundSettings(): SoundSettings {
  if (cachedSettings) {
    return cachedSettings;
  }

  if (typeof window === "undefined") {
    return { ...DEFAULT_SOUND_SETTINGS };
  }

  try {
    const raw = window.localStorage.getItem(SOUND_SETTINGS_KEY);
    if (!raw) {
      cachedSettings = { ...DEFAULT_SOUND_SETTINGS };
      return cachedSettings;
    }

    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof (parsed as SoundSettings).volume === "number" &&
      typeof (parsed as SoundSettings).muted === "boolean"
    ) {
      cachedSettings = {
        volume: clampVolume((parsed as SoundSettings).volume),
        muted: (parsed as SoundSettings).muted,
      };
      return cachedSettings;
    }
  } catch {
    // Ignore malformed settings.
  }

  cachedSettings = { ...DEFAULT_SOUND_SETTINGS };
  return cachedSettings;
}

export function saveSoundSettings(settings: SoundSettings): void {
  cachedSettings = {
    volume: clampVolume(settings.volume),
    muted: settings.muted,
  };

  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(SOUND_SETTINGS_KEY, JSON.stringify(cachedSettings));
  } catch {
    // Ignore quota errors.
  }
}

export function getEffectiveVolume(): number {
  const settings = getSoundSettings();
  return settings.muted ? 0 : settings.volume;
}

export function subscribeSoundSettings(listener: () => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = (event: StorageEvent) => {
    if (event.key === SOUND_SETTINGS_KEY) {
      cachedSettings = null;
      listener();
    }
  };

  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}
