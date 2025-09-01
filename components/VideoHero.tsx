'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import Link from 'next/link'

type Cta = { href: string; label: string }

type Props = {
  poster?: string
  sources?: string[] // 默认 ['/hero.webm', '/hero.mp4']
  className?: string
  heading?: string
  subheading?: string
  cta?: Cta
  children?: ReactNode
}

async function headOK(url: string) {
  try {
    const r = await fetch(url, { method: 'HEAD', cache: 'no-store' })
    return r.ok
  } catch {
    return false
  }
}

export default function VideoHero({
  poster = '/hero-poster.jpg',
  sources,
  className,
  heading,
  subheading,
  cta,
  children,
}: Props) {
  const [okSrcs, setOkSrcs] = useState<string[]>([])
  const [checked, setChecked] = useState(false)
  const [needsTap, setNeedsTap] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    let cancelled = false
    const candidates = sources ?? ['/hero.webm', '/hero.mp4']
    ;(async () => {
      const res: string[] = []
      for (const u of candidates) {
        if (!u) continue
        if (await headOK(u)) res.push(u)
      }
      if (!cancelled) {
        setOkSrcs(res)
        setChecked(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [sources])

  // 元数据就绪后主动播放（部分浏览器需要显式 play()）
  const tryPlay = async () => {
    const v = videoRef.current
    if (!v) return
    try {
      await v.play()
      setNeedsTap(false)
    } catch {
      // NotAllowedError：需要手势
      setNeedsTap(true)
    }
  }

  const hasVideo = okSrcs.length > 0

  return (
    <section
      className={className}
      style={{
        position: 'relative',
        height: 'min(92vh, 900px)',
        overflow: 'hidden',
        background: '#000',
        borderRadius: 16,
      }}
    >
      {/* 背景层：视频或海报 */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {checked && hasVideo ? (
          <video
            ref={videoRef}
            key={okSrcs.join('|')}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={poster}
            onLoadedData={tryPlay}
            onLoadedMetadata={tryPlay}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              filter: 'brightness(0.92)',
            }}
          >
            {okSrcs.map((u) => {
              const type =
                u.endsWith('.webm') ? 'video/webm' :
                u.endsWith('.mp4')  ? 'video/mp4'  :
                undefined
              return <source key={u} src={u} type={type} />
            })}
          </video>
        ) : (
          <img
            src={poster}
            alt="Hero Poster"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}
      </div>

      {/* 顶层文案 */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          padding: '6vh 5vw',
          color: '#fff',
        }}
      >
        {children ?? (
          <div>
            {heading && (
              <h1 style={{ fontSize: 48, lineHeight: 1.06, fontWeight: 900, margin: '0 0 10px' }}>
                {heading}
              </h1>
            )}
            {subheading && <p style={{ opacity: 0.9, fontSize: 16, margin: 0 }}>{subheading}</p>}
            {cta && (
              <div style={{ marginTop: 20 }}>
                <Link
                  href={cta.href}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2 bg-white text-black hover:bg-zinc-200 transition"
                >
                  {cta.label} <span aria-hidden>→</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 渐变叠层提升可读性 */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.70) 100%)',
          zIndex: 0,
        }}
      />

      {/* 若需要手势才能播放，给个轻提示按钮 */}
      {needsTap && hasVideo && (
        <button
          onClick={tryPlay}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/90 text-black text-sm px-4 py-2 hover:bg-white z-10"
        >
          Tap to play
        </button>
      )}

      {/* 开发态简单诊断 */}
      {process.env.NODE_ENV !== 'production' && (
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            background: 'rgba(0,0,0,.6)',
            color: '#fff',
            fontSize: 12,
            padding: '6px 10px',
            borderRadius: 8,
            zIndex: 2,
          }}
        >
          {checked
            ? hasVideo
              ? `Video sources: ${okSrcs.join(', ')}`
              : 'No video found (showing poster)'
            : 'Checking /hero.webm, /hero.mp4 ...'}
        </div>
      )}
    </section>
  )
}
