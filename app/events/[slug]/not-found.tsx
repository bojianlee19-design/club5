export default function NotFound() {
  return (
    <main style={{ color:'#fff', background:'#000', minHeight:'60vh', display:'grid', placeItems:'center', fontFamily:'ui-sans-serif, system-ui' }}>
      <div>
        <h1 style={{ fontSize:24, marginBottom:8 }}>Event not found</h1>
        <p style={{ opacity:.8 }}><a href="/events" style={{ textDecoration:'underline' }}>Back to Events</a></p>
      </div>
    </main>
  )
}
