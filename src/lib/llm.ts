import type { AssessmentAnswers, DisorderScore } from "./types";

async function callLLM(system: string, user: string): Promise<string> {
  const orKey = process.env.OPENROUTER_API_KEY;
  const oaKey = process.env.OPENAI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  const attempts: { url: string; key: string; model: string }[] = [];
  if (orKey) {
    attempts.push({
      url: "https://openrouter.ai/api/v1/chat/completions",
      key: orKey,
      model: process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash",
    });
  }
  if (oaKey) {
    attempts.push({
      url: "https://api.openai.com/v1/chat/completions",
      key: oaKey,
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    });
  }
  if (groqKey) {
    attempts.push({
      url: "https://api.groq.com/openai/v1/chat/completions",
      key: groqKey,
      model: "llama-3.3-70b-versatile",
    });
  }

  let lastErr: Error | null = null;
  for (const { url, key, model } of attempts) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
          "HTTP-Referer": "https://psyc.6x7.gr",
          "X-Title": "PsycScope",
        },
        body: JSON.stringify({
          model,
          temperature: 0.3,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
      });
      if (!res.ok) {
        lastErr = new Error(`LLM ${res.status}: ${(await res.text()).slice(0, 200)}`);
        continue;
      }
      const data = await res.json();
      return data.choices?.[0]?.message?.content || "";
    } catch (e) {
      lastErr = e instanceof Error ? e : new Error(String(e));
    }
  }
  throw lastErr || new Error("No LLM provider configured");
}

const SYSTEM = `You are a clinical screening assistant for PsycScope, a self-report tool covering 32 well-known psychological disorders.

CRITICAL RULES:
- This is SCREENING ONLY, not diagnosis. Never say the user "has" a disorder — use "screen suggests possible concern" or "worth discussing with a clinician".
- Base analysis ONLY on provided answers and narrative. Do not invent symptoms.
- Be compassionate, non-judgmental, plain language.
- If crisis indicators (self-harm, suicide, psychosis with danger), urge immediate professional help and crisis lines.
- Return ONLY valid JSON with this shape:
{
  "summary": "2-4 paragraph compassionate overview",
  "refinedScores": [{"id":"disorder_id","adjustedPercent":0-100,"rationale":"one sentence"}],
  "followUpQuestions": ["optional clarifying questions if narrative was vague"],
  "resources": ["brief practical next steps"]
}
refinedScores should only include disorders where you have evidence to adjust; adjustedPercent reflects likelihood of clinical concern (not certainty).`;

export type AIAnalysis = {
  summary: string;
  refinedScores: { id: string; adjustedPercent: number; rationale: string }[];
  followUpQuestions: string[];
  resources: string[];
};

export async function analyzeWithAI(
  scores: DisorderScore[],
  answers: AssessmentAnswers,
  narrative?: string,
): Promise<AIAnalysis> {
  const positive = scores.filter((s) => s.positive);
  const user = JSON.stringify({
    positiveScreens: positive.map((s) => ({
      id: s.id,
      name: s.name,
      percent: s.percent,
      rawScore: s.rawScore,
    })),
    allScores: scores.map((s) => ({ id: s.id, percent: s.percent, positive: s.positive })),
    answerCount: Object.keys(answers).length,
    narrative: narrative || "",
  });

  const raw = await callLLM(SYSTEM, user);
  try {
    return JSON.parse(raw) as AIAnalysis;
  } catch {
    const m = raw.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]) as AIAnalysis;
    throw new Error("AI did not return valid JSON");
  }
}

export function mergeAIRefinement(
  scores: DisorderScore[],
  refined: AIAnalysis["refinedScores"],
): DisorderScore[] {
  const map = new Map(refined.map((r) => [r.id, r]));
  return scores.map((s) => {
    const adj = map.get(s.id);
    if (!adj) return s;
    return {
      ...s,
      percent: adj.adjustedPercent,
      positive: adj.adjustedPercent >= 50,
    };
  });
}
