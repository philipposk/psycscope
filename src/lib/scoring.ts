import { DISORDERS, deepeningQuestions, primaryQuestions } from "./disorders";
import type { AssessmentAnswers, AssessmentResult, DisorderScore, LikertValue } from "./types";

function scoreDisorder(disorderId: string, answers: AssessmentAnswers): DisorderScore {
  const disorder = DISORDERS.find((d) => d.id === disorderId)!;
  const qIds = [
    ...primaryQuestions().filter((q) => q.disorders.includes(disorderId)).map((q) => q.id),
    ...deepeningQuestions(disorderId).map((q) => q.id),
  ];
  let raw = 0;
  let answered = 0;
  for (const qid of qIds) {
    const v = answers[qid];
    if (v !== undefined) {
      raw += v;
      answered++;
    }
  }
  const maxScore = disorder.maxScore;
  const percent = Math.round((raw / maxScore) * 100);
  const positive = raw >= disorder.threshold;
  return {
    id: disorder.id,
    name: disorder.name,
    category: disorder.category,
    rawScore: raw,
    maxScore,
    percent: Math.min(100, percent),
    positive,
    instrument: disorder.instrument,
    shortDescription: disorder.shortDescription,
  };
}

export function scoreAll(answers: AssessmentAnswers): DisorderScore[] {
  return DISORDERS.map((d) => scoreDisorder(d.id, answers));
}

export function buildResult(answers: AssessmentAnswers, narrative?: string): AssessmentResult {
  const scores = scoreAll(answers);
  const positiveCount = scores.filter((s) => s.positive).length;
  const overallPercent = Math.round((positiveCount / DISORDERS.length) * 100);
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    answers,
    scores,
    positiveCount,
    overallPercent,
    narrative,
  };
}

/** After primary screen, which disorders need deepening questions */
export function disordersNeedingDeepening(answers: AssessmentAnswers): string[] {
  return DISORDERS.filter((d) => {
    const primary = primaryQuestions().find((q) => q.disorders.includes(d.id));
    if (!primary) return false;
    const v = answers[primary.id];
    return v !== undefined && v >= 2;
  }).map((d) => d.id);
}

export function questionsForPhase(
  phase: "primary" | "deepening",
  deepeningFor: string[],
): { id: string; text: string; disorderName?: string }[] {
  if (phase === "primary") {
    return primaryQuestions().map((q) => ({
      id: q.id,
      text: q.text,
      disorderName: DISORDERS.find((d) => q.disorders.includes(d.id))?.name,
    }));
  }
  const out: { id: string; text: string; disorderName?: string }[] = [];
  for (const did of deepeningFor) {
    const d = DISORDERS.find((x) => x.id === did);
    for (const q of deepeningQuestions(did)) {
      out.push({ id: q.id, text: q.text, disorderName: d?.name });
    }
  }
  return out;
}

export function defaultAnswer(): LikertValue {
  return 0;
}

export const STORAGE_KEY = "psycscope-assessment-v1";

export function saveLocal(result: AssessmentResult) {
  if (typeof window === "undefined") return;
  const prev = loadHistory();
  prev.unshift(result);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prev.slice(0, 20)));
}

export function loadHistory(): AssessmentResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function loadLatest(): AssessmentResult | null {
  const h = loadHistory();
  return h[0] ?? null;
}
