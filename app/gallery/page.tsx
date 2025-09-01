import { sanityClient } from '@/lib/sanity.client'
import { urlFor } from '@/lib/sanity.image'

type Item = { _id: string; image?: any; caption?: string }

export const revalidate = 60 // ISR：60秒刷新一次

export default async function GalleryPage() {
  // 仅取已发布的图片，按创建时间倒序
  const items: Item[] = await sanityClient.fetch(
    `*[_type=="galleryImage" && published==true]|order(_createdAt desc){
      _id, image, caption
    }`
  )

  return (
    <main style={{ minHeight:'100vh', color:'#fff', background:'#000', padding:24, fontFamily:'ui-sans-serif, system-ui' }}>
      <h1 style={{ fontSize:28, fontWeight:700, marginBottom:16 }}>Gallery</h1>

      {(!items || items.length === 0) && (
        <p style={{ opacity:.7 }}>No images yet.</p>
      )}

      <div style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))' }}>
        {items?.map((it) => {
          const hasImage = !!it.image
          const imgUrl = hasImage ? urlFor(it.image).width(1200).height(800).fit('crop').url() : null
          return (
            <div key={it._id} style={{ borderRadius:12, overflow:'hidden', background:'#111', border:'1px solid #222' }}>
              {imgUrl ? (
                <img
                  src={imgUrl}
                  alt={it.caption || 'Gallery image'}
                  style={{ width:'100%', height:220, objectFit:'cover', display:'block' }}
                />
              ) : (
                <div style={{ height:220, display:'grid', placeItems:'center', opacity:.7 }}>No image</div>
              )}
              {it.caption && (
                <div style={{ padding:'8px 10px', fontSize:14, opacity:.85 }}>{it.caption}</div>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}
