import TicketsGrid from '@/components/TicketsGrid'
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
  soldOut?: boolean
  genres?: string[]
}

export const revalidate = 60

export default async function TicketsPage() {
  const events: Event[] = await sanityClient.fetch(
    `*[_type=="event" && published==true]
     | order(coalesce(date,_createdAt) asc){
      _id,title,date,lineup,image,slug,ticketUrl,ageRestriction,priceFrom,soldOut,genres
    }`
  )

  // 预先生成封面 URL（传给客户端，避免在客户端再依赖 urlFor）
  const withCovers = events.map(e => ({
    ...e,
    cover: e.image ? urlFor(e.image).width(1200).height(800).fit('crop').url() : undefined
  }))

  return (
    <main style={{ minHeight:'100vh', background:'#000', color:'#fff', fontFamily:'ui-sans-serif, system-ui' }}>
      <div className="container" style={{ padding:'24px 20px' }}>
        <h1 style={{ fontSize:28, fontWeight:900, marginBottom:8 }}>Tickets</h1>
        <p style={{ color:'#aaa', margin:'0 0 16px' }}>The city’s best house, techno & electronic nights — every week.</p>
        <TicketsGrid events={withCovers} />
      </div>
    </main>
  )
}
