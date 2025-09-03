// app/page.tsx
import HeroTriptych from '@/components/HeroTriptych';
import EventsAutoScroller from '@/components/EventsAutoScroller';
import { getUpcomingEvents } from '@/lib/sanity';

export default async function HomePage() {
  const events = await getUpcomingEvents(); // 稳定返回 {id,slug,title,date,cover}

  return (
    <main className="bg-black">
      {/* 英雄屏：桌面三联 / 移动单联，整块可点击 /events */}
      <HeroTriptych src="/hero-b0.mp4" poster="/hero-poster.jpg" href="/events" />

      {/* 英雄下方：活动滚动（居中、悬停暂停、左右按钮、触摸滑动） */}
      <section className="mx-auto w-full max-w-7xl px-4">
        <EventsAutoScroller events={events} durationSec={4} />
      </section>
    </main>
  );
}
