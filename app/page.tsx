// app/page.tsx
import { Suspense } from 'react'
import Link from 'next/link'
import VideoHero from '@/components/VideoHero'
import EventsRail from '@/components/EventsRail'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      {/* 顶部全屏视频：会优先尝试 webm，失败回退到 mp4；没有就显示 poster */}
      <section>
        <VideoHero
          sources={['/hero.webm', '/hero.mp4?v=1']}
          poster="/hero-poster.jpg"
          heading="HAZY CLUB"
          subheading="NIGHTS · MUSIC · COMMUNITY"
          cta={{ href: '/tickets', label: 'Tickets' }}
        />
      </section>

      {/* MOS 风格横向自动滚动活动 */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold">What’s On</h2>
          <Link
            href="/events"
            className="text-sm text-white/70 hover:text-white underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>

        <Suspense fallback={<div className="text-zinc-400 py-12">Loading…</div>}>
          <EventsRail />
        </Suspense>
      </section>

      {/* 订阅 CTA（纯静态，不依赖任何自定义组件） */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-16">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur">
          <h3 className="text-xl md:text-2xl font-semibold mb-2">Join the mailing list</h3>
          <p className="text-white/70 mb-4">Get the latest drops, line-ups and events.</p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 bg-white text-black hover:bg-zinc-200 transition"
          >
            Sign up <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </main>
  )
}
