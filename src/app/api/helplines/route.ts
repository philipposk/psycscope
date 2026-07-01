import { NextRequest, NextResponse } from "next/server";
import { helplinesForCountry, findAHelplineUrl, GLOBAL_HELPLINE_URL } from "@/lib/helplines";

export const runtime = "edge";

/** Country-level crisis hints from Vercel geo IP (no GPS). Override with ?country=GR */
export async function GET(req: NextRequest) {
  const override = req.nextUrl.searchParams.get("country");
  const country =
    override ||
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    null;

  const data = helplinesForCountry(country);
  return NextResponse.json({
    countryCode: country?.toUpperCase() || null,
    country: data,
    findAHelplineUrl: findAHelplineUrl(data),
    globalUrl: GLOBAL_HELPLINE_URL,
    source: "Curated shortcuts; full directory by ThroughLine at findahelpline.com",
  });
}
