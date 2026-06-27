import Image from "next/image";
import BookingTrigger from "./BookingTrigger";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ink text-bone min-h-[100svh] flex items-end grain">
      <Image
        src="https://images.unsplash.com/photo-1514516345957-556ca7d90a29?auto=format&fit=crop&w=1800&q=78"
        alt="Wood-fired oven glowing inside the dining room"
        priority
        fetchPriority="high"
        fill
        sizes="100vw"
        className="object-cover opacity-50 scale-105"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/30" />
      <div aria-hidden className="absolute inset-0 [background:radial-gradient(60%_50%_at_75%_25%,#D9770633_0%,transparent_60%)]" />

      <div className="container-x relative pt-32 pb-20 lg:pb-28 grid lg:grid-cols-12 gap-x-12 gap-y-14 items-end w-full">
        <div className="lg:col-span-8 animate-rise">
          <p className="eyebrow text-ember">Est. 2024 · Wood-Fired Bistro · Brooklyn</p>
          <h1 className="h-display mt-6 text-bone text-balance">
            Smoke, oak, and<br />
            <span className="italic text-ember">the season&rsquo;s best.</span>
          </h1>
          <p className="mt-7 max-w-xl text-bone/75 text-base sm:text-lg leading-relaxed text-balance">
            A 32-seat neighborhood bistro built around a single hearth. Menus shift weekly with what regional growers harvest at dawn.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <BookingTrigger className="btn-ember">Book a table<span aria-hidden>→</span></BookingTrigger>
            <a href="#menu" className="btn border border-bone/25 text-bone hover:bg-bone hover:text-ink">Tonight&rsquo;s menu</a>
          </div>
        </div>

        <div className="lg:col-span-4 lg:justify-self-end animate-rise [animation-delay:140ms]">
          <dl className="grid grid-cols-3 lg:grid-cols-1 gap-x-6 gap-y-6 lg:gap-y-7 lg:border-l lg:border-bone/15 lg:pl-8">
            {[
              ["32", "seats nightly"],
              ["7", "course tasting"],
              ["12", "regional farms"],
            ].map(([n, l]) => (
              <div key={l} className="lg:flex lg:items-baseline lg:gap-4">
                <dt className="font-display text-4xl lg:text-5xl text-ember leading-none">{n}</dt>
                <dd className="mt-2 lg:mt-0 text-[10px] sm:text-xs uppercase tracking-[0.22em] text-bone/55">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <a
        href="#story"
        aria-label="Scroll to story"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 lg:left-12 lg:translate-x-0 text-bone/50 hover:text-ember text-[10px] uppercase tracking-[0.3em] flex flex-col items-center gap-2"
      >
        Scroll
        <span aria-hidden className="block w-px h-12 bg-gradient-to-b from-bone/50 to-transparent animate-glow" />
      </a>
    </section>
  );
}
