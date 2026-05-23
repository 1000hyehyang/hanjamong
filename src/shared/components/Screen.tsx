import type { ReactNode } from "react";
import { Icon } from "./icons/Icon";
import { pressableIconButton } from "../styles/interactive";

interface ScreenProps {
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  noPadding?: boolean;
  footerAboveNav?: boolean;
  footerPlain?: boolean;
}

export function Screen({
  children,
  footer,
  className = "",
  noPadding = false,
  footerAboveNav = false,
  footerPlain = false,
}: ScreenProps) {
  const contentPadding = noPadding
    ? ""
    : footerAboveNav
      ? "px-4 pt-2 pb-[calc(var(--app-action-footer-height)+var(--app-tab-bar-height)+env(safe-area-inset-bottom))]"
      : "px-4 pt-2 pb-[calc(var(--app-tab-bar-height)+env(safe-area-inset-bottom))]";

  return (
    <div className={`flex flex-col bg-surface ${className}`}>
      <div className={["min-w-0 flex-1", contentPadding].filter(Boolean).join(" ")}>
        {children}
      </div>
      {footer ? (
        footerAboveNav ? (
          <div
            className={[
              "fixed inset-x-0 bottom-[calc(var(--app-tab-bar-height)+env(safe-area-inset-bottom))] z-30 mx-auto w-full max-w-[420px] border-t-2 border-border bg-surface px-4 py-4 [&>*]:w-full [&_a]:block",
              footerPlain ? "" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {footer}
          </div>
        ) : (
          <div
            className={[
              "sticky bottom-0 bg-surface px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
              footerPlain ? "" : "border-t border-border",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {footer}
          </div>
        )
      ) : null}
    </div>
  );
}

interface ScreenHeaderProps {
  onBack?: () => void;
  backLabel?: string;
  progress?: number;
  progressMax?: number;
  rightSlot?: ReactNode;
}

export function ScreenHeader({
  onBack,
  backLabel = "뒤로",
  progress,
  progressMax = 100,
  rightSlot,
}: ScreenHeaderProps) {
  const progressPercent =
    progressMax === 0 ? 0 : Math.min(100, Math.round((progress ?? 0) / progressMax * 100));

  return (
    <header className="mb-4 pt-1">
      <div className="mb-3 flex items-center gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label={backLabel}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-secondary ${pressableIconButton}`}
          >
            <Icon name="chevron-left" size={24} />
          </button>
        ) : (
          <div className="h-10 w-10 shrink-0" />
        )}

        {typeof progress === "number" ? (
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-track">
            <div
              className="h-full rounded-full bg-green transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {rightSlot ?? <div className="h-10 w-10 shrink-0" />}
      </div>
    </header>
  );
}

export function ScreenTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-extrabold leading-tight text-text-primary">
        {children}
      </h1>
    </div>
  );
}
