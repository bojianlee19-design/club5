'use client';

import Link from 'next/link';
import Image from 'next/image';

type Item = {
  slug: string;
  title: string;
  date?: string;
  cover?: string; // 可为空
};

export default function EventsAutoScroller({ events }: { events: Item[] }) {
  if (!events?.length) return null;

  // 为实现无缝轮播，拼接一遍
  const loop = [...events, ...events];

  return (
    <div className="relative w-full overflow-hidden py-10">
      <div className="track flex gap-4">
        {loop.map((e, i) => (
          <Link
            href={`/events/${e.slug}`}
            key={`${e.slug}-${i}`}
            className="group relative h-48 w-72 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5"
          >
            {e.cover ? (
              <Image
                src={e.cover}
                alt={e.title}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                sizes="288px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-white/60">
                {e.title}
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-sm">
              <div className="font-semibold">{e.title}</div>
              {e.date && <div className="text-white/70">{new Date(e.date).toLocaleDateString()}</div>}
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .track {
          width: max-content;
          animation: scroll 36s linear infinite;
        }
        @keyframes scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
