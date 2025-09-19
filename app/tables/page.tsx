// app/tables/page.tsx
import { getTables } from '@/lib/sanity'
import TableCard from '@/components/TableCard'

export const dynamic = 'force-dynamic'

export default async function TablesPage() {
  const tables = await getTables()

  return (
    <main className="mx-auto max-w-7xl bg-black px-4 pb-24 pt-28 text-white">
      <h1 className="mb-6 text-3xl font-extrabold tracking-wide md:text-4xl">Tables</h1>

      {tables.length === 0 ? (
        <p className="opacity-80">No table packages yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tables.map(t => (
            <TableCard
             // app/tables/page.tsx 片段 —— 渲染 <TableCard /> 的地方
// 建议在 map 外面加一个小工具函数
const toNum = (v: unknown): number | undefined => {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
};

// ...
{tables.map((t) => (
  <TableCard
    key={t._id ?? t.slug ?? t.title}
    title={t.title}
    cover={t.cover}
    capacity={toNum(t.capacity)}    // <- 这里做转换
    minSpend={toNum(t.minSpend)}    // <- 建议一起转
    price={toNum(t.price)}          // <- 建议一起转
    bookingUrl={t.bookingUrl}
  />
))}

        </div>
      )}
    </main>
  )
}
