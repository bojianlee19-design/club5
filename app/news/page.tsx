import { sanityClient } from '@/lib/sanity.client'
import { urlFor } from '@/lib/sanity.image'

type Block = {
  _type?: string
  children?: Array<{ _type?: string; text?: string }>
}
type News = {
  _id: string
  title?: string
  slug?: { current?: string }
  image?: any
  content?: Block[]
  published?: boolean
}

export const revalidate = 60

// 提取富文本的纯文本摘要（不依赖额外库，足够列表页使用）
function excerpt(blocks?: Block[], maxLen = 140) {
  if (!blocks || blocks.length === 0) return ''
  const texts: string[] = []
  for (const b of blocks) {
    if (b?._type === 'block' && Array.isArray(b.children)) {
      for (const span of b.children) {
        if (span?._type === 'span' && span.text) texts.push(span.text)
      }
    }
    if (texts.length >= maxLen) break
  }
  const joined = texts.join(' ').trim().replace(/\s+/g, ' ')
  return joined.length > maxLen ? joined.slice(0, maxLen) + '…' : joined
}

export default async function NewsPage() {
  const items: News[] = await sanityClient.fetch(
    `*[_type=="news" && published==true]|order(_createdAt desc){
      _id, title, slug, image, content, published
    }`
  )

  return (
    <main style={{ minHeight:'100vh', color:'#fff', background:'#000', padding:24, fontFamily:'ui-sans-serif, system-ui' }}>
      <h1 style={{ fontSize:28, fontWeight:700, marginBottom:16 }}>News</h1>

      {(!items || items.length === 0) && (
        <p style={{ opacity:.7 }}>No news yet.</p>
      )}

      <div style={{ display:'grid', gap:16 }}>
        {items?.map((n) => {
          const cover = n.image ? urlFor(n.image).width(1200).height(630).fit('crop').url() : null
          const sub = excerpt(n.content, 160)
          // 如需详情页，可把 <article> 改成 <a href={`/news/${n.slug?.current || n._id}`}> 包裹
          return (
            <article key={n._id} style={{ display:'grid', gap:12, gridTemplateColumns:'160px 1fr', alignItems:'start', border:'1px solid #222', borderRadius:12, padding:12, background:'#0b0b0b' }}>
              <div style={{ borderRadius:8, overflow:'hidden', background:'#111', aspectRatio:'16/9' }}>
                {cover ? (
                  <img src={cover} alt={n.title || 'News'} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                ) : (
                  <div style={{ width:'100%', height:'100%', display:'grid', placeItems:'center', color:'#aaa' }}>No image</div>
                )}
              </div>
              <div>
                <h3 style={{ margin:'4px 0 8px', fontSize:18, fontWeight:700 }}>{n.title || 'Untitled'}</h3>
                {sub && <p style={{ margin:0, opacity:.85, lineHeight:1.5 }}>{sub}</p>}
              </div>
            </article>
          )
        })}
      </div>
    </main>
  )
}
