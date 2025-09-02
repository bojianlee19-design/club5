// app/page.tsx
import Link from 'next/link'
import Header from '@/components/Header'
import VideoHero from '@/components/VideoHero'
import { fetchEvents } from '@/lib/sanity' // 你已有这个方法；若路径不同，把这行改成你项目里的实际导出

export const dynamic = 'force-dynamic'

// 你项目里的 Event 结构可能略有差异，下面做了容错（title/cover/date/slug）
type EventLite = {
  slug: string
  title?: string
  name?: string
  date?: string
  when?: string
  cover?: string
  image?: string
}

function formatBadge(d?: string) {
  if (!d) return ''
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return ''
  // 例：01 SEPT
  const day = dt.toLocaleDateString('en-GB', { day: '2-digit' })
  const mon = dt.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()
  return `${day} ${mon}`
}

export default async function Home() {
  // 拉 12 条活动（数量可自行调整）
  const events = (await fetchEvents(12)) as EventLite[]
  const safe = Array.isArray(events) ? events : []
  const featured = safe[0]

  return (
    <main className="bg-black text-white">
      <Header />

      {/* 英雄区：使用你可播的 hero-b0（带 ?v=1 强制刷新缓存） */}
      <VideoHero
        sources={['/hero-b0.webm?v=1', '/hero-b0.mp4?v=1']}
        poster="/hero-poster.jpg"
        heading="HAZY CLUB"
        subheading="NIGHTS · MUSIC · COMMUNITY"
        href={featured ? `/events/${featured.slug}` : '/events'}
      />

      {/* WHAT'S ON 区块（自动横向滚动） */}
      <section className="relative py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">WHAT’S ON</h2>
            <Link href="/events" className="text-sm underline hover:no-underline">
              View all
            </Link>
          </div>
        </div>

        {/* 滚动容器 */}
        <div className="overflow-hidden">
          <div
            className="flex gap-4 will-change-transform px-4"
            style={{
              animation: 'hazy-scroll 28s linear infinite',
            }}
          >
            {/* 为了无缝循环，把列表复制一份 */}
            {[...safe, ...safe].map((ev, i) => {
              const title = ev.title ?? ev.name ?? 'Untitled Event'
              const date = ev.date ?? ev.when
              const img = ev.cover ?? ev.image // 若有封面字段不同，自动兜底
              return (
                <Link
                  href={`/events/${ev.slug}`}
                  key={`${ev.slug}-${i}`}
                  className="group w-[260px] sm:w-[320px] shrink-0 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors overflow-hidden"
                >
                  <div className="relative aspect-[4/3] bg-white/5">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img}
                        alt={title}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : null}

                    {/* 日期徽章 */}
                    {date ? (
                      <div className="absolute top-2 left-2 text-[11px] font-bold px-2 py-1 rounded-md bg-black/70 backdrop-blur">
                        {formatBadge(date)}
                      </div>
                    ) : null}
                  </div>

                  <div className="p-4">
                    <div className="text-sm text-white/60 mb-1">
                      {date
                        ? new Date(date).toLocaleDateString('en-GB', {
                            weekday: 'short',
                            day: '2-digit',
                            month: 'short',
                          })
                        : ''}
                    </div>
                    <div className="text-lg font-semibold leading-tight line-clamp-2">{title}</div>
                    <div className="mt-2 text-sm underline opacity-80 group-hover:opacity-100">
                      View Details →
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* 内联样式只负责这个区块的动画关键帧 */}
        <style>{`
          @keyframes hazy-scroll {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @media (hover: none) and (pointer: coarse) {
            /* 移动端滚动慢一点，省电且更顺滑 */
            .animate-slower { animation-duration: 40s; }
          }
        `}</style>
      </section>

      {/* 页脚：仍保留基本信息（你之前确认过的地址/邮箱） */}
      <footer className="py-12 text-center text-sm text-white/60">
        <div className="space-x-6">
          <a href="/tickets" className="underline">Tickets</a>
          <a href="/tables" className="underline">Tables</a>
          <a href="/venue-hire" className="underline">Venue Hire</a>
          <a href="/faq" className="underline">FAQ</a>
        </div>
        <p className="mt-6">28 Eyre St, Sheffield City Centre, Sheffield S1 4QY</p>
        <p className="mt-1"><a className="underline" href="mailto:matt@hazyclub.co.uk">matt@hazyclub.co.uk</a></p>
      </footer>
    </main>
  )
}
