'use client'

import { useEffect, useState } from 'react'

type Item = { url: string; pathname: string; size: number; uploadedAt: string }

export default function Home() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/gallery', { cache: 'no-store' })
        const data = await res.json()
        if (!cancelled) {
          if (data?.ok) setItems(data.items || [])
          else setError('Gallery API failed')
        }
      } catch {
        if (!cancelled) setError('Network error')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  return (
    <main style={{ minHeight: '100vh', color: '#fff', background: '#000', padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Hazy Club</h1>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: '#f99' }}>Failed to load gallery. You can still use the site.</p>}

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
        {items.map((it) => (
          <a key={it.pathname} href={it.url} target="_blank" rel="noreferrer"
             style={{ display: 'block', borderRadius: 12, overflow: 'hidden', background: '#111', border: '1px solid #222' }}>
            <img src={it.url} alt={it.pathname} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
          </a>
        ))}
      </div>
    </main>
  )
}
