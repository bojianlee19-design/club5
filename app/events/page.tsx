import { sanityClient } from '@/lib/sanity.client'

type Event = {
  _id: string
  title: string
  date?: string
  lineup?: string[]
  description?: string
}

export const revalidate = 60

export default async function EventsPage() {
  const events: Event[] = await sanityClient.fetch(
    `*[_type=="event" && published==true]|order(coalesce(date, _createdAt) desc){
      _id,title,date,lineup,description
    }`
  )

  return (
    <main style={{ padding:24, fontFamily:'ui-sans-serif, system-ui' }}>
      <h1 style={{ fontSize:28, fontWeight:700, marginBottom:16 }}>Events</h1>
      <ul style={{ display:'grid', gap:16, listStyle:'none', padding:0 }}>
        {events.map(e => (
          <li key={e._id} style={{ border:'1px solid #eee', borderRadius:12, padding:16 }}>
            <h3 style={{ margin:'0 0 6px' }}>{e.title}</h3>
            {e.date && <div style={{ opacity:.7, marginBottom:6 }}>{e.date}</div>}
            {e.lineup?.length ? <div style={{ marginBottom:8 }}>{e.lineup.join(' · ')}</div> : null}
            {e.description && <p style={{ margin:0 }}>{e.description}</p>}
          </li>
        ))}
      </ul>
    </main>
  )
}
