import Reveal from "./Reveal";

const quotes = [
  { q: "The most quietly confident restaurant to open this year.", s: "The Ledger · Food", n: "★★★★★" },
  { q: "Holloway cooks with restraint and a fire that knows what it’s doing.", s: "Field & Vine Magazine", n: "Editor's Pick" },
  { q: "Thirty-two seats, zero missteps. Book ahead — far ahead.", s: "Hearth Quarterly", n: "Top 50 · 2026" },
];

export default function Press() {
  return (
    <section id="press" className="border-y border-ink/10 bg-bone py-20 lg:py-28">
      <div className="container-x">
        <Reveal className="text-center">
          <p className="eyebrow">Press</p>
        </Reveal>
        <div className="mt-10 lg:mt-14 grid md:grid-cols-3 gap-10 lg:gap-px lg:bg-ink/10 lg:rounded-3xl lg:overflow-hidden">
          {quotes.map((p, i) => (
            <Reveal key={p.s} delay={i * 100}>
              <figure className="text-center lg:bg-bone lg:p-12 h-full flex flex-col justify-between">
                <p className="text-ember text-[10px] uppercase tracking-[0.3em]">{p.n}</p>
                <blockquote className="font-display font-light text-xl lg:text-2xl italic leading-snug mt-5 text-balance">
                  &ldquo;{p.q}&rdquo;
                </blockquote>
                <figcaption className="mt-6 text-[11px] uppercase tracking-[0.28em] text-oak">{p.s}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
