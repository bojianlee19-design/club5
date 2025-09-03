// app/events/page.tsx
import Link from 'next/link'
import { getUpcomingEvents } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const events = await getUpcomingEvents(48)

  return (
    <main className="mx-auto max-w-7xl bg-black px-4 pb-20 pt-24 text-white">
      <h1 className="text-3xl font-extrabold tracking-wide">What’s On</h1>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => (
          <Link
            key={e._id}
            href={`/events/${typeof e.slug === 'string' ? e.slug : e.slug?.current ?? ''}`}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5"
          >
            {e.cover ? (
              <img
                src={e.cover}
                alt={e.title ?? 'Event'}
                className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="aspect-[4/3] w-full bg-white/5" />
            )}

            <div className="p-4">
              <div className="text-sm opacity-70">
                {e.date ? new Date(e.date).toLocaleDateString() : ''}
              </div>
              <div className="mt-1 line-clamp-2 text-lg font-semibold">
                {e.title ?? 'Untitled'}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
