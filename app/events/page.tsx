// app/events/page.tsx
import Link from 'next/link'
import { getUpcomingEvents } from '@/lib/sanity'
import EventGridCard from '@/components/EventGridCard'

export const dynamic = 'force-dynamic'

type RangeKey = 'all' | 'week' | 'month' | 'dates'

// 服务器端读取 searchParams
export default async function EventsPage({
  searchParams,
}: {
  searchParams?: { range?: RangeKey }
}) {
  const range = (searchParams?.range || 'all') as RangeKey

  const all = await getUpcomingEvents(60) // 已按时间降序
  const now = new Date()

  // 一周范围
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7)) // 以周一为一周开始
  startOfWeek.setHours(0, 0, 0, 0)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 7)

  // 本月范围
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  const inRange = (d?: string) => {
    if (!d) return false
    const x = new Date(d).getTime()
    if (range === 'week') return x >= +startOfWeek && x < +endOfWeek
    if (range === 'month') return x >= +startOfMonth && x < +endOfMonth
    return true
  }

  const events =
    range === 'all' ? all : all.filter((e) => inRange(e.date))

  const Tab = ({
    label,
    value,
  }: {
    label: string
    value: RangeKey
  }) => {
    const active = range === value
    return (
      <Link
        href={value === 'all' ? '/events' : `/events?range=${value}`}
        className={[
          'px-3 py-1 text-sm transition',
          active
            ? 'text-white'
            : 'text-white/60 hover:text-white',
        ].join(' ')}
      >
        {label}
      </Link>
    )
  }

  return (
    <main className="mx-auto max-w-7xl bg-black px-4 pb-24 pt-28 text-white">
      {/* 顶部返回首页（与 MOS 同样在导航条下方保留标题） */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-wide">WHAT&apos;S ON</h1>
        {/* 可选的“Refine”占位，保留结构感；如不需要可删 */}
        {/* <button className="rounded-full bg-white/10 px-3 py-1 text-sm ring-1 ring-white/15 hover:bg-white/15">
          REFINE
        </button> */}
      </div>

      {/* —— Tabs: 去掉日期选择栏，仅保留四个切换 —— */}
      <nav className="mb-6 flex gap-4 border-b border-white/10 pb-2">
        <Tab label="ALL" value="all" />
        <Tab label="THIS WEEK" value="week" />
        <Tab label="THIS MONTH" value="month" />
        <Tab label="SELECT DATES" value="dates" />
      </nav>

      {/* SELECT DATES 先作为占位说明（不引入日历），避免交互跳变 */}
      {range === 'dates' && (
        <p className="mb-6 text-sm text-white/60">
          Date picker coming soon. Please use WEEK/MONTH for now.
        </p>
      )}

      {/* —— 网格：手机 2 列，md 3 列，lg 4 列；间距更精致 —— */}
      <section className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {events.map((e) => (
          <EventGridCard
            key={e.slug}
            slug={e.slug}
            title={e.title}
            date={e.date}
            cover={e.cover}
          />
        ))}
      </section>

      {/* 末尾留一点呼吸 */}
      <div className="mt-16" />
    </main>
  )
}
