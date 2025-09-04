// app/events/page.tsx
import TopNav from '@/components/TopNav';
import Link from 'next/link';
import Image from 'next/image';
import { getUpcomingEvents, type EventItem } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const events = await getUpcomingEvents(64);
  return (
    <main className="mx-auto max-w-7xl bg-black px-4 pb-24 pt-24 text-white">
      <TopNav />
      <h1 className="mt-6 text-3xl font-extrabold tracking-wide md:text-4xl">
        WHAT&apos;S ON
      </h1>
      <FiltersAndGrid initialEvents={events} />
    </main>
  );
}

/* -------------------- Client part: filters + grid -------------------- */
function formatEN(d: Date) {
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function inThisWeek(d: Date) {
  const now = new Date();
  const start = new Date(now);
  // start from Monday like MOS
  const day = (now.getDay() + 6) % 7; // 0..6 with Monday=0
  start.setDate(now.getDate() - day);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return d >= start && d < end;
}

function inThisMonth(d: Date) {
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

function FiltersAndGrid({ initialEvents }: { initialEvents: EventItem[] }) {
  'use client';

  const [tab, setTab] = React.useState<'all' | 'week' | 'month' | 'date'>('all');
  const [picked, setPicked] = React.useState<string>(''); // yyyy-mm-dd from <input type="date">
  const dateObj = React.useMemo(() => (picked ? new Date(picked) : null), [picked]);

  const filtered = React.useMemo(() => {
    if (tab === 'all') return initialEvents;
    if (tab === 'week') {
      return initialEvents.filter((e) => (e.date ? inThisWeek(new Date(e.date)) : false));
    }
    if (tab === 'month') {
      return initialEvents.filter((e) => (e.date ? inThisMonth(new Date(e.date)) : false));
    }
    // date tab
    if (dateObj) {
      return initialEvents.filter((e) =>
        e.date ? sameDay(new Date(e.date), dateObj) : false
      );
    }
    return initialEvents;
  }, [initialEvents, tab, dateObj]);

  const tabs = [
    { key: 'all', label: 'ALL' },
    { key: 'week', label: 'THIS WEEK' },
    { key: 'month', label: 'THIS MONTH' },
  ] as const;

  return (
    <>
      {/* Tabs row */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex flex-wrap gap-x-4 gap-y-2 md:gap-x-8">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={[
                // 移动端更小字号，去掉下划线
                'text-[12px] xs:text-[13px] md:text-base tracking-wide no-underline',
                'transition-opacity',
                tab === t.key ? 'opacity-100' : 'opacity-60 hover:opacity-80',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}

          {/* Select Dates */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab('date')}
              className={[
                'text-[12px] xs:text-[13px] md:text-base tracking-wide no-underline',
                tab === 'date' ? 'opacity-100' : 'opacity-60 hover:opacity-80',
              ].join(' ')}
              aria-pressed={tab === 'date'}
            >
              SELECT DATES
            </button>

            {/* 原生 date 输入：设定 lang=en-GB；实际选中后旁边文本按英文格式显示 */}
            <input
              type="date"
              lang="en-GB"
              value={picked}
              onChange={(e) => {
                setPicked(e.currentTarget.value);
                setTab('date');
              }}
              className="rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-[12px] xs:text-[13px] md:text-sm outline-none ring-0 backdrop-blur placeholder-white/40"
              placeholder="Select date"
            />
            {dateObj ? (
              <span className="text-[12px] xs:text-[13px] md:text-sm opacity-80">
                {formatEN(dateObj)}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((e) => (
          <article key={e.slug}>
            <Link href={`/events/${e.slug}`} className="group block">
              <div className="relative aspect-square overflow-hidden">
                {/* 用 <img> 防止远程域名受限；保持现有行为 */}
                <img
                  src={e.cover || '/placeholder.jpg'}
                  alt={e.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>

              {/* 文本移到图片下方左侧，英文日期格式 */}
              <div className="mt-3 space-y-1">
                <h3 className="line-clamp-2 text-[14px] font-semibold leading-snug md:text-[15px]">
                  {e.title}
                </h3>
                <p className="text-[12px] md:text-[13px] opacity-70">
                  {e.date ? formatEN(new Date(e.date)) : ''}
                </p>
                <span className="inline-block rounded-full border border-white/20 px-3 py-1 text-[12px] opacity-80 transition-colors hover:border-white/40">
                  BUY TICKETS
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}

/* Because this file contains a client component above */
import * as React from 'react';
