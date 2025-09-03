// app/events/[slug]/page.tsx
import { getEventBySlug } from '@/lib/sanity';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EventDetail({ params }: { params: { slug: string } }) {
  const ev = await getEventBySlug(params.slug);
  if (!ev) return (
    <main className="mx-auto max-w-4xl bg-black px-3 pb-24 pt-28 text-white">
      <p>Event not found.</p>
      <Link href="/events" className="mt-4 inline-block underline">← Back to events</Link>
    </main>
  );

  return (
    <main className="mx-auto max-w-4xl bg-black px-3 pb-24 pt-28 text-white">
      <Link href="/events" className="mb-6 inline-block underline">← Back to events</Link>
      <h1 className="text-3xl font-extrabold tracking-wide md:text-4xl">{ev.title}</h1>
      <div className="mt-2 opacity-80">{ev.date ? new Date(ev.date).toLocaleString() : ''}</div>

      {ev.cover && (
        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl">
          <img src={ev.cover} alt={ev.title} className="h-full w-full object-cover" />
        </div>
      )}
    </main>
  );
}
