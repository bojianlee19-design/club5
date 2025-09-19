// components/TopNav.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// ✅ 静态导入，确保构建期就能找到文件
import HazyLogo from '@/public/hazy-logo.png';

export default function TopNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest('#hc-menu-pop') && !t.closest('#hc-menu-btn')) setOpen(false);
    };
    document.addEventListener('keydown', onEsc);
    document.addEventListener('click', onDocClick);
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.removeEventListener('click', onDocClick);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-3 z-40 flex justify-center">
      <div className="flex items-center gap-3 rounded-full bg-white/10 px-3 py-2 text-white ring-1 ring-white/20 backdrop-blur">
        {/* Logo + 回到首页 */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={HazyLogo}
            alt="HAZY Club"
            width={80}
            height={36}
            priority
            className="h-6 w-auto md:h-7"
          />
        </Link>

        {/* 导航胶囊 */}
        <nav className="flex items-center gap-2">
          {/* Menu：点击弹出下拉，点击空白处自动收起 */}
          <button
            id="hc-menu-btn"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-white/30 px-4 py-1.5 text-sm tracking-wider hover:bg-white/10"
          >
            MENU
          </button>
          <Link
            href="/tables"
            className="rounded-full border border-white/30 px-4 py-1.5 text-sm tracking-wider hover:bg-white/10"
          >
            TABLES
          </Link>
          <Link
            href="/events"
            className="rounded-full border border-white/30 px-4 py-1.5 text-sm tracking-wider hover:bg-white/10"
          >
            TICKETS
          </Link>
        </nav>

        {/* Menu 下拉（点击任意空白关闭） */}
        {open && (
          <div
            id="hc-menu-pop"
            className="absolute left-1/2 top-full z-40 mt-2 w-[92vw] max-w-sm -translate-x-1/2 rounded-2xl border border-white/15 bg-black/80 p-3 text-white shadow-xl backdrop-blur"
          >
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  href="/"
                  className="block rounded-lg px-3 py-2 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  Home page
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="block rounded-lg px-3 py-2 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  What’s On / Tickets
                </Link>
              </li>
              <li>
                <Link
                  href="/membership"
                  className="block rounded-lg px-3 py-2 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  Membership
                </Link>
              </li>
              <li>
                <Link
                  href="/venue-hire"
                  className="block rounded-lg px-3 py-2 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  Venue Hire
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="block rounded-lg px-3 py-2 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  About Our Club
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block rounded-lg px-3 py-2 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-in"
                  className="block rounded-lg px-3 py-2 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  Sign in / Register
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
