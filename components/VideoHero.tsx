'use client'

import { useEffect, useState, ReactNode } from 'react'
import Link from 'next/link'

type Cta = { href: string; label: string }

type Props = {
  /** 作为封面的占位图，可选 */
  poster?: string
  /** 候选视频资源，默认 ['/hero.webm', '/hero.mp4'] */
  sources?: string[]
  /** 额外样式 */
  className?: string
  /** 叠加在视频上的大标题/副标题/CTA（可选） */
  heading?: string
  subheading?: string
  cta?: Cta
  /** 如果你想自定义叠加层，传 children 会覆盖 heading/subheading/cta 的默认渲染 */
  children?: ReactNode
}

/** 用 HEAD 探测静态资源是否存在（生产环境 404 问题最好排查） */
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
        if (process.env.NODE_ENV !== 'production') {
          console.info('[VideoHero] available sources:', res)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [sources])

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
      {/* 背景层：视频或占位图 */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        {checked && hasVideo ? (
          <video
            key={okSrcs.join('|')}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={poster}
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
                u.endsWith('.webm') ? 'video/webm' : u.endsWith('.mp4') ? 'video/mp4' : undefined
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

      {/* 渐变叠层（让文字可读） */}
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

      {/* 前景文案 */}
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
              <h1
                style={{
                  fontSize: 48,
                  lineHeight: 1.06,
                  fontWeight: 900,
                  margin: '0 0 10px',
                  letterSpacing: '-0.02em',
                }}
              >
                {heading}
              </h1>
            )}
            {subheading && (
              <p style={{ opacity: 0.9, fontSize: 16, margin: 0 }}>{subheading}</p>
            )}
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

      {/* 开发环境的简易诊断条 */}
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
              ? `Video OK: ${okSrcs.join(', ')}`
              : 'No video found, showing poster'
            : 'Checking /hero.webm, /hero.mp4 ...'}
        </div>
      )}
    </section>
  )
}
