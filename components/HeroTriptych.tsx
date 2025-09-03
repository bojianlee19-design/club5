// components/HeroTriptych.tsx
import Link from 'next/link'

type Props = {
  /** 可播放的视频 src（目前你可用 /hero-b0.mp4） */
  src: string
  /** 备用海报 */
  poster?: string
}

export default function HeroTriptych({ src, poster }: Props) {
  return (
    <section className="relative mx-auto w-full max-w-[1600px] px-3 pt-24">
      {/* 整块可点击进 What's On */}
      <Link href="/events" className="block group">
        <div className="grid aspect-[16/6] w-full grid-cols-3 gap-2 overflow-hidden rounded-3xl md:aspect-[16/5]">
          {[0, 1, 2].map(i => (
            <div key={i} className="relative">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src={src}
                poster={poster}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
              {/* 轻微遮罩，提升文字/对比度（与 MOS 相似） */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </Link>
    </section>
  )
}
