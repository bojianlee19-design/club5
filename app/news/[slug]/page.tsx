import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { sanityClient } from '@/lib/sanity.client'
import { urlFor } from '@/lib/sanity.image'

type NewsDoc = {
  _id: string
  title?: string
  slug?: { current?: string }
  image?: any
  content?: any[]
  date?: string
}

export const revalidate = 60

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await sanityClient.fetch(
    `*[_type=="news" && published==true && defined(slug.current)]{ "slug": slug.current }`
  )
  return slugs.map(s => ({ slug: s.slug }))
}

async function getNews(slug: string): Promise<NewsDoc | null> {
  const doc = await sanityClient.fetch(
    `*[_type=="news" && slug.current==$slug][0]{ _id,title,slug,image,content,date }`,
    { slug }
  )
  return doc || null
}

const components = {
  types: {
    image: ({ value }: any) =>
      value ? (
        <img
          src={urlFor(value).width(1600).fit('max').url()}
          alt=""
          style={{ width:'100%', borderRadius:12, margin:'12px 0' }}
        />
      ) : null,
  },
  block: {
    h2: ({ children }: any) => <h2 style={{ fontSize:22, margin:'16px 0 8px', fontWeight:800 }}>{children}</h2>,
    h3: ({ children }: any) => <h3 style={{ fontSize:18, margin:'14px 0 6px', fontWeight:800 }}>{children}</h3>,
    normal: ({ children }: any) => <p style={{ lineHeight:1.7, margin:'10px 0', opacity:.95 }}>{children}</p>,
  },
  marks: {
    strong: ({ children }: any) => <strong style={{ fontWeight:800 }}>{children}</strong>,
    em: ({ children }: any) => <em style={{ opacity:.95 }}>{children}</em>,
    link: ({ value, children }: any) => <a href={value?.href} target="_blank" rel="noreferrer" style={{ textDecoration:'underline' }}>{children}</a>,
  },
}

export default async function NewsDetail({ params }: { params: { slug: string } }) {
  const doc = await getNews(params.slug)
  if (!doc) notFound()

  const cover = doc.image ? urlFor(doc.image).width(1800).height(900).fit('crop').url() : null

  return (
    <main style={{ color:'#fff', background:'#000', minHeight:'100vh', fontFamily:'ui-sans-serif, system-ui' }}>
      {cover && (
        <div style={{ position:'relative', aspectRatio:'16/6', background:'#0b0b0b' }}>
          <img src={cover} alt={doc.title || 'News'} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,0,0,.0), rgba(0,0,0,.9))' }} />
        </div>
      )}

      <article style={{ maxWidth:860, margin:'-80px auto 40px', padding:'0 16px' }}>
        <div style={{ background:'#0b0b0b', border:'1px solid #161616', borderRadius:16, padding:'20px 20px' }}>
          {doc.date && <div style={{ fontSize:12, opacity:.75, marginBottom:6 }}>{doc.date}</div>}
          <h1 style={{ margin:'0 0 10px', fontSize:30, fontWeight:900 }}>{doc.title || 'Untitled'}</h1>
          {doc.content?.length ? <PortableText value={doc.content} components={components as any} /> : <p style={{ opacity:.8 }}>No content.</p>}
          <div style={{ marginTop:16 }}>
            <a href="/news" style={{ textDecoration:'underline' }}>Back to News</a>
          </div>
        </div>
      </article>
    </main>
  )
}
