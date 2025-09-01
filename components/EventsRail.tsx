'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type AnyEvent = {
  id?: string
  _id?: string
  title?: string
  name?: string
  slug?: string | { current?: string }
  date?: string
  startDate?: string
  datetime?: string
  imageUrl?: string
  bannerUrl?: string
  cover?: string
  poster?: string
  mainImage?: { url?: string }
}

function pickTitle(e: AnyEvent) {
  return e.title || e.name || 'Untitled'
}
function pickDate(e: AnyEvent) {
  const raw = e.date || e.startDate || e.datetime
  if (!raw) return ''
  const d = new Date(raw)
  if (isNaN(d.getTime())) return String(raw)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
function pickSlug(e: AnyEvent) {
  return (typeof e.slug === 'string' ? e.slug : e.slug?.current) || e._id || e.id || ''
}
function pickImg(e: AnyEvent) {
  return (
    e.imageUrl ||
    e.bannerUrl ||
    e.cover ||
    e.poster ||
    e.mainImage?.url ||
    '/fallback-event.jpg' // 如无就会用占位
  )
}

export default function EventsRail() {
  const [events, setEvents] = useState<AnyEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const railRef = useRef<HTMLDivElement>(null)

  // 拉数据：优先 /api/events（你已有），失败再尝试 /api/news 或空
  useEffect(() => {
    let dead = false
    ;(async () => {
      try {
        setLoading(true)
        const r = await fetch('/api/events', { cache: 'no-store' })
        if (!r.ok) throw new Error('events api not ok')
        const data = await r.json()
        if (!dead) setEvents(Array.isArray(data) ? data : data?.items || [])
      } catch (e) {
        console.error(e)
        if (!dead) setErr('failed')
      } finally {
        if (!dead) setLoading(false)
      }
    })()
    return () => {
      dead = true
    }
  }, [])

  // 为了无缝循环，复制一份
  const doubled = useMemo(() => {
    if (!events?.length) return []
    return [...events, ...events]
  }, [events])

  // 自动匀速滚动（并支持拖拽）
  useEffect(() => {
    const el = railRef.current
    if (!el || !events.length) return

    let raf = 0
    let last = performance.now()
    const speed = 0.3 // 像素/帧，越大滚得越快
    const step = (t: number) => {
      const dt = t - last
      last = t
      el.scrollLeft += speed * (dt / (1000 / 60)) // 近似 60fps 基准
      // 到尾了就重置到中间前半段，实现循环
      if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft = 0
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)

    // 拖拽
    let isDown = false
    let startX = 0
    let startLeft = 0
    const onDown = (e: MouseEvent | TouchEvent) => {
      isDown = true
      cancelAnimationFrame(raf)
      const pageX = 'touches' in e ? e.touches[0].pageX : (e as MouseEvent).pageX
      startX = pageX
      startLeft = el.scrollLeft
    }
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDown) return
      const pageX = 'touches' in e ? e.touches[0].pageX : (e as MouseEvent).pageX
      const dx = pageX - startX
      el.scrollLeft = startLeft - dx
    }
    const onUp = () => {
      if (!isDown) return
      isDown = false
      last = performance.now()
      raf = requestAnimationFrame(step)
    }
    el.addEventListener('mousedown', onDown)
    el.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    el.addEventListener('touchstart', onDown, { passive: true })
    el.addEventListener('touchmove', onMove, { passive: true })
    el.addEventListener('touchend', onUp)

    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('mousedown', onDown)
      el.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      el.removeEventListener('touchstart', onDown)
      el.removeEventListener('touchmove', onMove)
      el.removeEventListener('touchend', onUp)
    }
  }, [events])

  if (loading) {
    return <div className="text-zinc-400 py-12">Loading events…</div>
  }
  if (err || !events.length) {
    return <div className="text-zinc-400 py-12">No upcoming events yet.</div>
  }

  return (
    <div className="relative">
      <div
        ref={railRef}
        className="overflow-x-auto whitespace-nowrap select-none no-scrollbar"
        style={{ scrollBehavior: 'auto' }}
      >
        {doubled.map((e, idx) => {
          const title = pickTitle(e)
          const dateText = pickDate(e)
          const slug = pickSlug(e)
          const img = pickImg(e)
          return (
            <Link
              key={`${slug}-${idx}`}
              href={slug ? `/events/${slug}` : '#'}
              className="inline-block align-top mr-4"
              prefetch={false}
            >
              <article className="relative w-[320px] h-[420px] rounded-2xl overflow-hidden bg-[#0c0c0c]">
                {/* 背景图 */}
                <div className="absolute inset-0">
                  <Image
                    src={img}
                    alt={title}
                    fill
                    sizes="320px"
                    className="object-cover"
                    unoptimized={img.startsWith('/')}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                </div>
                {/* 文案 */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  {dateText && (
                    <div className="text-xs tracking-wide uppercase text-zinc-300 mb-1">{dateText}</div>
                  )}
                  <h3 className="text-xl font-semibold text-white leading-tight line-clamp-2">{title}</h3>
                  <div className="mt-3 inline-flex items-center text-[13px] text-white/90 rounded-full bg-white/10 px-3 py-1 backdrop-blur">
                    View Details →
                  </div>
                </div>
              </article>
            </Link>
          )
        })}
      </div>

      {/* 轻微两侧渐隐，MOS 风格 */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0b0b0b] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0b0b0b] to-transparent" />

      {/* 隐藏滚动条（无需额外插件） */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
