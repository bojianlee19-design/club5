'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function TopNav() {
  const [open, setOpen] = React.useState(false);
  const navRef = React.useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  // 1) 点击外部关闭
  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!navRef.current) return;
      if (!navRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  // 2) 路由变化自动关闭
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // 公共样式：磨砂胶囊按钮
  const pill =
    'rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/15 hover:text-white transition-colors';

  return (
    <>
      {/* 顶部：居中磨砂导航条 */}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-40 flex w-full justify-center">
        <div
          ref={navRef}
          className="
            pointer-events-auto
            flex items-center gap-3
            rounded-3xl border border-white/15 bg-black/60 px-3 py-2 text-white shadow-2xl backdrop-blur
            ring-1 ring-white/10
            max-w-[92vw]
          "
        >
          {/* 左侧 LOGO（使用你 /public 里的文件名；若不同可自行替换） */}
          <Link
            href="/"
            className="mr-1 flex items-center gap-2 rounded-2xl px-2 py-1 hover:bg-white/10"
            aria-label="Go home"
          >
            <Image
              src="/hazy-logo-red.png"
              alt="HAZY CLUB"
              width={88}
              height={28}
              className="h-6 w-auto object-contain"
              priority
            />
          </Link>

          {/* 三个主按钮 */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={pill}
            aria-expanded={open}
            aria-controls="hc-menu-popover"
          >
            MENU
          </button>

          <Link href="/tables" className={pill}>
            TABLES
          </Link>

          {/* Tickets -> 统一到 /events（What’s On） */}
          <Link href="/events" className={pill}>
            TICKETS
          </Link>
        </div>
      </div>

      {/* 右上角：Sign in / Register（轻量，不影响主导航布局） */}
      <div className="fixed right-4 top-4 z-40 hidden sm:flex items-center gap-2">
        <Link
          href="/sign-in"
          className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white/85 hover:bg-white/15"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white/85 hover:bg-white/15"
        >
          Register
        </Link>
      </div>

      {/* 下拉菜单：跟随导航条，点击空白可关闭；移动端同样适配 */}
      <div
        id="hc-menu-popover"
        className={`
          fixed left-1/2 z-30 mt-2 w-[92vw] max-w-md -translate-x-1/2
          rounded-2xl border border-white/15 bg-black/80 p-2 text-white shadow-2xl backdrop-blur
          transition-all duration-150
          ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}
        `}
        style={{ top: '72px' }}
        aria-hidden={!open}
      >
        <ul className="divide-y divide-white/10">
          <li>
            <Link
              href="/"
              className="block px-4 py-3 hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              Home Page
            </Link>
          </li>
          <li>
            <Link
              href="/events"
              className="block px-4 py-3 hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              What&apos;s On
            </Link>
          </li>
          <li>
            <Link
              href="/membership"
              className="block px-4 py-3 hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              Membership
            </Link>
          </li>
          <li>
            <Link
              href="/venue-hire"
              className="block px-4 py-3 hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              Venue Hire
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="block px-4 py-3 hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              About Our Club
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="block px-4 py-3 hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              Contact Us
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
