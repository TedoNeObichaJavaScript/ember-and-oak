import Reveal from "./Reveal";

const pillars = [
  { k: "01", t: "Single Hearth", d: "Every plate touches the wood fire. Oak, cherry, and apple shape each course." },
  { k: "02", t: "Farm-Direct", d: "Twelve regional growers within sixty miles. Menu rewritten when the harvest changes." },
  { k: "03", t: "Quiet Service", d: "No upsell, no theatre. A team that knows the room and the wine list by heart." },
];

export default function Pillars() {
  return (
    <section className="container-x py-24 lg:py-36">
      <Reveal className="max-w-2xl">
        <p className="eyebrow">The kitchen</p>
        <h2 className="h-section mt-4 text-balance">Three things we refuse to compromise.</h2>
      </Reveal>
      <div className="mt-14 lg:mt-20 grid md:grid-cols-3 gap-px bg-ink/10 border border-ink/10 rounded-3xl overflow-hidden">
        {pillars.map((p, i) => (
          <Reveal key={p.k} delay={i * 90}>
            <article className="bg-bone p-8 lg:p-12 group hover:bg-ink hover:text-bone transition-colors duration-500 h-full">
              <div className="flex items-baseline justify-between">
                <span className="font-display text-ember text-sm tracking-widest">{p.k}</span>
                <span aria-hidden className="h-px w-12 bg-current/30 group-hover:bg-ember transition-colors" />
              </div>
              <h3 className="font-display font-light text-3xl mt-8 tracking-tight">{p.t}</h3>
              <p className="mt-4 text-current/65 leading-relaxed text-[15px]">{p.d}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
