export default function VIP() {
  return (
    <div className="container-max py-12 grid md:grid-cols-2 gap-8">
      <div>
        <h1 className="text-3xl font-semibold">VIP Booths</h1>
        <p className="text-white/70">Book a booth for bottle service and the best views in the room.</p>
        <ul className="list-disc list-inside text-white/70">
          <li>Priority entry</li>
          <li>Dedicated host</li>
          <li>Bottle packages</li>
        </ul>
      </div>
      <form className="card p-6 space-y-3" action="https://formsubmit.co/" method="post">
        <div className="row">
          <div><label>Name</label><input name="name" required /></div>
          <div><label>Email</label><input type="email" name="email" required /></div>
        </div>
        <div className="row">
          <div><label>Phone</label><input name="phone" /></div>
          <div><label>Event date</label><input type="date" name="date" /></div>
        </div>
        <button className="btn btn-primary" type="submit">Request Booking</button>
      </form>
    </div>
  )
}
