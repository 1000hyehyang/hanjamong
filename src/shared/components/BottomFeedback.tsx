import { Button } from "./Button";
import { Icon } from "./icons/Icon";

type FeedbackVariant = "success" | "error";

interface BottomFeedbackProps {
  variant: FeedbackVariant;
  title: string;
  description?: string;
  explanation?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  secondaryActionVariant?: "secondary" | "grapefruit";
}

const variantStyles: Record<
  FeedbackVariant,
  { panel: string; title: string; iconBg: string; icon: "check" | "x" }
> = {
  success: {
    panel: "bg-correct border-green",
    title: "text-green-dark",
    iconBg: "bg-green text-white",
    icon: "check",
  },
  error: {
    panel: "bg-wrong-feedback border-wrong",
    title: "text-[#b83232]",
    iconBg: "bg-wrong text-white",
    icon: "x",
  },
};

export function BottomFeedback({
  variant,
  title,
  description,
  explanation,
  actionLabel = "계속하기",
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  secondaryActionVariant = "secondary",
}: BottomFeedbackProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[420px] border-t-2 px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] ${styles.panel}`}
    >
      <div className="mb-4 flex items-start gap-3">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${styles.iconBg}`}
        >
          <Icon name={styles.icon} size={18} className="text-white" strokeWidth={3} />
        </span>
        <div className="min-w-0 flex-1">
          <p className={`text-xl font-extrabold ${styles.title}`}>{title}</p>
          {description ? (
            <p className="mt-1 text-sm font-semibold leading-relaxed text-text-primary">
              {description}
            </p>
          ) : null}
          {explanation ? (
            <p
              className={`text-sm font-semibold leading-relaxed text-text-primary ${description ? "mt-2" : "mt-1"}`}
            >
              {explanation}
            </p>
          ) : null}
        </div>
      </div>
      {onAction || onSecondaryAction ? (
        <div className="space-y-2">
          {onAction ? (
            <Button fullWidth onClick={onAction}>
              {actionLabel}
            </Button>
          ) : null}
          {onSecondaryAction ? (
            <Button
              variant={secondaryActionVariant}
              fullWidth
              onClick={onSecondaryAction}
            >
              {secondaryActionLabel}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
