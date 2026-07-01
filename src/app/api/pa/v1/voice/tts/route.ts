import { NextRequest, NextResponse } from "next/server";
import { synthesize } from "@page-assistant/server";
import { enforceRateLimit } from "@/lib/ratelimit";
import { getUserId } from "@/lib/supabase/user";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  const limited = await enforceRateLimit(req, "pa", userId);
  if (limited) return limited;
  try {
    const body = await req.json();
    const { audio, contentType } = await synthesize(body);
    return new NextResponse(new Uint8Array(audio), { headers: { "Content-Type": contentType } });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
