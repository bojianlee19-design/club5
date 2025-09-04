// components/EventsFiltersGrid.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import type { EventItem } from '@/lib/sanity';

/* ---------- utils ---------- */
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
  const day = (now.getDay() + 6) % 7; // Monday=0
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

/* ---------- component ---------- */
export default function EventsFiltersGrid({ initialEvents }: { initialEvents: EventItem[] }) {
  const [tab, setTab] = React.useState<'all' | 'week' | 'month' | 'date'>('all');
  const [picked, setPicked] = React.useState<string>(''); // yyyy-mm-dd
  const dateObj = React.useMemo(() => (picked ? new Date(picked) : null), [picked]);

  const filtered = React.useMemo(() => {
    if (tab === 'all') return initialEvents;
    if (tab === 'week') return initialEvents.filter(e => (e.date ? inThisWeek(new Date(e.date)) : false));
    if (tab === 'month') return initialEvents.filter(e => (e.date ? inThisMonth(new Date(e.date)) : false));
    if (dateObj) return initialEvents.filter(e => (e.date ? sameDay(new Date(e.date), dateObj) : false));
    return initialEvents;
  }, [initialEvents, tab, dateObj]);

  const tabs = [
    { key: 'all', label: 'ALL' },
    { key: 'week', label: 'THIS WEEK' },
    { key: 'month', label: 'THIS MONTH' },
  ] as const;

  return (
    <>
      {/* Tabs */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex flex-wrap gap-x-4 gap-y-2 md:gap-x-8">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={[
                'text-[12px] sm:text-sm md:text-base tracking-wide no-underline',
                'transition-opacity',
                tab === t.key ? 'opacity-100' : 'opacity-60 hover:opacity-80',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}

          {/* Select Dates + 原生日期控件（展示始终英文） */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab('date')}
              className={[
                'text-[12px] sm:text-sm md:text-base tracking-wide no-underline',
                tab === 'date' ? 'opacity-100' : 'opacity-60 hover:opacity-80',
              ].join(' ')}
              aria-pressed={tab === 'date'}
            >
              SELECT DATES
            </button>

            <input
              type="date"
              lang="en-GB"
              value={picked}
              onChange={(e) => {
                setPicked(e.currentTarget.value);
                setTab('date');
              }}
              className="rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-[12px] sm:text-sm outline-none backdrop-blur placeholder-white/40"
              placeholder="Select date"
            />
            {dateObj ? (
              <span className="text-[12px] sm:text-sm opacity-80">{formatEN(dateObj)}</span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Grid：移动端两列，卡片直角、正方形图，文字在下方左侧 */}
      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((e) => (
          <article key={e.slug}>
            <Link href={`/events/${e.slug}`} className="group block">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={e.cover || '/placeholder.jpg'}
                  alt={e.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
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
