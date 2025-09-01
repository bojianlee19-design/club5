import VideoHero from '@/components/VideoHero'
import { sanityClient } from '@/lib/sanity.client'
import { urlFor } from '@/lib/sanity.image'

type EventDoc = { _id: string; title?: string; date?: string; lineup?: string[]; image?: any; slug?: { current?: string }; ticketUrl?: string }
type GalleryDoc = { _id: string; image?: any; caption?: string }

export const revalidate = 60

export default async function Home() {
  const [events, gallery]: [EventDoc[], GalleryDoc[]] = await Promise.all([
    sanityClient.fetch(`*[_type=="event" && published==true]|order(coalesce(date,_createdAt) asc){ _id,title,date,lineup,image,slug,ticketUrl }`),
    sanityClient.fetch(`*[_type=="galleryImage" && published==true]|order(_createdAt desc)[0...12]{ _id,image,caption }`),
  ])

  const heroPoster = gallery?.[0]?.image ? urlFor(gallery[0].image).width(2000).height(1200).fit('crop').url() : undefined

  // 周末范围
  const now = new Date()
  const day = now.getDay() || 7 // 周日当 7
  const friday = new Date(now); friday.setDate(now.getDate() + (5 - day + 7) % 7)
  const sunday = new Date(friday); sunday.setDate(friday.getDate() + 2)
  const toDateStr = (d: Date) => d.toISOString().slice(0,10)

  const weekendEvents = events.filter(e => e.date && e.date >= toDateStr(friday) && e.date <= toDateStr(sunday)).slice(0,3)
  const gridEvents = events.slice(0, 6)

  // 跑马灯内容：未来 14 天活动
  const in2w = new Date(now); in2w.setDate(now.getDate() + 14)
  const marquee = (events
    .filter(e => e.date && e.date >= toDateStr(now) && e.date <= toDateStr(in2w))
    .map(e => e.title?.toUpperCase())
    .filter(Boolean) as string[]).join('  •  ')
    || 'HAZY CLUB — LONDON  •  HOUSE • TECHNO • ELECTRONIC'

  return (
    <main style={{ background:'#000', color:'#fff', minHeight:'100vh' }}>
      {/* 视频 HERO */}
      <VideoHero poster={heroPoster}>
        <div style={{ textAlign:'center' }}>
          <div style={{ width:84,height:84,borderRadius:'50%',border:'2px solid #888',display:'grid',placeItems:'center',fontWeight:900,letterSpacing:'.08em',margin:'0 auto 12px' }}>HC</div>
          <h1 style={{ fontSize:'clamp(28px, 5vw, 56px)', fontWeight:900, margin:'12px 0 6px' }}>HAZY CLUB — LONDON</h1>
          <p style={{ opacity:.9 }}>Home of late nights & heavy sound. House / Techno / Electronic.</p>
          <div style={{ display:'flex',gap:12,justifyContent:'center',marginTop:16,flexWrap:'wrap' }}>
            <a href="/tickets" className="btn btn-primary">Buy Tickets</a>
            <a href="/events" className="btn btn-ghost">All Events</a>
          </div>
        </div>
      </VideoHero>

      {/* 跑马灯 */}
      <section className="marquee" aria-label="Latest">
        <div className="marquee-track" style={{ paddingLeft: 24 }}>{marquee}  •  {marquee}</div>
      </section>

      <div className="container" style={{ padding:'24px 20px' }}>
        {/* 周末活动 */}
        <h2 className="section-title" style={{ display:'flex', gap:10, alignItems:'center' }}>
          <span>What’s on this weekend</span><span className="badge">Fri–Sun</span>
        </h2>
        {weekendEvents.length ? (
          <div className="grid">
            {weekendEvents.map(e => {
              const cover = e.image ? urlFor(e.image).width(1000).height(750).fit('crop').url() : null
              const detailHref = e.slug?.current ? `/events/${e.slug.current}` : '/events'
              const ticketHref = e.ticketUrl || detailHref
              return (
                <article key={e._id} className="card">
                  <div className="card-media">{cover && <img src={cover} alt={e.title || 'Event'} />}</div>
                  <div className="card-body">
                    <div className="badge" style={{ marginBottom:8 }}>{e.date || 'TBA'}</div>
                    <h3 style={{ margin:'0 0 6px', fontSize:18, fontWeight:800 }}>{e.title || 'Untitled'}</h3>
                    {e.lineup?.length ? <div className="muted" style={{ marginBottom:10 }}>{e.lineup.join(' · ')}</div> : null}
                    <div style={{ display:'flex', gap:10 }}>
                      <a href={detailHref} className="btn btn-ghost">Details</a>
                      <a href={ticketHref} target={e.ticketUrl ? '_blank' : undefined} rel={e.ticketUrl ? 'noreferrer' : undefined} className="btn btn-primary">Tickets</a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : <p className="muted">No listed events this weekend.</p>}

        {/* 全部活动宫格 */}
        <h2 className="section-title" style={{ marginTop:28 }}>All listings</h2>
        {gridEvents.length ? (
          <div className="grid">
            {gridEvents.map(e => {
              const cover = e.image ? urlFor(e.image).width(1000).height(750).fit('crop').url() : null
              const detailHref = e.slug?.current ? `/events/${e.slug.current}` : '/events'
              const ticketHref = e.ticketUrl || detailHref
              return (
                <article key={e._id} className="card">
                  <div className="card-media">{cover && <img src={cover} alt={e.title || 'Event'} />}</div>
                  <div className="card-body">
                    <div className="badge" style={{ marginBottom:8 }}>{e.date || 'TBA'}</div>
                    <h3 style={{ margin:'0 0 6px', fontSize:18, fontWeight:800 }}>{e.title || 'Untitled'}</h3>
                    {e.lineup?.length ? <div className="muted" style={{ marginBottom:10 }}>{e.lineup.join(' · ')}</div> : null}
                    <div style={{ display:'flex', gap:10 }}>
                      <a href={detailHref} className="btn btn-ghost">Details</a>
                      <a href={ticketHref} target={e.ticketUrl ? '_blank' : undefined} rel={e.ticketUrl ? 'noreferrer' : undefined} className="btn btn-primary">Tickets</a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : <p className="muted">No events yet.</p>}

        {/* 相册条 */}
        <h2 className="section-title" style={{ marginTop:28 }}>Last night at Hazy</h2>
        {gallery.length ? (
          <div className="strip">
            {gallery.map(g => {
              const src = g.image ? urlFor(g.image).width(800).height(800).fit('crop').url() : null
              return (
                <a key={g._id} href="/gallery" className="strip-item" aria-label="Open gallery">
                  {src && <img src={src} alt={g.caption || 'Gallery'} />}
                </a>
              )
            })}
          </div>
        ) : <p className="muted">No photos yet.</p>}

        {/* 订阅 */}
        <section className="nl" style={{ marginTop:28 }}>
          <h3 style={{ margin:'0 0 10px', fontSize:18, fontWeight:800 }}>Join our crew</h3>
          <p className="muted" style={{ margin:'0 0 12px' }}>Sign up for early drops, lineups & limited tickets. Unsubscribe anytime.</p>
          <form action="/api/newsletter" method="POST">
            <input name="email" type="email" placeholder="you@example.com" required />
            <button className="btn btn-primary" type="submit">Subscribe</button>
          </form>
        </section>
      </div>

      <style>{`
        :root { --accent: #9A7BFF; }
        .btn { display:inline-block; padding:12px 18px; border-radius:999px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; }
        .btn-primary { background: var(--accent); color:#000; }
        .btn-ghost { border:1px solid #333; color:#fff; }
        .btn:hover { transform: translateY(-1px); transition: .2s; }

        .marquee { border-block: 1px solid #1a1a1a; background:#0b0b0b; overflow:hidden; white-space:nowrap; }
        .marquee-track { display:inline-block; padding:12px 0; animation: scroll 22s linear infinite; font-weight:800; letter-spacing:.06em; }
        @keyframes scroll { from { transform: translate3d(0,0,0);} to { transform: translate3d(-50%,0,0);} }

        .section-title { font-size: clamp(20px, 3.5vw, 28px); font-weight:900; margin: 24px 0 12px; letter-spacing:.02em; }
        .badge { display:inline-block; font-size:12px; padding:4px 8px; border:1px solid #333; border-radius:999px; color:#ccc; }

        .grid { display:grid; gap:14px; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
        .card { border:1px solid #161616; border-radius:14px; overflow:hidden; background:#0b0b0b; }
        .card-media { aspect-ratio: 4/3; background:#111; }
        .card-media img { width:100%; height:100%; object-fit:cover; display:block; }
        .card-body { padding:12px; }
        .muted { color:#9a9a9a }

        .strip { display:grid; gap:10px; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
        .strip-item { border-radius:10px; overflow:hidden; border:1px solid #161616; background:#0b0b0b; aspect-ratio:1/1; }
        .strip-item img { width:100%; height:100%; object-fit:cover; display:block; }

        .nl { border:1px solid #161616; border-radius:16px; padding:16px; background:#0b0b0b; }
        .nl form { display:flex; gap:10px; flex-wrap:wrap; }
        .nl input { flex:1; min-width:220px; background:#0f0f0f; border:1px solid #222; border-radius:999px; color:#fff; padding:12px 14px; outline:none; }
      `}</style>
    </main>
  )
}
