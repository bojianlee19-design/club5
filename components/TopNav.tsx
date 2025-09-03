// components/TopNav.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function TopNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* 顶部居中三项：Menu / Tables / Tickets */}
      <nav className="pointer-events-none fixed left-1/2 top-4 z-50 -translate-x-1/2">
        <ul className="pointer-events-auto flex items-center gap-6 text-sm font-bold tracking-wide">
          <li>
            <button
              onClick={() => setOpen(v => !v)}
              className="rounded-full bg-white/10 px-4 py-2 backdrop-blur transition hover:bg-white/20"
              aria-expanded={open}
            >
              Menu
            </button>
          </li>
          <li>
            <Link
              href="/tables"
              className="rounded-full bg-white/10 px-4 py-2 backdrop-blur transition hover:bg-white/20"
            >
              Tables
            </Link>
          </li>
          <li>
            <Link
              href="/events"
              className="rounded-full bg-white px-4 py-2 text-black transition hover:bg-white/90"
            >
              Tickets
            </Link>
          </li>
        </ul>
      </nav>

      {/* Menu 下拉（居中） */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute left-1/2 top-20 w-[min(92vw,720px)] -translate-x-1/2 rounded-2xl bg-neutral-900 p-6 shadow-2xl ring-1 ring-white/10"
            onClick={e => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
              <Link className="hc-menu-item" href="/events">What’s On</Link>
              <Link className="hc-menu-item" href="/membership">Membership</Link>
              <Link className="hc-menu-item" href="/venue-hire">Venue Hire</Link>
              <Link className="hc-menu-item" href="/about">About Our Club</Link>
              <Link className="hc-menu-item" href="/contact">Contact Us</Link>
              <Link className="hc-menu-item" href="/gallery">Gallery</Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
