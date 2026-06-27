"use client";
import { useEffect, useState } from "react";
import { business } from "@/lib/site";
import { openBooking } from "./BookingTrigger";

const links = [
  { href: "#menu", label: "Menu" },
  { href: "#story", label: "Story" },
  { href: "#visit", label: "Visit" },
  { href: "#press", label: "Press" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled || open ? "bg-bone/90 backdrop-blur-md border-b border-ink/10" : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container-x flex items-center justify-between h-16 lg:h-20">
          <a href="#top" onClick={close} className="flex items-center gap-2.5 font-display text-lg lg:text-xl tracking-tight">
            <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-ember animate-glow shadow-[0_0_12px_2px_rgba(217,119,6,.6)]" />
            <span className={open || scrolled ? "text-ink" : "text-bone"}>Ember <span className="text-oak">&amp;</span> Oak</span>
          </a>

          <nav aria-label="Primary" className="hidden md:flex items-center gap-9 text-sm">
            {links.map((l) => (
              <a key={l.href} href={l.href} className={`transition hover:text-ember ${scrolled ? "text-ink/70" : "text-bone/85"}`}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => { close(); openBooking(); }} className="hidden sm:inline-flex btn-primary text-xs px-5 py-3">Reserve</button>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className={`md:hidden grid place-items-center h-11 w-11 rounded-full border ${open || scrolled ? "border-ink/20 text-ink" : "border-bone/30 text-bone"}`}
            >
              <span className="sr-only">Menu</span>
              <span aria-hidden className="relative block w-4 h-3">
                <span className={`absolute inset-x-0 top-0 h-px bg-current transition-transform duration-300 ${open ? "translate-y-1.5 rotate-45" : ""}`} />
                <span className={`absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-300 ${open ? "-translate-y-1 -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        aria-hidden={!open}
        className={`md:hidden fixed inset-0 z-40 bg-ink text-bone transition-[opacity,transform] duration-500 ${
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="container-x flex flex-col h-full pt-24 pb-10 gap-1">
          <nav aria-label="Mobile" className="flex flex-col flex-1">
            {links.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={close}
                className="font-display font-light text-5xl py-4 border-b border-bone/10 hover:text-ember transition tracking-tightest"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <button type="button" onClick={() => { close(); openBooking(); }} className="btn-ember w-full mt-6">Reserve a table</button>
          <p className="text-bone/50 mt-8 text-sm leading-relaxed">
            {business.address.street} · {business.address.locality}<br />{business.hours.display}
          </p>
        </div>
      </div>
    </>
  );
}
