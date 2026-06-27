import { NextResponse, type NextRequest } from "next/server";
import { readDB } from "@/lib/db";
import { generateSlots, isServiceDay, SEATS_PER_SLOT } from "@/lib/slots";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") ?? "";
  const partyParam = searchParams.get("party");
  const party = partyParam ? Number(partyParam) : 2;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "date=YYYY-MM-DD required" }, { status: 400 });
  }
  if (!Number.isInteger(party) || party < 1 || party > 12) {
    return NextResponse.json({ error: "party 1–12 required" }, { status: 400 });
  }

  if (!isServiceDay(date)) {
    return NextResponse.json({ date, party, open: false, reason: "Closed Mon & Tue", slots: [] });
  }

  const db = await readDB();
  const slots = generateSlots().map((time) => {
    const taken = db.reservations
      .filter((r) => r.date === date && r.time === time && r.status !== "cancelled")
      .reduce((s, r) => s + r.party, 0);
    const seatsLeft = Math.max(0, SEATS_PER_SLOT - taken);
    return { time, seatsLeft, available: seatsLeft >= party };
  });

  return NextResponse.json({ date, party, open: true, slots });
}
