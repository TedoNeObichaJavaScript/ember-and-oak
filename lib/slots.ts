export const SERVICE_DAYS = [3, 4, 5, 6, 0];
export const SLOT_MINUTES = 30;
export const OPEN = "17:30";
export const CLOSE = "21:30";
export const SEATS_PER_SLOT = 16;

export function generateSlots(): string[] {
  const out: string[] = [];
  const [oh, om] = OPEN.split(":").map(Number);
  const [ch, cm] = CLOSE.split(":").map(Number);
  let mins = oh * 60 + om;
  const end = ch * 60 + cm;
  while (mins <= end) {
    const h = String(Math.floor(mins / 60)).padStart(2, "0");
    const m = String(mins % 60).padStart(2, "0");
    out.push(`${h}:${m}`);
    mins += SLOT_MINUTES;
  }
  return out;
}

export function isServiceDay(date: string): boolean {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return false;
  return SERVICE_DAYS.includes(d.getUTCDay());
}

export function isValidSlot(time: string): boolean {
  return generateSlots().includes(time);
}

export function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "pm" : "am";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}
