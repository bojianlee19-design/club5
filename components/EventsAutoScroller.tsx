'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useMemo } from 'react'

export type EventItem = {
  id?: string
  slug: string
  title: string
  date?: string
  cover?: string
}

export default function EventsAutoScroller({
  events,
  durationSec = 40, // 动画时长（秒）
}: {
  events: EventItem[]
  durationSec?: number
}) {
  if (!events?.length) return null

  // 无缝：复制一遍
  const list = useMemo(() => [...events, ...events], [events])

  return (
    <div className="relative overflow-hidden py-6">
      {/* 左右遮罩（渐隐） */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-16"
        style={{
          maskImage: 'linear-gradient(90deg, black, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, black, transparent)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-16"
        style={{
          maskImage: 'linear-gradient(90deg, transparent, black)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, black)',
        }}
        aria-hidden
      />

      <div className="marquee" style={{ ['--d' as any]: `${durationSec}s` }}>
        <div className="row">
          {events.map((e) => (
            <Card key={`a-${e.id ?? e.slug}`} item={e} />
          ))}
        </div>
        <div className="row" aria-hidden>
          {events.map((e) => (
            <Card key={`b-${e.id ?? e.slug}`} item={e} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes hc-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .marquee {
          display: flex;
          width: 200%;
          animation: hc-scroll var(--d, 40s) linear infinite;
          will-change: transform;
        }
        .row {
          width: 50%;
          display: flex;
          gap: 16px;
          padding-right: 16px;
        }
      `}</style>
    </div>
  )
}

function Card({ item }: { item: EventItem }) {
  const href = item.slug ? `/events/${item.slug}` : '#'
  return (
    <Link
      href={href}
      className="group relative block w-[300px] md:w-[420px]"
      prefetch={false}
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-900">
        {item.cover ? (
          <Image
            src={item.cover}
            alt={item.title || 'Event'}
            fill
            sizes="(max-width: 768px) 300px, 420px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-sm text-neutral-400">
            No cover
          </div>
        )}
      </div>
      <div className="mt-2 text-sm opacity-80">
        {item.date ? new Date(item.date).toLocaleString() : ''}
      </div>
      <div className="text-base font-semibold tracking-wide">{item.title}</div>
    </Link>
  )
}
