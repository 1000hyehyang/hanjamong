import type { ReactNode } from "react";
import type { IconName } from "./icons/Icon";
import { Icon } from "./icons/Icon";

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description?: string;
  action?: ReactNode;
  plain?: boolean;
}

export function EmptyState({
  icon = "book-open",
  title,
  description,
  action,
  plain = false,
}: EmptyStateProps) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center px-6 py-14 text-center",
        plain ? "" : "rounded-3xl border-2 border-dashed border-border bg-page",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-grapefruit-light text-grapefruit shadow-[0_4px_0_0_#FFD4C4]">
        <Icon name={icon} size={32} />
      </div>
      <h3 className="mt-4 text-xl font-extrabold text-text-primary">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-xs text-sm font-semibold leading-relaxed text-text-secondary">
          {description}
        </p>
      ) : null}
      {action ? (
        <div className={`mt-6 w-full ${plain ? "" : "max-w-xs"}`}>{action}</div>
      ) : null}
    </div>
  );
}
