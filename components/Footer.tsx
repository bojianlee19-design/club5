export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40">
      <div className="container-max py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="text-xl font-semibold gradient-text">HAZY CLUB</div>
          <p className="text-white/70 mt-2">28 Eyre St, Sheffield City Centre, Sheffield S1 4QY</p>
          <p className="text-white/50 text-sm mt-2">© {new Date().getFullYear()} HAZY Club. All rights reserved.</p>
        </div>
        <div>
          <div className="font-semibold mb-2">Links</div>
          <ul className="space-y-1 text-white/70">
            <li><a href="/tickets">Tickets</a></li>
            <li><a href="/vip">VIP</a></li>
            <li><a href="/venue-hire">Venue Hire</a></li>
            <li><a href="/news">News</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Newsletter</div>
          <form action="/api/newsletter" method="post" className="flex gap-2">
            <input className="flex-1" type="email" name="email" placeholder="you@example.com" required />
            <button className="btn btn-primary" type="submit">Sign Up</button>
          </form>
          <p className="text-white/50 text-xs mt-2">We respect your privacy.</p>
        </div>
      </div>
    </footer>
  )
}
