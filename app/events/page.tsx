// app/events/page.tsx
import Link from 'next/link'
import EventCardWide from '@/components/EventCardWide'
import { getUpcomingEvents } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

// 把任意形态的 slug 统一转成 string
function toSlug(val: unknown): string {
  if (!val) return ''
  if (typeof val === 'string') return val
  if (typeof val === 'object' && 'current' in (val as any)) {
    const cur = (val as any).current
    return typeof cur === 'string' ? cur : ''
  }
  return ''
}

// 把 cover 统一成 string | undefined
function toCover(val: unknown): string | undefined {
  return typeof val === 'string' && val.length > 0 ? val : undefined
}

type EventVM = {
  id: string
  slug: string
  title: string
  date?: string
  cover?: string
}

export default async function EventsPage() {
  const docs = await getUpcomingEvents()

  // 统一整理成前端需要的安全类型
  const events: EventVM[] = (docs || []).map((d: any) => ({
    id: d?._id ?? crypto.randomUUID(),
    slug: toSlug(d?.slug),
    title: typeof d?.title === 'string' ? d.title : '',
    date: typeof d?.date === 'string' ? d.date : undefined,
    cover: toCover(d?.cover),
  }))

  return (
    <main className="mx-auto max-w-7xl bg-black px-4 pb-20 pt-24 text-white">
      <header className="mb-8 flex items-end justify-between">
        <h1 className="text-3xl font-extrabold tracking-wide md:text-4xl">What’s On</h1>
        <Link
          href="/"
          className="rounded-full border border-white/30 px-4 py-2 text-sm opacity-80 hover:opacity-100"
        >
          ← Back home
        </Link>
      </header>

      {events.length === 0 ? (
        <p className="opacity-70">No events yet. Please add some in Studio.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {events.map((e) => (
            <EventCardWide
              key={e.id}
              slug={e.slug}                 // 已是 string
              title={e.title}
              date={e.date}
              cover={e.cover}              // string | undefined
            />
          ))}
        </div>
      )}
    </main>
  )
}
