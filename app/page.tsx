// app/page.tsx
import Link from 'next/link'
import { getUpcomingEvents, toEventItem, type EventItem } from '@/lib/sanity'
import HeroTriptych from '@/components/HeroTriptych'
import EventsAutoScroller from '@/components/EventsAutoScroller'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // 取未来活动，映射成滚动组件需要的结构
  const docs = await getUpcomingEvents(20)
  const events: EventItem[] = docs.map(toEventItem).filter(e => !!e.slug)

  return (
    <main className="bg-black text-white">
      {/* 三联英雄：整块可点击进入 What's On（/events） */}
      <Link href="/events" className="block focus:outline-none">
        <HeroTriptych
          src="/hero-b0.mp4"
          // 如果需要封面占位图，可放一张
          poster="/hero-poster.jpg"
          // 循环/静音/自动播放都在组件里处理，无需额外参数
        />
      </Link>

      {/* 英雄下方：自动滚动活动（居中、悬停暂停） */}
      <section className="mx-auto w-full max-w-7xl px-4">
        <EventsAutoScroller events={events} durationSec={28} />
      </section>
    </main>
  )
}
