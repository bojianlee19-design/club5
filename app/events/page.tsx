// app/events/page.tsx
import { getUpcomingEvents } from '@/lib/sanity';
import EventCardWide from '@/components/EventCardWide';

export default async function EventsPage() {
  const events = await getUpcomingEvents();

  return (
    <main className="mx-auto max-w-7xl bg-black px-4 pb-24 pt-28 text-white">
      <h1 className="mb-6 text-3xl font-extrabold tracking-wide">What’s On</h1>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {events.map((e) => (
          <EventCardWide key={e.id} {...e} />
        ))}
      </div>
    </main>
  );
}
