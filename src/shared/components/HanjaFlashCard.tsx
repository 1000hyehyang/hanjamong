import type { HanjaEntry } from "../types/hanja";
import { HanjaMeaningLines } from "./HanjaMeaningLines";
import { StarButton } from "./StarButton";
import { playSound } from "../sounds/play-sound";
import { pressableFlashCard } from "../styles/interactive";

interface HanjaFlashCardProps {
  entry: HanjaEntry;
  gradeLabel: string;
  revealed: boolean;
  onToggleReveal: () => void;
  bookmarked: boolean;
  onToggleBookmark: () => void;
}

const cardFaceClassName =
  "absolute inset-0 flex flex-col items-center justify-center bg-surface px-6 py-10 text-center [-webkit-backface-visibility:hidden] [backface-visibility:hidden]";

export function HanjaFlashCard({
  entry,
  gradeLabel,
  revealed,
  onToggleReveal,
  bookmarked,
  onToggleBookmark,
}: HanjaFlashCardProps) {
  return (
    <div className="relative w-full">
      <div className="absolute right-3 top-3 z-10">
        <StarButton active={bookmarked} onToggle={onToggleBookmark} />
      </div>

      <button
        type="button"
        aria-label={revealed ? "앞면 보기" : "뜻/음 보기"}
        onClick={() => {
          playSound("click");
          onToggleReveal();
        }}
        className={`block w-full overflow-hidden rounded-[24px] border-2 border-b-4 border-border bg-surface text-left ${pressableFlashCard}`}
      >
        <div className="relative h-[340px] w-full [perspective:1000px]">
          <div
            className={[
              "relative h-full w-full [transform-style:preserve-3d] transition-transform duration-500",
              revealed ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]",
            ].join(" ")}
          >
            <div className={`${cardFaceClassName} [transform:rotateY(0deg)_translateZ(1px)]`}>
              <span className="inline-flex rounded-full bg-grapefruit-light px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-grapefruit">
                {gradeLabel}
              </span>

              <div className="mt-6 font-serif text-[112px] font-bold leading-none text-text-primary">
                {entry.character}
              </div>

              <p className="mt-8 text-sm font-bold text-text-secondary">
                탭해서 뒤집기
              </p>
            </div>

            <div
              className={`${cardFaceClassName} [transform:rotateY(180deg)_translateZ(1px)]`}
            >
              <span className="inline-flex rounded-full bg-grapefruit-light px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-grapefruit">
                {gradeLabel}
              </span>

              <div className="mt-6">
                <HanjaMeaningLines
                  entry={entry}
                  className="space-y-3"
                  lineClassName="text-2xl font-extrabold text-text-primary"
                />
              </div>

              {entry.examples && entry.examples.length > 0 ? (
                <p className="mt-6 text-sm font-semibold text-text-secondary">
                  예: {entry.examples.join(", ")}
                </p>
              ) : null}

              <p className="mt-6 text-sm font-bold text-text-secondary">
                탭해서 앞면으로
              </p>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
