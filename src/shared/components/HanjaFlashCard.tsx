import type { ReactNode } from "react";
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
  "absolute inset-0 flex flex-col items-center justify-center bg-surface px-6 py-8 text-center [-webkit-backface-visibility:hidden] [backface-visibility:hidden]";

interface HanjaMetaItem {
  key: string;
  content: ReactNode;
}

function HanjaMetaBadges({ entry }: { entry: HanjaEntry }) {
  const maybeItems: Array<HanjaMetaItem | null> = [
    entry.strokeCount !== undefined
      ? {
          key: "strokeCount",
          content: (
            <>
              <span className="text-text-primary">{entry.strokeCount}</span>
              <span>획</span>
            </>
          ),
        }
      : null,
    entry.radical
      ? {
          key: "radical",
          content: (
            <>
              <span>부수 </span>
              <span className="text-text-primary">{entry.radical}</span>
            </>
          ),
        }
      : null,
    entry.formation
      ? {
          key: "formation",
          content: (
            <>
              <span>육서 </span>
              <span className="text-text-primary">{entry.formation}자</span>
            </>
          ),
        }
      : null,
  ];
  const items = maybeItems.filter((item): item is HanjaMetaItem => item !== null);

  if (items.length === 0) return null;

  return (
    <div className="absolute left-3 top-3 z-10 flex max-w-[240px] items-center overflow-hidden rounded-full bg-bg px-3 py-1.5 text-left text-[11px] font-extrabold leading-none text-text-secondary">
      {items.map((item, index) => (
        <span key={item.key} className="flex items-center">
          {index > 0 ? (
            <span className="mx-2 text-text-secondary">|</span>
          ) : null}
          <span>{item.content}</span>
        </span>
      ))}
    </div>
  );
}

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
      <HanjaMetaBadges entry={entry} />

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
                <div className="mt-6 w-full max-w-[260px] border-t-2 border-border pt-4">
                  <p className="text-xs font-extrabold text-text-secondary">
                    단어
                  </p>
                  <div className="mt-2 flex flex-wrap justify-center gap-2">
                    {entry.examples.map((example) => (
                      <span
                        key={example}
                        className="inline-flex items-baseline gap-1 rounded-full bg-bg px-3 py-1.5 text-sm font-extrabold"
                      >
                        <span className="text-text-primary">{example}</span>
                      </span>
                    ))}
                  </div>
                </div>
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
