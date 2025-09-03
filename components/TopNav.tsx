// components/TopNav.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function TopNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="pointer-events-none fixed left-1/2 top-4 z-50 -translate-x-1/2">
      <nav className="pointer-events-auto flex items-center gap-6 rounded-full bg-black/60 px-5 py-2 text-sm backdrop-blur md:text-base">
        {/* Menu（下拉） */}
        <div className="relative">
          <button
            onClick={() => setOpen(v => !v)}
            onBlur={() => setOpen(false)}
            className="uppercase tracking-wide hover:opacity-90"
          >
            Menu
          </button>
          {open && (
            <div
              className="absolute left-1/2 z-50 mt-2 w-52 -translate-x-1/2 rounded-xl border border-white/10 bg-black/90 p-2 shadow-xl"
              onMouseDown={e => e.preventDefault()}
            >
              <Link href="/events" className="block rounded-lg px-3 py-2 hover:bg-white/10">What’s On</Link>
              <Link href="/membership" className="block rounded-lg px-3 py-2 hover:bg-white/10">Membership</Link>
              <Link href="/venue-hire" className="block rounded-lg px-3 py-2 hover:bg-white/10">Venue Hire</Link>
              <Link href="/about" className="block rounded-lg px-3 py-2 hover:bg-white/10">About Our Club</Link>
              <Link href="/contact" className="block rounded-lg px-3 py-2 hover:bg-white/10">Contact Us</Link>
            </div>
          )}
        </div>

        {/* Tables / Tickets 与 MOS 一样放在右侧 */}
        <Link href="/tables" className="uppercase tracking-wide hover:opacity-90">
          Tables
        </Link>
        <Link href="/events" className="uppercase tracking-wide hover:opacity-90">
          Tickets
        </Link>
      </nav>
    </div>
  )
}
