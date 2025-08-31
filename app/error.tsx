'use client'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body style={{ background:'#000', color:'#fff', fontFamily:'ui-sans-serif, system-ui', padding:24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Something went wrong</h1>
        <p style={{ opacity: .8, marginBottom: 16 }}>{error?.message || 'Unexpected error'}</p>
        <button onClick={() => reset()} style={{ padding:'8px 14px', borderRadius:8, background:'#fff', color:'#000' }}>
          Try again
        </button>
      </body>
    </html>
  )
}
