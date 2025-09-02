'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

export type EventCard = {
  _id: string;
  slug: string;
  title: string;
  date?: string;
  cover?: string | null;
};

export default function EventsAutoScroller({ events }: { events: EventCard[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  // 无尽滚动：复制一份
  const doubled = [...events, ...events];

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }],
      { duration: 22000, iterations: Infinity, easing: 'linear' }
    );
  }, []);

  return (
    <div className="relative overflow-hidden">
      <div ref={trackRef} className="flex w-[200%] gap-4">
        {doubled.map((ev, i) => (
          <Link
            href={`/events/${encodeURIComponent(ev.slug)}`}
            key={`${ev._id}-${i}`}
            className="group relative h-56 w-64 flex-none overflow-hidden rounded-2xl bg-neutral-900"
          >
            {ev.cover ? (
              <Image
                src={ev.cover}
                alt={ev.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="256px"
                priority={i < 4}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-900" />
            )}
            <div className="absolute inset-x-0 bottom-0 p-3 text-white">
              <div className="text-xs opacity-80">
                {ev.date ? new Date(ev.date).toLocaleDateString() : ''}
              </div>
              <div className="line-clamp-1 text-sm font-semibold">{ev.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
