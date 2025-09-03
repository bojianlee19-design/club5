// app/events/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getEventBySlug } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

export default async function EventDetail({ params }: { params: { slug: string } }) {
  const ev = await getEventBySlug(params.slug)
  if (!ev) return notFound()

  const cover = ev.cover ?? ev.image ?? ev.mainImage ?? ''

  return (
    <main className="mx-auto max-w-4xl bg-black px-3 pb-24 pt-28 text-white">
      <h1 className="text-3xl font-extrabold tracking-wide md:text-4xl">{ev.title}</h1>
      <div className="mt-2 opacity-80">{ev.date ? new Date(ev.date).toLocaleString() : ''}</div>

      {cover && (
        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl">
          <img src={cover} alt={ev.title ?? ''} className="h-full w-full object-cover" />
        </div>
      )}

      {/* 这里可继续渲染正文内容 */}
    </main>
  )
}
