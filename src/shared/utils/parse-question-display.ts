import type { QuizQuestion } from "../types/quiz";

const CIRCLE_MARK_RE = /[㉠-㉩]/g;

export interface QuestionDisplayParts {
  header: string | null;
  passage: string | null;
  instruction: string | null;
  content: string | null;
  underlinePassageHanja: boolean;
  highlightCircleMarks: boolean;
}

function mentionsUnderline(text: string): boolean {
  return text.includes("밑줄 친") || text.includes("밑줄친");
}

function isReadingHeader(line: string): boolean {
  return /^다음 글을 읽/.test(line) || /^다음 문장/.test(line);
}

function isSubQuestionLine(line: string): boolean {
  return (
    mentionsUnderline(line) ||
    /^㉠/.test(line.trim()) ||
    line.includes("무엇입니까") ||
    line.includes("어느 것") ||
    line.includes("바르지 않") ||
    line.includes("바르게")
  );
}

export function parseQuestionDisplay(question: QuizQuestion): QuestionDisplayParts {
  const { question: text, type } = question;
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);

  if (type === "reading_comp") {
    const inlineSplit = text.match(/^([\s\S]+?[.?!?…])\s+(밑줄 친[\s\S]+)$/);

    if (inlineSplit) {
      return {
        header: null,
        passage: inlineSplit[1].trim(),
        instruction: inlineSplit[2].trim(),
        content: null,
        underlinePassageHanja: true,
        highlightCircleMarks: false,
      };
    }

    if (lines.length >= 2) {
      const hasHeader = isReadingHeader(lines[0]);
      const header = hasHeader ? lines[0] : null;
      const bodyStart = hasHeader ? 1 : 0;
      const instruction = lines[lines.length - 1];
      const passageLines = lines.slice(bodyStart, lines.length - 1);

      if (passageLines.length > 0 && isSubQuestionLine(instruction)) {
        const passage = passageLines.join("\n");
        return {
          header,
          passage,
          instruction,
          content: null,
          underlinePassageHanja: mentionsUnderline(instruction),
          highlightCircleMarks: CIRCLE_MARK_RE.test(passage),
        };
      }
    }

    if (lines.length >= 3 && isReadingHeader(lines[0])) {
      return {
        header: lines[0],
        passage: lines[1],
        instruction: lines.slice(2).join("\n"),
        content: null,
        underlinePassageHanja: mentionsUnderline(text),
        highlightCircleMarks: CIRCLE_MARK_RE.test(lines[1] ?? ""),
      };
    }
  }

  if (lines.length >= 2) {
    return {
      header: null,
      passage: null,
      instruction: lines[0],
      content: lines.slice(1).join("\n"),
      underlinePassageHanja: false,
      highlightCircleMarks: false,
    };
  }

  return {
    header: null,
    passage: null,
    instruction: null,
    content: text,
    underlinePassageHanja: mentionsUnderline(text),
    highlightCircleMarks: false,
  };
}

export function renderHighlightedText(
  text: string,
  options: { underlineHanja: boolean; highlightCircleMarks: boolean },
): Array<string | { type: "hanja" | "mark"; text: string }> {
  const parts: Array<string | { type: "hanja" | "mark"; text: string }> = [];
  const pattern = options.highlightCircleMarks
    ? /([㉠-㉩][^㉠-㉩\s]*|[\u4e00-\u9fff\u3400-\u4dbf]+)/g
    : /[\u4e00-\u9fff\u3400-\u4dbf]+/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (options.highlightCircleMarks && CIRCLE_MARK_RE.test(token)) {
      parts.push({ type: "mark", text: token });
    } else if (options.underlineHanja) {
      parts.push({ type: "hanja", text: token });
    } else {
      parts.push(token);
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}
