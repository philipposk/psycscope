import { NextRequest, NextResponse } from "next/server";
import { routerFromEnv } from "@page-assistant/server";
import { enforceRateLimit } from "@/lib/ratelimit";
import { getUserId } from "@/lib/supabase/user";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  const limited = await enforceRateLimit(req, "pa", userId);
  if (limited) return limited;
  try {
    const body = await req.json();
    const llm = routerFromEnv();
    const out = await llm.complete(body);
    return NextResponse.json(out);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
