"use client";
import { useEffect, useRef } from "react";

export default function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const show = () => el.classList.add("in");

    if (reduce || typeof IntersectionObserver === "undefined") { show(); return; }

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const t = window.setTimeout(show, delay);
      return () => window.clearTimeout(t);
    }

    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { window.setTimeout(show, delay); io.disconnect(); } },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    const safety = window.setTimeout(() => { show(); io.disconnect(); }, 1400 + delay);
    return () => { io.disconnect(); window.clearTimeout(safety); };
  }, [delay]);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}
