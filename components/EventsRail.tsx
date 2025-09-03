// components/EventsRail.tsx
'use client';

import Link from 'next/link';
import { useRef } from 'react';
import EventCardWide from './EventCardWide';

type Item = { id?: string; slug: string; title: string; date?: string; cover?: string };

export default function EventsRail({ events }: { events: Item[] }) {
  const listRef = useRef<HTMLUListElement>(null);

  const scrollByCard = (dir: number) => {
    const el = listRef.current;
    if (!el) return;
    const card = el.querySelector('li') as HTMLLIElement | null;
    const step = card ? card.clientWidth + 24 : 360; // 每次滚动一个卡片宽度
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {/* 左右按钮（桌面端显示） */}
      <button
        onClick={() => scrollByCard(-1)}
        aria-label="Prev"
        className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/15 p-2 text-white ring-1 ring-white/20 backdrop-blur hover:bg-white/25 md:block"
      >
        ←
      </button>
      <button
        onClick={() => scrollByCard(1)}
        aria-label="Next"
        className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/15 p-2 text-white ring-1 ring-white/20 backdrop-blur hover:bg-white/25 md:block"
      >
        →
      </button>

      <ul
        ref={listRef}
        className="
          mx-auto flex w-full gap-6 overflow-x-auto px-2 pb-2
          [scroll-snap-type:x_proximity] snap-x
          [-webkit-overflow-scrolling:touch] touch-pan-x overscroll-x-contain scroll-smooth
        "
      >
        {events.map((e) => (
          <li
            key={e.slug}
            className="snap-center w-[86vw] min-w-[280px] max-w-[420px] sm:w-[420px] md:w-[520px] mx-auto"
          >
            <Link href={`/events/${e.slug}`} className="block">
              {/* 这里补上 id（用 slug 兜底保证有值） */}
              <EventCardWide
                id={e.id ?? e.slug}
                slug={e.slug}
                title={e.title}
                date={e.date}
                cover={e.cover ?? undefined}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
