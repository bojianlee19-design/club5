import Link from 'next/link';
import Image from 'next/image';
import { getUpcomingEvents } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const docs = await getUpcomingEvents(24);

  const events = docs.map(d => ({
    id: d._id,
    slug: typeof d.slug === 'string' ? d.slug : d.slug?.current ?? '',
    title: d.title ?? '',
    date: d.date,
    cover: d.cover ?? '',
  })).filter(e => e.slug);

  return (
    <main className="mx-auto max-w-7xl bg-black px-4 pb-20 pt-24 text-white">
      <h1 className="mb-8 text-4xl font-extrabold tracking-wide">What’s On</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map(e => (
          <Link
            key={e.id}
            href={`/events/${e.slug}`}
            className="group rounded-2xl border border-white/10 bg-white/5"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl">
              {e.cover ? (
                <Image
                  src={e.cover}
                  alt={e.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-white/60">
                  {e.title}
                </div>
              )}
            </div>
            <div className="space-y-1 p-4">
              <div className="text-lg font-bold">{e.title}</div>
              {e.date && <div className="text-sm text-white/70">{new Date(e.date).toLocaleString()}</div>}
              <div className="pt-2 text-sm font-semibold text-white/80 group-hover:underline">View Details →</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
