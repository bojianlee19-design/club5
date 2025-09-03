// components/TopNav.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function TopNav() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 点击外部关闭 & ESC 关闭
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onEsc);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center">
      <div
        ref={ref}
        className="pointer-events-auto mx-2 mt-3 flex w-full max-w-6xl items-center justify-between rounded-full bg-black/50 px-3 py-2 backdrop-blur-md"
      >
        {/* 左：Logo */}
        <Link href="/" className="flex items-center gap-2 pl-1">
          {/* 你提供的 logo 图片放到 /public/logo-hazy.png */}
          <Image src="/logo-hazy.png" alt="HAZY Club" width={36} height={36} className="object-contain" />
          <span className="sr-only">HAZY Club</span>
        </Link>

        {/* 中：三枚按钮 */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => setOpen((s) => !s)}
            className="rounded-full bg-neutral-800/80 px-4 py-1.5 text-sm font-semibold hover:bg-neutral-700 transition"
            aria-expanded={open}
          >
            MENU
          </button>
          <Link
            href="/tables"
            className="rounded-full bg-neutral-800/80 px-4 py-1.5 text-sm font-semibold hover:bg-neutral-700 transition"
          >
            TABLES
          </Link>
          <Link
            href="/events"
            className="rounded-full bg-neutral-800/80 px-4 py-1.5 text-sm font-semibold hover:bg-neutral-700 transition"
          >
            TICKETS
          </Link>
        </div>

        {/* 右：登录注册 */}
        <div className="flex items-center gap-2 pr-1">
          <Link href="/sign-in" className="rounded-full bg-neutral-800/80 px-3 py-1.5 text-sm hover:bg-neutral-700">
            Sign in
          </Link>
          <Link href="/register" className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-black hover:bg-neutral-200">
            Register
          </Link>
        </div>
      </div>

      {/* 下拉菜单（点外部关闭） */}
      {open && (
        <div
          className="pointer-events-auto absolute top-16 z-40 w-full max-w-6xl px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-4 shadow-2xl backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <Link href="/events" className="rounded-lg bg-neutral-800/60 p-4 hover:bg-neutral-700">
                What’s On
              </Link>
              <Link href="/membership" className="rounded-lg bg-neutral-800/60 p-4 hover:bg-neutral-700">
                Membership
              </Link>
              <Link href="/venue-hire" className="rounded-lg bg-neutral-800/60 p-4 hover:bg-neutral-700">
                Venue Hire
              </Link>
              <Link href="/about" className="rounded-lg bg-neutral-800/60 p-4 hover:bg-neutral-700">
                About Our Club
              </Link>
              <Link href="/contact" className="rounded-lg bg-neutral-800/60 p-4 hover:bg-neutral-700">
                Contact Us
              </Link>
              <Link href="/gallery" className="rounded-lg bg-neutral-800/60 p-4 hover:bg-neutral-700">
                Gallery
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
