// app/events/[slug]/page.tsx
import { getEventBySlug } from '@/lib/sanity'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EventDetail({ params }: { params: { slug: string } }) {
  const ev = await getEventBySlug(params.slug)
  if (!ev) return notFound()

  return (
    <main className="mx-auto max-w-4xl bg-black px-4 pb-20 pt-24 text-white">
      <h1 className="text-3xl font-extrabold tracking-wide">{ev.title}</h1>
      <div className="mt-2 opacity-80">
        {ev.date ? new Date(ev.date).toLocaleString() : ''}
      </div>

      {ev.cover && (
        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl">
          <img src={ev.cover} alt={ev.title ?? 'Event'} className="h-full w-full object-cover" />
        </div>
      )}

      {ev.body && (
        <div className="prose prose-invert mt-8 max-w-none">
          {/* 你如果有富文本可在这里渲染 */}
          <p>{ev.body}</p>
        </div>
      )}
    </main>
  )
}
