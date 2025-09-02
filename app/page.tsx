import TopNav from '@/components/TopNav';
import VideoHero from '@/components/VideoHero';
import EventsAutoScroller from '@/components/EventsAutoScroller';
import Link from 'next/link';
import { getUpcomingEvents } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // 取 12 条做滚动
  const docs = await getUpcomingEvents(12);

  // 统一映射给滚动组件（确保 cover 是字符串）
  const events = docs.map(d => ({
    slug: typeof d.slug === 'string' ? d.slug : d.slug?.current ?? '',
    title: d.title ?? '',
    date: d.date,
    cover: d.cover ?? '',
  })).filter(e => e.slug);

  return (
    <main className="bg-black text-white">
      <TopNav />

      {/* 英雄：三联视频（点击进 /events） */}
      <VideoHero
        sources={[
          { src: '/hero-b0.webm', type: 'video/webm' }, // 若没有此文件，保留也没事，浏览器会跳到下一个
          { src: '/hero-b0.mp4',  type: 'video/mp4'  },
        ]}
        poster="/hero-poster.jpg"
        heightClass="h-[92vh]"
      />

      {/* 英雄下方的按钮/标题区（靠 MOS 做法，简单留一个 CTA） */}
      <section className="mx-auto max-w-7xl px-4 pb-2 pt-6 text-center">
        <h2 className="mb-3 text-2xl font-extrabold tracking-wide">WHAT’S ON</h2>
        <Link
          href="/events"
          className="inline-block rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold hover:bg-white/20"
        >
          Go to What’s On
        </Link>
      </section>

      {/* 自动滚动的活动推送（封面可见） */}
      <section className="mx-auto max-w-[1400px] px-4">
        <EventsAutoScroller events={events} />
      </section>

      {/* 页脚留空，按你原来的即可 */}
    </main>
  );
}
