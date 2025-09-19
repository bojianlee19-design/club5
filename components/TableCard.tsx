// components/TableCard.tsx
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  slug: string
  title: string
  cover?: string
  capacity?: number
  minSpend?: string
  price?: string
  bookingUrl?: string
  summary?: string
  perks?: string[]
}

export default function TableCard({
  slug, title, cover, capacity, minSpend, price, bookingUrl, summary, perks,
}: Props) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-white shadow-xl backdrop-blur">
      <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-lg bg-white/5">
        {cover ? (
          <Image src={cover} alt={title} fill className="object-cover" />
        ) : null}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm opacity-80">
        {capacity ? `Up to ${capacity} guests • ` : ''}{minSpend || price || ''}
      </p>
      {summary ? <p className="mt-2 text-sm opacity-80">{summary}</p> : null}
      {perks?.length ? (
        <ul className="mt-2 list-disc pl-5 text-sm opacity-80">
          {perks.slice(0, 4).map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      ) : null}

      <div className="mt-3 flex gap-2">
        {bookingUrl ? (
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white/15 px-3 py-2 text-sm font-medium ring-1 ring-white/20 hover:bg-white/25"
          >
            Book now
          </a>
        ) : null}
        <Link
          href={`/tables/${slug}`}
          className="rounded-full bg-white/10 px-3 py-2 text-sm font-medium ring-1 ring-white/15 hover:bg-white/20"
        >
          Details
        </Link>
      </div>
    </div>
  )
}
