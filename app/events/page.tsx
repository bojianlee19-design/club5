// app/events/page.tsx
import Link from 'next/link';
import { getUpcomingEvents } from '@/lib/sanity';
import EventGridCard from '@/components/EventGridCard';
import DateRangePicker from '@/components/DateRangePicker';

export const dynamic = 'force-dynamic';

type RangeKey = 'all' | 'week' | 'month' | 'dates';

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function parseIsoDate(s?: string) {
  if (!s) return undefined;
  // YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return undefined;
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams?: { range?: RangeKey; from?: string; to?: string };
}) {
  const range = (searchParams?.range || 'all') as RangeKey;
  const fromParam = searchParams?.from;
  const toParam = searchParams?.to;

  const all = await getUpcomingEvents(120); // 服务端取齐再按需过滤
  const now = new Date();

  // 周一为一周起点
  const weekStart = startOfDay(addDays(now, -((now.getDay() + 6) % 7)));
  const weekEnd = addDays(weekStart, 7);
  const monthStart = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
  const monthEnd = startOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 1));

  const fromDate = parseIsoDate(fromParam);
  const toDate = parseIsoDate(toParam);
  const toDateExclusive = toDate ? addDays(startOfDay(toDate), 1) : undefined;

  const inRange = (d?: string) => {
    if (!d) return false;
    const t = new Date(d).getTime();
    if (range === 'week') return t >= +weekStart && t < +weekEnd;
    if (range === 'month') return t >= +monthStart && t < +monthEnd;
    if (range === 'dates') {
      if (fromDate && toDateExclusive) return t >= +startOfDay(fromDate) && t < +toDateExclusive;
      if (fromDate) return t >= +startOfDay(fromDate);
      if (toDateExclusive) return t < +toDateExclusive;
      return true;
    }
    return true;
  };

  const events = range === 'all' ? all : all.filter((e) => inRange(e.date));

  const Tab = ({ label, value }: { label: string; value: RangeKey }) => {
    const active = range === value;
    return (
      <Link
        href={value === 'all' ? '/events' : `/events?range=${value}`}
        className={[
          'px-3 py-1 text-sm transition',
          active ? 'text-white' : 'text-white/60 hover:text-white',
        ].join(' ')}
      >
        {label}
      </Link>
    );
  };

  return (
    <main className="mx-auto max-w-7xl bg-black px-4 pb-24 pt-28 text-white">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-wide">WHAT&apos;S ON</h1>
      </div>

      {/* 顶部 Tabs */}
      <nav className="mb-4 flex gap-4 border-b border-white/10 pb-2">
        <Tab label="ALL" value="all" />
        <Tab label="THIS WEEK" value="week" />
        <Tab label="THIS MONTH" value="month" />
        <Tab label="SELECT DATES" value="dates" />
      </nav>

      {/* 选择日期：仅在 range=dates 时出现 */}
      {range === 'dates' && (
        <>
          <DateRangePicker initialFrom={fromParam} initialTo={toParam} />
          {(fromParam || toParam) && (
            <div className="mb-4 text-sm text-white/70">
              Showing events
              {fromParam ? ` from ${fromParam}` : ''}{toParam ? ` to ${toParam}` : ''}.
            </div>
          )}
        </>
      )}

      {/* 网格：手机 2 列，md 3 列，lg 4 列；卡片直角方形，文案在下 */}
      <section className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {events.map((e) => (
          <EventGridCard key={e.slug} slug={e.slug} title={e.title} date={e.date} cover={e.cover} />
        ))}
      </section>

      <div className="mt-16" />
    </main>
  );
}
