import { NextResponse, type NextRequest } from "next/server";
import { writeDB, randomUUID, type Reservation } from "@/lib/db";
import { send } from "@/lib/mail";
import { business } from "@/lib/site";
import { isServiceDay, isValidSlot, SEATS_PER_SLOT, formatTime } from "@/lib/slots";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const isISODate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = (await req.json()) as Record<string, unknown>; }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const errors: Record<string, string> = {};
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const phone = String(body.phone ?? "").trim();
  const date = String(body.date ?? "").trim();
  const time = String(body.time ?? "").trim();
  const party = Number(body.party);
  const notes = String(body.notes ?? "").trim().slice(0, 500);

  if (name.length < 2) errors.name = "Name is required";
  if (!isEmail(email)) errors.email = "Valid email required";
  if (phone.length < 5) errors.phone = "Phone is required";
  if (!isISODate(date)) errors.date = "Date must be YYYY-MM-DD";
  else if (!isServiceDay(date)) errors.date = "We're closed that day";
  if (!isValidSlot(time)) errors.time = "Choose a valid time slot";
  if (!Number.isInteger(party) || party < 1 || party > 12) errors.party = "Party 1–12";

  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 400 });

  const id = randomUUID();
  const confirmToken = randomUUID().replaceAll("-", "");
  const reservation: Reservation = {
    id, createdAt: new Date().toISOString(),
    name, email, phone, date, time, party,
    notes: notes || undefined,
    status: "pending", confirmToken,
  };

  let conflict = false;
  await writeDB((db) => {
    const taken = db.reservations
      .filter((r) => r.date === date && r.time === time && r.status !== "cancelled")
      .reduce((s, r) => s + r.party, 0);
    if (taken + party > SEATS_PER_SLOT) { conflict = true; return; }
    db.reservations.unshift(reservation);
  });

  if (conflict) {
    return NextResponse.json({ errors: { time: "That slot just filled — please pick another time." } }, { status: 409 });
  }

  const origin = new URL(req.url).origin;
  const confirmUrl = `${origin}/api/reservations/confirm?id=${id}&token=${confirmToken}`;
  const niceTime = formatTime(time);

  await send({
    to: email,
    subject: `${business.name} — reservation request received`,
    body: `Hi ${name},\n\nWe've received your request for ${party} on ${date} at ${niceTime}. We'll confirm by email within an hour.\n\n— ${business.name}`,
  });
  await send({
    to: business.email,
    subject: `New reservation: ${name} · ${date} ${niceTime} · party ${party}`,
    body: `${name} <${email}> ${phone}\nParty: ${party}\nDate: ${date} ${niceTime}\nNotes: ${notes || "—"}\n\nConfirm: ${confirmUrl}`,
  });

  return NextResponse.json({ id, status: "pending" }, { status: 201 });
}
