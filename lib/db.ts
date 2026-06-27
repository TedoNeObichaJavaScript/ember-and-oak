import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

export type Reservation = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  party: number;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled";
  confirmToken: string;
};

export type NewsletterSub = { id: string; email: string; createdAt: string };
export type PressInquiry = { id: string; name: string; outlet?: string; email: string; message: string; createdAt: string };
export type Mail = { id: string; to: string; subject: string; body: string; sentAt: string };

export type DB = {
  reservations: Reservation[];
  newsletter: NewsletterSub[];
  press: PressInquiry[];
  mailbox: Mail[];
};

const FILE = path.join(process.cwd(), "data", "db.json");
const EMPTY: DB = { reservations: [], newsletter: [], press: [], mailbox: [] };

let writeQueue: Promise<unknown> = Promise.resolve();

async function ensureFile() {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  try { await fs.access(FILE); }
  catch { await fs.writeFile(FILE, JSON.stringify(EMPTY, null, 2)); }
}

export async function readDB(): Promise<DB> {
  await ensureFile();
  const raw = await fs.readFile(FILE, "utf8");
  try { return { ...EMPTY, ...(JSON.parse(raw) as Partial<DB>) }; }
  catch { return { ...EMPTY }; }
}

export async function writeDB(mutator: (db: DB) => void | Promise<void>): Promise<DB> {
  const next = writeQueue.then(async () => {
    const db = await readDB();
    await mutator(db);
    const tmp = FILE + ".tmp";
    await fs.writeFile(tmp, JSON.stringify(db, null, 2));
    await fs.rename(tmp, FILE);
    return db;
  });
  writeQueue = next.catch(() => undefined);
  return next;
}

export { randomUUID };
