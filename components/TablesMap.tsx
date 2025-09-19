// components/TablesMap.tsx
'use client'

import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

type Hotspot = {
  id: string
  label: string
  x: number // 百分比(0-100)
  y: number // 百分比(0-100)
  capacity?: number
  minSpend?: string
}

type Props = {
  src: string
  hotspots: Hotspot[]
  emailTo?: string // 可改为你的订座邮箱
}

export default function TablesMap({ src, hotspots, emailTo = 'book@hazy.club' }: Props) {
  const [active, setActive] = React.useState<Hotspot | null>(null)

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl ring-1 ring-white/10">
        <Image
          src={src}
          alt="Tables plan"
          fill
          className="object-contain bg-black"
          priority
        />

        {/* 热点标记 */}
        {hotspots.map(h => (
          <button
            key={h.id}
            aria-label={h.label}
            onClick={() => setActive(h)}
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-black shadow"
          >
            {h.label}
          </button>
        ))}
      </div>

      {/* 选中信息卡片 */}
      {active && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-white backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm opacity-70">Selected table</div>
              <h3 className="mt-1 text-xl font-bold tracking-wide">{active.label}</h3>
              <div className="mt-2 space-y-1 text-sm opacity-80">
                {active.capacity ? <div>Capacity: {active.capacity}</div> : null}
                {active.minSpend ? <div>Min spend: {active.minSpend}</div> : null}
              </div>
            </div>
            <button
              onClick={() => setActive(null)}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-sm hover:bg-white/10"
            >
              Close
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link
              href={`mailto:${emailTo}?subject=${encodeURIComponent(
                `Table enquiry: ${active.label}`
              )}&body=${encodeURIComponent('Hi, I would like to book this table. Date: ____  Time: ____  Guests: ____.')}`}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90"
            >
              Request table
            </Link>
            <Link
              href={`/contact?table=${encodeURIComponent(active.label)}`}
              className="rounded-full border border-white/15 px-4 py-2 text-sm hover:bg-white/10"
            >
              Contact us
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
