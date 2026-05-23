import type { ButtonHTMLAttributes, ReactNode } from "react";
import { choiceCardBase, choiceCardHover, choiceCardStates } from "../styles/ui";

export type ChoiceCardState =
  | "default"
  | "selected"
  | "correct"
  | "wrong"
  | "muted";

interface ChoiceCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  state?: ChoiceCardState;
  icon?: ReactNode;
  label: ReactNode;
  description?: string;
}

export function ChoiceCard({
  state = "default",
  icon,
  label,
  description,
  className = "",
  onClick,
  disabled,
  ...props
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      className={[
        choiceCardBase,
        choiceCardStates[state],
        choiceCardHover[state],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      <div className="flex items-center gap-3">
        {icon ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-page text-text-secondary">
            {icon}
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="text-base leading-snug">{label}</div>
          {description ? (
            <p className="mt-1 text-sm font-semibold text-text-secondary">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </button>
  );
}
