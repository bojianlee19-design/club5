// app/events/page.tsx
import TopNav from '@/components/TopNav';
import { getUpcomingEvents, type EventItem } from '@/lib/sanity';
import EventsFiltersGrid from '@/components/EventsFiltersGrid';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const events: EventItem[] = await getUpcomingEvents(64);

  return (
    <main className="mx-auto max-w-7xl bg-black px-4 pb-24 pt-24 text-white">
      <TopNav />
      <h1 className="mt-6 text-3xl font-extrabold tracking-wide md:text-4xl">
        WHAT&apos;S ON
      </h1>

      <EventsFiltersGrid initialEvents={events} />
    </main>
  );
}
