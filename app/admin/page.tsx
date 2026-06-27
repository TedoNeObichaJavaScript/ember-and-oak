import { readDB } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOKEN = process.env.ADMIN_TOKEN ?? "demo";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  if (token !== TOKEN) {
    return (
      <main className="min-h-screen bg-ink text-bone p-10 font-sans">
        <h1 className="font-display text-3xl">Admin</h1>
        <p className="mt-3 text-bone/60 text-sm">
          Append <code className="text-ember">?token=&lt;ADMIN_TOKEN&gt;</code> to view. Demo default: <code className="text-ember">demo</code>.
        </p>
        <p className="mt-2 text-bone/40 text-xs">Override via <code>ADMIN_TOKEN</code> env var.</p>
      </main>
    );
  }

  const db = await readDB();

  return (
    <main className="min-h-screen bg-bone text-ink p-6 sm:p-10 font-sans">
      <header className="flex items-baseline justify-between mb-10">
        <h1 className="font-display text-3xl">Ember &amp; Oak — Admin</h1>
        <p className="text-ink/40 text-xs">Demo storage · {process.cwd()}/data/db.json</p>
      </header>

      <Section title={`Reservations (${db.reservations.length})`}>
        {db.reservations.length === 0 ? <Empty /> : (
          <table className="w-full text-sm">
            <thead className="text-left text-ink/50 text-xs uppercase tracking-wider">
              <tr><th className="pb-2">Created</th><th>Name</th><th>Date</th><th>Time</th><th>Party</th><th>Email</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {db.reservations.map((r) => (
                <tr key={r.id} className="border-t border-ink/10">
                  <td className="py-2 text-ink/60">{r.createdAt.slice(0, 16).replace("T", " ")}</td>
                  <td>{r.name}</td>
                  <td>{r.date}</td>
                  <td>{r.time ?? "—"}</td>
                  <td>{r.party}</td>
                  <td className="text-ink/70">{r.email}</td>
                  <td><Status status={r.status} /></td>
                  <td>{r.status === "pending" ? <a className="text-ember underline underline-offset-2" href={`/api/reservations/confirm?id=${r.id}&token=${r.confirmToken}`}>Confirm</a> : <span className="text-ink/30">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      <Section title={`Newsletter (${db.newsletter.length})`}>
        {db.newsletter.length === 0 ? <Empty /> : (
          <ul className="space-y-1.5 text-sm">
            {db.newsletter.map((n) => <li key={n.id}><span className="text-ink/40 mr-3">{n.createdAt.slice(0, 10)}</span>{n.email}</li>)}
          </ul>
        )}
      </Section>

      <Section title={`Press (${db.press.length})`}>
        {db.press.length === 0 ? <Empty /> : (
          <ul className="space-y-3 text-sm">
            {db.press.map((p) => (
              <li key={p.id} className="border-t border-ink/10 pt-3">
                <b>{p.name}</b>{p.outlet ? <span className="text-ink/50"> · {p.outlet}</span> : null}<span className="text-ink/50"> · {p.email}</span>
                <div className="text-ink/70 mt-1.5 whitespace-pre-wrap">{p.message}</div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={`Mailbox (${db.mailbox.length})`}>
        {db.mailbox.length === 0 ? <Empty /> : (
          <ul className="space-y-3 text-sm">
            {db.mailbox.slice(0, 40).map((m) => (
              <li key={m.id} className="border-t border-ink/10 pt-3">
                <div className="text-ink/50 text-xs">{m.sentAt.slice(0, 16).replace("T", " ")}</div>
                <div><b>To:</b> {m.to}</div>
                <div><b>Subject:</b> {m.subject}</div>
                <pre className="text-ink/70 mt-1.5 whitespace-pre-wrap font-sans">{m.body}</pre>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-display text-xl mb-3 text-oak">{title}</h2>
      <div className="bg-bone border border-ink/10 rounded-2xl p-5 overflow-x-auto">{children}</div>
    </section>
  );
}

function Empty() { return <p className="text-ink/40 text-sm italic">No records yet.</p>; }

function Status({ status }: { status: "pending" | "confirmed" | "cancelled" }) {
  const map = { pending: "bg-ember/15 text-ember", confirmed: "bg-emerald-100 text-emerald-700", cancelled: "bg-ink/10 text-ink/50" } as const;
  return <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] uppercase tracking-wide ${map[status]}`}>{status}</span>;
}
