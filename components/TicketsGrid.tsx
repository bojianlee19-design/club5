'use client'
import { useMemo, useState } from 'react'

type Event = {
  _id: string
  title?: string
  date?: string // YYYY-MM-DD
  lineup?: string[]
  image?: any
  slug?: { current?: string }
  ticketUrl?: string
  ageRestriction?: string
  priceFrom?: number
  soldOut?: boolean
  genres?: string[]
  cover?: string // 父组件传入已生成的 URL
}

function isWeekend(dateStr?: string) {
  if (!dateStr) return false
  const d = new Date(dateStr + 'T00:00:00')
  const day = d.getDay() // 0 Sun, 6 Sat
  return day === 0 || day === 6
}
function isWeekday(dateStr?: string) {
  if (!dateStr) return false
  const d = new Date(dateStr + 'T00:00:00')
  const day = d.getDay()
  return day >= 1 && day <= 5
}

export default function TicketsGrid({ events }: { events: Event[] }) {
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState<string>('all')
  const [maxPrice, setMaxPrice] = useState<number | ''>('')
  const [onlyUpcoming, setOnlyUpcoming] = useState(true)
  const [dayFilter, setDayFilter] = useState<'all' | 'weekend' | 'weekday'>('all')
  const [sortKey, setSortKey] = useState<'date' | 'price' | 'title'>('date')

  const allGenres = useMemo(() => {
    const set = new Set<string>()
    for (const e of events) (e.genres || []).forEach(g => g && set.add(g))
    return ['all', ...Array.from(set).sort((a,b)=>a.localeCompare(b))]
  }, [events])

  const todayStr = new Date().toISOString().slice(0,10)

  const filtered = useMemo(() => {
    return events.filter(e => {
      if (onlyUpcoming && e.date && e.date < todayStr) return false
      if (genre !== 'all' && !(e.genres || []).includes(genre)) return false
      if (maxPrice !== '' && typeof e.priceFrom === 'number' && e.priceFrom > maxPrice) return false
      if (query) {
        const q = query.toLowerCase()
        const hay = [
          e.title || '',
          (e.lineup || []).join(' '),
          (e.genres || []).join(' ')
        ].join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      if (dayFilter === 'weekend' && !isWeekend(e.date)) return false
      if (dayFilter === 'weekday' && !isWeekday(e.date)) return false
      return true
    })
  }, [events, query, genre, maxPrice, onlyUpcoming, dayFilter, todayStr])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    arr.sort((a, b) => {
      // 先把 SOLD OUT 放到最后
      if (!!a.soldOut !== !!b.soldOut) return a.soldOut ? 1 : -1

      // 再按选择的 sortKey
      if (sortKey === 'date') {
        const da = a.date || '9999-12-31'
        const db = b.date || '9999-12-31'
        return da.localeCompare(db)
      }
      if (sortKey === 'price') {
        const pa = typeof a.priceFrom === 'number' ? a.priceFrom : Number.POSITIVE_INFINITY
        const pb = typeof b.priceFrom === 'number' ? b.priceFrom : Number.POSITIVE_INFINITY
        return pa - pb
      }
      // title
      return (a.title || '').localeCompare(b.title || '')
    })
    return arr
  }, [filtered, sortKey])

  return (
    <div>
      {/* 过滤条 */}
      <div style={{ display:'grid', gap:10, gridTemplateColumns:'1.2fr 1fr 1fr 1.2fr 1fr 1fr', margin:'0 0 14px' }}>
        <input
          placeholder="Search title / lineup…"
          value={query}
          onChange={e=>setQuery(e.target.value)}
          style={{ background:'#0f0f0f', border:'1px solid #222', color:'#fff', borderRadius:999, padding:'10px 12px' }}
        />
        <select
          value={genre}
          onChange={e=>setGenre(e.target.value)}
          style={{ background:'#0f0f0f', border:'1px solid #222', color:'#fff', borderRadius:999, padding:'10px 12px' }}
        >
          {allGenres.map(g => <option key={g} value={g}>{g === 'all' ? 'All genres' : g}</option>)}
        </select>
        <input
          type="number"
          inputMode="numeric"
          placeholder="Max price (£)"
          value={maxPrice}
          onChange={e=>setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
          style={{ background:'#0f0f0f', border:'1px solid #222', color:'#fff', borderRadius:999, padding:'10px 12px' }}
        />
        <select
          value={dayFilter}
          onChange={e=>setDayFilter(e.target.value as any)}
          style={{ background:'#0f0f0f', border:'1px solid #222', color:'#fff', borderRadius:999, padding:'10px 12px' }}
        >
          <option value="all">All days</option>
          <option value="weekend">Weekend only</option>
          <option value="weekday">Weekdays only</option>
        </select>
        <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:14, padding:'0 8px' }}>
          <input type="checkbox" checked={onlyUpcoming} onChange={e=>setOnlyUpcoming(e.target.checked)} />
          Upcoming only
        </label>
        <select
          value={sortKey}
          onChange={e=>setSortKey(e.target.value as any)}
          style={{ background:'#0f0f0f', border:'1px solid #222', color:'#fff', borderRadius:999, padding:'10px 12px' }}
        >
          <option value="date">Sort by date</option>
          <option value="price">Sort by price</option>
          <option value="title">Sort by title</option>
        </select>
      </div>

      {/* 列表 */}
      <div style={{ display:'grid', gap:14, gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))' }}>
        {sorted.map(e => {
          const detailHref = e.slug?.current ? `/events/${e.slug.current}` : '/events'
          const ticketHref = e.ticketUrl || detailHref
          const sold = !!e.soldOut

          return (
            <article key={e._id} style={{ border:'1px solid #161616', borderRadius:14, overflow:'hidden', background:'#0b0b0b', position:'relative' }}>
              {/* 售罄角标 */}
              {sold && (
                <div style={{
                  position:'absolute', top:10, left:-48, transform:'rotate(-35deg)',
                  background:'#c01616', color:'#fff', padding:'6px 60px', fontWeight:900, letterSpacing:'.06em'
                }}>
                  SOLD OUT
                </div>
              )}

              <div style={{ aspectRatio:'4/3', background:'#111' }}>
                {e.cover ? (
                  <img src={e.cover} alt={e.title || 'Event'} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', filter: sold ? 'grayscale(60%)' : undefined }} />
                ) : null}
              </div>
              <div style={{ padding:12 }}>
                <div style={{ fontSize:12, opacity:.8, marginBottom:6 }}>{e.date || 'TBA'}</div>
                <h3 style={{ margin:'0 0 6px', fontSize:18, fontWeight:800 }}>{e.title || 'Untitled'}</h3>
                {e.lineup?.length ? <div style={{ opacity:.8, marginBottom:10 }}>{e.lineup.join(' · ')}</div> : null}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ color:'#bbb', fontSize:13 }}>
                    {typeof e.priceFrom === 'number' ? <>From £{e.priceFrom.toFixed(2)}</> : <>&nbsp;</>}
                    {e.ageRestriction ? <span style={{ marginLeft:8 }}>· {e.ageRestriction}</span> : null}
                  </div>
                  {sold ? (
                    <span className="btn btn-ghost" style={{ padding:'8px 12px', opacity:.6, cursor:'not-allowed' }} aria-disabled>Sold out</span>
                  ) : (
                    <a
                      href={ticketHref}
                      target={e.ticketUrl ? '_blank' : undefined}
                      rel={e.ticketUrl ? 'noreferrer' : undefined}
                      className="btn btn-primary"
                      style={{ padding:'8px 12px' }}
                    >
                      Buy
                    </a>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {!sorted.length && (
        <div style={{ textAlign:'center', color:'#9a9a9a', padding:'24px 0' }}>
          No events matched your filters.
        </div>
      )}
    </div>
  )
}
