'use client'
import {useEffect, useRef, useState} from 'react'

type EventItem = {
  id: string
  title: string
  slug?: string
  date?: string
  imageUrl?: string
}

export default function EventsRail() {
  const [items, setItems] = useState<EventItem[]>([])
  const railRef = useRef<HTMLDivElement|null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch('/api/events', { cache: 'no-store' })
        const json = await res.json()
        if (alive) setItems(json || [])
      } catch { /* ignore */ }
    })()
    return () => { alive = false }
  }, [])

  // 自动轮播（每 4.5s 滚一屏，末尾回到起点）
  useEffect(() => {
    const el = railRef.current
    if (!el || items.length <= 1) return
    const tick = () => {
      const w = el.clientWidth
      const nearEnd = el.scrollLeft + w*1.5 >= el.scrollWidth
      el.scrollTo({ left: nearEnd ? 0 : el.scrollLeft + w, behavior: 'smooth' })
    }
    const id = setInterval(tick, 4500)
    return () => clearInterval(id)
  }, [items.length])

  if (!items.length) return null

  return (
    <section className="wrap">
      <div className="bar">
        <h2>What’s On</h2>
        <a className="more" href="/events">View all</a>
      </div>

      <div className="rail" ref={railRef}>
        {items.map(ev => {
          const href = ev.slug ? `/events/${ev.slug}` : '#'
          const day = ev.date ? new Date(ev.date).toLocaleDateString(undefined, { day:'2-digit' }) : ''
          const mon = ev.date ? new Date(ev.date).toLocaleDateString(undefined, { month:'short', year:'numeric' }) : ''
          return (
            <a key={ev.id} className="card" href={href}>
              <div className="img">
                {ev.imageUrl ? <img src={ev.imageUrl} alt={ev.title} /> : <div className="ph" />}
                {day && <div className="badge">
                  <div className="d">{day}</div>
                  <div className="m">{mon}</div>
                </div>}
              </div>
              <div className="meta">
                <div className="title">{ev.title}</div>
                <div className="link">View Details →</div>
              </div>
            </a>
          )
        })}
      </div>

      <style jsx>{`
        .wrap{padding:40px 6vw 10px}
        .bar{display:flex;align-items:end;justify-content:space-between;margin-bottom:16px}
        h2{margin:0;font-size:clamp(22px,3.5vw,32px);color:#fff;font-weight:800}
        .more{color:#fff;opacity:.9;text-decoration:underline}
        .rail{display:flex;gap:16px;overflow-x:auto;padding-bottom:8px;scroll-snap-type:x mandatory}
        .rail::-webkit-scrollbar{height:6px}.rail::-webkit-scrollbar-thumb{background:#444;border-radius:3px}
        .card{flex:0 0 320px;scroll-snap-align:start;border-radius:14px;overflow:hidden;background:#0b0b0b;border:1px solid #1f1f1f;color:#fff;text-decoration:none}
        .img{position:relative;height:200px;background:#111}
        .img img{width:100%;height:100%;object-fit:cover;display:block}
        .ph{width:100%;height:100%;background:linear-gradient(180deg,#1b1b1b,#0f0f0f)}
        .badge{position:absolute;left:10px;top:10px;background:rgba(0,0,0,.7);border:1px solid #fff;border-radius:12px;padding:6px 8px;text-align:center;line-height:1}
        .badge .d{font-weight:800;font-size:18px}
        .badge .m{font-size:11px;opacity:.9}
        .meta{padding:12px}
        .title{font-weight:700;margin-bottom:6px}
        .link{opacity:.9;text-decoration:underline}
      `}</style>
    </section>
  )
}
