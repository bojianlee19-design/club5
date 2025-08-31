import EventCard, { type EventItem } from '@/components/EventCard'

async function fetchEvents(): Promise<EventItem[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/events`, { cache: 'no-store' })
  const data = await res.json()
  return data.events as EventItem[]
}

export default async function EventsSection({ limit = 3 }: { limit?: number }) {
  const events = (await fetchEvents()).slice(0, limit)
  if (events.length === 0) return null
  return (
    <section className="py-12">
      <div className="container-max space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Upcoming</h2>
            <p className="text-white/70">What’s on this weekend and beyond.</p>
          </div>
          <a className="nav-link" href="/events">All listings →</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(e => <EventCard key={e.id} e={e} />)}
        </div>
      </div>
    </section>
  )
}
