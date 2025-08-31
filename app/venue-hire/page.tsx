export default function VenueHire() {
  return (
    <div className="container-max py-12 grid md:grid-cols-2 gap-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold">Venue Hire</h1>
        <p className="text-white/70">Private hire for brands, shows, and celebrations. World-class sound, modular lighting, and central location.</p>
        <ul className="list-disc list-inside text-white/70">
          <li>4 rooms + courtyard</li>
          <li>Full AV support</li>
          <li>Up to 1,500 capacity</li>
        </ul>
      </div>
      <form action="https://formsubmit.co/" method="post" className="card p-6 space-y-3">
        <div className="row">
          <div><label>Name</label><input name="name" required /></div>
          <div><label>Email</label><input type="email" name="email" required /></div>
        </div>
        <div className="row">
          <div><label>Date</label><input type="date" name="date" /></div>
          <div><label>Guests</label><input type="number" name="guests" min="10" /></div>
        </div>
        <div><label>Message</label><textarea name="message" rows={4} /></div>
        <button className="btn btn-primary" type="submit">Enquire</button>
      </form>
    </div>
  )
}
