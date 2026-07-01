import { buildResult } from "./scoring";
import type { AssessmentResult } from "./types";

/** Realistic example profile — developer, moderate worry/focus/sleep flags (not diagnostic). */
const FILIPPOS_ANSWERS: Record<string, 0 | 1 | 2 | 3 | 4> = {
  mdd_p1: 2,
  mdd_d1: 2,
  mdd_d2: 1,
  bipolar_p1: 0,
  bipolar_d1: 0,
  bipolar_d2: 0,
  sad_p1: 1,
  sad_d1: 0,
  sad_d2: 0,
  pmdd_p1: 0,
  pmdd_d1: 0,
  pmdd_d2: 0,
  gad_p1: 2,
  gad_d1: 3,
  gad_d2: 2,
  panic_p1: 1,
  panic_d1: 0,
  panic_d2: 0,
  social_p1: 2,
  social_d1: 1,
  social_d2: 1,
  specific_phobia_p1: 1,
  specific_phobia_d1: 0,
  specific_phobia_d2: 0,
  agoraphobia_p1: 0,
  agoraphobia_d1: 0,
  agoraphobia_d2: 0,
  separation_p1: 0,
  separation_d1: 0,
  separation_d2: 0,
  ptsd_p1: 0,
  ptsd_d1: 0,
  ptsd_d2: 0,
  ocd_p1: 1,
  ocd_d1: 1,
  ocd_d2: 0,
  hoarding_p1: 0,
  hoarding_d1: 0,
  hoarding_d2: 0,
  bdd_p1: 0,
  bdd_d1: 0,
  bdd_d2: 0,
  adhd_p1: 2,
  adhd_d1: 2,
  adhd_d2: 2,
  asd_p1: 1,
  asd_d1: 1,
  asd_d2: 0,
  schizophrenia_p1: 0,
  schizophrenia_d1: 0,
  schizophrenia_d2: 0,
  bpd_p1: 0,
  bpd_d1: 0,
  bpd_d2: 0,
  avoidant_pd_p1: 1,
  avoidant_pd_d1: 1,
  avoidant_pd_d2: 0,
  anorexia_p1: 0,
  anorexia_d1: 0,
  anorexia_d2: 0,
  bulimia_p1: 0,
  bulimia_d1: 0,
  bulimia_d2: 0,
  binge_p1: 1,
  binge_d1: 0,
  binge_d2: 0,
  aud_p1: 1,
  aud_d1: 0,
  aud_d2: 0,
  sud_p1: 0,
  sud_d1: 0,
  sud_d2: 0,
  insomnia_p1: 2,
  insomnia_d1: 2,
  insomnia_d2: 2,
  trich_p1: 0,
  trich_d1: 0,
  trich_d2: 0,
  excor_p1: 0,
  excor_d1: 0,
  excor_d2: 0,
  ied_p1: 0,
  ied_d1: 0,
  ied_d2: 0,
  adjustment_p1: 2,
  adjustment_d1: 2,
  adjustment_d2: 1,
  somatic_p1: 1,
  somatic_d1: 0,
  somatic_d2: 0,
  illness_anxiety_p1: 0,
  illness_anxiety_d1: 0,
  illness_anxiety_d2: 0,
  dissociative_p1: 0,
  dissociative_d1: 0,
  dissociative_d2: 0,
};

const FILIPPOS_NARRATIVE =
  "Busy period shipping several side projects. Sleep slips when deadlines stack. Worry loops about unfinished work, but still functioning day to day.";

const FILIPPOS_AI_SUMMARY = `This example screen suggests possible concern in a handful of areas — notably generalized anxiety, ADHD-related attention patterns, and insomnia — with milder signals for social anxiety and adjustment stress tied to workload.

That pattern is common among people in demanding creative or technical work. It is not a diagnosis. A few flagged screens can reflect situational stress rather than a chronic disorder.

If these themes resonate, consider discussing sleep hygiene and worry management with a GP or psychologist. Screening is a starting point for conversation, not a label.`;

export function buildFilipposDemo(): AssessmentResult {
  const result = buildResult(FILIPPOS_ANSWERS, FILIPPOS_NARRATIVE);
  return {
    ...result,
    id: "demo-filippos",
    createdAt: new Date().toISOString(),
    aiSummary: FILIPPOS_AI_SUMMARY,
    isDemo: true,
  };
}

export const SESSION_RESULT_KEY = "psycscope-latest";

export function saveSessionResult(result: AssessmentResult) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_RESULT_KEY, JSON.stringify(result));
  } catch {
    // ignore
  }
}

export function loadSessionResult(): AssessmentResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_RESULT_KEY);
    return raw ? (JSON.parse(raw) as AssessmentResult) : null;
  } catch {
    return null;
  }
}

export function clearSessionResult() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(SESSION_RESULT_KEY);
  } catch {
    // ignore
  }
}
