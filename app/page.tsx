import Link from 'next/link'
import EventsSection from '@/components/sections/EventsSection'
import GalleryStrip from '@/components/sections/GalleryStrip'

export default async function Home() {
  return (
    <div>
      <section className="relative py-24 md:py-36">
        <div className="absolute inset-0 -z-10 bg-brand-gradient opacity-20 blur-3xl" />
        <div className="container-max">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            <span className="gradient-text">HAZY</span> is coming in hot.
          </h1>
          <p className="mt-4 text-white/70 max-w-2xl">
            Sheffield’s new home of sound. Immersive lights, heavy bass,
            and unforgettable nights. Get on the list — don’t miss the launch.
          </p>
          <div className="mt-8 flex gap-3">
            <Link className="btn btn-primary" href="/events">See Events</Link>
            <Link className="btn btn-outline" href="/sign-up">Sign Up</Link>
          </div>
        </div>
      </section>
      <EventsSection limit={3} />
      <GalleryStrip />
      <section className="py-16">
        <div className="container-max card p-8">
          <h2 className="text-2xl font-semibold mb-3">Venue Hire</h2>
          <p className="text-white/70 mb-4">Private events, brand takeovers, and everything in between. Make it yours.</p>
          <Link className="btn btn-primary" href="/venue-hire">Enquire</Link>
        </div>
      </section>
    </div>
  )
}
