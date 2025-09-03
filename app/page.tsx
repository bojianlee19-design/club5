// app/page.tsx
import HeroTriptych from '@/components/HeroTriptych'
import EventsAutoScroller, { EventItem } from '@/components/EventsAutoScroller'
import { getUpcomingEvents } from '@/lib/sanity'
import Link from 'next/link'

export default async function HomePage() {
  const docs = await getUpcomingEvents(20)
  const events: EventItem[] = docs.map((d) => ({
    id: d._id,
    slug: typeof d.slug === 'string' ? d.slug : d.slug?.current ?? '',
    title: d.title ?? '',
    date: d.date,
    cover: d.cover, // 已经是 URL
  }))

  return (
    <main className="bg-black text-white">
      {/* 英雄：三联横向并排（整块可点击进入 /events） */}
      <HeroTriptych src="/hero-b0.mp4" poster="/hero-poster.jpg" height="80vh" />

      {/* What’s On 标题 + View all */}
      <section className="mx-auto w-full max-w-7xl px-4 py-10">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-extrabold tracking-wide">What’s On</h2>
          <Link href="/events" className="underline opacity-80 hover:opacity-100">
            View all →
          </Link>
        </div>

        {/* 自动滚动活动推送（居中、悬停暂停） */}
        <EventsAutoScroller events={events} durationSec={28} />
      </section>
    </main>
  )
}
