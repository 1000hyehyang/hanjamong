import type { QuizQuestion } from "../types/quiz";

function hasMarkedText(text: string): boolean {
  return text.includes("⟦") && text.includes("⟧");
}

function hasNumberedHanja(text: string): boolean {
  return /[①-⑳]/.test(text);
}

function hasCircleMarks(text: string): boolean {
  return /[㉠-㉭]/.test(text);
}

function hasBlankFill(text: string): boolean {
  return text.includes("□□");
}

const CIRCLE_MARK_CHAR_RE = /[㉠-㉭]/;

const PARTICLE_SUFFIXES = [
  "이라고",
  "이라는",
  "라고",
  "이라",
  "에서는",
  "에서",
  "으로",
  "로",
  "의",
  "을",
  "를",
  "이",
  "가",
  "은",
  "는",
  "에",
  "와",
  "과",
  "도",
  "만",
  "부터",
  "까지",
  "란",
  "라는",
  "하고",
  "이고",
];

export interface HighlightOptions {
  underlineAllHanja: boolean;
  underlineNumberedHanja: boolean;
  underlineMarkedText: boolean;
  underlineBlanks: boolean;
  highlightCircleMarks: boolean;
  circleMarkWords: Record<string, string>;
  circleMarksToUnderline: string[];
  specificChar?: { mark?: string; word: string; char: string };
}

export interface QuestionDisplayParts {
  header: string | null;
  passage: string | null;
  instruction: string | null;
  content: string | null;
  highlightOptions: HighlightOptions;
}

export type HighlightPart =
  | string
  | { type: "mark" | "hanja" | "text" | "blank" | "circleText"; text: string };

function mentionsUnderline(text: string): boolean {
  return text.includes("밑줄 친") || text.includes("밑줄친");
}

function isReadingHeader(line: string): boolean {
  return /^다음 글을 읽/.test(line) || /^다음 문장/.test(line);
}

function isBlankFillInstruction(line: string): boolean {
  return line.includes("빈칸");
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

function extractCircleMarkWords(instruction: string): Record<string, string> {
  const words: Record<string, string> = {};

  for (const match of instruction.matchAll(
    /([㉠-㉭])[\u2018''""''`'‘]([^\u2019"""\n''`'’]+)[\u2019"""\n''`'’]/g,
  )) {
    words[match[1]] = match[2].trim();
  }

  return words;
}

function expandCircleMarkRange(start: string, end: string): string[] {
  const startCode = start.codePointAt(0);
  const endCode = end.codePointAt(0);
  if (startCode === undefined || endCode === undefined || startCode > endCode) {
    return [];
  }

  const marks: string[] = [];
  for (let code = startCode; code <= endCode; code += 1) {
    marks.push(String.fromCodePoint(code));
  }
  return marks;
}

function extractCircleMarksToUnderline(instruction: string): string[] {
  const marks = new Set<string>();

  for (const match of instruction.matchAll(/([㉠-㉭])\s*[~～∼-]\s*([㉠-㉭])/g)) {
    for (const mark of expandCircleMarkRange(match[1], match[2])) {
      marks.add(mark);
    }
  }

  for (const match of instruction.matchAll(/[㉠-㉭]/g)) {
    marks.add(match[0]);
  }

  return [...marks];
}

function normalizeHanjaText(text: string): string {
  return text.normalize("NFKC");
}

function hanjaTextsEqual(a: string, b: string): boolean {
  return normalizeHanjaText(a) === normalizeHanjaText(b);
}

function sliceMatchingWord(text: string, expectedWord: string): string | null {
  const actual = text.slice(0, expectedWord.length);
  return hanjaTextsEqual(actual, expectedWord) ? actual : null;
}

function findCharSpanInWord(
  word: string,
  char: string,
): { start: number; end: number } | null {
  for (let start = 0; start < word.length; start += 1) {
    for (let end = start + 1; end <= word.length; end += 1) {
      if (hanjaTextsEqual(word.slice(start, end), char)) {
        return { start, end };
      }
    }
  }

  return null;
}

function appendWordWithCharUnderline(
  parts: HighlightPart[],
  word: string,
  char: string,
): void {
  const span = findCharSpanInWord(word, char);
  if (!span) {
    parts.push({ type: "circleText", text: word });
    return;
  }

  if (span.start > 0) {
    parts.push({ type: "circleText", text: word.slice(0, span.start) });
  }

  parts.push({
    type: stemHighlightType(word.slice(span.start, span.end)),
    text: word.slice(span.start, span.end),
  });

  if (span.end < word.length) {
    parts.push({ type: "circleText", text: word.slice(span.end) });
  }
}

function matchLeadingParticle(text: string): string {
  for (const particle of PARTICLE_SUFFIXES) {
    if (text.startsWith(particle)) {
      return particle;
    }
  }

  return "";
}

function consumeLeadingQuestionTarget(text: string): {
  parts: HighlightPart[];
  consumed: number;
} | null {
  const match = text.match(/^[^\s,.;:!?()[\]{}<>《》"'“”‘’]+/);
  if (!match) {
    return null;
  }

  const { stem, suffix } = splitStemAndParticle(match[0]);
  if (!stem) {
    return null;
  }

  return {
    parts: suffix
      ? [{ type: stemHighlightType(stem), text: stem }, suffix]
      : [{ type: stemHighlightType(stem), text: stem }],
    consumed: match[0].length,
  };
}

function extractSpecificCharUnderline(
  instruction: string,
): { mark?: string; word: string; char: string } | null {
  const fromMarkedPhrase = instruction.match(
    /([㉠-㉭])?[\u2018''""‘']?([^\u2019''""'\n]+)[\u2019''""’']?에서 밑줄 친 [\u2018''""‘']?([\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff])[\u2019''""’']?자/,
  );

  if (fromMarkedPhrase) {
    return {
      mark: fromMarkedPhrase[1],
      word: fromMarkedPhrase[2],
      char: fromMarkedPhrase[3],
    };
  }

  const fromReadingDiff = instruction.match(
    /([㉠-㉭])[\u2018''""‘']([^\u2019''""'\n]+)[\u2019''""’']의 [\u2018''""‘']([\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff])[\u2019''""’']자?(?:과|와)? (?:독)?음/,
  );

  if (fromReadingDiff) {
    return {
      mark: fromReadingDiff[1],
      word: fromReadingDiff[2],
      char: fromReadingDiff[3],
    };
  }

  const fromWordCharReference =
    instruction.match(
      /([㉠-㉭])[\u2018''""‘']([^\u2019''""'\n]+)[\u2019''""’'](?:에서|의|을 한자로 쓸 때|를 한자로 쓸 때)\s*[\u2018''""‘']([^\u2019''""'\n])[\u2019''""’']\s*자?/,
    ) ??
    instruction.match(
      /[\u2018''""‘']([㉠-㉭])([^\u2019''""'\n]+)[\u2019''""’'](?:에서|의|을 한자로 쓸 때|를 한자로 쓸 때)\s*[\u2018''""‘']([^\u2019''""'\n])[\u2019''""’']\s*자?/,
    );

  if (fromWordCharReference) {
    return {
      mark: fromWordCharReference[1],
      word: fromWordCharReference[2],
      char: fromWordCharReference[3],
    };
  }

  return null;
}

function partsWithHighlightType(
  parts: HighlightPart[],
  type: "hanja" | "text" | "blank" | "circleText",
): HighlightPart[] {
  return parts.map((part) => {
    if (typeof part === "string" || part.type === "mark") {
      return part;
    }
    return { ...part, type };
  });
}

function splitStemAndParticle(text: string): { stem: string; suffix: string } {
  if (text.startsWith("□□")) {
    for (const particle of PARTICLE_SUFFIXES) {
      if (text.slice(2).startsWith(particle)) {
        return { stem: "□□", suffix: particle };
      }
    }
    return { stem: "□□", suffix: "" };
  }

  for (const particle of PARTICLE_SUFFIXES) {
    if (text.endsWith(particle) && text.length > particle.length) {
      return {
        stem: text.slice(0, -particle.length),
        suffix: particle,
      };
    }
  }

  return { stem: text, suffix: "" };
}

function stemHighlightType(stem: string): "blank" | "hanja" | "text" {
  if (stem.includes("□")) {
    return "blank";
  }
  if (/[\u4e00-\u9fff\u3400-\u4dbf]/.test(stem)) {
    return "hanja";
  }
  return "text";
}

function buildHighlightOptions(
  instruction: string,
  passage: string,
): HighlightOptions {
  const circleMarkWords = extractCircleMarkWords(instruction);
  const circleMarksToUnderline = extractCircleMarksToUnderline(instruction);
  const specificChar = extractSpecificCharUnderline(instruction);
  const underlineBlanks = isBlankFillInstruction(instruction) && hasBlankFill(passage);

  if (specificChar) {
    return {
      underlineAllHanja: false,
      underlineNumberedHanja: false,
      underlineMarkedText: false,
      underlineBlanks,
      highlightCircleMarks: hasCircleMarks(passage),
      circleMarkWords,
      circleMarksToUnderline,
      specificChar,
    };
  }

  if (!mentionsUnderline(instruction)) {
    return {
      underlineAllHanja: false,
      underlineNumberedHanja: false,
      underlineMarkedText: false,
      underlineBlanks,
      highlightCircleMarks: hasCircleMarks(passage),
      circleMarkWords,
      circleMarksToUnderline,
    };
  }

  if (hasMarkedText(passage)) {
    return {
      underlineAllHanja: false,
      underlineNumberedHanja: false,
      underlineMarkedText: true,
      underlineBlanks,
      highlightCircleMarks: hasCircleMarks(passage),
      circleMarkWords,
      circleMarksToUnderline,
    };
  }

  if (hasNumberedHanja(passage)) {
    return {
      underlineAllHanja: false,
      underlineNumberedHanja: true,
      underlineMarkedText: false,
      underlineBlanks,
      highlightCircleMarks: hasCircleMarks(passage),
      circleMarkWords,
      circleMarksToUnderline,
    };
  }

  return {
    underlineAllHanja: true,
    underlineNumberedHanja: false,
    underlineMarkedText: false,
    underlineBlanks,
    highlightCircleMarks: hasCircleMarks(passage),
    circleMarkWords,
    circleMarksToUnderline,
  };
}

const defaultHighlightOptions: HighlightOptions = {
  underlineAllHanja: false,
  underlineNumberedHanja: false,
  underlineMarkedText: false,
  underlineBlanks: false,
  highlightCircleMarks: false,
  circleMarkWords: {},
  circleMarksToUnderline: [],
};

export function parseQuestionDisplay(question: QuizQuestion): QuestionDisplayParts {
  const { question: text, type } = question;
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);

  if (type === "reading_comp") {
    const inlineSplit = text.match(/^([\s\S]+?[.?!?…])\s+(밑줄 친[\s\S]+)$/);

    if (inlineSplit) {
      const passage = inlineSplit[1].trim();
      const instruction = inlineSplit[2].trim();
      return {
        header: null,
        passage,
        instruction,
        content: null,
        highlightOptions: buildHighlightOptions(instruction, passage),
      };
    }

    if (
      lines.length === 2 &&
      isReadingHeader(lines[0]) &&
      !isSubQuestionLine(lines[1])
    ) {
      const passage = lines[1];
      const instruction = lines[0];
      return {
        header: null,
        passage,
        instruction,
        content: null,
        highlightOptions: isBlankFillInstruction(instruction)
          ? {
              ...defaultHighlightOptions,
              underlineBlanks: hasBlankFill(passage),
              highlightCircleMarks: hasCircleMarks(passage),
            }
          : buildHighlightOptions(instruction, passage),
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
          highlightOptions: buildHighlightOptions(instruction, passage),
        };
      }
    }

    if (lines.length >= 3 && isReadingHeader(lines[0])) {
      const passage = lines[1];
      const instruction = lines.slice(2).join("\n");
      return {
        header: lines[0],
        passage,
        instruction,
        content: null,
        highlightOptions: buildHighlightOptions(instruction, passage),
      };
    }
  }

  if (lines.length >= 2) {
    const instruction = lines[0];
    const content = lines.slice(1).join("\n");
    return {
      header: null,
      passage: null,
      instruction,
      content,
      highlightOptions: buildHighlightOptions(instruction, content),
    };
  }

  return {
    header: null,
    passage: null,
    instruction: null,
    content: text,
    highlightOptions: buildHighlightOptions(text, text),
  };
}

function consumeCircleMarkSegment(
  text: string,
  index: number,
  options: HighlightOptions,
): { parts: HighlightPart[]; nextIndex: number } | null {
  const mark = text[index];
  if (!CIRCLE_MARK_CHAR_RE.test(mark)) {
    return null;
  }

  const expected = options.circleMarkWords[mark];
  const afterMark = text.slice(index + 1);
  const parts: HighlightPart[] = [{ type: "mark", text: mark }];
  const specific = options.specificChar;

  if (specific?.mark === mark) {
    const matchedWord = sliceMatchingWord(afterMark, specific.word);
    if (matchedWord) {
      appendWordWithCharUnderline(parts, matchedWord, specific.char);
      let consumed = 1 + matchedWord.length;
      const particle = matchLeadingParticle(afterMark.slice(matchedWord.length));
      if (particle) {
        parts.push(particle);
        consumed += particle.length;
      }
      return { parts, nextIndex: index + consumed };
    }
  }

  if (expected && specific?.mark !== mark) {
    const matchedWord = sliceMatchingWord(afterMark, expected);
    if (matchedWord) {
      parts.push({ type: stemHighlightType(matchedWord), text: matchedWord });
      let consumed = 1 + matchedWord.length;
      const particle = matchLeadingParticle(afterMark.slice(matchedWord.length));
      if (particle) {
        parts.push(particle);
        consumed += particle.length;
      }
      return { parts, nextIndex: index + consumed };
    }
  }

  if (options.circleMarksToUnderline.includes(mark)) {
    const target = consumeLeadingQuestionTarget(afterMark);
    if (target) {
      parts.push(...target.parts);
      return { parts, nextIndex: index + 1 + target.consumed };
    }
  }

  if (afterMark.startsWith("□□") && options.underlineBlanks) {
    parts.push({ type: "blank", text: "□□" });
    const rest = afterMark.slice(2);
    const { suffix } = splitStemAndParticle(`□□${rest}`);
    if (suffix) {
      parts.push(suffix);
      return { parts, nextIndex: index + 1 + 2 + suffix.length };
    }
    return { parts, nextIndex: index + 3 };
  }

  const target = consumeLeadingQuestionTarget(afterMark);
  if (target && !target.parts.some((part) => typeof part !== "string" && part.type === "blank")) {
    parts.push(...partsWithHighlightType(target.parts, "circleText"));
    return { parts, nextIndex: index + 1 + target.consumed };
  }

  return { parts, nextIndex: index + 1 };
}

function consumeNumberedHanja(
  text: string,
  index: number,
): { parts: HighlightPart[]; nextIndex: number } | null {
  const marker = text[index];
  if (!/[①-⑳]/.test(marker)) {
    return null;
  }

  const hanjaMatch = text.slice(index + 1).match(/^[\u4e00-\u9fff\u3400-\u4dbf]+/);
  if (!hanjaMatch) {
    return null;
  }

  return {
    parts: [
      marker,
      { type: "hanja", text: hanjaMatch[0] },
    ],
    nextIndex: index + 1 + hanjaMatch[0].length,
  };
}

function consumeMarkedText(
  text: string,
  index: number,
): { parts: HighlightPart[]; nextIndex: number } | null {
  if (text[index] !== "⟦") {
    return null;
  }

  const end = text.indexOf("⟧", index + 1);
  if (end < 0) {
    return null;
  }

  const inner = text.slice(index + 1, end);
  return {
    parts: [{ type: "text", text: inner }],
    nextIndex: end + 1,
  };
}

function consumeBlankFill(
  text: string,
  index: number,
): { parts: HighlightPart[]; nextIndex: number } | null {
  if (text.slice(index, index + 2) !== "□□") {
    return null;
  }

  return {
    parts: [{ type: "blank", text: "□□" }],
    nextIndex: index + 2,
  };
}

function consumeHanjaToken(
  text: string,
  index: number,
): { parts: HighlightPart[]; nextIndex: number } | null {
  const match = text.slice(index).match(/^[\u4e00-\u9fff\u3400-\u4dbf]+/);
  if (!match) {
    return null;
  }

  return {
    parts: [{ type: "hanja", text: match[0] }],
    nextIndex: index + match[0].length,
  };
}

function findNextSpecialIndex(
  text: string,
  index: number,
  options: HighlightOptions,
): number {
  const candidates: number[] = [];

  const markedIndex = text.indexOf("⟦", index);
  if (markedIndex >= 0) {
    candidates.push(markedIndex);
  }

  if (options.highlightCircleMarks) {
    for (let i = index; i < text.length; i += 1) {
      if (CIRCLE_MARK_CHAR_RE.test(text[i])) {
        candidates.push(i);
        break;
      }
    }
  }

  if (options.underlineBlanks) {
    const blankIndex = text.indexOf("□□", index);
    if (blankIndex >= 0) {
      candidates.push(blankIndex);
    }
  }

  if (options.underlineNumberedHanja) {
    for (let i = index; i < text.length; i += 1) {
      if (/[①-⑳]/.test(text[i])) {
        candidates.push(i);
        break;
      }
    }
  }

  if (options.underlineAllHanja) {
    for (let i = index; i < text.length; i += 1) {
      if (/[\u4e00-\u9fff\u3400-\u4dbf]/.test(text[i])) {
        candidates.push(i);
        break;
      }
    }
  }

  return candidates.length > 0 ? Math.min(...candidates) : text.length;
}

export function renderHighlightedText(
  text: string,
  options: HighlightOptions,
): HighlightPart[] {
  const parts: HighlightPart[] = [];
  let index = 0;

  while (index < text.length) {
    const marked = consumeMarkedText(text, index);
    if (marked) {
      parts.push(...marked.parts);
      index = marked.nextIndex;
      continue;
    }

    if (options.highlightCircleMarks && CIRCLE_MARK_CHAR_RE.test(text[index])) {
      const circle = consumeCircleMarkSegment(text, index, options);
      if (circle) {
        parts.push(...circle.parts);
        index = circle.nextIndex;
        continue;
      }
    }

    if (options.underlineBlanks) {
      const blank = consumeBlankFill(text, index);
      if (blank) {
        parts.push(...blank.parts);
        index = blank.nextIndex;
        continue;
      }
    }

    if (options.underlineNumberedHanja) {
      const numbered = consumeNumberedHanja(text, index);
      if (numbered) {
        parts.push(...numbered.parts);
        index = numbered.nextIndex;
        continue;
      }
    }

    if (options.underlineAllHanja) {
      const hanja = consumeHanjaToken(text, index);
      if (hanja) {
        parts.push(...hanja.parts);
        index = hanja.nextIndex;
        continue;
      }
    }

    const nextSpecial = findNextSpecialIndex(text, index, options);
    if (nextSpecial > index) {
      parts.push(text.slice(index, nextSpecial));
      index = nextSpecial;
      continue;
    }

    parts.push(text[index]);
    index += 1;
  }

  return parts.length > 0 ? parts : [text];
}
