import Link from 'next/link'
import { sanityClient } from '@/lib/sanity.client'
import { urlFor } from '@/lib/sanity.image'

type Event = {
  _id: string
  title?: string
  date?: string
  lineup?: string[]
  description?: string
  image?: any
  slug?: { current?: string }
}

export const revalidate = 60

export default async function EventsPage() {
  const events: Event[] = await sanityClient.fetch(
    `*[_type=="event" && published==true]|order(coalesce(date,_createdAt) asc){
      _id,title,date,lineup,description,image,slug
    }`
  )

  return (
    <main style={{ padding:24, fontFamily:'ui-sans-serif, system-ui', color:'#fff', background:'#000', minHeight:'100vh' }}>
      <h1 style={{ fontSize:28, fontWeight:700, marginBottom:16 }}>Events</h1>
      <ul style={{ display:'grid', gap:16, listStyle:'none', padding:0 }}>
        {events.map(e => {
          const cover = e.image ? urlFor(e.image).width(1200).height(750).fit('crop').url() : null
          const hasSlug = !!e.slug?.current
          return (
            <li key={e._id} style={{ border:'1px solid #161616', borderRadius:12, overflow:'hidden', background:'#0b0b0b' }}>
              {cover && <img src={cover} alt={e.title || 'Event'} style={{ width:'100%', height:220, objectFit:'cover', display:'block' }} />}
              <div style={{ padding:14 }}>
                <div style={{ fontSize:12, opacity:.8, marginBottom:6 }}>{e.date || 'TBA'}</div>
                <h3 style={{ margin:'0 0 6px', fontSize:20, fontWeight:800 }}>{e.title || 'Untitled'}</h3>
                {e.lineup?.length ? <div style={{ opacity:.8, marginBottom:10 }}>{e.lineup.join(' · ')}</div> : null}
                {hasSlug ? (
                  <Link href={`/events/${e.slug!.current!}`} className="btn" style={{ display:'inline-block', padding:'10px 14px', border:'1px solid #333', borderRadius:999 }}>
                    Details
                  </Link>
                ) : (
                  <span style={{ fontSize:12, opacity:.6 }}>No detail (slug missing)</span>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
