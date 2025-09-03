// app/events/page.tsx
import Link from 'next/link'
import { getUpcomingEvents } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const rows: any[] = await getUpcomingEvents()

  const events = (rows || []).map((d) => {
    const slug =
      typeof d?.slug === 'string' ? d.slug : d?.slug?.current ?? String(d?._id ?? '')
    const cover =
      d?.cover ||
      d?.image?.asset?.url || d?.image?.url || d?.image ||
      d?.mainImage?.asset?.url || d?.mainImage?.url || d?.mainImage ||
      d?.gallery?.[0]?.asset?.url || d?.gallery?.[0]?.url ||
      ''

    return {
      id: String(d?._id ?? slug),
      slug,
      title: d?.title ?? '',
      date: d?.date,
      cover,
    }
  })

  return (
    <main className="mx-auto max-w-7xl bg-black px-4 pb-20 pt-24 text-white">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-wide md:text-4xl">What’s On</h1>
        <Link href="/" className="opacity-80 hover:opacity-100">← Back home</Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {events.map((e) => (
          <Link
            href={`/events/${e.slug}`}
            key={e.id}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              {e.cover ? (
                <img src={e.cover} alt={e.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="flex h-full w-full items-center justify-center opacity-60">No cover</div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="text-lg font-semibold">{e.title}</div>
                <div className="text-sm opacity-80">
                  {e.date ? new Date(e.date).toLocaleString() : ''}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
