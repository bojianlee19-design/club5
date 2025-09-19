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
              key={t.slug}
              slug={t.slug}
              title={t.title}
              cover={t.cover}
              capacity={t.capacity}
              minSpend={t.minSpend}
              price={t.price}
              bookingUrl={t.bookingUrl}
              summary={t.summary}
              perks={t.perks}
            />
          ))}
        </div>
      )}
    </main>
  )
}
