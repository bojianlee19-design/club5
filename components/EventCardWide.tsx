// components/EventCardWide.tsx
import Link from 'next/link';
import Image from 'next/image';
import type { EventDoc } from '@/lib/sanity';

export default function EventCardWide({ ev }: { ev: EventDoc }) {
  const href = ev.slug?.current ? `/events/${encodeURIComponent(ev.slug.current)}` : '/events';
  const date = ev.date
    ? new Date(ev.date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';
  const cover = ev.coverUrl || ev.cover;

  return (
    <Link
      href={href}
      className="group block w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60"
    >
      <div className="relative aspect-[16/9] w-full">
        {cover ? (
          <Image
            src={cover}
            alt={ev.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-zinc-800 text-neutral-400">
            No image
          </div>
        )}
      </div>

      <div className="space-y-1 p-4">
        <div className="text-xs text-neutral-300">{date}</div>
        <div className="line-clamp-2 text-base font-semibold text-white">{ev.title}</div>
        <div className="text-xs text-neutral-400">View Details →</div>
      </div>
    </Link>
  );
}
