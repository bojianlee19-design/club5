'use client'
import { useEffect, useRef, useState } from 'react'

type Props = {
  poster?: string
  children?: React.ReactNode
}

export default function VideoHero({ poster, children }: Props) {
  const ref = useRef<HTMLVideoElement | null>(null)
  const [canPlay, setCanPlay] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!el) return
          if (e.isIntersecting) el.play().catch(() => {})
          else el.pause()
        })
      },
      { threshold: 0.25 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="hero">
      <div className="hero-bg" />
      <video
        ref={ref}
        className="hero-video"
        playsInline
        muted
        autoPlay
        loop
        preload="metadata"
        onCanPlay={() => setCanPlay(true)}
        poster={poster}
        style={{ opacity: canPlay ? 0.7 : 0, transition: 'opacity .6s ease' }}
      >
        <source src="/hero.webm" type="video/webm" />
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay" />
      <div className="hero-inner container">{children}</div>
      <style>{`
        .hero{position:relative;min-height:72vh;display:grid;place-items:center;overflow:hidden;background:#060606}
        .container{max-width:1200px;margin:0 auto;padding:20px}
        .hero-bg{position:absolute;inset:0;background:#060606}
        .hero-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(1.1) contrast(1.05) brightness(.9)}
        .hero-overlay{position:absolute;inset:0;background:
          radial-gradient(1200px 600px at 50% 80%, rgba(154,123,255,.25), transparent 55%),
          linear-gradient(180deg, rgba(0,0,0,.0), #000 85%)}
        @media (prefers-reduced-motion: reduce){ .hero-video{display:none} }
      `}</style>
    </section>
  )
}
