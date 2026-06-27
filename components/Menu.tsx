import Image from "next/image";
import Reveal from "./Reveal";
import { menu } from "@/lib/menu";

export default function Menu() {
  return (
    <section id="menu" className="relative bg-char text-bone py-24 lg:py-36 grain overflow-hidden">
      <div aria-hidden className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-ember/10 blur-3xl" />
      <div className="container-x relative">
        <Reveal className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div className="max-w-2xl">
            <p className="eyebrow text-ember">Tonight&rsquo;s menu</p>
            <h2 className="h-section mt-4 text-bone text-balance">
              Rewritten weekly.<br />Cooked once, by hand.
            </h2>
          </div>
          <p className="max-w-sm text-bone/55 text-sm leading-relaxed">
            A snapshot of this week. The seven-course tasting ($115) runs Thursday through Saturday and pairs with our small natural-wine list.
          </p>
        </Reveal>

        <div className="mt-16 lg:mt-24 grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-4 hidden lg:block sticky top-28">
            <Reveal>
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden ring-1 ring-bone/10">
                <Image
                  src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80"
                  alt="Wood-grilled course plated with charred herbs"
                  fill
                  sizes="(min-width:1024px) 33vw, 100vw"
                  className="object-cover"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-char via-transparent" />
                <span className="absolute bottom-6 left-6 right-6 font-display text-bone text-lg">
                  Plate of the week
                  <span className="block mt-2 text-xs uppercase tracking-[0.22em] text-ember">Wood-Grilled Lamb · No. 14</span>
                </span>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-8 grid sm:grid-cols-2 lg:grid-cols-1 gap-12 lg:gap-16">
            {menu.map((s, si) => (
              <Reveal key={s.title} delay={si * 80}>
                <div>
                  <div className="flex items-baseline justify-between border-b border-bone/15 pb-4">
                    <h3 className="font-display text-ember text-2xl tracking-tight">{s.title}</h3>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-bone/40">N° {String(si + 1).padStart(2, "0")}</span>
                  </div>
                  <ul className="mt-6 space-y-7">
                    {s.items.map((i) => (
                      <li key={i.name} className="grid grid-cols-[1fr_auto] gap-x-4 items-baseline">
                        <p className="font-medium tracking-tight text-[17px]">{i.name}</p>
                        <span className="font-display text-bone/85 text-lg">${i.price}</span>
                        <p className="text-bone/55 text-sm mt-1.5 col-start-1">{i.desc}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-20 pt-10 border-t border-bone/10 flex flex-wrap items-center justify-between gap-6">
          <p className="text-bone/55 text-sm max-w-md">
            Allergies and dietary preferences accommodated with notice. A 20% gratuity is included on tasting menus.
          </p>
          <a href="#reserve" className="btn-ember">Reserve for tasting</a>
        </Reveal>
      </div>
    </section>
  );
}
