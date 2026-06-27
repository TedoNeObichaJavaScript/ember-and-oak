import { NextResponse, type NextRequest } from "next/server";
import { writeDB, randomUUID } from "@/lib/db";
import { send } from "@/lib/mail";
import { business } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = (await req.json()) as Record<string, unknown>; }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!isEmail(email)) return NextResponse.json({ errors: { email: "Valid email required" } }, { status: 400 });

  let already = false;
  await writeDB((db) => {
    if (db.newsletter.some((s) => s.email === email)) { already = true; return; }
    db.newsletter.unshift({ id: randomUUID(), email, createdAt: new Date().toISOString() });
  });

  if (!already) {
    await send({
      to: email,
      subject: `Welcome to ${business.name}`,
      body: `Thanks for subscribing. Seasonal updates, four times a year.\n\n— ${business.name}`,
    });
  }
  return NextResponse.json({ ok: true, already });
}
