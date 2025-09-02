import TopNav from '@/components/TopNav';
import VideoHero from '@/components/VideoHero';
import EventsAutoScroller from '@/components/EventsAutoScroller';
import { getUpcomingEvents } from '@/lib/sanity';

export default async function HomePage() {
  const events = await getUpcomingEvents(10);

  return (
    <main className="min-h-screen bg-black">
      <TopNav />

      <VideoHero
        sources={[
          { src: '/hero-b0.webm', type: 'video/webm' },
          { src: '/hero-b0.mp4', type: 'video/mp4' },
        ]}
        poster="/hero-poster.jpg"
        heading="HAZY CLUB"
        subheading="NIGHTS · MUSIC · COMMUNITY"
        cta={{ href: '/events', label: 'Get Tickets' }}
        linkTo="/events"
      />

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="mb-4 flex items-baseline justify-between text-white">
          <h2 className="text-2xl font-extrabold tracking-wide md:text-3xl">What’s On</h2>
          <a href="/events" className="underline opacity-90 hover:opacity-100">
            View all
          </a>
        </div>
        <EventsAutoScroller events={events} />
      </section>
    </main>
  );
}
