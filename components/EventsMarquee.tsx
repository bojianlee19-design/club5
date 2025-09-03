// components/EventsMarquee.tsx
'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

export type EventItem = {
  id: string
  slug: string
  title: string
  date?: string
  cover?: string
}

export default function EventsMarquee({
  events,
  durationSec = 28,
}: {
  events: EventItem[]
  durationSec?: number
}) {
  const [paused, setPaused] = useState(false)
  const loop = useMemo(() => [...events, ...events], [events])

  return (
    <div
      className="group relative mx-auto max-w-7xl overflow-hidden rounded-2xl border border-white/10 bg-white/5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex gap-4 whitespace-nowrap p-4"
        style={{
          animation: `hc-marquee ${durationSec}s linear infinite`,
          animationPlayState: paused ? 'paused' as const : 'running' as const,
        }}
      >
        {loop.map((e, i) => (
          <Link
            href={`/events/${e.slug}`}
            key={`${e.id}-${i}`}
            className="relative block h-44 w-72 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/30"
          >
            {e.cover ? (
              <img src={e.cover} alt={e.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center opacity-60">No cover</div>
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <div className="line-clamp-1 text-sm font-semibold">{e.title}</div>
              <div className="text-xs opacity-80">
                {e.date ? new Date(e.date).toLocaleDateString() : ''}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        @keyframes hc-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
