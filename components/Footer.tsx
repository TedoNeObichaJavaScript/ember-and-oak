import { business } from "@/lib/site";

const cols = [
  {
    h: "Visit",
    items: [
      [business.address.street, null],
      [`${business.address.locality}, ${business.address.region} ${business.address.postal}`, null],
      [business.hours.display, null],
    ],
  },
  {
    h: "Contact",
    items: [
      [business.email, `mailto:${business.email}`],
      [business.phone.display, `tel:${business.phone.e164}`],
      ["Press inquiries", `mailto:${business.pressEmail}`],
    ],
  },
  {
    h: "Follow",
    items: [
      ["Instagram", business.social.instagram],
      ["Resy", "#reserve"],
      ["Newsletter", "#reserve"],
    ],
  },
] as const;

export default function Footer() {
  return (
    <footer className="bg-ink text-bone/60 border-t border-bone/10 relative overflow-hidden">
      <div aria-hidden className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-ember/40 to-transparent" />
      <div className="container-x py-16 lg:py-20 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <a href="#top" className="flex items-center gap-2.5 font-display text-xl text-bone">
            <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-ember animate-glow" />
            Ember <span className="text-oak">&amp;</span> Oak
          </a>
          <p className="mt-5 max-w-sm text-sm leading-relaxed">
            A 32-seat wood-fired bistro in Brooklyn. Seasonal menus, regional sourcing, a single hearth.
          </p>
          <div aria-hidden className="mt-8 flex gap-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="block h-px w-8 bg-bone/15" style={{ opacity: 1 - i * 0.14 }} />
            ))}
          </div>
        </div>

        {cols.map((c) => (
          <div key={c.h} className="md:col-span-2 lg:col-span-2 text-sm">
            <p className="text-bone/40 uppercase tracking-[0.22em] text-[10px]">{c.h}</p>
            <ul className="mt-5 space-y-2.5">
              {c.items.map(([label, href]) => (
                <li key={label}>
                  {href ? <a href={href} className="hover:text-bone transition">{label}</a> : <span>{label}</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="md:col-span-1 md:col-start-12 md:justify-self-end self-end text-xs text-bone/40 relative">
          <a href="#top" className="hover:text-bone transition" aria-label="Back to top">↑ Top</a>
        </div>
      </div>

      <div className="border-t border-bone/10">
        <div className="container-x py-6 flex flex-wrap justify-between items-center gap-4 text-[11px] text-bone/40">
          <p>© {new Date().getFullYear()} Ember &amp; Oak Hospitality. All rights reserved.</p>
          <p>Crafted with fire, oak, and care.</p>
        </div>
      </div>
    </footer>
  );
}
