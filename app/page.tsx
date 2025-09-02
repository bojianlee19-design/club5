// app/page.tsx
import VideoHero from '@/components/VideoHero'
import dynamic from 'next/dynamic'

const EventsRail = dynamic(() => import('@/components/EventsRail'), { ssr: false })

export default function HomePage() {
  return (
    <>
      {/* 英雄区：优先 webm，其次 mp4；若 mp4 还没修好会自动回退到 poster */}
     <VideoHero
  sources={[
    '/hero-b0.webm?v=1',
    '/hero-b0.mp4?v=1',
  ]}
  poster="/hero-poster.jpg"
  heading="HAZY CLUB"
  subheading="NIGHTS · MUSIC · COMMUNITY"
  cta={{ href: '/tickets', label: 'Get Tickets' }}
/>


      {/* 活动横向滑动 */}
      <EventsRail />

      {/* 订阅、地址等信息 */}
      <section style={{padding:'32px 6vw 60px', color:'#fff'}}>
        <div style={{display:'grid', gap:24, gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', alignItems:'start'}}>
          <div>
            <h3 style={{margin:'0 0 8px', fontSize:'20px', fontWeight:800}}>Join the mailing list</h3>
            <p style={{margin:'0 0 10px', opacity:.9}}>Get the latest drops, line-ups and events.</p>
            <a href="/sign-up" style={{color:'#fff', textDecoration:'underline'}}>Sign up →</a>
          </div>

          <div>
            <h3 style={{margin:'0 0 8px', fontSize:'20px', fontWeight:800}}>Visit us</h3>
            <p style={{margin:0, opacity:.95}}>28 Eyre St, Sheffield City Centre, Sheffield S1 4QY</p>
            <p style={{margin:'6px 0 0'}}>
              <a href="https://maps.apple.com/?q=28%20Eyre%20St%2C%20Sheffield%20S1%204QY" target="_blank" style={{color:'#fff', textDecoration:'underline'}}>Open in Maps →</a>
            </p>
          </div>

          <div>
            <h3 style={{margin:'0 0 8px', fontSize:'20px', fontWeight:800}}>Contact</h3>
            <p style={{margin:0}}>
              <a href="mailto:matt@hazyclub.co.uk" style={{color:'#fff', textDecoration:'underline'}}>matt@hazyclub.co.uk</a>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
