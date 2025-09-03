// app/page.tsx
import Link from 'next/link';
import HeroTriptych from '@/components/HeroTriptych';
import EventsAutoScroller from '@/components/EventsAutoScroller';
import { getUpcomingEvents } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // 读取最新活动（已在 lib/sanity.ts 里禁用缓存）
  const events = await getUpcomingEvents(20);

  return (
    <main className="bg-black text-white">
      {/* 顶部留出空间，避免被 fixed 的导航遮住 */}
      <section className="relative pt-20">
        {/* 整个英雄区可点击跳转 What's On */}
        <Link href="/events" className="block">
          {/* 使用你已有的三联视频组件；视频文件放在 /public 下，例如 /hero-b0.mp4 */}
          <HeroTriptych src="/hero-b0.mp4" poster="/hero-poster.jpg" />
        </Link>
      </section>

      {/* 英雄下方：单卡居中轮播（自动滚动，悬停/触摸暂停，左右箭头，可滑动） */}
      <section className="mx-auto w-full max-w-7xl px-4">
        <div className="mt-10">
          <EventsAutoScroller events={events} intervalSec={5} />
        </div>
      </section>

      {/* 底部联系方式与地图（可按需修改文案） */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold">Contact</h2>
            <p className="mt-2 opacity-80">
              For general enquiries &amp; bookings:
            </p>
            <p className="mt-2">
              <a href="mailto:info@hazyclub.co.uk" className="underline">
                info@hazyclub.co.uk
              </a>
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold">Find us</h2>
            <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">
              {/* 使用关键字搜索嵌入，避免地址写错；确认后可换成精确坐标 */}
              <iframe
                title="Hazy Club Map"
                src="https://www.google.com/maps?q=Hazy%20Club%20Sheffield&output=embed"
                width="100%"
                height="280"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
