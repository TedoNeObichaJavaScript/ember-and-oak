import Image from "next/image";
import Reveal from "./Reveal";

export default function Story() {
  return (
    <section id="story" className="container-x py-24 lg:py-36 grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
      <Reveal className="lg:col-span-5 relative">
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden ring-1 ring-ink/10">
          <Image
            src="https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&w=1400&q=80"
            alt="Chef Mira Holloway tending the wood hearth"
            fill
            sizes="(min-width:1024px) 40vw, 100vw"
            className="object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
          <figcaption className="absolute bottom-6 left-6 right-6 font-display text-bone text-xl leading-snug">
            &ldquo;The fire decides. We just listen.&rdquo;
            <span className="block mt-3 text-[10px] uppercase tracking-[0.3em] text-ember">Chef Mira Holloway · Founder</span>
          </figcaption>
        </div>
        <div aria-hidden className="hidden lg:block absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-ember/15 blur-3xl" />
      </Reveal>

      <div className="lg:col-span-7">
        <Reveal>
          <p className="eyebrow">The story</p>
          <h2 className="h-section mt-4 text-balance">
            A bistro built around <span className="italic text-ember">one fire,</span> one farmer at a time.
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-7 text-ink/70 text-lg leading-relaxed text-balance">
            We opened Ember &amp; Oak with thirty-two seats, a wood hearth, and a single rule: nothing on the plate that we couldn&rsquo;t name the field it came from. Two years later, that rule still holds.
          </p>
          <p className="mt-4 text-ink/70 text-lg leading-relaxed text-balance">
            The dining room is small on purpose. Service is unhurried. The menu is a conversation between the chef and the farms&mdash;rewritten Tuesday mornings before the doors open Wednesday night.
          </p>
        </Reveal>
        <Reveal delay={200} className="mt-12 grid grid-cols-3 gap-6 text-sm">
          {[
            ["Founded", "2024"],
            ["Seats", "32"],
            ["Sourcing", "60 mi"],
          ].map(([l, v]) => (
            <div key={l} className="border-t border-ink/15 pt-5">
              <p className="text-oak uppercase tracking-[0.22em] text-[10px]">{l}</p>
              <p className="font-display font-light text-3xl lg:text-4xl mt-2 tracking-tight">{v}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
