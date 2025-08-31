'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
export default function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 bg-black/40 backdrop-blur border-b border-white/10">
      <div className="container-max flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Logo" width={36} height={36} />
          <span className="font-semibold text-lg gradient-text">HAZY CLUB</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link className="nav-link" href="/events">Events</Link>
          <Link className="nav-link" href="/gallery">Gallery</Link>
          <Link className="nav-link" href="/news">News</Link>
          <Link className="nav-link" href="/vip">VIP</Link>
          <Link className="nav-link" href="/venue-hire">Venue Hire</Link>
          <Link className="nav-link" href="/faq">FAQ</Link>
          <Link className="btn btn-primary" href="/tickets">Tickets</Link>
        </nav>
        <button className="md:hidden nav-link" onClick={() => setOpen(!open)}>Menu</button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10 bg-black/60">
          <div className="container-max py-3 flex flex-col gap-2">
            <a className="nav-link" href="/events">Events</a>
            <a className="nav-link" href="/gallery">Gallery</a>
            <a className="nav-link" href="/news">News</a>
            <a className="nav-link" href="/vip">VIP</a>
            <a className="nav-link" href="/venue-hire">Venue Hire</a>
            <a className="nav-link" href="/faq">FAQ</a>
            <a className="btn btn-primary w-full text-center" href="/tickets">Tickets</a>
          </div>
        </div>
      )}
    </header>
  )
}
