import { sanityClient } from '@/lib/sanity.client'
import { urlFor } from '@/lib/sanity.image'

type Event = {
  _id: string
  title?: string
  date?: string
  lineup?: string[]
  image?: any
  slug?: { current?: string }
  ticketUrl?: string
  ageRestriction?: string
  priceFrom?: number
}

export const revalidate = 60

export default async function TicketsPage() {
  const events: Event[] = await sanityClient.fetch(
    `*[_type=="event" && published==true]|order(coalesce(date,_createdAt) asc){
      _id,title,date,lineup,image,slug,ticketUrl,ageRestriction,priceFrom
    }`
  )

  return (
    <main style={{ minHeight:'100vh', background:'#000', color:'#fff', fontFamily:'ui-sans-serif, system-ui' }}>
      <div className="container" style={{ padding:'24px 20px' }}>
        <h1 style={{ fontSize:28, fontWeight:900, marginBottom:14 }}>Tickets</h1>
        <p style={{ color:'#aaa', margin:'0 0 16px' }}>The city’s best house, techno & electronic nights — every week.</p>

        <div style={{ display:'grid', gap:14, gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {events.map(e => {
            const cover = e.image ? urlFor(e.image).width(1200).height(800).fit('crop').url() : null
            const href = e.ticketUrl || (e.slug?.current ? `/events/${e.slug.current}` : '/events')
            return (
              <article key={e._id} style={{ border:'1px solid #161616', borderRadius:14, overflow:'hidden', background:'#0b0b0b' }}>
                <div style={{ aspectRatio:'4/3', background:'#111' }}>
                  {cover && <img src={cover} alt={e.title || 'Event'} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />}
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
                    <a href={href} target={e.ticketUrl ? '_blank' : undefined} rel={e.ticketUrl ? 'noreferrer' : undefined}
                       className="btn btn-primary" style={{ padding:'8px 12px' }}>Buy</a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </main>
  )
}
