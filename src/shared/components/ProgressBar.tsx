interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = false,
}: ProgressBarProps) {
  const percent = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100));

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="mb-2 flex items-center justify-between text-sm font-bold text-text-secondary">
          {label ? <span>{label}</span> : <span />}
          {showPercent ? <span>{percent}%</span> : null}
        </div>
      )}
      <div className="h-3 overflow-hidden rounded-full bg-track">
        <div
          className="h-full rounded-full bg-green transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
