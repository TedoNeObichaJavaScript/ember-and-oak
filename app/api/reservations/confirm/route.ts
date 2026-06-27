import { NextResponse, type NextRequest } from "next/server";
import { writeDB, type Reservation } from "@/lib/db";
import { send } from "@/lib/mail";
import { business } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const token = searchParams.get("token");
  if (!id || !token) return NextResponse.json({ error: "Missing id/token" }, { status: 400 });

  let confirmed: Reservation | null = null;
  let alreadyConfirmed = false;
  await writeDB((db) => {
    const r = db.reservations.find((x) => x.id === id);
    if (!r || r.confirmToken !== token) return;
    if (r.status === "confirmed") { confirmed = r; alreadyConfirmed = true; return; }
    if (r.status === "cancelled") return;
    r.status = "confirmed";
    confirmed = r;
  });

  if (!confirmed) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const r: Reservation = confirmed;

  if (!alreadyConfirmed) {
    await send({
      to: r.email,
      subject: `${business.name} — your table is confirmed`,
      body: `Hi ${r.name},\n\nWe've confirmed your reservation for ${r.party} on ${r.date}. See you by the fire.\n\n— ${business.name}`,
    });
  }

  return new NextResponse(
    `<!doctype html><meta charset="utf-8"><title>Confirmed</title><body style="font-family:system-ui;background:#0B0A09;color:#F5F1EA;padding:3rem;max-width:520px;margin:auto"><h1 style="font-weight:300">${alreadyConfirmed ? "Already confirmed" : "Confirmed"}</h1><p style="color:#F5F1EAaa;line-height:1.6">${r.name}'s table for ${r.party} on ${r.date} is confirmed.${alreadyConfirmed ? "" : " A confirmation email was sent."}</p><p><a style="color:#D97706" href="/admin?token=demo">View admin →</a></p></body>`,
    { headers: { "content-type": "text/html; charset=utf-8" } }
  );
}
