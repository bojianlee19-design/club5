'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

// 简易 cn：把真假不一的 class 合并
function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export default function TopNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    h();
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className={cn('mx-auto w-full max-w-7xl px-4 transition-all', scrolled ? 'py-3' : 'py-5')}>
        <div className="pointer-events-auto mx-auto w-fit rounded-full bg-black/50 px-5 py-2 text-sm tracking-wide text-white backdrop-blur">
          <button
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="mr-5 font-semibold uppercase hover:opacity-80"
          >
            Menu
          </button>

          <Link href="/events" className="mx-5 uppercase hover:opacity-80">
            What’s On
          </Link>
          <Link href="/events" className="ml-5 uppercase hover:opacity-80">
            Tickets
          </Link>
        </div>

        {/* 下拉菜单（非弹窗） */}
        <div
          className={cn(
            'pointer-events-auto mx-auto mt-2 w-full max-w-3xl overflow-hidden rounded-2xl bg-black/70 text-white backdrop-blur transition-[max-height,opacity]',
            open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="grid grid-cols-2 gap-1 p-4 text-sm sm:grid-cols-3">
            <Link href="/events" className="rounded-xl bg-white/5 p-3 hover:bg-white/10">
              What’s On
            </Link>
            <Link href="/membership" className="rounded-xl bg-white/5 p-3 hover:bg-white/10">
              Membership
            </Link>
            <Link href="/venue-hire" className="rounded-xl bg-white/5 p-3 hover:bg-white/10">
              Venue Hire
            </Link>
            <Link href="/about" className="rounded-xl bg-white/5 p-3 hover:bg-white/10">
              About Our Club
            </Link>
            <Link href="/contact" className="rounded-xl bg-white/5 p-3 hover:bg-white/10">
              Contact Us
            </Link>
            <Link href="/gallery" className="rounded-xl bg-white/5 p-3 hover:bg-white/10">
              Gallery
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
