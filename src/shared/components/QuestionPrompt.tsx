import type { QuizQuestion } from "../types/quiz";
import {
  parseQuestionDisplay,
  renderHighlightedText,
} from "../utils/parse-question-display";

function HighlightedText({
  text,
  underlineHanja,
  highlightCircleMarks,
  className = "",
}: {
  text: string;
  underlineHanja: boolean;
  highlightCircleMarks: boolean;
  className?: string;
}) {
  const parts = renderHighlightedText(text, {
    underlineHanja,
    highlightCircleMarks,
  });

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (typeof part === "string") {
          return <span key={`t-${index}`}>{part}</span>;
        }

        if (part.type === "mark") {
          return (
            <span
              key={`m-${index}`}
              className="font-extrabold text-grapefruit underline decoration-2 decoration-grapefruit underline-offset-2"
            >
              {part.text}
            </span>
          );
        }

        return (
          <span
            key={`h-${index}`}
            className="font-serif font-bold underline decoration-2 decoration-grapefruit underline-offset-[3px]"
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
                underlineHanja={parts.underlinePassageHanja}
                highlightCircleMarks={parts.highlightCircleMarks}
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
              ? "font-serif text-3xl font-bold"
              : "text-2xl font-extrabold",
          ].join(" ")}
        >
          <HighlightedText
            text={parts.content}
            underlineHanja={parts.underlinePassageHanja}
            highlightCircleMarks={false}
          />
        </p>
      </div>
    );
  }

  return (
    <p className="text-base font-extrabold leading-relaxed text-text-primary whitespace-pre-line">
      <HighlightedText
        text={parts.content ?? question.question}
        underlineHanja={parts.underlinePassageHanja}
        highlightCircleMarks={parts.highlightCircleMarks}
      />
    </p>
  );
}
