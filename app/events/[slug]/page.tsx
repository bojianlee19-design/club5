import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/lib/sanity';

export default async function EventDetail({ params }: { params: { slug: string } }) {
  const ev = await getEventBySlug(params.slug);
  if (!ev) return notFound();

  return (
    <main className="mx-auto max-w-4xl bg-black px-4 pb-20 pt-24 text-white">
      <h1 className="text-3xl font-extrabold tracking-wide md:text-4xl">{ev.title}</h1>
      <div className="mt-2 opacity-80">{ev.date ? new Date(ev.date).toLocaleString() : ''}</div>
      {ev.cover && (
        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl">
          <Image src={ev.cover} alt={ev.title} fill className="object-cover" />
        </div>
      )}
      {/* 这里可以继续渲染富文本等 */}
    </main>
  );
}
