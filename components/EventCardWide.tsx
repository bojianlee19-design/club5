import Image from 'next/image';
import Link from 'next/link';

export default function EventCardWide({
  slug,
  title,
  date,
  cover,
}: {
  slug: string;
  title: string;
  date?: string;
  cover?: string | null;
}) {
  return (
    <Link
      href={`/events/${encodeURIComponent(slug)}`}
      className="group grid grid-cols-3 overflow-hidden rounded-2xl bg-neutral-900"
    >
      <div className="relative col-span-2 h-48">
        {cover ? (
          <Image src={cover} alt={title} fill className="object-cover transition-transform group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 bg-neutral-800" />
        )}
      </div>
      <div className="p-4 text-white">
        <div className="text-xs opacity-80">{date ? new Date(date).toLocaleDateString() : ''}</div>
        <div className="mt-1 line-clamp-2 font-semibold">{title}</div>
        <div className="mt-3 text-sm underline opacity-90">View Details →</div>
      </div>
    </Link>
  );
}
