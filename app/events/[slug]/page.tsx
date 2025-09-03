// app/events/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getEventBySlug } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

type Props = { params: { slug: string } }

export default async function EventDetailPage({ params }: Props) {
  const ev = await getEventBySlug(params.slug)
  if (!ev) notFound()

  return (
    <main className="mx-auto max-w-5xl bg-black px-4 pb-24 pt-24 text-white">
      <nav className="mb-6 text-sm opacity-70">
        <Link href="/events" className="underline">
          ← Back to What’s On
        </Link>
      </nav>

      <h1 className="text-3xl font-extrabold tracking-wide md:text-4xl">
        {ev.title ?? 'Event'}
      </h1>
      <div className="mt-2 opacity-80">
        {ev.date ? new Date(ev.date).toLocaleString() : ''}
      </div>

      {typeof ev.cover === 'string' && ev.cover.length > 0 && (
        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl">
          <Image
            src={ev.cover}
            alt={ev.title ?? 'Event cover'}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 960px, 100vw"
            priority
          />
        </div>
      )}

      {ev.description && (
        <div className="prose prose-invert mt-8 max-w-none">
          {/* 这里按你实际结构渲染，先用纯文本兜底 */}
          <p>{typeof ev.description === 'string' ? ev.description : ''}</p>
        </div>
      )}

      {ev.ctaUrl && (
        <a
          href={ev.ctaUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-block rounded-full bg-white px-6 py-3 font-semibold text-black hover:bg-neutral-200"
        >
          {ev.ctaLabel ?? 'Get Tickets'}
        </a>
      )}
    </main>
  )
}
