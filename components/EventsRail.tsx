// components/EventsRail.tsx
'use client';

import EventCardWide, { type EventCard } from './EventCardWide';

export default function EventsRail({ events }: { events: EventCard[] }) {
  if (!events?.length) return null;

  return (
    <div className="mx-auto max-w-7xl px-4">
      <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
        {events.map((e) => (
          <li
            key={e.id ?? (typeof e.slug === 'string' ? e.slug : (e.slug as any)?.current ?? Math.random().toString(36))}
            className="snap-start w-[85%] min-w-[280px] md:w-[520px]"
          >
            <EventCardWide
              id={e.id}
              slug={typeof e.slug === 'string' ? e.slug : (e.slug as any)?.current ?? ''}
              title={e.title ?? ''}
              date={e.date}
              cover={e.cover}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
