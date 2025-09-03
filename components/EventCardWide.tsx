// components/EventCardWide.tsx
import Image from 'next/image';
import Link from 'next/link';

export type EventCard = {
  id: string;
  slug: string;
  title: string;
  date?: string;
  cover?: string;
};

export default function EventCardWide(props: EventCard) {
  const { slug, title, date, cover } = props;

  return (
    <Link
      href={`/events/${slug}`}
      className="group relative block overflow-hidden rounded-3xl"
    >
      {/* 16:9 容器 */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {/* 封面图 */}
        {cover ? (
          <Image
            src={cover}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-neutral-800 to-neutral-900" />
        )}

        {/* 顶部渐变遮罩 + 左上角文字（标题 + 日期） */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 to-transparent" />
        <div className="absolute left-4 top-3 flex max-w-[75%] flex-col text-white drop-shadow">
          <h3 className="text-lg font-extrabold tracking-wide md:text-xl">
            {title}
          </h3>
          {date ? (
            <div className="mt-0.5 text-xs opacity-90 md:text-sm">
              {new Date(date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                weekday: 'short',
              })}
            </div>
          ) : null}
        </div>

        {/* 右下角 BUY TICKETS */}
        <div className="absolute bottom-3 right-3">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-black transition-colors group-hover:bg-white">
            BUY TICKETS
          </span>
        </div>
      </div>
    </Link>
  );
}
