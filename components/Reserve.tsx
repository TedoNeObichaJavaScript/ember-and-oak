import Reveal from "./Reveal";
import BookingTrigger from "./BookingTrigger";
import { business } from "@/lib/site";

const blocks = [
  { l: "Address", v: <>{business.address.street}, Ground Floor<br />{business.address.locality}, {business.address.region} {business.address.postal}</> },
  { l: "Hours", v: <>{business.hours.display}<br />Closed Mon &amp; Tue</> },
  { l: "Contact", v: <>{business.email}<br /><a className="hover:text-ember transition" href={`tel:${business.phone.e164}`}>{business.phone.display}</a></> },
] as const;

export default function Reserve() {
  return (
    <section id="reserve" className="relative bg-ink text-bone py-24 lg:py-36 overflow-hidden grain">
      <div aria-hidden className="absolute inset-0 [background:radial-gradient(45%_55%_at_15%_30%,#D9770626,transparent_60%),radial-gradient(35%_45%_at_85%_85%,#5C3A1E66,transparent_70%)]" />
      <div className="container-x relative">
        <Reveal>
          <div className="max-w-2xl">
            <p className="eyebrow text-ember">Reservations</p>
            <h2 className="h-section mt-4 text-bone text-balance">Hold a seat by the fire.</h2>
            <p className="mt-6 text-bone/70 leading-relaxed text-balance">
              We seat from 5:30 to 9:30, Wednesday through Sunday. Tasting menu Thursday&ndash;Saturday. Walk-ins welcome at the bar.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <BookingTrigger className="btn-ember">Book a table<span aria-hidden>→</span></BookingTrigger>
              <a href={`tel:${business.phone.e164}`} className="text-sm text-bone/60 hover:text-ember transition">
                or call {business.phone.display}
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <dl id="visit" className="mt-20 grid sm:grid-cols-3 gap-12 sm:gap-10 text-sm border-t border-bone/10 pt-12">
            {blocks.map((b) => (
              <div key={b.l}>
                <dt className="text-bone/40 uppercase tracking-[0.22em] text-[10px]">{b.l}</dt>
                <dd className="mt-3 leading-relaxed text-bone/85">{b.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
