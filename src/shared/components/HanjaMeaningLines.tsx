import type { HanjaEntry } from "../types/hanja";

interface HanjaMeaningLinesProps {
  entry: HanjaEntry;
  className?: string;
  lineClassName?: string;
}

export function HanjaMeaningLines({
  entry,
  className = "space-y-2",
  lineClassName = "text-xl font-extrabold",
}: HanjaMeaningLinesProps) {
  return (
    <div className={className}>
      {entry.meanings.map((item) => (
        <p key={`${item.meaning}-${item.reading}`} className={lineClassName}>
          <span className="text-text-primary">{item.meaning}</span>
          <span className="text-green-dark"> {item.reading}</span>
        </p>
      ))}
    </div>
  );
}
