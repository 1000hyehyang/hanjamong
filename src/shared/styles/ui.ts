import {
  pressableChoiceCorrect,
  pressableChoiceDefault,
  pressableChoiceMuted,
  pressableChoiceSelected,
  pressableChoiceWrong,
} from "./interactive";

export const colors = {
  green: "#58CC02",
  greenDark: "#46A302",
  brandGrapefruit: "#FF8A65",
  brandGrapefruitLight: "#FFF0EA",
  correctFeedback: "#D7FFB8",
  wrongRed: "#FF4B4B",
  wrongFeedback: "#FFDCDC",
  selectedBg: "#DDF4FF",
  selectedBorder: "#84D8FF",
  selectedAccent: "#1CB0F6",
  starYellow: "#FFC800",
  pageBg: "#F7F7F7",
  surface: "#FFFFFF",
  border: "#E5E5E5",
  progressTrack: "#E5E5E5",
  textPrimary: "#3C3C3C",
  textSecondary: "#777777",
} as const;

export const mobileMaxWidth = "420px";

export const choiceCardBase =
  "w-full rounded-2xl border-2 border-b-4 px-4 py-4 text-left font-bold text-text-primary";

export const choiceCardStates = {
  default: "border-border bg-surface border-b-border",
  selected: "border-selected-border bg-selected-bg border-b-selected-border",
  correct: "border-green bg-correct border-b-green-dark",
  wrong: "border-wrong bg-wrong-feedback border-b-wrong",
  muted: "border-border bg-surface text-text-secondary opacity-70 border-b-border",
} as const;

export const choiceCardHover: Record<keyof typeof choiceCardStates, string> = {
  default: pressableChoiceDefault,
  selected: pressableChoiceSelected,
  correct: pressableChoiceCorrect,
  wrong: pressableChoiceWrong,
  muted: pressableChoiceMuted,
};

export const gradeBadgeClassName =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 border-b-4 border-grapefruit bg-grapefruit-light text-lg font-black text-grapefruit shadow-[0_4px_0_0_#FFD4C4]";
