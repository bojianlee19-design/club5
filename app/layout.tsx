import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'Hazy Club — London',
  description: 'House · Techno · Electronic — Every weekend at Hazy Club',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background:'#000', color:'#fff', fontFamily:'ui-sans-serif, system-ui' }}>
        <header className="site-header">
          <div className="container bar">
            <Link href="/" className="brand">HAZY</Link>
            <nav className="nav">
              <Link href="/events">What’s On</Link>
              <Link href="/tickets">Tickets</Link>
              <Link href="/gallery">Gallery</Link>
              <Link href="/news">News</Link>
              <Link href="/venue-hire">Venue Hire</Link>
            </nav>
            <div className="cta">
              <Link href="/tickets" className="btn btn-primary">Buy Tickets</Link>
              <Link href="/tables" className="btn btn-ghost">Tables</Link>
            </div>
          </div>
        </header>

        {children}

        <footer className="site-footer">
          <div className="container grid">
            <div>
              <h4>Hazy Club · London</h4>
              <p className="muted">103 Gaunt Street, London SE1 6DP</p>
            </div>
            <div>
              <h4>Links</h4>
              <ul>
                <li><a href="/faq">FAQ</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/venue-hire">Venue Hire</a></li>
                <li><a href="/legal">Legal</a></li>
              </ul>
            </div>
            <div>
              <h4>Join our crew</h4>
              <form action="/api/newsletter" method="POST" className="nl">
                <input name="email" type="email" placeholder="you@example.com" required />
                <button className="btn btn-primary" type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </footer>

        <style>{`
          :root{ --accent:#9A7BFF }
          .container{ max-width:1200px; margin:0 auto; padding:0 20px }
          .btn{ display:inline-block; padding:10px 14px; border-radius:999px; font-weight:800; letter-spacing:.04em }
          .btn-primary{ background:var(--accent); color:#000 }
          .btn-ghost{ border:1px solid #333; color:#fff }
          .btn:hover{ transform:translateY(-1px); transition:.2s }

          .site-header{ position:sticky; top:0; z-index:40; backdrop-filter:saturate(1.2) blur(8px); background:rgba(0,0,0,.45); border-bottom:1px solid #101010 }
          .bar{ height:64px; display:flex; align-items:center; gap:16px; justify-content:space-between }
          .brand{ font-weight:900; letter-spacing:.08em; font-size:20px; color:#fff; text-decoration:none }
          .nav a{ color:#ddd; margin:0 10px; text-decoration:none }
          .nav a:hover{ color:#fff }
          .cta{ display:flex; gap:10px; align-items:center }

          .site-footer{ border-top:1px solid #111; margin-top:40px; padding:24px 0; background:#0b0b0b }
          .grid{ display:grid; gap:18px; grid-template-columns: 2fr 1fr 2fr }
          .nl{ display:flex; gap:10px; margin-top:8px }
          .nl input{ flex:1; min-width:220px; background:#0f0f0f; border:1px solid #222; border-radius:999px; color:#fff; padding:10px 12px }
          .muted{ color:#9a9a9a }
          @media (max-width:900px){ .nav{ display:none } .grid{ grid-template-columns:1fr } }
        `}</style>
      </body>
    </html>
  )
}
