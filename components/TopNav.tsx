// components/TopNav.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function TopNav() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 点击外部自动收起
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* 左侧 LOGO */}
        <Link href="/" className="flex items-center gap-2">
          {/* 如果你使用其它文件名，请把 src 改成对应路径 */}
          <Image
            src="/logo-hazy.png"
            alt="HAZY CLUB"
            width={120}
            height={36}
            priority
            className="h-9 w-auto"
          />
        </Link>

        {/* 右侧导航组：TABLES / TICKETS / MENU */}
        <nav className="flex items-center gap-2">
          <Link
            href="/events"
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/15"
          >
            TABLES
          </Link>
          <Link
            href="/events"
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/15"
          >
            TICKETS
          </Link>

          {/* MENU 下拉 */}
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/25"
            >
              MENU
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-white/10 bg-black/80 p-1 text-sm text-white shadow-xl backdrop-blur">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2 hover:bg-white/10"
                >
                  Home page
                </Link>
                <Link
                  href="/events"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2 hover:bg-white/10"
                >
                  What&apos;s On
                </Link>
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2 hover:bg-white/10"
                >
                  Sign in / Register
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2 hover:bg-white/10"
                >
                  Contact
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
