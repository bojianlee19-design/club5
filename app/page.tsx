// app/page.tsx
import TopNav from "@/components/TopNav";
import HeroTriptych from "@/components/HeroTriptych";
import EventsAutoScroller from "@/components/EventsAutoScroller";
import { getUpcomingEvents } from "@/lib/sanity";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // 兼容你的 lib/sanity：此方法不接收参数
  const events = (await getUpcomingEvents()) as any[];

  return (
    <main className="bg-black text-white">
      <TopNav />

      {/* 英雄：横向三联视频（整块可点击进入 /events） */}
      <HeroTriptych src="/hero-b0.mp4" />

      {/* 英雄下方：居中自动滚动活动 */}
      <section className="mx-auto my-10 max-w-7xl px-4">
        <h2 className="mb-4 text-center text-xl font-semibold tracking-wide">
          What’s On
        </h2>
        <EventsAutoScroller events={events} durationSec={28} />
      </section>

      {/* 页脚（恢复地址 & 联系方式） */}
      <footer className="mt-16 border-t border-white/10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-3">
          <div>
            <div className="font-bold">Visit us</div>
            <div>28 Eyre St, Sheffield City Centre, Sheffield S1 4QY</div>
          </div>
          <div>
            <div className="font-bold">Contact</div>
            <a href="mailto:matt@hazyclub.co.uk" className="underline">
              matt@hazyclub.co.uk
            </a>
          </div>
          <div>
            <div className="font-bold">Follow</div>
            <div>@hazyclub</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
