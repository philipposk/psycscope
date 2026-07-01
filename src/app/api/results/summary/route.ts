import { NextResponse } from "next/server";
import { loadLatest } from "@/lib/scoring";

export async function GET() {
  // Client-side localStorage is primary; this endpoint supports page-assistant server calls
  // by accepting a POST body from a thin client wrapper. GET returns placeholder.
  return NextResponse.json({
    summary:
      "Open your results page (/results) to see your latest screening. If you completed an assessment in this browser, results are stored locally.",
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = body.result;
    if (!result?.scores) {
      return NextResponse.json({ summary: "No results in this session yet. Complete /assess first." });
    }
    const positive = result.scores.filter((s: { positive: boolean }) => s.positive);
    const summary = positive.length
      ? `Your latest screen flags possible concern in ${positive.length} of 32 disorders (${result.overallPercent}%): ${positive.map((s: { name: string }) => s.name).join(", ")}. This is screening only — please discuss with a clinician.`
      : `Your latest screen shows no strong flags across the 32 disorders (${result.overallPercent}% with possible concern). Screening is not diagnosis — consult a professional if you still feel unwell.`;
    return NextResponse.json({ summary });
  } catch {
    return NextResponse.json({ summary: "Could not read results." });
  }
}
