import { sanityClient } from '@/lib/sanity.client'
import { urlFor } from '@/lib/sanity.image'

type EventDoc = {
  _id: string
  title?: string
  date?: string // YYYY-MM-DD
  lineup?: string[]
  description?: string
  image?: any
  slug?: { current?: string }
}
type GalleryDoc = { _id: string; image?: any; caption?: string }

export const revalidate = 60 // 每 60 秒静态再生

export default async function Home() {
  // 并发读取：活动&相册
  const [events, gallery]: [EventDoc[], GalleryDoc[]] = await Promise.all([
    sanityClient.fetch(
      `*[_type=="event" && published==true]|order(coalesce(date,_createdAt) asc){
        _id,title,date,lineup,description,image,slug
      }`
    ),
    sanityClient.fetch(
      `*[_type=="galleryImage" && published==true]|order(_createdAt desc)[0...12]{
        _id,image,caption
      }`
    ),
  ])

  // 取一张最近的相册图做 Hero 背景（没有也优雅降级纯色）
  const heroImg = gallery?.[0]?.image ? urlFor(gallery[0].image).width(2000).height(1200).fit('crop').url() : null

  // 生成「本周末」列表（周五~周日）
  const now = new Date()
  const day = now.getDay() // 0-6
  // 找到即将到来的周五、周日
  const daysUntilFriday = (5 - (day === 0 ? 7 : day) + 7) % 7 // 把周日当 7
  const friday = new Date(now); friday.setDate(now.getDate() + daysUntilFriday)
  const sunday = new Date(friday); sunday.setDate(friday.getDate() + 2)
  const toDateStr = (d: Date) => d.toISOString().slice(0,10)

  const weekendEvents = events.filter(e => {
    if (!e.date) return false
    return e.date >= toDateStr(friday) && e.date <= toDateStr(sunday)
  }).slice(0, 3)

  // 通告跑马灯内容：未来 14 天内的活动标题
  const twoWeeks = new Date(now); twoWeeks.setDate(now.getDate() + 14)
  const marqueeTitles = events
    .filter(e => e.date && e.date >= toDateStr(now) && e.date <= toDateStr(twoWeeks))
    .map(e => e.title?.toUpperCase())
    .filter(Boolean) as string[]
  const marqueeText = marqueeTitles.length ? marqueeTitles.join('  •  ') : 'HAZY CLUB — LONDON  •  HOUSE • TECHNO • ELECTRONIC'

  // 活动宫格（MOS 的 Tickets/Events 区块风格）
  const gridEvents = events.slice(0, 6)

  return (
    <main style={{ background:'#000', color:'#fff', minHeight:'100vh', fontFamily:'ui-sans-serif, system-ui' }}>
      <style>{`
        :root { --accent: #9A7BFF; } /* 可改成你 Logo 的主色 */
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .btn { display:inline-block; padding:12px 18px; border-radius:999px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; }
        .btn-primary { background: var(--accent); color:#000; }
        .btn-ghost { border:1px solid #333; color:#fff; }
        .btn:hover { transform: translateY(-1px); transition: .2s; }

        /* Hero */
        .hero { position:relative; min-height: 68vh; display:grid; place-items:center; overflow:hidden; }
        .hero-bg { position:absolute; inset:0; background:#060606; }
        .hero-bg::after { content:''; position:absolute; inset:0; background: radial-gradient(1200px 600px at 50% 80%, rgba(154,123,255,.25), transparent 55%), linear-gradient(180deg, rgba(0,0,0,.0), #000 85%); }
        .hero-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:.55; filter: saturate(1.1) contrast(1.05) brightness(.9); }
        .hero-inner { position:relative; z-index:2; text-align:center; padding: 40px 20px; }
        .logo-circle { width:84px; height:84px; border-radius:50%; border:2px solid #888; display:grid; place-items:center; font-weight:900; letter-spacing:.08em; }
        .hero-title { font-size: clamp(28px, 5vw, 56px); line-height:1.05; font-weight:900; margin:18px 0 10px; }
        .hero-sub { opacity:.85; font-size: clamp(14px, 2.2vw, 18px); }
        .hero-cta { display:flex; gap:12px; justify-content:center; margin-top:22px; flex-wrap:wrap; }

        /* Marquee */
        .marquee { border-block: 1px solid #1a1a1a; background:#0b0b0b; overflow:hidden; white-space:nowrap; }
        .marquee-track { display:inline-block; padding:12px 0; animation: scroll 22s linear infinite; font-weight:800; letter-spacing:.06em; }
        @keyframes scroll { from { transform: translate3d(0,0,0);} to { transform: translate3d(-50%,0,0);} }

        /* Section titles */
        .section-title { font-size: clamp(20px, 3.5vw, 28px); font-weight:900; margin: 24px 0 12px; letter-spacing:.02em; }

        /* Cards */
        .grid { display:grid; gap:14px; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
        .card { border:1px solid #161616; border-radius:14px; overflow:hidden; background:#0b0b0b; }
        .card-media { aspect-ratio: 4/3; background:#111; }
        .card-media img { width:100%; height:100%; object-fit:cover; display:block; }
        .card-body { padding:12px; }
        .badge { display:inline-block; font-size:12px; padding:4px 8px; border:1px solid #333; border-radius:999px; color:#ccc; }

        /* Gallery strip */
        .strip { display:grid; gap:10px; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
        .strip-item { border-radius:10px; overflow:hidden; border:1px solid #161616; background:#0b0b0b; aspect-ratio:1/1; }
        .strip-item img { width:100%; height:100%; object-fit:cover; display:block; }

        /* Newsletter */
        .nl { border:1px solid #161616; border-radius:16px; padding:16px; background:#0b0b0b; }
        .nl form { display:flex; gap:10px; flex-wrap:wrap; }
        .nl input { flex:1; min-width:220px; background:#0f0f0f; border:1px solid #222; border-radius:999px; color:#fff; padding:12px 14px; outline:none; }
        .muted { color:#9a9a9a; }

        /* Footer mini */
        .footer { opacity:.85; font-size:13px; display:grid; gap:8px; margin-top:22px; }
      `}</style>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        {heroImg && <img className="hero-img" src={heroImg} alt="Hero" />}
        <div className="hero-inner container">
          {/* 这里可替换成你自己的圆形 Logo 图；先用简版占位 */}
          <div className="logo-circle" aria-hidden>HC</div>
          <h1 className="hero-title">HAZY CLUB — LONDON</h1>
          <p className="hero-sub">Home of late nights & heavy sound. Every week with the city’s best house & techno DJs.</p>
          <div className="hero-cta">
            <a href="/events" className="btn btn-primary">Get Tickets</a>
            <a href="/gallery" className="btn btn-ghost">View Gallery</a>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="marquee" aria-label="Latest Announcements">
        {/* 复制两遍实现无缝滚动 */}
        <div className="marquee-track" style={{ paddingLeft: 24 }}>
          {marqueeText}  •  {marqueeText}
        </div>
      </section>

      <div className="container">
        {/* WHAT'S ON THIS WEEKEND */}
        <h2 className="section-title" style={{ display:'flex', gap:10, alignItems:'center' }}>
          <span>What’s on this weekend</span>
          <span className="badge">Fri–Sun</span>
        </h2>
        {weekendEvents.length === 0 ? (
          <p className="muted">No listed events this weekend. Check all listings below.</p>
        ) : (
          <div className="grid">
            {weekendEvents.map(e => {
              const cover = e.image ? urlFor(e.image).width(1000).height(750).fit('crop').url() : null
              return (
                <article key={e._id} className="card">
                  <div className="card-media">{cover ? <img src={cover} alt={e.title || 'Event'} /> : null}</div>
                  <div className="card-body">
                    <div className="badge" style={{ marginBottom:8 }}>{e.date || 'TBA'}</div>
                    <h3 style={{ margin:'0 0 6px', fontSize:18, fontWeight:800 }}>{e.title || 'Untitled'}</h3>
                    {e.lineup?.length ? <div className="muted" style={{ marginBottom:10 }}>{e.lineup.join(' · ')}</div> : null}
                    <a href="/events" className="btn btn-primary" aria-label={`Get tickets for ${e.title || 'event'}`}>Tickets</a>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* ALL LISTINGS （精简宫格） */}
        <h2 className="section-title" style={{ marginTop:28 }}>All listings</h2>
        {gridEvents.length === 0 ? (
          <p className="muted">No events yet. Check back soon.</p>
        ) : (
          <div className="grid">
            {gridEvents.map(e => {
              const cover = e.image ? urlFor(e.image).width(1000).height(750).fit('crop').url() : null
              return (
                <article key={e._id} className="card">
                  <div className="card-media">{cover ? <img src={cover} alt={e.title || 'Event'} /> : null}</div>
                  <div className="card-body">
                    <div className="badge" style={{ marginBottom:8 }}>{e.date || 'TBA'}</div>
                    <h3 style={{ margin:'0 0 6px', fontSize:18, fontWeight:800 }}>{e.title || 'Untitled'}</h3>
                    {e.lineup?.length ? <div className="muted" style={{ marginBottom:10 }}>{e.lineup.join(' · ')}</div> : null}
                    <a href="/events" className="btn btn-ghost">Details</a>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* GALLERY STRIP */}
        <h2 className="section-title" style={{ marginTop:28 }}>Last night at Hazy</h2>
        {gallery.length === 0 ? (
          <p className="muted">No photos yet.</p>
        ) : (
          <div className="strip">
            {gallery.map(g => {
              const src = g.image ? urlFor(g.image).width(800).height(800).fit('crop').url() : null
              return (
                <a key={g._id} href="/gallery" className="strip-item" aria-label="Open gallery">
                  {src ? <img src={src} alt={g.caption || 'Gallery'} /> : null}
                </a>
              )
            })}
          </div>
        )}

        {/* NEWSLETTER */}
        <section className="nl" style={{ marginTop:28 }}>
          <h3 style={{ margin:'0 0 10px', fontSize:18, fontWeight:800 }}>Join our crew</h3>
          <p className="muted" style={{ margin:'0 0 12px' }}>
            Sign up for early drops, lineups & limited tickets. Unsubscribe anytime.
          </p>
          <form action="/api/newsletter" method="POST">
            <input name="email" type="email" placeholder="you@example.com" required />
            <button className="btn btn-primary" type="submit">Subscribe</button>
          </form>
        </section>

        {/* FOOTER MINI */}
        <footer className="footer">
          <div>Hazy Club · London</div>
          <div className="muted">Bookings · Venue hire · Press</div>
        </footer>
      </div>
    </main>
  )
}
