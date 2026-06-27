import { NextResponse, type NextRequest } from "next/server";
import { readDB } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SEATS_PER_DAY = 32;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "date=YYYY-MM-DD required" }, { status: 400 });
  }
  const db = await readDB();
  const seatsTaken = db.reservations
    .filter((r) => r.date === date && r.status !== "cancelled")
    .reduce((sum, r) => sum + r.party, 0);
  return NextResponse.json({
    date,
    seatsTotal: SEATS_PER_DAY,
    seatsTaken,
    seatsAvailable: Math.max(0, SEATS_PER_DAY - seatsTaken),
  });
}
