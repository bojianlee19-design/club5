'use client';

import Link from 'next/link';
import Image from 'next/image';
import * as React from 'react';

type EventItem = {
  slug: string;
  title: string;
  date?: string | null;
  cover?: string | null;
};

type Props = {
  events: EventItem[];
  /** 整个轨道滚动一圈所需时长（秒）。数值越小滚得越快 */
  durationSec?: number;
  /** 卡片宽度（Tailwind 值），保证所有卡片一致，滚动更平滑 */
  cardWidthClass?: string;
};

export default function EventsAutoScroller({
  events,
  durationSec = 28,
  cardWidthClass = 'w-[280px] md:w-[360px]',
}: Props) {
  // 为空直接不渲染
  if (!events || events.length === 0) return null;

  // 复制一份用于无缝衔接
  const loop = React.useMemo(() => [...events, ...events], [events]);

  return (
    <section aria-label="Upcoming events" className="relative mx-auto mt-8 w-full overflow-hidden">
      {/* 轨道：用自定义动画横向滚动；group 用于 hover 暂停 */}
      <div
        className="group relative w-full"
        // 渐隐两侧，视觉更顺滑
      >
        {/* 渐隐遮罩（可选） */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-black to-transparent" />

        <ul
          className="flex w-[200%] items-stretch gap-4 whitespace-nowrap will-change-transform
                     [animation:hc-marquee_linear_infinite] group-hover:[animation-play-state:paused]"
          style={
            {
              // @ts-expect-error Tailwind 任意属性：把时长注入到 animation-duration
              '--hc-marquee-duration': `${durationSec}s`,
            } as React.CSSProperties
          }
        >
          {loop.map((ev, idx) => (
            <li
              key={`${ev.slug}-${idx}`}
              className={`${cardWidthClass} shrink-0`}
            >
              <EventCard item={ev} />
            </li>
          ))}
        </ul>
      </div>

      {/* 本组件自带的关键帧样式（仅当前页面注入一次） */}
      <style jsx>{`
        @keyframes hc-marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        :global([animation\\:hc-marquee_linear_infinite]) {
          animation-name: hc-marquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-duration: var(--hc-marquee-duration, 28s);
        }
      `}</style>
    </section>
  );
}

function EventCard({ item }: { item: EventItem }) {
  const href = `/events/${item.slug}`;
  const dateText =
    item.date ? new Date(item.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : '';

  return (
    <Link
      href={href}
      className="block overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-transform hover:-translate-y-0.5 hover:border-white/20"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {item.cover ? (
          <Image
            src={item.cover}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 280px, 360px"
            priority={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-800">
            <span className="text-sm text-white/70">No cover</span>
          </div>
        )}
        {/* 底部信息条 */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-black/0 p-3">
          {dateText && <div className="text-xs opacity-80">{dateText}</div>}
          <div className="truncate text-sm font-semibold">{item.title}</div>
        </div>
      </div>
    </Link>
  );
}
