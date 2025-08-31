import Image from 'next/image'
import Link from 'next/link'

export type EventItem = {
  id: string
  title: string
  date: string // ISO
  time?: string
  venue?: string
  description?: string
  lineup?: string[]
  coverUrl?: string
  ticketsUrl?: string
}

export default function EventCard({ e }: { e: EventItem }) {
  const date = new Date(e.date)
  const weekday = date.toLocaleDateString(undefined, { weekday: 'short' })
  const day = date.getDate()
  const month = date.toLocaleDateString(undefined, { month: 'short' })
  return (
    <div className="card overflow-hidden">
      {e.coverUrl && (
        <div className="relative h-56 w-full">
          <Image src={e.coverUrl} alt={e.title} fill className="object-cover" />
        </div>
      )}
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-3 text-white/80">
          <div className="text-center px-3 py-2 rounded-xl bg-white/5">
            <div className="text-xs">{weekday}</div>
            <div className="text-2xl font-bold">{day}</div>
            <div className="text-xs">{month}</div>
          </div>
          <div>
            <h3 className="text-xl font-semibold">{e.title}</h3>
            {e.venue && <div className="text-white/60 text-sm">{e.venue}</div>}
          </div>
        </div>
        {e.lineup && e.lineup.length > 0 && (
          <div className="text-white/70 text-sm">
            <span className="text-white/50">Lineup:</span> {e.lineup.join(' · ')}
          </div>
        )}
        <div className="flex gap-2">
          {e.ticketsUrl && <Link href={e.ticketsUrl} className="btn btn-primary">Get Tickets</Link>}
          <Link href={`/events/${e.id}`} className="btn btn-outline">Details</Link>
        </div>
      </div>
    </div>
  )
}
