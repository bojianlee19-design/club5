'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function TopNav() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="pointer-events-auto flex items-center justify-center gap-10 rounded-full bg-black/50 px-5 py-2 backdrop-blur">
          {/* 居中主导航 */}
          <nav className="hidden items-center gap-6 text-sm font-semibold tracking-wide md:flex">
            <Link href="/events" className="text-white/90 hover:text-white">What’s On</Link>
            <Link href="/events" className="text-white/90 hover:text-white">Tickets</Link>
            <Link href="/gallery" className="text-white/90 hover:text-white">Gallery</Link>
          </nav>

          {/* Menu 下拉（移动端主入口 & 桌面更多） */}
          <div ref={ref} className="relative">
            <button
              onClick={() => setOpen(v => !v)}
              className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-white hover:bg-white/20"
            >
              Menu
            </button>
            {open && (
              <div className="absolute left-1/2 mt-3 w-[280px] -translate-x-1/2 rounded-2xl border border-white/10 bg-black/90 p-2 shadow-2xl backdrop-blur">
                <Link href="/events" className="block rounded-lg px-4 py-3 text-sm font-medium text-white/90 hover:bg-white/10">What’s On</Link>
                <Link href="/membership" className="block rounded-lg px-4 py-3 text-sm font-medium text-white/90 hover:bg-white/10">Membership</Link>
                <Link href="/venue-hire" className="block rounded-lg px-4 py-3 text-sm font-medium text-white/90 hover:bg-white/10">Venue Hire</Link>
                <Link href="/about" className="block rounded-lg px-4 py-3 text-sm font-medium text-white/90 hover:bg-white/10">About Our Club</Link>
                <Link href="/contact" className="block rounded-lg px-4 py-3 text-sm font-medium text-white/90 hover:bg-white/10">Contact Us</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
