import { NextRequest, NextResponse } from "next/server";
import { analyzeWithAI, mergeAIRefinement } from "@/lib/llm";
import { buildResult } from "@/lib/scoring";
import { getUserId } from "@/lib/supabase/user";
import { enforceRateLimit } from "@/lib/ratelimit";
import type { AssessmentAnswers } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  const limited = await enforceRateLimit(req, "analyze", userId);
  if (limited) return limited;

  try {
    const body = await req.json();
    const answers = body.answers as AssessmentAnswers;
    const narrative = typeof body.narrative === "string" ? body.narrative : undefined;
    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ error: "answers required" }, { status: 400 });
    }

    const result = buildResult(answers, narrative);
    const ai = await analyzeWithAI(result.scores, answers, narrative);
    const aiRefined = mergeAIRefinement(result.scores, ai.refinedScores);

    return NextResponse.json({
      ...result,
      scores: aiRefined,
      positiveCount: aiRefined.filter((s) => s.positive).length,
      overallPercent: Math.round(
        (aiRefined.filter((s) => s.positive).length / aiRefined.length) * 100,
      ),
      aiSummary: ai.summary,
      aiResources: ai.resources,
      followUpQuestions: ai.followUpQuestions,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[analyze]", msg);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
