// components/HeroTriptych.tsx
import Link from 'next/link'

type Props = {
  src: string           // 视频文件（public 下，比如 /hero-b0.mp4）
  poster?: string       // 海报占位，可选
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

export default function HeroTriptych({ src, poster }: Props) {
  return (
    <Link href="/events" aria-label="Go to What's On">
      <section className="relative w-full overflow-hidden">
        {/* 16:9 高宽比容器，桌面三列、移动单列 */}
        <div className="mx-auto aspect-[16/9] w-full">
          <div className="grid h-full w-full grid-cols-1 md:grid-cols-3">
            <V src={src} poster={poster} />
            <V src={src} poster={poster} />
            <V src={src} poster={poster} />
          </div>
        </div>
        {/* 左下角文案（可按需调样式） */}
        <div className="pointer-events-none absolute left-6 bottom-6 z-10 select-none">
          <div className="text-2xl font-extrabold tracking-wide md:text-3xl">HAZY CLUB</div>
          <div className="opacity-80">NIGHTS · MUSIC · COMMUNITY</div>
        </div>
      </section>
    </Link>
  )
}
