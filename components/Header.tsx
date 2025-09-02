// components/Header.tsx
"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!open) return;
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/40">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <nav className="flex items-center justify-center gap-10">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="uppercase tracking-widest text-sm font-bold hover:text-white/80"
          >
            Menu
          </button>

          <Link
            href="/events"
            className="uppercase tracking-widest text-sm font-black hover:text-white/80"
          >
            What’s On
          </Link>

          <Link
            href="/events"
            className="uppercase tracking-widest text-sm font-black hover:text-white/80"
          >
            Tickets
          </Link>
        </nav>
      </div>

      {/* 下拉菜单 */}
      <div
        ref={panelRef}
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-white/10" />
        <div className="max-w-7xl mx-auto px-4 py-6 grid sm:grid-cols-5 gap-4 text-sm">
          <Link href="/events" className="hover:underline font-semibold">
            What’s On
          </Link>
          <Link href="/membership" className="hover:underline">
            Membership
          </Link>
          <Link href="/venue-hire" className="hover:underline">
            Venue Hire
          </Link>
          <Link href="/about" className="hover:underline">
            About Our Club
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact Us
          </Link>
        </div>
      </div>
      <div className="border-b border-white/10" />
    </header>
  );
}
