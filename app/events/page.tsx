// app/events/page.tsx
import Link from 'next/link'
import { getUpcomingEvents, getAllGenres } from '@/lib/sanity'
import EventCardWide from '@/components/EventCardWide'

type Search = { [key: string]: string | string[] | undefined }

function s(val: string | string[] | undefined): string | undefined {
  if (!val) return undefined
  return Array.isArray(val) ? val[0] : val
}

function buildUrl(base: string, next: Record<string, string | undefined>, current: URLSearchParams) {
  const qs = new URLSearchParams(current)
  Object.entries(next).forEach(([k, v]) => {
    if (v === undefined || v === '') qs.delete(k)
    else qs.set(k, v)
  })
  const q = qs.toString()
  return q ? `${base}?${q}` : base
}

export const dynamic = 'force-dynamic'

export default async function EventsPage({ searchParams }: { searchParams: Search }) {
  const range = (s(searchParams.range) as 'all' | 'week' | 'month' | undefined) || 'all'
  const from = s(searchParams.from)
  const to = s(searchParams.to)
  const genresParam = s(searchParams.genres) // 逗号分隔
  const genres = genresParam ? genresParam.split(',').map(g => g.trim()).filter(Boolean) : []

  // 数据
  const [events, allGenres] = await Promise.all([
    getUpcomingEvents({ limit: 60, range, from, to, genres }),
    getAllGenres(),
  ])

  const urlParams = new URLSearchParams()
  if (from) urlParams.set('from', from)
  if (to) urlParams.set('to', to)
  if (genres.length) urlParams.set('genres', genres.join(','))

  // UI
  const tabs: Array<{ key: 'all'|'week'|'month'; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
  ]

  return (
    <main className="mx-auto max-w-7xl bg-black px-4 pb-24 pt-24 text-white">
      {/* 标题 */}
      <div className="mb-6 flex items-end justify-between gap-4">
        <h1 className="text-3xl font-extrabold tracking-wide md:text-4xl">What’s On</h1>

        {/* 快速 Tabs */}
        <nav className="hidden gap-2 md:flex">
          {tabs.map(t => {
            const href = buildUrl('/events', { range: t.key }, urlParams)
            const active = range === t.key
            return (
              <Link
                key={t.key}
                href={href}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  active ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {t.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* 工具条：移动端合并为表单，桌面端横排 */}
      <form method="get" className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-3">
        {/* Tabs（移动端） */}
        <div className="md:hidden">
          <select
            name="range"
            defaultValue={range}
            className="w-full rounded-xl bg-white/10 px-3 py-2 text-sm outline-none backdrop-blur"
          >
            {tabs.map(t => (
              <option key={t.key} value={t.key}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* 日期范围 */}
        <div className="flex items-center gap-2">
          <label className="text-sm opacity-80">From</label>
          <input
            type="date"
            name="from"
            defaultValue={from}
            className="flex-1 rounded-xl bg-white/10 px-3 py-2 text-sm outline-none backdrop-blur"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm opacity-80">To</label>
          <input
            type="date"
            name="to"
            defaultValue={to}
            className="flex-1 rounded-xl bg-white/10 px-3 py-2 text-sm outline-none backdrop-blur"
          />
        </div>

        {/* Genres 精炼（多选） */}
        <div className="md:col-span-3">
          <details className="rounded-2xl bg-white/5 p-3 backdrop-blur">
            <summary className="cursor-pointer list-none text-sm font-semibold">
              Refine by Genre
              {genres.length ? (
                <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs font-bold text-black">
                  {genres.length}
                </span>
              ) : null}
            </summary>
            <div className="mt-3 flex flex-wrap gap-2">
              {allGenres.map(g => {
                const checked = genres.includes(g)
                return (
                  <label
                    key={g}
                    className={`cursor-pointer select-none rounded-full px-3 py-1 text-xs font-semibold ${
                      checked ? 'bg-white text-black' : 'bg-white/10 text-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="genres"
                      value={g}
                      defaultChecked={checked}
                      className="sr-only"
                    />
                    {g}
                  </label>
                )
              })}
            </div>
          </details>
        </div>

        {/* 提交按钮（移动端可见） */}
        <div className="md:col-span-3">
          <button
            type="submit"
            className="w-full rounded-2xl bg-white px-4 py-3 text-center text-sm font-bold text-black md:hidden"
          >
            Apply filters
          </button>
        </div>
      </form>

      {/* 列表（竖版海报栅格） */}
      {events.length === 0 ? (
        <p className="mt-16 text-center opacity-70">No events match your filters.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map(e => (
            <li key={e.id}>
              <Link href={`/events/${e.slug}`} className="group block">
                <EventCardWide
                  slug={e.slug}
                  title={e.title}
                  date={e.date}
                  cover={e.cover}
                  ratio="3/4"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
