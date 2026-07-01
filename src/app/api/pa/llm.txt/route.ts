import { NextRequest, NextResponse } from "next/server";
import { generateLlmTxt } from "@page-assistant/core";
import { psycCapabilities } from "@/lib/page-assistant/capabilities";
import { paLlmTxtMeta } from "@/lib/page-assistant/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  const text = generateLlmTxt(paLlmTxtMeta(origin), psycCapabilities());
  return new NextResponse(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
