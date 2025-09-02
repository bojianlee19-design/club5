// app/events/page.tsx
import Link from 'next/link';
import EventCardWide from '@/components/EventCardWide';
import { getUpcomingEvents } from '@/lib/sanity';

// 事件页希望定期更新，不吃老缓存
export const revalidate = 60;

export default async function EventsPage() {
  // 直接从 Sanity 取，slug 已是 string、cover 已兜底为 string|undefined
  const events = await getUpcomingEvents(24);

  return (
    <main className="mx-auto max-w-7xl bg-black px-4 pb-20 pt-24 text-white">
      <header className="mb-8 flex items-end justify-between">
        <h1 className="text-3xl font-extrabold tracking-wide md:text-4xl">
          What’s On
        </h1>
        <Link
          href="/"
          className="text-sm underline underline-offset-4 opacity-80 hover:opacity-100"
        >
          ← Back to home
        </Link>
      </header>

      {events.length === 0 ? (
        <p className="opacity-70">No events yet. Check back soon.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {events.map((e) => (
            <EventCardWide
              key={e._id}
              slug={e.slug}               // e.slug 已是 string
              title={e.title}
              date={e.date}
              // 组件若把 cover 定义为可选，这里直接传；若定义为 string，就用 || '' 兜底
              cover={e.cover || undefined}
            />
          ))}
        </div>
      )}
    </main>
  );
}
