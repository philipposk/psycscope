import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    summary: "Complete a screening at /assess or view the example at /demo. Results stay in your browser session only.",
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = body.result;
    if (!result?.scores) {
      return NextResponse.json({ summary: "No results in this session yet." });
    }
    const positive = result.scores.filter((s: { positive: boolean }) => s.positive);
    const summary = positive.length
      ? `${result.overallPercent}% flag possible concern (${positive.length}/32). Screening only — not diagnosis.`
      : `No strong flags (${result.overallPercent}% overall).`;
    return NextResponse.json({ summary });
  } catch {
    return NextResponse.json({ summary: "Could not read results." });
  }
}
