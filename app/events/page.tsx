import { getUpcomingEvents } from '@/lib/sanity';
import EventCardWide from '@/components/EventCardWide';

export default async function EventsPage() {
  const events = await getUpcomingEvents(24);

  return (
    <main className="mx-auto max-w-7xl bg-black px-4 pb-20 pt-24 text-white">
      <h1 className="mb-6 text-3xl font-extrabold tracking-wide md:text-4xl">What’s On</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {events.map((e) => (
          <EventCardWide key={e._id} slug={e.slug} title={e.title} date={e.date} cover={e.cover ?? undefined} />
        ))}
      </div>
    </main>
  );
}
