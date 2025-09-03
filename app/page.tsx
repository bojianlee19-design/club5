// app/page.tsx
import HeroTriptych from '@/components/HeroTriptych'
import EventsMarquee, { type EventItem } from '@/components/EventsMarquee'
import { getUpcomingEvents } from '@/lib/sanity'

export default async function HomePage() {
  // 取未来活动（数量可按需调整）
  const docs: any[] = await getUpcomingEvents()

  // 统一数据形态：{ id, slug, title, date, cover }
  const events: EventItem[] = (docs || []).map((d) => {
    const slug =
      typeof d?.slug === 'string' ? d.slug : d?.slug?.current ?? String(d?._id ?? '')
    const cover =
      d?.cover ||
      d?.image?.asset?.url || d?.image?.url || d?.image ||
      d?.mainImage?.asset?.url || d?.mainImage?.url || d?.mainImage ||
      d?.gallery?.[0]?.asset?.url || d?.gallery?.[0]?.url ||
      ''

    return {
      id: String(d?._id ?? slug),
      slug,
      title: d?.title ?? '',
      date: d?.date,
      cover,
    }
  })

  return (
    <main className="bg-black text-white">
      {/* 英雄：横向三联（整块可点击进入 /events） */}
      <HeroTriptych src="/hero-b0.mp4" />

      {/* 英雄下方：活动自动滚动条（居中） */}
      <section className="mx-auto w-full max-w-7xl px-4 py-10">
        <div className="mb-3 text-lg font-semibold tracking-wide opacity-80">What’s On</div>
        <EventsMarquee events={events} durationSec={28} />
      </section>
    </main>
  )
}
