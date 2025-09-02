// app/page.tsx
import HeroTriptych from '@/components/HeroTriptych';
import EventsAutoScroller from '@/components/EventsAutoScroller';
import EventsRail from '@/components/EventsRail';
import Link from 'next/link';
import { getUpcomingEvents } from '@/lib/sanity';

export const revalidate = 60;

export default async function HomePage() {
  const events = await getUpcomingEvents(20); // -> { slug, title, date?, cover? }[]

  return (
    <main className="bg-black text-white">
      {/* 三联英雄：整块可点击进入 What's On（/events） */}
      <HeroTriptych
        src="/hero-b0.mp4"
        poster="/hero-poster.jpg"
        heading="HAZY CLUB"
        subheading="NIGHTS · MUSIC · COMMUNITY"
        href="/events"
      />

      {/* 英雄下方：自动滚动活动（居中、悬停暂停） */}
      <section className="mx-auto w-full max-w-7xl px-4">
        <EventsAutoScroller events={events} durationSec={28} />
      </section>

      {/* 轨道式横向滚动 + 左右按钮（可选，二选一都行） */}
      <EventsRail title="What's On" events={events} />

      {/* 底部简单 CTA（可留可删） */}
      <section className="mx-auto mt-16 max-w-7xl px-4 pb-20">
        <div className="flex items-center justify-center">
          <Link
            href="/events"
            className="rounded-full border border-white/15 bg-white/10 px-6 py-2 text-sm font-semibold tracking-wide hover:bg-white/15"
          >
            View All Events
          </Link>
        </div>
      </section>
    </main>
  );
}
