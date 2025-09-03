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
            // 维持我们之前的交互与样式（横向三联、桌面三联 / 移动单视频）
          />
        </Link>
      </section>

      {/* 英雄下方：活动推送（竖版海报、居中、一次只显示一个；悬停暂停/左右切换/移动端可滑动） */}
      <section className="mx-auto w-full max-w-7xl px-4">
        <EventsAutoScroller events={events} durationSec={6} />
      </section>

      {/* —— 这里原来有 “Find us + 地图” —— 已按你的要求整个删除 —— */}

      {/* 保留的「Visit us」信息：保持简洁（可按需改地址/时间） */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-28 pt-16">
        <h2 className="text-xl font-extrabold tracking-wide">VISIT US</h2>
        <div className="mt-3 grid gap-6 md:grid-cols-3">
          <div className="space-y-1 text-white/80">
            <div className="font-semibold text-white">Address</div>
            <address className="not-italic">
              Hazy Club<br />
              Hackney Wick, London<br />
              United Kingdom
            </address>
          </div>
          <div className="space-y-1 text-white/80">
            <div className="font-semibold text-white">Hours</div>
            <p>Fri–Sat: 22:00 – 04:00</p>
          </div>
          <div className="space-y-1 text-white/80">
            <div className="font-semibold text-white">Contact</div>
            <p>info@hazyclub.co.uk</p>
          </div>
        </div>
      </section>
    </main>
  );
}
