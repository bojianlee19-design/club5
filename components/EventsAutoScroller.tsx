// components/EventsAutoScroller.tsx
import Link from 'next/link'

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
  // 复制一份实现无缝循环
  const lane = [...events, ...events]

  return (
    <div className="relative mx-auto w-full overflow-hidden">
      <div
        className="hc-marquee flex gap-4 will-change-transform hover:[animation-play-state:paused]"
        style={{ animationDuration: `${durationSec}s`, width: 'max-content' }}
      >
        {lane.map((e, idx) => (
          <Link
            href={`/events/${e.slug}`}
            key={`${e.id}-${idx}`}
            className="group relative block h-44 w-72 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5"
          >
            {e.cover ? (
              <img
                src={e.cover}
                alt={e.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white/5 text-sm opacity-70">
                No cover
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <div className="text-sm opacity-80">
                {e.date ? new Date(e.date).toLocaleDateString() : ''}
              </div>
              <div className="line-clamp-1 font-semibold">{e.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
