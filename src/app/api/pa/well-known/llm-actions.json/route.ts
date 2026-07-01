import { NextRequest, NextResponse } from "next/server";
import { generateActionsJson } from "@page-assistant/core";
import { psycCapabilities } from "@/lib/page-assistant/capabilities";
import { paLlmTxtMeta } from "@/lib/page-assistant/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  const json = generateActionsJson(paLlmTxtMeta(origin), psycCapabilities());
  return NextResponse.json(json);
}
