// components/TopNav.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function TopNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-black/60 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* 左侧 LOGO/Title */}
        <Link href="/" className="font-black tracking-widest">
          HAZY CLUB
        </Link>

        {/* 中间主导航（MOS 风格） */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/events" className="hover:opacity-80">What’s On</Link>
          <Link href="/events" className="hover:opacity-80">Tickets</Link>
        </nav>

        {/* 右侧 Menu */}
        <button
          className="rounded-full border border-white/15 px-4 py-1 text-sm hover:bg-white/10"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="hc-menu"
        >
          Menu
        </button>
      </div>

      {/* 下拉面板 */}
      {open && (
        <div id="hc-menu" className="border-t border-white/10 bg-black/85">
          <div className="mx-auto max-w-7xl px-4 py-6 grid gap-3 md:grid-cols-3">
            <Link href="/events" className="underline" onClick={() => setOpen(false)}>What’s On</Link>
            <Link href="/membership" className="underline" onClick={() => setOpen(false)}>Membership</Link>
            <Link href="/venue-hire" className="underline" onClick={() => setOpen(false)}>Venue Hire</Link>
            <Link href="/about" className="underline" onClick={() => setOpen(false)}>About our club</Link>
            <Link href="/contact" className="underline" onClick={() => setOpen(false)}>Contact us</Link>
          </div>
        </div>
      )}
    </header>
  )
}
