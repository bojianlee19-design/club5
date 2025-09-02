// app/api/events/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getEventBySlug } from '@/lib/sanity'; // 旧名 fetchEventBySlug -> 新名 getEventBySlug

export const dynamic = 'force-dynamic';

type PageProps = {
  params: { slug: string };
};

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = params;

  let event: any;
  try {
    event = await getEventBySlug(slug);
  } catch (e) {
    console.error('getEventBySlug failed:', e);
  }

  if (!event) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-white">
      <Link href="/events" className="mb-6 inline-block text-sm underline">
        ← Back to What’s On
      </Link>

      <h1 className="mb-2 text-3xl font-bold">{event.title}</h1>
      {event.date && (
        <p className="mb-4 text-neutral-300">
          {new Date(event.date).toLocaleString('en-GB', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      )}

      {event.coverImage?.url && (
        // 如果你已经有 sanity.image() 工具，这里可换成 <Image />
        <img
          src={event.coverImage.url}
          alt={event.title}
          className="mb-6 w-full rounded-2xl object-cover"
        />
      )}

      {Array.isArray(event.lineup) && event.lineup.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">Line-up</h2>
          <ul className="list-inside list-disc text-neutral-200">
            {event.lineup.map((name: string, i: number) => (
              <li key={i}>{name}</li>
            ))}
          </ul>
        </div>
      )}

      {event.description && (
        <div className="prose prose-invert">
          <p>{event.description}</p>
        </div>
      )}
    </main>
  );
}
