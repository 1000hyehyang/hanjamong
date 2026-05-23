import { Icon } from "./icons/Icon";
import { pressableStar } from "../styles/interactive";

interface StarButtonProps {
  active: boolean;
  onToggle: () => void;
  size?: "sm" | "md";
}

const sizeClasses = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
};

const iconSizes = {
  sm: 18,
  md: 22,
};

export function StarButton({ active, onToggle, size = "md" }: StarButtonProps) {
  return (
    <button
      type="button"
      aria-label={active ? "별표 해제" : "별표 추가"}
      aria-pressed={active}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      className={[
        "inline-flex items-center justify-center rounded-2xl border-2 border-b-4",
        pressableStar,
        sizeClasses[size],
        active
          ? "border-[#e6b800] bg-duo-yellow text-white shadow-[0_4px_0_0_#d9a800] hover:shadow-[0_6px_0_0_#d9a800]"
          : "border-border bg-surface text-text-secondary shadow-[0_4px_0_0_#E5E5E5] hover:border-[#e6b800] hover:text-duo-yellow hover:shadow-[0_6px_0_0_#E5E5E5]",
      ].join(" ")}
    >
      <Icon
        name={active ? "star-filled" : "star"}
        size={iconSizes[size]}
        className={active ? "text-white" : undefined}
      />
    </button>
  );
}
