import Link from 'next/link';
import Image from 'next/image';

export type EventCard = {
  slug: string;
  title: string;
  date?: string | null;
  cover?: string | null;
};

type Props = EventCard;

export default function EventCardWide({ slug, title, date, cover }: Props) {
  const href = `/events/${slug}`;
  const dateText =
    date ? new Date(date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : '';

  return (
    <Link
      href={href}
      className="block overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-transform hover:-translate-y-0.5 hover:border-white/20"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {cover ? (
          <Image
            src={cover}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-800">
            <span className="text-sm text-white/70">No cover</span>
          </div>
        )}

        {/* 底部信息条 */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-black/0 p-3">
          {dateText && <div className="text-xs opacity-80">{dateText}</div>}
          <div className="truncate text-base font-semibold">{title}</div>
        </div>
      </div>
    </Link>
  );
}
