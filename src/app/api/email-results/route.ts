import { NextRequest, NextResponse } from "next/server";
import { isDisposableEmail, isValidEmail, sendEmail } from "@/lib/email";
import { buildResultsEmail } from "@/lib/resultEmail";
import { enforceRateLimit } from "@/lib/ratelimit";
import type { AssessmentResult } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const limited = await enforceRateLimit(req, "email");
  if (limited) return limited;

  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const result = body.result as AssessmentResult | undefined;

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (isDisposableEmail(email)) {
      return NextResponse.json({ error: "Use a permanent email address." }, { status: 400 });
    }
    if (!result?.scores?.length) {
      return NextResponse.json({ error: "No results to send." }, { status: 400 });
    }

    const { subject, html, text } = buildResultsEmail(result);
    const sent = await sendEmail({ to: email, subject, html, text });

    if (sent.disabled) {
      return NextResponse.json(
        { error: "Email is not configured on this server. Copy your results manually." },
        { status: 503 },
      );
    }
    if (!sent.ok) {
      return NextResponse.json({ error: sent.error || "Could not send email." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
