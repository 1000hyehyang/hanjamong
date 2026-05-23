import { pressablePill, pressablePillActive, pressablePillInactive } from "../styles/interactive";

interface PillButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

export function PillButton({ active, onClick, label }: PillButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "shrink-0 rounded-full border-2 px-4 py-2 text-sm font-extrabold",
        pressablePill,
        active ? pressablePillActive : pressablePillInactive,
      ].join(" ")}
    >
      {label}
    </button>
  );
}
