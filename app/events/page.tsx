// app/events/page.tsx
import Link from 'next/link'
import { getUpcomingEvents } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const docs = await getUpcomingEvents(24)

  return (
    <main className="mx-auto max-w-7xl bg-black px-3 pb-20 pt-28 text-white">
      <h1 className="mb-6 text-3xl font-extrabold tracking-wide">What’s On</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(docs ?? []).map((d: any, i: number) => {
          const slug = typeof d.slug === 'string' ? d.slug : d.slug?.current ?? ''
          const cover = d.cover ?? d.image ?? d.mainImage ?? ''
          const dateStr = d.date ? new Date(d.date).toLocaleDateString() : ''
          return (
            <Link key={d._id ?? i} href={`/events/${encodeURIComponent(slug)}`} className="group overflow-hidden rounded-2xl ring-1 ring-white/10">
              {cover ? (
                <img src={cover} alt={d.title ?? ''} className="h-56 w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
              ) : (
                <div className="flex h-56 w-full items-center justify-center bg-neutral-800">No cover</div>
              )}
              <div className="p-4">
                <div className="text-xs uppercase tracking-wide opacity-75">{dateStr}</div>
                <div className="mt-1 line-clamp-2 text-base font-bold">{d.title ?? ''}</div>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
