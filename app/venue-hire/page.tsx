export default function VenueHire() {
  return (
    <main style={{ minHeight:'60vh', background:'#000', color:'#fff', display:'grid', placeItems:'center' }}>
      <div style={{ textAlign:'center', maxWidth:680, padding:'0 16px' }}>
        <h1 style={{ fontSize:28, fontWeight:900, marginBottom:10 }}>Venue Hire</h1>
        <p style={{ opacity:.85 }}>
          Host your next event at Hazy Club. For private hire and brand takeovers, email
          {' '}<a href="mailto:hire@hazy.club" style={{ textDecoration:'underline' }}>hire@hazy.club</a>.
        </p>
      </div>
    </main>
  )
}
