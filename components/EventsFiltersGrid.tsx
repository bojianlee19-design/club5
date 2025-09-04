// components/EventsFiltersGrid.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import type { EventItem } from '@/lib/sanity';

/* ---------- utils ---------- */
function formatEN(d: Date) {
  // Thu, 18 Sept 2025
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
function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/* ---------- lightweight calendar popover ---------- */
function Calendar({
  value,
  onChange,
  onClear,
  onClose,
}: {
  value?: Date | null;
  onChange: (d: Date) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const today = new Date();
  const [view, setView] = React.useState<Date>(value ? new Date(value) : today);
  const ref = React.useRef<HTMLDivElement | null>(null);

  // close on outside click
  React.useEffect(() => {
    function onDoc(e: MouseEvent | TouchEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('touchstart', onDoc, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('touchstart', onDoc);
    };
  }, [onClose]);

  const year = view.getFullYear();
  const month = view.getMonth(); // 0..11
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7; // Mon=0
  const firstCell = new Date(first);
  firstCell.setDate(first.getDate() - startOffset);

  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(firstCell);
    d.setDate(firstCell.getDate() + i);
    cells.push(d);
  }

  const weekNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div
      ref={ref}
      className="absolute z-30 mt-2 w-72 rounded-xl border border-white/15 bg-black/80 p-3 text-white shadow-xl backdrop-blur"
    >
      <div className="mb-2 flex items-center justify-between">
        <button
          aria-label="Previous month"
          className="rounded-lg px-2 py-1 ring-1 ring-white/15 hover:bg-white/10"
          onClick={() => setView(new Date(year, month - 1, 1))}
        >
          ‹
        </button>
        <div className="text-sm font-semibold">
          {first.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
        </div>
        <button
          aria-label="Next month"
          className="rounded-lg px-2 py-1 ring-1 ring-white/15 hover:bg-white/10"
          onClick={() => setView(new Date(year, month + 1, 1))}
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs opacity-70">
        {weekNames.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d) => {
          const isCurrMonth = d.getMonth() === month;
          const isSelected = value ? sameDay(d, value) : false;
          const isToday = sameDay(d, today);
          return (
            <button
              key={toISODate(d) + String(isCurrMonth)}
              onClick={() => {
                onChange(d);
                onClose();
              }}
              className={[
                'h-9 w-9 rounded-md text-sm',
                isCurrMonth ? 'text-white' : 'text-white/35',
                isSelected ? 'bg-white text-black' : isToday ? 'ring-1 ring-white/40' : 'hover:bg-white/10',
              ].join(' ')}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={() => {
            onClear();
            onClose();
          }}
          className="rounded-md px-2 py-1 text-xs opacity-70 ring-1 ring-white/15 hover:bg-white/10"
        >
          Clear
        </button>
        <button
          onClick={onClose}
          className="rounded-md px-2 py-1 text-xs opacity-70 ring-1 ring-white/15 hover:bg-white/10"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* ---------- main component ---------- */
export default function EventsFiltersGrid({ initialEvents }: { initialEvents: EventItem[] }) {
  const [tab, setTab] = React.useState<'all' | 'week' | 'month' | 'date'>('all');
  const [pickedISO, setPickedISO] = React.useState<string>(''); // yyyy-mm-dd
  const pickedDate = React.useMemo(() => (pickedISO ? new Date(pickedISO) : null), [pickedISO]);

  const [open, setOpen] = React.useState(false); // calendar popover open

  // 切换到其它 tab 时清空日期并隐藏显示
  const changeTab = (t: 'all' | 'week' | 'month' | 'date') => {
    setTab(t);
    if (t !== 'date') {
      setPickedISO('');
      setOpen(false);
    }
  };

  const filtered = React.useMemo(() => {
    if (tab === 'all') return initialEvents;
    if (tab === 'week') return initialEvents.filter((e) => (e.date ? inThisWeek(new Date(e.date)) : false));
    if (tab === 'month') return initialEvents.filter((e) => (e.date ? inThisMonth(new Date(e.date)) : false));
    if (pickedDate) return initialEvents.filter((e) => (e.date ? sameDay(new Date(e.date), pickedDate) : false));
    return initialEvents;
  }, [initialEvents, tab, pickedDate]);

  const tabs = [
    { key: 'all', label: 'ALL' },
    { key: 'week', label: 'THIS WEEK' },
    { key: 'month', label: 'THIS MONTH' },
  ] as const;

  return (
    <>
      {/* Tabs + Select Dates（自定义英文日历） */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex flex-wrap gap-x-4 gap-y-2 md:gap-x-8">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => changeTab(t.key)}
              className={[
                'text-[12px] sm:text-sm md:text-base tracking-wide no-underline',
                'transition-opacity',
                tab === t.key ? 'opacity-100' : 'opacity-60 hover:opacity-80',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}

          {/* SELECT DATES + 显示英文日期，仅在 tab==='date' 时显示 */}
          <div className="relative">
            <button
              onClick={() => {
                setOpen((v) => !v);
                changeTab('date');
              }}
              className={[
                'rounded-xl border border-white/15 bg-white/5 px-3 py-1 text-[12px] sm:text-sm',
                'backdrop-blur transition-colors hover:bg-white/10',
              ].join(' ')}
              aria-expanded={open}
            >
              SELECT DATES
              {tab === 'date' && pickedDate ? (
                <span className="ml-2 opacity-80">{formatEN(pickedDate)}</span>
              ) : null}
            </button>

            {open ? (
              <Calendar
                value={pickedDate}
                onChange={(d) => {
                  setPickedISO(toISODate(d));
                  setTab('date');
                }}
                onClear={() => setPickedISO('')}
                onClose={() => setOpen(false)}
              />
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
