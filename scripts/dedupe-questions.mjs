import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const grades = [7, 6, 5, 4, 3];

function fingerprint(question) {
  return [
    question.type,
    question.question,
    JSON.stringify(question.choices),
    question.answerIndex,
  ].join("|");
}

const keptFingerprints = new Map();
const resultByGrade = Object.fromEntries(grades.map((grade) => [grade, []]));
const stats = { removed: 0, kept: 0, crossGradeRemoved: 0 };

const allQuestions = [];

for (const grade of [...grades].reverse()) {
  const filePath = path.join(root, "src/data/questions", `questions-${grade}.json`);
  const questions = JSON.parse(fs.readFileSync(filePath, "utf8"));
  for (const question of questions) {
    allQuestions.push({ ...question, grade });
  }
}

const sorted = [...allQuestions].sort((a, b) => {
  if (a.grade !== b.grade) {
    return b.grade - a.grade;
  }
  return a.id.localeCompare(b.id);
});

for (const question of sorted) {
  const fp = fingerprint(question);
  const grade = question.grade;

  if (keptFingerprints.has(fp)) {
    const kept = keptFingerprints.get(fp);
    stats.removed += 1;
    if (kept.grade !== grade) {
      stats.crossGradeRemoved += 1;
    }
    continue;
  }

  const seq = resultByGrade[grade].length + 1;
  const newId = `q-${grade}-${String(seq).padStart(3, "0")}`;
  const normalized = { ...question, id: newId, grade };

  keptFingerprints.set(fp, { newId, grade });
  resultByGrade[grade].push(normalized);
  stats.kept += 1;
}

for (const grade of grades) {
  const filePath = path.join(root, "src/data/questions", `questions-${grade}.json`);
  fs.writeFileSync(filePath, `${JSON.stringify(resultByGrade[grade], null, 2)}\n`);
}

console.log("dedupe complete (low grade first)", stats);
for (const grade of grades) {
  console.log(`  grade ${grade}: ${resultByGrade[grade].length} questions`);
}
