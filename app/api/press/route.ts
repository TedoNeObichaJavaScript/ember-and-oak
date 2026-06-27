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

  const errors: Record<string, string> = {};
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const outlet = String(body.outlet ?? "").trim();
  const message = String(body.message ?? "").trim().slice(0, 2000);

  if (name.length < 2) errors.name = "Name is required";
  if (!isEmail(email)) errors.email = "Valid email required";
  if (message.length < 10) errors.message = "Message is too short";
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 400 });

  await writeDB((db) => {
    db.press.unshift({
      id: randomUUID(), name, email,
      outlet: outlet || undefined,
      message,
      createdAt: new Date().toISOString(),
    });
  });

  await send({
    to: business.pressEmail,
    subject: `Press inquiry: ${outlet || name}`,
    body: `${name} <${email}>\nOutlet: ${outlet || "—"}\n\n${message}`,
  });

  return NextResponse.json({ ok: true });
}
