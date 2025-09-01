'use client'
import { useMemo, useState } from 'react'

type Event = {
  _id: string
  title?: string
  date?: string // YYYY-MM-DD
  lineup?: string[]
  image?: { asset?: { _ref?: string; _type?: string } } | any
  slug?: { current?: string }
  ticketUrl?: string
  ageRestriction?: string
  priceFrom?: number
  soldOut?: boolean
  genres?: string[]
  cover?: string // 我们会从父组件传入已生成的 URL（可选）
}

function parseDate(s?: string) {
  if (!s) return null
  const d = new Date(s + 'T00:00:00Z')
  return Number.isNaN(+d) ? null : d
}

export default function TicketsGrid({ events }: { events: Event[] }) {
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState<string>('all')
  const [maxPrice, setMaxPrice] = useState<number | ''>('')
  const [onlyUpcoming, setOnlyUpcoming] = useState(true)

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
      return true
    })
  }, [events, query, genre, maxPrice, onlyUpcoming, todayStr])

  return (
    <div>
      {/* 过滤条 */}
      <div style={{ display:'grid', gap:10, gridTemplateColumns:'1fr 1fr 1fr 1fr', margin:'0 0 14px' }}>
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
        <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:14 }}>
          <input type="checkbox" checked={onlyUpcoming} onChange={e=>setOnlyUpcoming(e.target.checked)} />
          Upcoming only
        </label>
      </div>

      {/* 列表 */}
      <div style={{ display:'grid', gap:14, gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))' }}>
        {filtered.map(e => {
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

      {/* 空状态 */}
      {!filtered.length && (
        <div style={{ textAlign:'center', color:'#9a9a9a', padding:'24px 0' }}>
          No events matched your filters.
        </div>
      )}
    </div>
  )
}
