// components/EventsAutoScroller.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import EventCardWide, { type EventCard } from './EventCardWide';

export default function EventsAutoScroller({
  events,
  intervalSec = 5,
}: {
  events: EventCard[];
  intervalSec?: number;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // 居中滚动到某一项
  const goTo = (i: number, behavior: ScrollBehavior = 'smooth') => {
    const el = listRef.current;
    if (!el) return;
    const items = Array.from(el.children) as HTMLElement[];
    const target = items[i];
    if (!target) return;

    const left =
      target.offsetLeft - (el.clientWidth - target.clientWidth) / 2;
    el.scrollTo({ left, behavior });
    setIndex(i);
  };

  // 自动轮播
  useEffect(() => {
    if (paused || events.length <= 1) return;
    const id = setInterval(() => {
      const next = (index + 1) % events.length;
      goTo(next);
    }, Math.max(2, intervalSec) * 1000);
    return () => clearInterval(id);
  }, [index, paused, events.length, intervalSec]);

  // 初次定位到第 0 张（无动画）
  useEffect(() => {
    goTo(0, 'auto');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPrev = () => goTo((index - 1 + events.length) % events.length);
  const onNext = () => goTo((index + 1) % events.length);

  if (!events?.length) return null;

  return (
    <div
      className="relative mx-auto w-full max-w-4xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* 轨道，只显示一个卡片宽度，居中 */}
      <ul
        ref={listRef}
        className="mx-auto flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth py-2 [scrollbar-width:none] [-ms-overflow-style:none]"
        style={{ scrollPaddingInline: '24px' }}
      >
        {events.map((e) => (
          <li
            key={e.id ?? e.slug}
            className="snap-center shrink-0"
            style={{ width: 'min(92vw, 720px)' }}
          >
            <EventCardWide {...e} />
          </li>
        ))}
      </ul>

      {/* 箭头 */}
      {events.length > 1 && (
        <>
          <button
            onClick={onPrev}
            aria-label="Previous"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur transition hover:bg-white/25"
          >
            ‹
          </button>
          <button
            onClick={onNext}
            aria-label="Next"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur transition hover:bg-white/25"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
