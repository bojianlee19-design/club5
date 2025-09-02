// app/events/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { fetchEventBySlug } from '@/lib/sanity'
import { urlForImage } from '@/sanity/image'

export const dynamic = 'force-dynamic'

function ensureUrl(img: any): string | undefined {
  if (!img) return undefined
  if (img?.asset?.url) return img.asset.url
  if (img?.asset?._ref) return urlForImage(img).width(1600).url()
  return undefined
}

export default async function EventDetail({ params }: { params: { slug: string } }) {
  const ev = await fetchEventBySlug(params.slug)
  if (!ev) return notFound()

  const cover =
    ensureUrl(ev.cover) ||
    ensureUrl(ev.gallery?.[0])

  const title = ev.title ?? 'Untitled Event'
  const d = ev.date ? new Date(ev.date) : undefined
  const dateLine = d
    ? d.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''

  const ticketsHref = ev.ticketUrl || '/contact'

  return (
    <main className="bg-black text-white">
      {/* 头图 */}
      <section
        className="relative min-h-[56vh] border-b border-white/10"
        style={{
          background: cover ? `#000 url(${cover}) center/cover no-repeat` : '#000',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <Link href="/events" className="inline-block text-sm text-white/80 hover:text-white underline">
            ← Back to What’s On
          </Link>

          <h1 className="mt-6 text-3xl sm:text-5xl font-black tracking-tight max-w-3xl">{title}</h1>
          {dateLine ? <p className="mt-2 text-white/80">{dateLine}</p> : null}

          <div className="mt-6">
            <Link
              href={ticketsHref}
              className="inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-2 text-sm font-bold hover:bg-white/90 transition"
            >
              Get Tickets →
            </Link>
          </div>
        </div>
      </section>

      {/* 详情 */}
      <section className="max-w-6xl mx-auto px-4 py-10 sm:py-14 grid lg:grid-cols-3 gap-10">
        {/* 左：正文 */}
        <div className="lg:col-span-2">
          {ev.summary ? (
            <p className="text-lg text-white/85 leading-relaxed">{ev.summary}</p>
          ) : null}
          {Array.isArray(ev.body) ? (
            <div className="mt-6 space-y-3">
              {ev.body
                .filter((b: any) => b?._type === 'block' && Array.isArray(b.children))
                .map((b: any, i: number) => (
                  <p key={i} className="text-white/85 leading-relaxed">
                    {b.children.map((c: any) => c?.text).join('')}
                  </p>
                ))}
            </div>
          ) : null}
        </div>

        {/* 右：信息卡 */}
        <aside className="space-y-4">
          {ev.lineup?.length ? (
            <div className="rounded-2xl border border-white/10 p-4 bg-white/5">
              <div className="text-sm text-white/70 mb-2">Line-up</div>
              <div className="flex flex-wrap gap-2">
                {ev.lineup.map((name: string, i: number) => (
                  <span key={i} className="px-2.5 py-1 rounded-full border border-white/15 text-sm">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl border border-white/10 p-4 bg-white/5 space-y-2">
            {ev.venue ? <Row k="Venue" v={ev.venue} /> : null}
            {ev.doorsTime ? <Row k="Doors" v={ev.doorsTime} /> : null}
            {ev.endTime ? <Row k="Ends" v={ev.endTime} /> : null}
            {ev.ageRestriction ? <Row k="Age" v={ev.ageRestriction} /> : null}
            {ev.price ? <Row k="Price" v={ev.price} /> : null}
          </div>

          <div className="rounded-2xl border border-white/10 p-4 bg-white/5">
            <Link
              href={ticketsHref}
              className="inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-2 text-sm font-bold hover:bg-white/90 transition"
            >
              Get Tickets →
            </Link>
          </div>
        </aside>
      </section>
    </main>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="text-sm text-white/60">{k}</div>
      <div className="text-sm font-medium">{v}</div>
    </div>
  )
}
