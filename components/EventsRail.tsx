'use client';

import * as React from 'react';
import EventCardWide, { EventCard } from './EventCardWide';

type Props = {
  title?: string;
  events: EventCard[];
};

export default function EventsRail({ title = "What's On", events }: Props) {
  const listRef = React.useRef<HTMLUListElement>(null);

  const scrollBy = (dir: 'left' | 'right') => {
    const el = listRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.9;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (!events || events.length === 0) return null;

  return (
    <section className="mx-auto mt-10 w-full max-w-7xl px-4 text-white">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-wide md:text-2xl">{title}</h2>
        <div className="hidden gap-2 md:flex">
          <button
            onClick={() => scrollBy('left')}
            className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm hover:bg-white/15"
            aria-label="Scroll left"
          >
            ‹
          </button>
          <button
            onClick={() => scrollBy('right')}
            className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm hover:bg-white/15"
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
      </div>

      <ul
        ref={listRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none]
                   [&::-webkit-scrollbar]:hidden"
      >
        {events.map((e) => (
          <li key={e.slug} className="snap-start w-[85%] min-w-[280px] md:w-[520px]">
            <EventCardWide slug={e.slug} title={e.title} date={e.date ?? undefined} cover={e.cover ?? undefined} />
          </li>
        ))}
      </ul>
    </section>
  );
}
