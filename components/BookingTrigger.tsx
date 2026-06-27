"use client";
import type { ReactNode } from "react";

export function openBooking() {
  window.dispatchEvent(new CustomEvent("open-booking"));
}

export default function BookingTrigger({
  children,
  className = "btn-ember",
  onTrigger,
}: {
  children: ReactNode;
  className?: string;
  onTrigger?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={() => { onTrigger?.(); openBooking(); }}
      className={className}
    >
      {children}
    </button>
  );
}
