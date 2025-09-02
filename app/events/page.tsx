// app/events/page.tsx
import Link from 'next/link'
import { fetchEvents } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

type SanityEvent = {
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
}

function ensureUrl(img: any): string | undefined {
  if (!img) return undefined
  if (typeof img === 'string') return img
  if (img?.asset?.url) return img.asset.url
  if (img?.asset?._ref && (global as any).__urlForImage) {
    return (global as any).__urlForImage(img).width(1200).url()
  }
  return undefined
}

function pickCover(ev: SanityEvent): string | undefined {
  const c = [
    ensureUrl(ev.cover),
    ensureUrl(ev.image),
    ensureUrl(ev.poster),
    ensureUrl(ev.images?.[0]),
    ensureUrl(ev.gallery?.[0]),
  ].filter(Boolean) as string[]
  return c[0]
}

function fmtBadge(d?: string) {
  if (!d) return ''
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return ''
  const day = dt.toLocaleDateString('en-GB', { day: '2-digit' })
  const mon = dt.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()
  return `${day} ${mon}`
}

export default async function EventsPage() {
  // 拉数据（你之前已实现 fetchEvents）
  const rows = (await fetchEvents(60)) as SanityEvent[]
  const now = new Date()

  // 仅显示未来/今天的活动，按时间升序（无日期的放最后）
  const events = [...rows]
    .sort((a, b) => {
      const ta = a.date ? new Date(a.date).getTime() : Infinity
      const tb = b.date ? new Date(b.date).getTime() : Infinity
      return ta - tb
    })
    .filter((e) => {
      if (!e.date) return true
      const t = new Date(e.date).getTime()
      // 同一天也算即将举行
      return t >= new Date(now.toDateString()).getTime()
    })

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-7xl mx-auto px-4 pt-10 pb-6">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">WHAT’S ON</h1>
        <p className="text-white/70 mt-2">Info & Tickets</p>
      </section>

      {events.length === 0 ? (
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <div className="rounded-2xl border border-white/10 p-10 text-center text-white/70">
            New events coming soon. Stay tuned.
          </div>
        </section>
      ) : (
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((ev) => {
              const title = ev.title ?? 'Untitled Event'
              const cover = pickCover(ev)
              const slug =
                typeof ev.slug === 'string' ? ev.slug : ev.slug?.current ?? ev._id
              const date = ev.date ? new Date(ev.date) : undefined
              const dateLine = date
                ? date.toLocaleDateString('en-GB', {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'short',
                  })
                : ''

              return (
                <Link
                  key={ev._id}
                  href={`/events/${encodeURIComponent(slug)}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="relative aspect-[4/5] bg-[#111]">
                    {/* 封面 */}
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover}
                        alt={title}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : null}

                    {/* 顶部渐变 + 日期角标 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                    {ev.date ? (
                      <div className="absolute top-3 left-3 text-[11px] font-bold px-2 py-1 rounded-md bg-black/70 backdrop-blur">
                        {fmtBadge(ev.date)}
                      </div>
                    ) : null}

                    {/* 底部文本 */}
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <div className="text-sm text-white/75">{dateLine}</div>
                      <div className="mt-1 text-lg font-semibold leading-tight line-clamp-2">
                        {title}
                      </div>

                      {/* MOS 风格：悬浮出现的“Info & Tickets” */}
                      <div className="mt-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white text-black px-4 py-2 text-[13px] font-bold">
                          Info & Tickets →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </main>
  )
}
