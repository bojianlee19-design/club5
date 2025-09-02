// app/events/page.tsx
import Link from 'next/link'
import { fetchEvents } from '@/lib/sanity'
import { urlForImage } from '@/sanity/image'

export const dynamic = 'force-dynamic'

type Ev = Awaited<ReturnType<typeof fetchEvents>>[number]

function coverUrl(ev: Ev): string | undefined {
  const cands = [
    ev?.cover?.asset?.url,
    ev?.gallery?.[0]?.asset?.url,
  ].filter(Boolean) as string[]
  if (cands[0]) return cands[0]
  if (ev?.cover?.asset?._ref) return urlForImage(ev.cover).width(1200).url()
  if (ev?.gallery?.[0]?.asset?._ref) return urlForImage(ev.gallery[0]).width(1200).url()
  return undefined
}

function ym(d?: string) {
  if (!d) return ''
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return ''
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`
}

function ymLabel(ym: string) {
  const [y, m] = ym.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, 1).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams?: { month?: string }
}) {
  const rows = await fetchEvents(120)

  // 仅保留今天及以后的
  const today0 = new Date(new Date().toDateString()).getTime()
  const upcomings = rows
    .filter((e) => !e.date || new Date(e.date).getTime() >= today0)
    .sort((a, b) => (new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()))

  // 生成月份集合
  const months = Array.from(
    new Set(upcomings.map((e) => ym(e.date)).filter(Boolean))
  ) as string[]
  const selected = (searchParams?.month && months.includes(searchParams.month))
    ? searchParams.month
    : months[0] // 默认第一月（最接近的未来月份）

  const list = upcomings.filter((e) => ym(e.date) === selected)

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-7xl mx-auto px-4 pt-10 pb-2">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">WHAT’S ON</h1>
        <p className="text-white/70 mt-2">Info & Tickets</p>
      </section>

      {/* 月份筛选（MOS 风格胶囊） */}
      <section className="max-w-7xl mx-auto px-4 pb-6">
        <div className="flex gap-2 overflow-x-auto py-2">
          {months.map((m) => {
            const active = m === selected
            return (
              <Link
                key={m}
                href={`/events?month=${encodeURIComponent(m)}`}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-sm ${
                  active
                    ? 'bg-white text-black border-white'
                    : 'border-white/20 text-white hover:bg-white/10'
                }`}
              >
                {ymLabel(m)}
              </Link>
            )
          })}
        </div>
      </section>

      {/* 栅格卡片 */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        {list.length === 0 ? (
          <div className="rounded-2xl border border-white/10 p-10 text-center text-white/70">
            New events coming soon. Stay tuned.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {list.map((ev) => {
              const title = ev.title || 'Untitled Event'
              const slug = String(ev.slug)
              const cover = coverUrl(ev)
              const dt = ev.date ? new Date(ev.date) : undefined
              const dateLine = dt
                ? dt.toLocaleDateString('en-GB', {
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
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover}
                        alt={title}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : null}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                    {ev.date ? (
                      <div className="absolute top-3 left-3 text-[11px] font-bold px-2 py-1 rounded-md bg-black/70 backdrop-blur">
                        {dt?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()}
                      </div>
                    ) : null}

                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <div className="text-sm text-white/75">{dateLine}</div>
                      <div className="mt-1 text-lg font-semibold leading-tight line-clamp-2">
                        {title}
                      </div>
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
        )}
      </section>
    </main>
  )
}
