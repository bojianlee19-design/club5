// app/events/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchEventBySlug } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

export default async function EventPage({ params }: { params: { slug: string } }) {
  const ev = await fetchEventBySlug(params.slug);
  if (!ev) return notFound();

  const dateStr = ev.date ? new Date(ev.date).toLocaleString() : '';

  return (
    <main style={{ color: '#fff' }}>
      <section
        style={{
          minHeight: '50vh',
          display: 'grid',
          placeItems: 'center',
          background: `#000 url(${ev.cover?.asset?.url || ''}) center/cover no-repeat`,
          borderBottom: '1px solid rgba(255,255,255,.1)',
        }}
      >
        <div style={{ background: 'rgba(0,0,0,.55)', padding: 16, borderRadius: 12 }}>
          <h1 style={{ margin: 0 }}>{ev.title}</h1>
          <p style={{ margin: '6px 0 0', opacity: .85 }}>{dateStr}</p>
        </div>
      </section>

      <section style={{ maxWidth: 900, margin: '32px auto', padding: '0 16px' }}>
        <p style={{ lineHeight: 1.7, opacity: .9 }}>{ev.summary || ''}</p>
        <div style={{ marginTop: 24 }}>
          <Link href="/tickets" style={cta}>Get Tickets</Link>
        </div>
      </section>
    </main>
  );
}

const cta: React.CSSProperties = {
  display: 'inline-block',
  color: '#000',
  background: '#fff',
  borderRadius: 10,
  padding: '10px 16px',
  textDecoration: 'none',
  fontWeight: 700,
};
