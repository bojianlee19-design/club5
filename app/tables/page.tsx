// app/tables/page.tsx
import TablesMap from '@/components/TablesMap'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const HOTSPOTS = [
  { id: 'vip-1', label: 'VIP 1', x: 22, y: 28, capacity: 8, minSpend: '£800' },
  { id: 'vip-2', label: 'VIP 2', x: 35, y: 32, capacity: 8, minSpend: '£800' },
  { id: 'booth-a', label: 'Booth A', x: 60, y: 40, capacity: 6, minSpend: '£500' },
  { id: 'booth-b', label: 'Booth B', x: 75, y: 52, capacity: 6, minSpend: '£500' },
  // ↑ 这些只是示范点位（百分比）。按你的卡座图随时改数字 / 增减
]

export default function TablesPage() {
  return (
    <main className="mx-auto max-w-7xl bg-black px-4 pb-24 pt-28 text-white">
      <header className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-extrabold tracking-wide md:text-4xl">Book a Table</h1>
        <p className="mt-2 max-w-2xl opacity-80">
          Choose your preferred table on the plan below and send us an enquiry. We’ll confirm
          availability and final details shortly.
        </p>
      </header>

      <section className="mt-8">
        <TablesMap src="/tables-map.png" hotspots={HOTSPOTS} />
      </section>

      {/* 可选：推荐桌台清单（不需要时可删） */}
      <section className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
        {HOTSPOTS.map(h => (
          <div key={h.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="text-sm opacity-70">Table</div>
            <div className="mt-1 text-lg font-semibold">{h.label}</div>
            <div className="mt-2 space-y-1 text-sm opacity-80">
              {h.capacity ? <div>Capacity: {h.capacity}</div> : null}
              {h.minSpend ? <div>Min spend: {h.minSpend}</div> : null}
            </div>
            <Link
              href={`/contact?table=${encodeURIComponent(h.label)}`}
              className="mt-4 inline-block rounded-full border border-white/15 px-4 py-2 text-sm hover:bg-white/10"
            >
              Enquire
            </Link>
          </div>
        ))}
      </section>
    </main>
  )
}
