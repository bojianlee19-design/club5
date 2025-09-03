// components/EventsAutoScroller.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export type EventItem = {
  id: string;
  slug: string;
  title: string;
  date?: string;
  cover?: string;
};

type Props = {
  events: EventItem[];
  /** 自动轮播间隔（秒） */
  durationSec?: number;
};

function formatDateEnglish(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  // 英文，固定 en-GB，再转大写：FRI 27 SEP
  const dow = d.toLocaleString('en-GB', { weekday: 'short' }); // Fri
  const day = d.toLocaleString('en-GB', { day: '2-digit' });   // 27
  const mon = d.toLocaleString('en-GB', { month: 'short' });   // Sep
  return `${dow} ${day} ${mon}`.toUpperCase();
}

export default function EventsAutoScroller({ events, durationSec = 6 }: Props) {
  // 过滤无 slug 的条目，避免点击失败
  const data = useMemo(
    () => (events || []).filter((e) => e.slug && e.slug.trim().length > 0),
    [events]
  );

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // 自动播放（悬停暂停）
  useEffect(() => {
    if (paused || data.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % data.length);
    }, durationSec * 1000);
    return () => clearInterval(t);
  }, [paused, data.length, durationSec]);

  // 手势滑动
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    const threshold = 30;
    if (Math.abs(delta) < threshold) return;
    if (delta < 0) next();
    else prev();
  }

  function prev() {
    setIndex((i) => (i - 1 + data.length) % data.length);
  }
  function next() {
    setIndex((i) => (i + 1) % data.length);
  }

  if (!data.length) return null;

  const ev = data[index];
  const cover = ev.cover || '/event-fallback.jpg'; // 兜底占位图（确保 /public 下有）

  return (
    <div className="relative mx-auto w-full max-w-7xl py-10">
      {/* 轮播主体：一次只显示一个竖版卡片，居中 */}
      <div
        className="flex items-center justify-center"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Link
          href={`/events/${ev.slug}`}
          className="group relative aspect-[2/3] w-[min(90vw,420px)] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10"
        >
          {/* 海报图（竖版） */}
          <Image
            src={cover}
            alt={ev.title || 'Event'}
            fill
            sizes="(max-width:768px) 90vw, 420px"
            className="object-cover"
            priority
          />
          {/* 顶部到中部的轻渐变，便于文字显示 */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/0" />

          {/* 左上角：日期（英文）与标题（你让左上角显示，日期在最左上，标题紧随其后靠上） */}
          <div className="absolute left-3 right-3 top-3 space-y-1">
            <div className="inline-block rounded bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow">
              {formatDateEnglish(ev.date)}
            </div>
            <h3 className="text-balance text-lg font-extrabold leading-tight text-white drop-shadow">
              {ev.title}
            </h3>
          </div>

          {/* 右下角：BUY TICKETS 按钮（点击到详情页） */}
          <div className="absolute bottom-3 right-3">
            <span className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-black transition group-hover:scale-[1.03]">
              Buy Tickets
            </span>
          </div>
        </Link>
      </div>

      {/* 左右切换按钮（桌面端显示） */}
      {data.length > 1 && (
        <>
          <button
            aria-label="Previous"
            onClick={prev}
            className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-2 backdrop-blur transition hover:bg-white/20 md:block"
          >
            ‹
          </button>
          <button
            aria-label="Next"
            onClick={next}
            className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-2 backdrop-blur transition hover:bg-white/20 md:block"
          >
            ›
          </button>
        </>
      )}

      {/* 指示点 */}
      {data.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {data.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full ${
                i === index ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
