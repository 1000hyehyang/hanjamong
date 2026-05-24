import type { QuizQuestion } from "../types/quiz";
import {
  parseQuestionDisplay,
  renderHighlightedText,
  type HighlightOptions,
} from "../utils/parse-question-display";

const HANJA_TEXT_RE = /([\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]+)/g;

function TextWithHanjaFont({ text }: { text: string }) {
  return (
    <>
      {text.split(HANJA_TEXT_RE).map((segment, index) => {
        if (!segment) {
          return null;
        }

        if (/^[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]+$/.test(segment)) {
          return (
            <span key={`hanja-${index}`} className="font-extrabold">
              {segment}
            </span>
          );
        }

        return <span key={`text-${index}`}>{segment}</span>;
      })}
    </>
  );
}

function HighlightedText({
  text,
  highlightOptions,
  className = "",
}: {
  text: string;
  highlightOptions: HighlightOptions;
  className?: string;
}) {
  const parts = renderHighlightedText(text, highlightOptions);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (typeof part === "string") {
          return (
            <span key={`t-${index}`}>
              <TextWithHanjaFont text={part} />
            </span>
          );
        }

        if (part.type === "mark") {
          return (
            <span
              key={`m-${index}`}
              className="font-extrabold text-grapefruit"
            >
              {part.text}
            </span>
          );
        }

        if (part.type === "blank") {
          return (
            <span
              key={`b-${index}`}
              className="font-extrabold underline decoration-2 decoration-grapefruit underline-offset-[3px] tracking-widest"
            >
              {part.text}
            </span>
          );
        }

        if (part.type === "circleText") {
          return (
            <span
              key={`c-${index}`}
              className="font-extrabold underline decoration-2 decoration-border underline-offset-[3px]"
            >
              <TextWithHanjaFont text={part.text} />
            </span>
          );
        }

        return (
          <span
            key={`h-${index}`}
            className={[
              "font-extrabold",
              "underline decoration-2 decoration-grapefruit underline-offset-[3px]",
            ].join(" ")}
          >
            {part.text}
          </span>
        );
      })}
    </span>
  );
}

export function QuestionPrompt({ question }: { question: QuizQuestion }) {
  const parts = parseQuestionDisplay(question);
  const isReading = question.type === "reading_comp";

  if (isReading && (parts.passage || parts.instruction)) {
    return (
      <div className="space-y-3">
        {parts.header ? (
          <p className="text-sm font-extrabold text-text-secondary">
            {parts.header}
          </p>
        ) : null}

        {parts.passage ? (
          <div className="rounded-2xl border-2 border-border bg-page px-4 py-3">
            <p className="text-[15px] font-semibold leading-[1.75] text-text-primary whitespace-pre-line">
              <HighlightedText
                text={parts.passage}
                highlightOptions={parts.highlightOptions}
              />
            </p>
          </div>
        ) : null}

        {parts.instruction ? (
          <p className="text-base font-extrabold leading-relaxed text-text-primary">
            {parts.instruction}
          </p>
        ) : null}
      </div>
    );
  }

  if (parts.instruction && parts.content) {
    return (
      <div className="space-y-3">
        <p className="text-base font-extrabold leading-relaxed text-text-primary">
          {parts.instruction}
        </p>
        <p
          className={[
            "leading-relaxed text-text-primary",
            question.type === "meaning_to_hanja"
              ? "text-3xl font-extrabold"
              : "text-2xl font-extrabold",
          ].join(" ")}
        >
          <HighlightedText
            text={parts.content}
            highlightOptions={parts.highlightOptions}
          />
        </p>
      </div>
    );
  }

  return (
    <p className="text-base font-extrabold leading-relaxed text-text-primary whitespace-pre-line">
      <HighlightedText
        text={parts.content ?? question.question}
        highlightOptions={parts.highlightOptions}
      />
    </p>
  );
}
