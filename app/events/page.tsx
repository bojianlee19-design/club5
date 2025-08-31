import EventCard, { type EventItem } from '@/components/EventCard'

async function fetchEvents(): Promise<EventItem[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/events`, { cache: 'no-store' })
  const data = await res.json()
  return data.events as EventItem[]
}

export default async function EventsPage() {
  const events = await fetchEvents()
  return (
    <div className="container-max py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Events</h1>
        <p className="text-white/70">All listings.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(e => <EventCard key={e.id} e={e} />)}
      </div>
    </div>
  )
}
