"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { business } from "@/lib/site";

type Step = 1 | 2 | 3 | 4;
type Slot = { time: string; seatsLeft: number; available: boolean };
type SlotsResponse = { date: string; party: number; open: boolean; reason?: string; slots: Slot[] };

const PARTY_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];
const STEP_LABELS = ["Party & date", "Time", "Details"] as const;

function todayISO(): string {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}
function maxDateISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 90);
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}
function fmtTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "pm" : "am";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}
function fmtDate(d: string): string {
  const dt = new Date(d);
  return dt.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" });
}
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export default function BookingDialog() {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [step, setStep] = useState<Step>(1);
  const [party, setParty] = useState(2);
  const [date, setDate] = useState(todayISO);
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [slotsRes, setSlotsRes] = useState<SlotsResponse | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reset = useCallback(() => {
    setStep(1); setTime("");
    setName(""); setEmail(""); setPhone(""); setNotes("");
    setErrors({}); setSlotsRes(null);
  }, []);

  const close = useCallback(() => { dialogRef.current?.close(); }, []);

  useEffect(() => {
    const onOpen = () => {
      reset();
      dialogRef.current?.showModal();
    };
    window.addEventListener("open-booking", onOpen);
    return () => window.removeEventListener("open-booking", onOpen);
  }, [reset]);

  useEffect(() => {
    if (step !== 2) return;
    let cancelled = false;
    // Reset loading/result state as we (re)fetch availability for the chosen date — the
    // canonical "fetch in an effect" case; the synchronous setState is intentional here.
    /* eslint-disable react-hooks/set-state-in-effect */
    setSlotsLoading(true);
    setSlotsRes(null);
    /* eslint-enable react-hooks/set-state-in-effect */
    fetch(`/api/availability/slots?date=${date}&party=${party}`)
      .then((r) => r.json())
      .then((j: SlotsResponse) => { if (!cancelled) { setSlotsRes(j); setSlotsLoading(false); } })
      .catch(() => { if (!cancelled) { setSlotsLoading(false); } });
    return () => { cancelled = true; };
  }, [step, date, party]);

  async function submit() {
    setSubmitting(true);
    setErrors({});
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, phone, date, time, party, notes }),
      });
      if (res.ok) { setStep(4); return; }
      const j = await res.json().catch(() => ({}));
      setErrors(j.errors ?? { _: "Something went wrong" });
    } catch {
      setErrors({ _: "Network error" });
    } finally {
      setSubmitting(false);
    }
  }

  const step1Valid = party >= 1 && party <= 8 && /^\d{4}-\d{2}-\d{2}$/.test(date);
  const step2Valid = !!time;
  const step3Valid = name.trim().length >= 2 && isEmail(email) && phone.trim().length >= 5;

  const onBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) close();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={reset}
      onClick={onBackdropClick}
      className="bg-transparent p-0 backdrop:bg-ink/70 backdrop:backdrop-blur-sm w-[min(560px,calc(100vw-1.5rem))] rounded-2xl"
    >
      <div className="bg-bone text-ink rounded-2xl shadow-2xl overflow-hidden font-sans">
        <header className="flex items-center justify-between px-6 sm:px-8 pt-6 pb-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-oak font-medium">Reservations</p>
            <h2 className="font-display text-2xl mt-1 tracking-tightest font-light">{business.name}</h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close booking"
            className="h-9 w-9 grid place-items-center rounded-full text-ink/45 hover:text-ink hover:bg-ink/5 transition"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 1l12 12M13 1L1 13" strokeLinecap="round"/></svg>
          </button>
        </header>

        {step < 4 && (
          <div className="px-6 sm:px-8 pb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em]">
            {STEP_LABELS.map((label, i) => {
              const s = (i + 1) as Step;
              const active = s === step, done = s < step;
              return (
                <div key={label} className="flex items-center gap-2">
                  <span className={`h-5 w-5 grid place-items-center rounded-full text-[10px] font-medium transition ${active ? "bg-ember text-ink" : done ? "bg-ink text-bone" : "bg-ink/8 text-ink/40"}`}>{done ? "✓" : s}</span>
                  <span className={active ? "text-ink" : "text-ink/40"}>{label}</span>
                  {i < STEP_LABELS.length - 1 && <span className="w-5 h-px bg-ink/12" />}
                </div>
              );
            })}
          </div>
        )}

        <div className="border-t border-ink/10" />

        <div className="px-6 sm:px-8 py-7 min-h-[280px]">
          {step === 1 && (
            <div>
              <p className="text-sm text-ink/60 leading-relaxed">We seat from 5:30 to 9:30, Wednesday through Sunday.</p>

              <fieldset className="mt-7">
                <legend className="text-[10px] uppercase tracking-[0.22em] text-ink/50">Party size</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {PARTY_OPTIONS.map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-pressed={party === n}
                      onClick={() => setParty(n)}
                      className={`h-11 w-11 rounded-full border text-sm font-medium transition ${
                        party === n ? "bg-ink text-bone border-ink" : "border-ink/15 hover:border-ink/40"
                      }`}
                    >{n}</button>
                  ))}
                </div>
              </fieldset>

              <label className="block mt-7">
                <span className="text-[10px] uppercase tracking-[0.22em] text-ink/50">Date</span>
                <input
                  type="date"
                  value={date}
                  min={todayISO()}
                  max={maxDateISO()}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-3 w-full bg-transparent border-b border-ink/15 py-3 outline-none focus:border-ember text-base"
                />
              </label>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-sm text-ink/60">{fmtDate(date)} · party of {party}</p>

              {slotsLoading && (
                <div className="mt-8 grid grid-cols-3 sm:grid-cols-4 gap-2" aria-busy="true">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="h-11 rounded-md bg-ink/5 animate-pulse" />
                  ))}
                </div>
              )}

              {!slotsLoading && slotsRes && !slotsRes.open && (
                <div className="mt-6 text-sm">
                  <p className="text-ink/70">{slotsRes.reason ?? "We're closed that day."}</p>
                  <button type="button" onClick={() => setStep(1)} className="mt-3 text-ember underline underline-offset-4">Pick another date</button>
                </div>
              )}

              {!slotsLoading && slotsRes?.open && (
                <>
                  <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {slotsRes.slots.map((s) => {
                      const selected = time === s.time;
                      return (
                        <button
                          key={s.time}
                          type="button"
                          disabled={!s.available}
                          aria-pressed={selected}
                          onClick={() => setTime(s.time)}
                          className={`py-3 rounded-md border text-sm font-medium transition ${
                            selected
                              ? "bg-ember border-ember text-ink shadow-sm"
                              : s.available
                                ? "border-ink/15 hover:border-ink/40"
                                : "border-ink/8 text-ink/30 line-through cursor-not-allowed"
                          }`}
                        >
                          {fmtTime(s.time)}
                        </button>
                      );
                    })}
                  </div>
                  {slotsRes.slots.every((s) => !s.available) && (
                    <p className="mt-5 text-sm text-ink/55">No availability for {party === 1 ? "1 guest" : `${party} guests`}. Try a smaller party or another date.</p>
                  )}
                </>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-ink/60 pb-5 mb-5 border-b border-ink/10">
                <span>{fmtDate(date)}</span>
                <span aria-hidden>·</span>
                <span>{fmtTime(time)}</span>
                <span aria-hidden>·</span>
                <span>party of {party}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-x-5 gap-y-4">
                <Field label="Name" value={name} onChange={setName} autoComplete="name" error={errors.name} className="sm:col-span-2" />
                <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" error={errors.email} />
                <Field label="Phone" type="tel" value={phone} onChange={setPhone} autoComplete="tel" error={errors.phone} />
                <label className="block sm:col-span-2">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-ink/50">Notes (optional)</span>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Allergies, special occasion…"
                    className="mt-2 w-full bg-transparent border-b border-ink/15 py-2 focus:border-ember outline-none resize-none text-sm placeholder:text-ink/30"
                  />
                </label>
              </div>
              {(errors._ || errors.time) && <p className="text-ember text-xs mt-4">{errors._ ?? errors.time}</p>}
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-3">
              <div aria-hidden className="mx-auto h-14 w-14 rounded-full bg-ember/12 grid place-items-center">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 11l4 4 8-9"/></svg>
              </div>
              <h3 className="font-display font-light text-2xl mt-5 tracking-tightest">Reservation requested</h3>
              <p className="text-sm text-ink/60 mt-3 leading-relaxed max-w-sm mx-auto">
                {fmtDate(date)} · {fmtTime(time)} · party of {party}.
                <br />We&apos;ve sent a confirmation request to <span className="text-ink">{email}</span>.
              </p>
            </div>
          )}
        </div>

        <footer className="border-t border-ink/10 px-6 sm:px-8 py-4 flex items-center justify-between gap-3 bg-bone">
          {step === 1 && (
            <>
              <button type="button" onClick={close} className="text-sm text-ink/55 hover:text-ink">Cancel</button>
              <PrimaryButton disabled={!step1Valid} onClick={() => setStep(2)}>Continue<span aria-hidden>→</span></PrimaryButton>
            </>
          )}
          {step === 2 && (
            <>
              <BackButton onClick={() => setStep(1)} />
              <PrimaryButton disabled={!step2Valid} onClick={() => setStep(3)}>Continue<span aria-hidden>→</span></PrimaryButton>
            </>
          )}
          {step === 3 && (
            <>
              <BackButton onClick={() => setStep(2)} />
              <PrimaryButton variant="ember" disabled={!step3Valid || submitting} onClick={submit}>
                {submitting ? "Sending…" : "Request table"}
              </PrimaryButton>
            </>
          )}
          {step === 4 && (
            <>
              <span className="text-xs text-ink/45">An email is on its way.</span>
              <PrimaryButton onClick={close}>Done</PrimaryButton>
            </>
          )}
        </footer>
      </div>
    </dialog>
  );
}

function PrimaryButton({
  children, onClick, disabled, variant = "ink",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "ink" | "ember";
}) {
  const base = "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium tracking-wide transition disabled:opacity-40 disabled:cursor-not-allowed";
  const colors = variant === "ember"
    ? "bg-ember text-ink hover:bg-ink hover:text-bone disabled:hover:bg-ember disabled:hover:text-ink"
    : "bg-ink text-bone hover:bg-ember hover:text-ink disabled:hover:bg-ink disabled:hover:text-bone";
  return <button type="button" onClick={onClick} disabled={disabled} className={`${base} ${colors}`}>{children}</button>;
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="text-sm text-ink/55 hover:text-ink inline-flex items-center gap-1.5">
      <span aria-hidden>←</span> Back
    </button>
  );
}

function Field({
  label, value, onChange, type = "text", autoComplete, error, className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  error?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[10px] uppercase tracking-[0.22em] text-ink/50">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        className={`mt-2 w-full bg-transparent border-b py-2.5 outline-none text-base ${error ? "border-ember" : "border-ink/15 focus:border-ember"}`}
      />
      {error && <span className="text-ember text-xs mt-1 block">{error}</span>}
    </label>
  );
}
