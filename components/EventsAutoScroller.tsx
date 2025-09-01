'use client'
import { useEffect, useRef, useState } from 'react'
import EventCardWide, { EventItem } from './EventCardWide'

type Props = {
  events: EventItem[]
  title?: string
  rows?: 1 | 2
  speed?: number        // 像素/秒，越大越快
  gap?: number          // 卡片间距
  cardWidth?: number    // 卡片宽度（需与 EventCardWide 里一致：360）
  pauseOnHover?: boolean
}

export default function EventsAutoScroller({
  events,
  title = 'Upcoming at Hazy',
  rows = 2,
  speed = 80,
  gap = 16,
  cardWidth = 360,
  pauseOnHover = true,
}: Props) {
  const sanitized = (events ?? []).filter(Boolean)
  if (!sanitized.length) return null

  return (
    <section style={{ marginTop: 32 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '0 8px 12px' }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>{title}</h2>
        <a href="/events" style={{ fontSize: 14, color: '#fff', opacity: .8, textDecoration: 'none' }}>View all →</a>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        <Rail
          items={sanitized}
          reverse={false}
          speed={speed}
          gap={gap}
          cardWidth={cardWidth}
          pauseOnHover={pauseOnHover}
        />
        {rows === 2 ? (
          <Rail
            items={sanitized}
            reverse
            speed={speed * 0.9}
            gap={gap}
            cardWidth={cardWidth}
            pauseOnHover={pauseOnHover}
          />
        ) : null}
      </div>
    </section>
  )
}

function Rail({
  items,
  reverse,
  speed,
  gap,
  cardWidth,
  pauseOnHover,
}: {
  items: EventItem[]
  reverse?: boolean
  speed: number
  gap: number
  cardWidth: number
  pauseOnHover: boolean
}) {
  // 只需测量「一份内容」的宽度，动画滚动这段距离即可
  const stripRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = stripRef.current
    if (!el) return
    const measure = () => {
      // 单份 strip 的总宽度：N * (卡片宽 + 间距)
      const n = items.length
      const total = n * (cardWidth + gap)
      setDistance(total)
      setReady(true)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [items.length, cardWidth, gap])

  // 计算动画时长（距离/速度）
  const durationSec = distance > 0 ? Math.max(12, distance / speed) : 12

  // 把 items 复制两份实现无缝循环
  const doubled = [...items, ...items]

  return (
    <div
      className="rail-viewport"
      style={{
        position: 'relative',
        overflow: 'hidden',
        maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)'
      }}
    >
      <div
        className="rail-track"
        style={{
          display: 'flex',
          gap,
          willChange: 'transform',
          animation: ready
            ? `${reverse ? 'marqueeR' : 'marquee'} ${durationSec}s linear infinite`
            : 'none',
          animationPlayState: pauseOnHover ? 'running' : 'running'
        }}
      >
        {/* 单份 strip（用于测距，同时渲染实际卡片） */}
        <div ref={stripRef} style={{ display: 'flex', gap }}>
          {items.map(ev => (
            <EventCardWide key={ev._id} ev={ev} />
          ))}
        </div>
        {/* 第二份 strip（无缝衔接） */}
        <div style={{ display: 'flex', gap }}>
          {doubled.slice(0, items.length).map((ev, i) => (
            <EventCardWide key={`${ev._id}-dup-${i}`} ev={ev} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .rail-viewport:hover .rail-track {
          animation-play-state: ${pauseOnHover ? 'paused' : 'running'};
        }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-${distance}px); }
        }
        @keyframes marqueeR {
          0%   { transform: translateX(-${distance}px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
