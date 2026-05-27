import { getEffectiveVolume } from "./sound-settings";

export type SoundEffect = "click" | "correct" | "error" | "sessionFinish";

const SOUND_SRC: Record<SoundEffect, string> = {
  click: "/sounds/click.mp3",
  correct: "/sounds/correct.mp3",
  error: "/sounds/error.mp3",
  sessionFinish: "/sounds/session-finish.mp3",
};

const audioCache = new Map<SoundEffect, HTMLAudioElement>();

function getAudio(effect: SoundEffect): HTMLAudioElement {
  let audio = audioCache.get(effect);
  if (!audio) {
    audio = new Audio(SOUND_SRC[effect]);
    audio.preload = "auto";
    audioCache.set(effect, audio);
  }
  return audio;
}

export function playSound(effect: SoundEffect): void {
  const audio = getAudio(effect);
  audio.volume = getEffectiveVolume();
  audio.currentTime = 0;
  void audio.play().catch(() => {
    // Ignore autoplay restrictions before the first user gesture.
  });
}
