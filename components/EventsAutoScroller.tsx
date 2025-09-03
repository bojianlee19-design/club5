// components/EventsAutoScroller.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import EventCardWide, { EventCard } from './EventCardWide';

type Props = {
  events: EventCard[];
  durationSec?: number; // 自动滚动间隔，可选
};

export default function EventsAutoScroller({ events, durationSec = 4 }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [hover, setHover] = useState(false);

  // 自动滚动（悬停或触摸时暂停）
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const start = () => {
      stop();
      timerRef.current = setInterval(() => {
        el.scrollBy({ left: 320, behavior: 'smooth' });
        // 末尾回卷
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }, durationSec * 1000);
    };
    const stop = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };

    if (!hover) start();
    else stop();

    return () => stop();
  }, [hover, durationSec]);

  // 简单拖拽滑动（移动端）
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onDown = (e: MouseEvent | TouchEvent) => {
      isDown = true;
      startX = 'touches' in e ? e.touches[0].pageX : (e as MouseEvent).pageX;
      scrollLeft = el.scrollLeft;
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDown) return;
      const x = 'touches' in e ? e.touches[0].pageX : (e as MouseEvent).pageX;
      const walk = (x - startX) * 1;
      el.scrollLeft = scrollLeft - walk;
    };
    const onUp = () => (isDown = false);

    el.addEventListener('mousedown', onDown);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onUp);
    el.addEventListener('mouseup', onUp);

    el.addEventListener('touchstart', onDown, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: true });
    el.addEventListener('touchend', onUp);

    return () => {
      el.removeEventListener('mousedown', onDown);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onUp);
      el.removeEventListener('mouseup', onUp);
      el.removeEventListener('touchstart', onDown);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onUp);
    };
  }, []);

  const go = (dir: -1 | 1) => {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  if (!events?.length) return null;

  return (
    <div className="mx-auto my-10 flex max-w-6xl flex-col items-center">
      <div className="relative w-full">
        {/* 左右按钮 */}
        <button
          onClick={() => go(-1)}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 text-sm backdrop-blur hover:bg-black/80"
          aria-label="Prev"
        >
          ←
        </button>
        <button
          onClick={() => go(1)}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 text-sm backdrop-blur hover:bg-black/80"
          aria-label="Next"
        >
          →
        </button>

        {/* 横向滚动区 */}
        <div
          ref={scrollerRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-10 py-4"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onTouchStart={() => setHover(true)}
          onTouchEnd={() => setHover(false)}
        >
          {events.map((e) => (
            <EventCardWide key={e.id} {...e} />
          ))}
        </div>
      </div>
    </div>
  );
}
