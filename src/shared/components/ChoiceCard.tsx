import type { ButtonHTMLAttributes, ReactNode } from "react";
import { choiceCardBase, choiceCardHover, choiceCardStates } from "../styles/ui";
import type { ResolvedChoiceAnnotation } from "../utils/choice-annotations";

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
  annotation?: ResolvedChoiceAnnotation;
}

export function ChoiceCard({
  state = "default",
  icon,
  label,
  description,
  annotation,
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
          <div className="flex flex-wrap items-baseline gap-x-2 text-base leading-snug">
            <span>{label}</span>
            {annotation ? (
              <span className="text-sm font-semibold">
                {annotation.meaning ? (
                  <span className="text-text-secondary">
                    {annotation.meaning}
                  </span>
                ) : null}
                <span className="text-green-dark">
                  {annotation.meaning ? " " : ""}
                  {annotation.reading}
                </span>
              </span>
            ) : null}
          </div>
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
