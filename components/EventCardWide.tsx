'use client'
import Link from 'next/link'

export type EventItem = {
  _id: string
  title: string
  slug?: { current: string } | string
  date?: string
  cover?: { url?: string } | string
  lineup?: string[]
  priceFrom?: number
  ticketUrl?: string
  soldOut?: boolean
}

function fmtDate(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short'
  }).toUpperCase()
}

export default function EventCardWide({ ev }: { ev: EventItem }) {
  const slug = typeof ev.slug === 'string' ? ev.slug : ev.slug?.current
  const href = slug ? `/events/${slug}` : '#'
  const img =
    typeof ev.cover === 'string' ? ev.cover :
    (ev.cover?.url ?? '/placeholder-event.jpg')

  return (
    <div
      className="event-card"
      style={{
        width: 360,
        minWidth: 360,
        height: 220,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        background: '#111',
        boxShadow: '0 8px 24px rgba(0,0,0,.35)'
      }}
    >
      <img
        src={img}
        alt={ev.title}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(.78)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,.15) 0%, rgba(0,0,0,.55) 65%, rgba(0,0,0,.85) 100%)'
        }}
      />
      {/* 顶部角标 */}
      <div style={{ position: 'absolute', top: 10, left: 12, display: 'flex', gap: 8 }}>
        <span
          style={{
            padding: '6px 10px',
            borderRadius: 999,
            background: '#fff',
            color: '#000',
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: .6
          }}
        >
          {fmtDate(ev.date)}
        </span>
        {ev.soldOut ? (
          <span
            style={{
              padding: '6px 10px',
              borderRadius: 999,
              background: '#ff2d55',
              color: '#fff',
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: .6
            }}
          >
            SOLD OUT
          </span>
        ) : null}
      </div>

      {/* 底部信息 */}
      <div
        style={{
          position: 'absolute',
          left: 14,
          right: 14,
          bottom: 12,
          display: 'grid',
          gap: 8,
          color: '#fff'
        }}
      >
        <h3 style={{ margin: 0, fontSize: 18, lineHeight: 1.2, fontWeight: 900 }}>
          {ev.title}
        </h3>
        {ev.lineup?.length ? (
          <p
            style={{
              margin: 0,
              fontSize: 13,
              opacity: .9,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
            title={ev.lineup.join(' · ')}
          >
            {ev.lineup.slice(0, 3).join(' · ')}
            {ev.lineup.length > 3 ? ' …' : ''}
          </p>
        ) : null}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, opacity: .9 }}>
            {typeof ev.priceFrom === 'number' ? `FROM £${ev.priceFrom.toFixed(2)}` : ''}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            {ev.ticketUrl ? (
              <a
                href={ev.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{
                  padding: '8px 12px',
                  background: ev.soldOut ? '#444' : '#fff',
                  color: ev.soldOut ? '#aaa' : '#000',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 800,
                  textDecoration: 'none'
                }}
              >
                {ev.soldOut ? 'JOIN WAITLIST' : 'TICKETS'}
              </a>
            ) : null}
            {href !== '#' ? (
              <Link
                href={href}
                className="btn"
                style={{
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,.14)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,.24)',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 800,
                  textDecoration: 'none'
                }}
              >
                DETAILS
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
