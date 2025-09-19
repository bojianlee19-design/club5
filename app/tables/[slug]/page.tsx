// app/tables/[slug]/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTableBySlug } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

export default async function TableDetail({ params }: { params: { slug: string } }) {
  const t = await getTableBySlug(params.slug)
  if (!t) return notFound()

  return (
    <main className="mx-auto max-w-4xl bg-black px-4 pb-24 pt-28 text-white">
      <Link href="/tables" className="rounded-full bg-white/10 px-3 py-1 text-sm ring-1 ring-white/15 hover:bg-white/20">
        ← Back
      </Link>

      <h1 className="mt-4 text-3xl font-extrabold md:text-4xl">{t.title}</h1>
      <p className="mt-2 opacity-80">
        {t.capacity ? `Up to ${t.capacity} guests • ` : ''}{t.minSpend || t.price || ''}
      </p>

      {t.cover ? (
        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl">
          <Image src={t.cover} alt={t.title} fill className="object-cover" />
        </div>
      ) : null}

      {t.summary ? <p className="mt-6 text-lg opacity-90">{t.summary}</p> : null}

      {t.perks?.length ? (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Perks</h2>
          <ul className="mt-2 list-disc pl-5 opacity-90">
            {t.perks.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
      ) : null}

      {t.bookingUrl ? (
        <a
          href={t.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex rounded-full bg-white/15 px-4 py-2 font-medium ring-1 ring-white/20 hover:bg-white/25"
        >
          Book this table
        </a>
      ) : null}
    </main>
  )
}
