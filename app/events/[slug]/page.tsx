import { notFound } from 'next/navigation'
import Link from 'next/link'
import { sanityClient } from '@/lib/sanity.client'
import { urlFor } from '@/lib/sanity.image'

type EventDoc = {
  _id: string
  title?: string
  date?: string
  lineup?: string[]
  description?: string
  image?: any
  slug?: { current?: string }
}

export const revalidate = 60

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await sanityClient.fetch(
    `*[_type=="event" && published==true && defined(slug.current)]{ "slug": slug.current }`
  )
  return slugs.map(s => ({ slug: s.slug }))
}

async function getEvent(slug: string): Promise<EventDoc | null> {
  const doc = await sanityClient.fetch(
    `*[_type=="event" && slug.current==$slug][0]{ _id,title,date,lineup,description,image,slug }`,
    { slug }
  )
  return doc || null
}

export default async function EventDetail({ params }: { params: { slug: string } }) {
  const doc = await getEvent(params.slug)
  if (!doc) notFound()

  const cover = doc.image ? urlFor(doc.image).width(1600).height(900).fit('crop').url() : null

  return (
    <main style={{ color:'#fff', background:'#000', minHeight:'100vh', fontFamily:'ui-sans-serif, system-ui' }}>
      <div style={{ position:'relative', aspectRatio:'16/7', background:'#0b0b0b' }}>
        {cover && <img src={cover} alt={doc.title || 'Event'} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', opacity:.95 }} />}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,0,0,.0), rgba(0,0,0,.85))' }} />
      </div>

      <section style={{ maxWidth:960, margin:'-80px auto 40px', padding:'0 16px' }}>
        <div style={{ background:'#0b0b0b', border:'1px solid #161616', borderRadius:16, padding:20 }}>
          <div style={{ fontSize:12, opacity:.8, marginBottom:6 }}>{doc.date || 'TBA'}</div>
          <h1 style={{ margin:'0 0 10px', fontSize:30, fontWeight:900 }}>{doc.title || 'Untitled Event'}</h1>
          {doc.lineup?.length ? <div style={{ marginBottom:12, opacity:.9 }}>{doc.lineup.join(' · ')}</div> : null}
          {doc.description && <p style={{ margin:0, lineHeight:1.6, opacity:.95 }}>{doc.description}</p>}

          <div style={{ marginTop:16, display:'flex', gap:12 }}>
            <a href="/events" className="btn" style={{ padding:'10px 14px', border:'1px solid #333', borderRadius:999 }}>Back to Events</a>
            <a href="#" className="btn" style={{ padding:'10px 14px', borderRadius:999, background:'#9A7BFF', color:'#000', fontWeight:800 }}>Get Tickets</a>
          </div>
        </div>
      </section>
    </main>
  )
}
