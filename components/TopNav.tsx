// components/TopNav.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

function PillButton({
  href,
  children,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const Cmp: any = href ? Link : 'button';
  return (
    <Cmp
      href={href as any}
      onClick={onClick}
      className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white ring-1 ring-white/20 hover:bg-white/25"
    >
      {children}
    </Cmp>
  );
}

export default function TopNav() {
  const [open, setOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center">
      <div
        ref={ref}
        className="pointer-events-auto flex items-center gap-3 rounded-full bg-black/35 px-3 py-2 text-white shadow-lg ring-1 ring-white/15 backdrop-blur-md"
      >
        {/* 左侧 LOGO（如果图片不存在会回退为文字） */}
        <Link href="/" className="mr-1 flex items-center gap-2">
          {!logoFailed ? (
            <Image
              src="/hazy-logo.png"
              alt="HAZY CLUB"
              width={92}
              height={18}
              className="h-5 w-auto"
              onError={() => setLogoFailed(true)}
              priority
            />
          ) : (
            <span className="text-sm font-bold tracking-wide">HAZY&nbsp;CLUB</span>
          )}
        </Link>

        {/* 居中三键 */}
        <div className="hidden md:flex items-center gap-2">
          <PillButton onClick={() => setOpen((v) => !v)}>Menu</PillButton>
          <PillButton href="/#tables">Tables</PillButton>
          <PillButton href="/events">Tickets</PillButton>
        </div>

        {/* 右侧移动端：显示三键（MENU 可展开） */}
        <div className="flex md:hidden items-center gap-2">
          <PillButton onClick={() => setOpen((v) => !v)}>Menu</PillButton>
          <PillButton href="/#tables">Tables</PillButton>
          <PillButton href="/events">Tickets</PillButton>
        </div>

        {/* 下拉：点击空白自动回收 */}
        {open && (
          <div className="absolute left-1/2 top-[calc(100%+10px)] w-[92vw] max-w-[560px] -translate-x-1/2 rounded-2xl bg-black/70 p-4 shadow-xl ring-1 ring-white/15 backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10 hover:bg-white/10"
              >
                Home Page
              </Link>
              <Link
                href="/events"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10 hover:bg-white/10"
              >
                What’s On / Tickets
              </Link>
              <Link
                href="/membership"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10 hover:bg-white/10"
              >
                Membership
              </Link>
              <Link
                href="/venue-hire"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10 hover:bg-white/10"
              >
                Venue Hire
              </Link>
              <Link
                href="/about"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10 hover:bg-white/10"
              >
                About Our Club
              </Link>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10 hover:bg-white/10"
              >
                Contact Us
              </Link>
              <Link
                href="/sign-in"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10 hover:bg-white/10"
              >
                Sign in / Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
