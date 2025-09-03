// app/page.tsx
import HeroTriptych from '@/components/HeroTriptych'
import EventsAutoScroller, { EventItem } from '@/components/EventsAutoScroller'
import Link from 'next/link'
import { getUpcomingEvents } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // 从 Sanity 取最近活动（保底 12 条）
  const docs = await getUpcomingEvents(12)

  // 规范化为组件需要的结构
  const events: EventItem[] = (docs || []).map((d: any, i: number) => ({
    id: d._id ?? String(i),
    slug: typeof d.slug === 'string' ? d.slug : d.slug?.current ?? '',
    title: d.title ?? '',
    date: d.date,
    // 允许两种字段：cover（已是 URL）或 mainImage / image（Sanity 图像 URL 你已有工具函数时可替换）
    cover: d.cover ?? d.image ?? d.mainImage ?? '',
  })).filter(e => e.slug) // 没有 slug 的先过滤

  return (
    <main className="bg-black text-white">
      {/* 横向三联英雄（整块可点进 What's On） */}
      <HeroTriptych src="/hero-b0.mp4" poster="/hero-poster.jpg" />

      {/* 英雄下方：居中自动滚动活动 */}
      <section className="mx-auto w-full max-w-7xl px-3">
        <div className="mb-3 mt-8 flex items-baseline justify-between">
          <h2 className="text-xl font-extrabold tracking-wide">What’s On</h2>
          <Link href="/events" className="text-sm underline opacity-80 hover:opacity-100">
            View all →
          </Link>
        </div>
      </section>
      <EventsAutoScroller events={events} durationSec={28} />

      {/* 简洁底部（恢复你站点原有信息） */}
      <footer className="mx-auto mt-16 w-full max-w-7xl px-3 pb-16 text-sm text-neutral-300">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="mb-2 font-bold text-white">Visit us</h3>
            <p>28 Eyre St, Sheffield City Centre, Sheffield S1 4QY</p>
          </div>
          <div>
            <h3 className="mb-2 font-bold text-white">Contact</h3>
            <p><a className="underline" href="mailto:matt@hazyclub.co.uk">matt@hazyclub.co.uk</a></p>
          </div>
          <div>
            <h3 className="mb-2 font-bold text-white">Follow</h3>
            <p>@hazyclub</p>
          </div>
        </div>
        <div className="mt-8 opacity-60">© {new Date().getFullYear()} HAZY Club. All rights reserved.</div>
      </footer>
    </main>
  )
}
