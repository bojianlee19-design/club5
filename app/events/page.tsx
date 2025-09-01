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
  ticketUrl?: string
}

export const revalidate = 60

export default async function EventsPage() {
  const events: Event[] = await sanityClient.fetch(
    `*[_type=="event" && published==true]|order(coalesce(date,_createdAt) asc){
      _id,title,date,lineup,description,image,slug,ticketUrl
    }`
  )

  return (
    <main style={{ padding:24, fontFamily:'ui-sans-serif, system-ui', color:'#fff', background:'#000', minHeight:'100vh' }}>
      <h1 style={{ fontSize:28, fontWeight:700, marginBottom:16 }}>Events</h1>
      <ul style={{ display:'grid', gap:16, listStyle:'none', padding:0 }}>
        {events.map(e => {
          const cover = e.image ? urlFor(e.image).width(1200).height(750).fit('crop').url() : null
          const detailHref = e.slug?.current ? `/events/${e.slug.current}` : '/events'
          const ticketHref = e.ticketUrl || detailHref
          return (
            <li key={e._id} style={{ border:'1px solid #161616', borderRadius:12, overflow:'hidden', background:'#0b0b0b' }}>
              {cover && <img src={cover} alt={e.title || 'Event'} style={{ width:'100%', height:220, objectFit:'cover', display:'block' }} />}
              <div style={{ padding:14 }}>
                <div style={{ fontSize:12, opacity:.8, marginBottom:6 }}>{e.date || 'TBA'}</div>
                <h3 style={{ margin:'0 0 6px', fontSize:20, fontWeight:800 }}>{e.title || 'Untitled'}</h3>
                {e.lineup?.length ? <div style={{ opacity:.8, marginBottom:10 }}>{e.lineup.join(' · ')}</div> : null}
                <div style={{ display:'flex', gap:10 }}>
                  <Link href={detailHref} className="btn btn-ghost">Details</Link>
                  <a href={ticketHref} target={e.ticketUrl ? '_blank' : undefined} rel={e.ticketUrl ? 'noreferrer' : undefined} className="btn btn-primary">Tickets</a>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
