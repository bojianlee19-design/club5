// components/HeroTriptych.tsx
import Link from 'next/link'

type Props = {
  src: string        // public 下视频路径，例如 /hero-b0.mp4
  poster?: string
}

function V({ src, poster }: Props) {
  return (
    <video
      className="h-full w-full object-cover"
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
    />
  )
}

/**
 * 关键：不使用响应式断点，直接 grid-cols-3，确保任何屏幕都保持一行三格
 * 外层用 aspect-[16/9] 固定比例，避免视频换行。
 */
export default function HeroTriptych({ src, poster }: Props) {
  return (
    <Link href="/events" aria-label="Go to What's On">
      <section className="relative w-full overflow-hidden">
        <div className="mx-auto aspect-[16/9] w-full">
          <div className="grid h-full w-full grid-cols-3">
            <V src={src} poster={poster} />
            <V src={src} poster={poster} />
            <V src={src} poster={poster} />
          </div>
        </div>

        {/* 左下角文案 */}
        <div className="pointer-events-none absolute left-6 bottom-6 z-10 select-none">
          <div className="text-2xl font-extrabold tracking-wide md:text-3xl">HAZY CLUB</div>
          <div className="opacity-80">NIGHTS · MUSIC · COMMUNITY</div>
        </div>
      </section>
    </Link>
  )
}
