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

function inferGradeFromOldId(oldId) {
  const match = oldId.match(/^q-(\d+)-\d+$/);
  if (match) {
    return Number(match[1]);
  }

  // Legacy ids without grade prefix came from the earliest 3급 import.
  return 3;
}

function loadCurrentQuestions() {
  const byNewId = new Map();

  for (const grade of [3, 4, 5, 6, 7]) {
    const filePath = path.join(root, "src/data/questions", `questions-${grade}.json`);
    const questions = JSON.parse(fs.readFileSync(filePath, "utf8"));
    for (const question of questions) {
      byNewId.set(question.id, question);
    }
  }

  return byNewId;
}

function assignLowestGrades() {
  const byNewId = loadCurrentQuestions();
  const previousMigration = JSON.parse(
    fs.readFileSync(path.join(root, "src/data/questions/id-migration.json"), "utf8"),
  );

  const sourcesByNewId = new Map();
  for (const [oldId, newId] of Object.entries(previousMigration)) {
    const list = sourcesByNewId.get(newId) ?? [];
    list.push(oldId);
    sourcesByNewId.set(newId, list);
  }

  const reassigned = [];

  for (const [newId, question] of byNewId.entries()) {
    const sourceIds = sourcesByNewId.get(newId) ?? [newId];
    const sourceGrades = sourceIds.map(inferGradeFromOldId);
    const targetGrade = Math.max(...sourceGrades);

    reassigned.push({
      ...question,
      grade: targetGrade,
    });
  }

  return { reassigned, previousMigration, sourcesByNewId };
}

function dedupeAndWrite(questions, previousMigration, sourcesByNewId) {
  const keptFingerprints = new Map();
  const idMigration = { ...previousMigration };
  const resultByGrade = Object.fromEntries(grades.map((grade) => [grade, []]));
  const stats = { removed: 0, kept: 0, crossGradeRemoved: 0, movedToLowerGrade: 0 };

  const sorted = [...questions].sort((a, b) => {
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

      for (const oldId of sourcesByNewId.get(question.id) ?? [question.id]) {
        idMigration[oldId] = kept.newId;
      }
      continue;
    }

    const seq = resultByGrade[grade].length + 1;
    const newId = `q-${grade}-${String(seq).padStart(3, "0")}`;
    const normalized = { ...question, id: newId, grade };

    keptFingerprints.set(fp, { newId, grade });
    resultByGrade[grade].push(normalized);
    stats.kept += 1;

    if (grade > 3) {
      stats.movedToLowerGrade += 1;
    }

    for (const oldId of sourcesByNewId.get(question.id) ?? [question.id]) {
      idMigration[oldId] = newId;
    }
    idMigration[question.id] = newId;
  }

  for (const grade of grades) {
    const filePath = path.join(root, "src/data/questions", `questions-${grade}.json`);
    fs.writeFileSync(filePath, `${JSON.stringify(resultByGrade[grade], null, 2)}\n`);
  }

  fs.writeFileSync(
    path.join(root, "src/data/questions/id-migration.json"),
    `${JSON.stringify(idMigration, null, 2)}\n`,
  );

  console.log("dedupe complete (low grade first)", stats);
  for (const grade of grades) {
    console.log(`  grade ${grade}: ${resultByGrade[grade].length} questions`);
  }
}

const { reassigned, previousMigration, sourcesByNewId } = assignLowestGrades();
dedupeAndWrite(reassigned, previousMigration, sourcesByNewId);
