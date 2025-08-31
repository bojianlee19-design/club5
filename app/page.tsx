import { sanityClient } from '@/lib/sanity.client'
import { urlFor } from '@/lib/sanity.image'

type Item = { _id: string; image: any; caption?: string }

export const revalidate = 60 // ISR: 每 60 秒更新一次

export default async function Home() {
  const items: Item[] = await sanityClient.fetch(
    `*[_type=="galleryImage" && published==true]|order(_createdAt desc)[0...24]{ _id, image, caption }`
  )

  return (
    <main style={{ minHeight: '100vh', color:'#fff', background:'#000', padding:24, fontFamily:'ui-sans-serif, system-ui' }}>
      <h1 style={{ fontSize:28, fontWeight:700, marginBottom:16 }}>Hazy Club</h1>
      <div style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))' }}>
        {items.map(it => (
          <div key={it._id} style={{ borderRadius:12, overflow:'hidden', background:'#111', border:'1px solid #222' }}>
            <img
              src={urlFor(it.image).width(800).height(600).fit('crop').url()}
              alt={it.caption || 'Gallery'}
              style={{ width:'100%', height:160, objectFit:'cover', display:'block' }}
            />
          </div>
        ))}
      </div>
    </main>
  )
}
