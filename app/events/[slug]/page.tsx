// app/events/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { fetchEventBySlug } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

type Ev = {
  _id: string
  title?: string
  date?: string
  slug?: { current?: string } | string
  summary?: string
  cover?: any
  image?: any
  poster?: any
  images?: any[]
  gallery?: any[]
  body?: any
  ticketUrl?: string
}

function ensureUrl(img: any): string | undefined {
  if (!img) return undefined
  if (typeof img === 'string') return img
  if (img?.asset?.url) return img.asset.url
  if (img?.asset?._ref && (global as any).__urlForImage) {
    return (global as any).__urlForImage(img).width(1600).url()
  }
  return undefined
}

function pickCover(ev: Ev): string | undefined {
  const c = [
    ensureUrl(ev.cover),
    ensureUrl(ev.image),
    ensureUrl(ev.poster),
    ensureUrl(ev.images?.[0]),
    ensureUrl(ev.gallery?.[0]),
  ].filter(Boolean) as string[]
  return c[0]
}

function PlainBody({ body }: { body?: any }) {
  // 免依赖渲染：只把 block 的 children 拼成段落
  if (!Array.isArray(body)) return null
  const paras = body
    .filter((b) => b?._type === 'block' && Array.isArray(b.children))
    .map((b, i) => (
      <p key={i} className="text-white/85 leading-relaxed mb-3">
        {b.children.map((c: any) => c?.text).join('')}
      </p>
    ))
  return <div>{paras}</div>
}

export default async function EventDetail({ params }: { params: { slug: string } }) {
  const ev: Ev | null = await fetchEventBySlug(params.slug)
  if (!ev) return notFound()

  const cover = pickCover(ev)
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

  const ticketsHref = ev.ticketUrl || '/contact' // 你未来可在 Sanity 里加 ticketUrl 字段

  return (
    <main className="bg-black text-white">
      {/* 头图区 */}
      <section
        className="relative min-h-[56vh] border-b border-white/10"
        style={{
          background:
            cover ? `#000 url(${cover}) center/cover no-repeat` : '#000',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <Link
            href="/events"
            className="inline-block text-sm text-white/80 hover:text-white underline"
          >
            ← Back to What’s On
          </Link>

          <h1 className="mt-6 text-3xl sm:text-5xl font-black tracking-tight max-w-3xl">
            {title}
          </h1>
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

      {/* 正文 */}
      <section className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
        {ev.summary ? (
          <p className="text-lg text-white/85 leading-relaxed">{ev.summary}</p>
        ) : null}
        <div className="mt-6">
          <PlainBody body={ev.body} />
        </div>
      </section>

      {/* 简易“更多活动” */}
      <section className="border-t border-white/10 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              More Events
            </h2>
            <Link href="/events" className="text-sm underline hover:no-underline">
              View all
            </Link>
          </div>
          <div className="text-white/70">
            Explore more on the <Link href="/events" className="underline">What’s On</Link> page.
          </div>
        </div>
      </section>
    </main>
  )
}
