// components/EventsAutoScroller.tsx
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

export default function EventsAutoScroller({
  events,
  durationSec = 28,
}: {
  events: EventItem[]
  durationSec?: number
}) {
  const [paused, setPaused] = useState(false)
  // 为了“无缝滚动”，内容*2
  const data = useMemo(() => [...events, ...events], [events])

  return (
    <div
      className="group mx-auto mt-8 w-full max-w-7xl overflow-hidden px-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex items-stretch gap-4"
        style={{
          animation: `hc-marquee ${durationSec}s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {data.map((e, idx) => (
          <Link
            href={`/events/${encodeURIComponent(e.slug)}`}
            key={`${e.id}-${idx}`}
            className="relative h-48 w-[280px] shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10"
          >
            {/* 封面 */}
            {e.cover ? (
              // 用 <img> 避免 next/image 的域名限制
              <img
                src={e.cover}
                alt={e.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-neutral-800">
                <span className="text-sm text-neutral-300">No cover</span>
              </div>
            )}

            {/* 信息条（与 MOS 相似：左上日期，底部标题） */}
            <div className="absolute left-2 top-2 rounded bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide">
              {e.date ? new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' }) : 'TBA'}
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
              <div className="line-clamp-2 text-sm font-bold">{e.title || 'Untitled'}</div>
              <div className="mt-0.5 text-[11px] opacity-80">View Details →</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
