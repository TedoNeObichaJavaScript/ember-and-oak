import { marqueeItems } from "@/lib/menu";

const loop = [...marqueeItems, ...marqueeItems];

export default function Marquee() {
  return (
    <div className="bg-ink text-bone/80 border-y border-bone/10 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap py-5" aria-hidden>
        {loop.map((t, i) => (
          <span key={i} className="font-display text-2xl mx-8 inline-flex items-center gap-8">
            <span className="opacity-90">{t}</span>
            <span className="text-ember/70">✦</span>
          </span>
        ))}
      </div>
      <span className="sr-only">Featured this week: {marqueeItems.join(", ")}</span>
    </div>
  );
}
