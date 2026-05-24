import { useEffect, useMemo, useState } from "react";
import { Icon } from "./icons/Icon";
import { playSound } from "../sounds/play-sound";
import { pressableIconButton } from "../styles/interactive";

interface HanjaExampleWord {
  word: string;
  reading?: string;
}

const VISIBLE_COUNT = 3;

function parseExample(example: string): HanjaExampleWord {
  const trimmed = example.trim();
  const match = trimmed.match(/^(.+)\s+([가-힣]+)$/);

  if (!match) {
    return { word: trimmed };
  }

  return {
    word: match[1],
    reading: match[2],
  };
}

function ExampleWordCard({ word, reading }: HanjaExampleWord) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-2xl border border-border bg-surface px-2 py-5">
      <span className="font-serif text-lg font-bold leading-tight text-text-primary">
        {word}
      </span>
      {reading ? (
        <span className="mt-1.5 text-sm font-extrabold text-green-dark">
          {reading}
        </span>
      ) : null}
    </div>
  );
}

interface HanjaExampleWordsProps {
  examples?: string[];
}

export function HanjaExampleWords({ examples }: HanjaExampleWordsProps) {
  const items = useMemo(() => {
    if (!examples || examples.length === 0) return [];

    return Array.from(new Set(examples.map((example) => example.trim())))
      .filter(Boolean)
      .map(parseExample);
  }, [examples]);

  const isCarousel = items.length > VISIBLE_COUNT;
  const maxPageIndex = Math.max(0, items.length - VISIBLE_COUNT);
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    setPageIndex(0);
  }, [examples]);

  useEffect(() => {
    setPageIndex((prev) => Math.min(prev, maxPageIndex));
  }, [maxPageIndex]);

  if (items.length === 0) return null;

  const visibleItems = isCarousel
    ? items.slice(pageIndex, pageIndex + VISIBLE_COUNT)
    : items;

  const goPrev = () => {
    playSound("click");
    setPageIndex((prev) => Math.max(0, prev - 1));
  };

  const goNext = () => {
    playSound("click");
    setPageIndex((prev) => Math.min(maxPageIndex, prev + 1));
  };

  return (
    <section className="mt-4">
      <div className="mt-3 flex items-center gap-1">
        {isCarousel ? (
          <button
            type="button"
            aria-label="이전 단어"
            onClick={goPrev}
            disabled={pageIndex === 0}
            className={`flex h-10 w-8 shrink-0 items-center justify-center rounded-lg text-text-secondary disabled:opacity-30 ${pressableIconButton}`}
          >
            <Icon name="chevron-left" size={20} />
          </button>
        ) : null}

        <div className="flex min-w-0 flex-1 gap-2">
          {visibleItems.map((example) => (
            <ExampleWordCard
              key={`${example.word}-${example.reading ?? ""}-${pageIndex}`}
              word={example.word}
              reading={example.reading}
            />
          ))}
        </div>

        {isCarousel ? (
          <button
            type="button"
            aria-label="다음 단어"
            onClick={goNext}
            disabled={pageIndex >= maxPageIndex}
            className={`flex h-10 w-8 shrink-0 items-center justify-center rounded-lg text-text-secondary disabled:opacity-30 ${pressableIconButton}`}
          >
            <Icon name="chevron-right" size={20} />
          </button>
        ) : null}
      </div>

      {isCarousel ? (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {Array.from({ length: maxPageIndex + 1 }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`${index + 1}번째 단어 보기`}
              aria-current={index === pageIndex ? "true" : undefined}
              onClick={() => {
                playSound("click");
                setPageIndex(index);
              }}
              className={[
                "h-2 w-2 rounded-full transition-colors",
                index === pageIndex ? "bg-green" : "bg-border",
              ].join(" ")}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
