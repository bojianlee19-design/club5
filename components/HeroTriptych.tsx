// components/HeroTriptych.tsx
import Link from 'next/link'

type Props = {
  src: string
  poster?: string
  height?: string // e.g. '80vh'
}

export default function HeroTriptych({ src, poster, height = '80vh' }: Props) {
  return (
    <Link href="/events" className="block group">
      <section
        className="w-screen"
        style={{ height }}
        aria-label="Go to What's On"
        title="Go to What's On"
      >
        <div className="grid h-full w-full grid-cols-1 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative">
              <video
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={poster}
              >
                <source src={`${src}`} type="video/mp4" />
              </video>
              {/* 轻微遮罩，悬停有动效 */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 to-black/0 transition-opacity duration-300 group-hover:opacity-60" />
            </div>
          ))}
        </div>
      </section>
    </Link>
  )
}
