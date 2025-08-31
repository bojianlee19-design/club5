import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

async function getEvent(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/events`, { cache: 'no-store' })
  const { events } = await res.json()
  return events.find((e: any) => e.id === id)
}

export default async function EventDetail({ params }: { params: { id: string }}) {
  const e = await getEvent(params.id)
  if (!e) notFound()
  return (
    <div className="container-max py-10 grid md:grid-cols-2 gap-8">
      <div className="card overflow-hidden">
        {e.coverUrl && <div className="relative w-full h-80"><Image src={e.coverUrl} alt={e.title} fill className="object-cover" /></div>}
        <div className="p-6 space-y-4">
          <h1 className="text-3xl font-semibold">{e.title}</h1>
          <div className="text-white/70">{new Date(e.date).toLocaleString()}</div>
          {e.venue && <div className="text-white/70">{e.venue}</div>}
          {e.lineup && <div className="text-white/70">Lineup: {e.lineup.join(' · ')}</div>}
          {e.description && <p className="text-white/80 whitespace-pre-line">{e.description}</p>}
          {e.ticketsUrl && <Link className="btn btn-primary" href={e.ticketsUrl}>Get Tickets</Link>}
        </div>
      </div>
      <div className="space-y-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-2">Know before you go</h2>
          <ul className="list-disc list-inside text-white/70 space-y-1">
            <li>Last entry may vary by night.</li>
            <li>Please bring a valid photo ID.</li>
            <li>Management reserves the right of admission.</li>
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-2">Share</h2>
          <div className="flex gap-2">
            <a className="btn btn-outline" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(e.title)}&url=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL + '/events/' + e.id)}`}>Twitter</a>
            <a className="btn btn-outline" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL + '/events/' + e.id)}`}>Facebook</a>
          </div>
        </div>
      </div>
    </div>
  )
}
