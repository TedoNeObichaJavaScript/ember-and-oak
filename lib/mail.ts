import { writeDB, randomUUID } from "./db";

export async function send({ to, subject, body }: { to: string; subject: string; body: string }) {
  const id = randomUUID();
  const sentAt = new Date().toISOString();
  await writeDB((db) => { db.mailbox.unshift({ id, to, subject, body, sentAt }); });
  if (process.env.NODE_ENV !== "production") {
    console.log(`[mailer] → ${to}: ${subject}`);
  }
  return { id, sentAt };
}
