import { NextResponse } from "next/server";
import { disorderById } from "@/lib/disorders";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const d = disorderById(id);
  if (!d) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    name: d.name,
    description: `${d.shortDescription} Screened via self-report items inspired by ${d.instrument || "clinical literature"}. This is educational information only — not a diagnosis.`,
  });
}
