// components/EventsAutoScroller.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { EventDoc } from '@/lib/sanity';

/**
 * 连续自动横向滚动（marquee 风格）：
 * - 接受 Sanity 的 EventDoc[]
 * - 自动做无限循环（把列表复制一份拼接）
 * - 悬停时暂停
 */
export default function EventsAutoScroller({
  events,
  speed = 60, // px / 秒
}: {
  events: EventDoc[];
  speed?: number;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);
  const [offset, setOffset] = useState(0);

  // 没有活动直接隐藏
  const list = useMemo(() => (events?.length ? [...events, ...events] : []), [events]);

  useEffect(() => {
    if (!trackRef.current || list.length === 0) return;

    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      setOffset((prev) => {
        const track = trackRef.current!;
        // 一轮的宽度（只取前半段的宽度做 wrap）
        const halfWidth = Math.max(1, Math.floor(track.scrollWidth / 2));
        if (paused) return prev; // 悬停暂停
        let next = prev - speed * dt;
        // wrap：向左移动到超过半段宽度后，从 0 重新开始
        if (Math.abs(next) >= halfWidth) {
          next += halfWidth;
        }
        return next;
      });

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [list.length, speed, paused]);

  if (!events || events.length === 0) return null;

  return (
    <div
      className="relative w-full select-none overflow-hidden py-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* 渐隐边缘遮罩，视觉更柔和 */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent" />

      <div
        ref={trackRef}
        className="flex will-change-transform"
        style={{ transform: `translateX(${offset}px)` }}
      >
        {list.map((ev, idx) => {
          const href = ev.slug?.current ? `/events/${encodeURIComponent(ev.slug.current)}` : '/events';
          const dateStr = ev.date
            ? new Date(ev.date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : '';
          const cover = ev.coverUrl || ev.cover;

          return (
            <Link
              href={href}
              key={`${ev._id}-${idx}`}
              className="mr-4 w-[320px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 hover:border-white/20"
            >
              <div className="relative aspect-[16/9] w-full">
                {cover ? (
                  <Image
                    src={cover}
                    alt={ev.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="320px"
                    priority={false}
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center bg-zinc-800 text-neutral-400">
                    No image
                  </div>
                )}
              </div>
              <div className="space-y-1 p-3">
                <div className="text-xs text-neutral-300">{dateStr}</div>
                <div className="line-clamp-2 text-sm font-semibold text-white">{ev.title}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
