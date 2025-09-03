// components/EventCardWide.tsx
import Link from 'next/link';

export type EventCard = {
  id: string;
  slug: string;
  title: string;
  date?: string;
  cover?: string;
};

export default function EventCardWide({ id, slug, title, date, cover }: EventCard) {
  const href = `/events/${slug}`;
  return (
    <Link
      href={href}
      className="group relative block w-[280px] snap-center overflow-hidden rounded-2xl bg-neutral-900 shadow-lg hover:shadow-xl"
      key={id}
    >
      {/* 封面（用 <img> 避免 Next Image 域名限制） */}
      <div className="relative aspect-[3/4] w-full bg-neutral-800">
        {cover ? (
          <img src={cover} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400">No cover</div>
        )}
      </div>

      {/* 左下标题 / 右下按钮 */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-3">
        <div className="rounded-lg bg-black/50 px-2 py-1 text-sm font-semibold backdrop-blur">{title}</div>
        <div className="mt-2 flex items-center justify-between">
          <div className="rounded-md bg-black/40 px-2 py-1 text-xs backdrop-blur">
            {date ? new Date(date).toLocaleDateString() : ''}
          </div>
          <div className="pointer-events-auto">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">BUY TICKETS</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
