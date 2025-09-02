// app/events/page.tsx
import EventCardWide from '@/components/EventCardWide';
import { getUpcomingEvents } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  // 取未来活动，最多 24 条（lib/sanity.ts 已支持可选 limit）
  const events = await getUpcomingEvents(24);

  return (
    <main className="mx-auto max-w-7xl bg-black px-4 pb-20 pt-24 text-white">
      <h1 className="mb-6 text-4xl font-extrabold">What’s On</h1>
      <p className="mb-8 text-neutral-300">Upcoming events, line-ups and tickets.</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map(ev => (
          <EventCardWide key={ev._id} ev={ev} />
        ))}
      </div>
    </main>
  );
}
