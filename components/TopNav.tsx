'use client';

import Link from 'next/link';
import Image from 'next/image';
import * as React from 'react';

type NavItem = { label: string; href: string };

const MAIN_LINKS: NavItem[] = [
  { label: "What's On", href: '/events' }, // 与 Tickets/Events 整合
  { label: 'Tickets', href: '/events' },   // 指向同一个列表页
];

const MENU_LINKS: NavItem[] = [
  { label: 'Membership', href: '/membership' },
  { label: 'Venue Hire', href: '/venue-hire' },
  { label: 'About Our Club', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

export default function TopNav() {
  const [open, setOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-black/70 to-black/0">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 text-white">
        {/* 左：Logo（用你的 hazyclub logo，或文字占位） */}
        <Link href="/" className="flex items-center gap-2">
          {/* 如有 logo.png 放在 public/ */}
          {/* <Image src="/logo.png" alt="Hazy Club" width={28} height={28} /> */}
          <span className="text-sm font-bold tracking-wide">HAZY CLUB</span>
        </Link>

        {/* 中：主导航（桌面） */}
        <div className="hidden items-center gap-6 md:flex">
          {MAIN_LINKS.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className="text-sm font-semibold tracking-wide opacity-90 hover:opacity-100"
            >
              {i.label}
            </Link>
          ))}

          {/* 下拉 Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              onMouseEnter={() => setOpen(true)}
              className="text-sm font-semibold tracking-wide opacity-90 hover:opacity-100"
              aria-haspopup="menu"
              aria-expanded={open}
            >
              Menu
            </button>

            {open && (
              <div
                onMouseLeave={() => setOpen(false)}
                className="absolute left-1/2 z-50 mt-3 w-56 -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl"
              >
                <ul className="py-2">
                  {MENU_LINKS.map((i) => (
                    <li key={i.href}>
                      <Link
                        href={i.href}
                        className="block px-4 py-2 text-sm opacity-90 hover:bg-white/10 hover:opacity-100"
                        onClick={() => setOpen(false)}
                      >
                        {i.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* 右：CTA（桌面） */}
        <div className="hidden md:block">
          <Link
            href="/events"
            className="rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-semibold tracking-wide hover:bg-white/15"
          >
            Book Tickets
          </Link>
        </div>

        {/* 移动端菜单按钮 */}
        <button
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </nav>

      {/* 移动端抽屉（下拉） */}
      {mobileOpen && (
        <div className="md:hidden">
          <div className="mx-4 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-black/85 text-white backdrop-blur-xl">
            <ul className="divide-y divide-white/10">
              {[...MAIN_LINKS, ...MENU_LINKS].map((i) => (
                <li key={i.href}>
                  <Link
                    href={i.href}
                    className="block px-4 py-3 text-sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="p-3">
              <Link
                href="/events"
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-center text-sm font-semibold"
              >
                Book Tickets
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
