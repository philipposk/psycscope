import { NextRequest, NextResponse } from "next/server";
import { transcribe } from "@page-assistant/server";
import { enforceRateLimit } from "@/lib/ratelimit";
import { getUserId } from "@/lib/supabase/user";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  const limited = await enforceRateLimit(req, "pa", userId);
  if (limited) return limited;
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "file required" }, { status: 400 });
    const buf = Buffer.from(await file.arrayBuffer());
    const text = await transcribe(buf, file.name || "audio.webm");
    return NextResponse.json({ text });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
