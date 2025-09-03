// components/TopNav.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

/** 顶部居中胶囊导航：Menu / Tables / Tickets（样式 & 交互参考 MOS） */
export default function TopNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
      {/* 居中主导航 */}
      <div className="mx-auto flex max-w-7xl justify-center pt-4">
        <div className="pointer-events-auto rounded-full bg-black/60 px-4 py-2 backdrop-blur">
          <nav className="flex items-center gap-6 text-sm font-medium uppercase tracking-wide">
            <button
              onClick={() => setOpen((v) => !v)}
              className="hover:opacity-80"
            >
              Menu
            </button>
            <Link href="/tables" className="hover:opacity-80">
              Tables
            </Link>
            <Link href="/events" className="hover:opacity-80">
              Tickets
            </Link>
          </nav>
        </div>
      </div>

      {/* Menu 下拉面板（非弹窗），置于导航正下方 */}
      {open && (
        <div className="pointer-events-auto">
          <div className="mx-auto mt-2 flex max-w-7xl justify-center">
            <div className="rounded-2xl bg-black/80 p-6 shadow-lg backdrop-blur">
              <ul className="grid grid-cols-2 gap-4 text-base">
                <li>
                  <Link onClick={() => setOpen(false)} href="/events" className="hover:opacity-80">
                    What’s On
                  </Link>
                </li>
                <li>
                  <Link onClick={() => setOpen(false)} href="/membership" className="hover:opacity-80">
                    Membership
                  </Link>
                </li>
                <li>
                  <Link onClick={() => setOpen(false)} href="/venue-hire" className="hover:opacity-80">
                    Venue Hire
                  </Link>
                </li>
                <li>
                  <Link onClick={() => setOpen(false)} href="/about" className="hover:opacity-80">
                    About Our Club
                  </Link>
                </li>
                <li className="col-span-2">
                  <Link onClick={() => setOpen(false)} href="/contact" className="hover:opacity-80">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
