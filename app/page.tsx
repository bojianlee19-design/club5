// app/page.tsx
import Link from 'next/link';
import HeroTriptych from '@/components/HeroTriptych';
import EventsAutoScroller from '@/components/EventsAutoScroller';
import { getUpcomingEvents } from '@/lib/sanity';

export default async function HomePage() {
  // 获取活动数据（用于英雄下方滚动）
  const events = await getUpcomingEvents(20); // -> { id, slug, title, date?, cover? }[]

  return (
    <main className="bg-black text-white">
      {/* 英雄：整块可点击进入 What's On（/events） */}
      <section>
        <Link href="/events" className="block focus:outline-none">
          <HeroTriptych
            src="/hero-b0.mp4"
            poster="/hero-poster.jpg"
          />
        </Link>
      </section>

      {/* 英雄下方：活动推送（竖版海报、居中、一次只显示一个；悬停暂停/左右切换/移动端可滑动） */}
      <section className="mx-auto w-full max-w-7xl px-4">
        <EventsAutoScroller events={events} durationSec={6} />
      </section>

      {/*
        说明：
        —— 本次按你的要求，删除了这里的 “Visit us + 联系方式” 这组，
        保留页面最底部已有的一组联系方式（通常来自 Footer）。
      */}
    </main>
  );
}
