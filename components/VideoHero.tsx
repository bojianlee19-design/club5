'use client'
import {useEffect, useRef, useState} from 'react'

type Props = {
  sources: string[]   // 例 ['/hero.webm', '/hero.mp4']
  poster?: string
  heading: string
  subheading?: string
  cta?: { href: string; label: string }
}

export default function VideoHero({ sources, poster, heading, subheading, cta }: Props) {
  const ref = useRef<HTMLVideoElement|null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const tryPlay = async () => {
      try {
        await v.play()
      } catch {
        // 某些浏览器第一时间会拒绝，等 meta/loadeddata 再试
        const onLoaded = async () => {
          try { await v.play() } catch { /* ignore */ }
          v.removeEventListener('loadeddata', onLoaded)
          v.removeEventListener('loadedmetadata', onLoaded)
        }
        v.addEventListener('loadeddata', onLoaded)
        v.addEventListener('loadedmetadata', onLoaded)
      }
    }
    tryPlay()
  }, [])

  return (
    <section className="hero">
      {!failed ? (
        <video
          ref={ref}
          className="hero-video"
          muted
          playsInline
          loop
          autoPlay
          preload="auto"
          poster={poster}
          onError={() => setFailed(true)}
        >
          {sources.map((src, i) => (
            <source key={i} src={src} type={src.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
          ))}
        </video>
      ) : (
        <div className="hero-fallback" style={poster ? { backgroundImage: `url(${poster})` } : undefined}/>
      )}

      <div className="hero-overlay">
        <h1>{heading}</h1>
        {subheading && <p className="sub">{subheading}</p>}
        {cta && <a href={cta.href} className="btn">{cta.label}</a>}
      </div>

      <style jsx>{`
        .hero{position:relative;min-height:72vh;background:#000;overflow:hidden}
        .hero-video,.hero-fallback{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background-size:cover;background-position:center}
        .hero-overlay{
          position:relative;z-index:2;display:flex;flex-direction:column;gap:12px;
          padding:22vh 6vw 12vh;background:linear-gradient(180deg,rgba(0,0,0,.55) 0%,rgba(0,0,0,.35) 35%,rgba(0,0,0,.2) 60%,transparent 100%);
          color:#fff;max-width:1200px;margin:0 auto
        }
        h1{font-size:clamp(32px,6vw,72px);line-height:1.05;margin:0;font-weight:800;letter-spacing:.01em}
        .sub{opacity:.92;font-size:clamp(14px,2.5vw,18px);margin:4px 0 10px}
        .btn{display:inline-block;padding:10px 18px;border:1px solid #fff;border-radius:999px;color:#000;background:#fff;text-decoration:none;font-weight:600}
        .btn:hover{opacity:.9}
      `}</style>
    </section>
  )
}
