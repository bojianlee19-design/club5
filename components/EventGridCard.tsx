// components/EventGridCard.tsx
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  slug: string
  title: string
  date?: string
  cover?: string
}

function formatDate(d?: string) {
  if (!d) return ''
  const date = new Date(d)
  // 英文、简洁：如 "Fri 12 Sep 2025" 或 "12 Sep 2025"
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function EventGridCard({ slug, title, date, cover }: Props) {
  return (
    <Link href={`/events/${slug}`} className="group block">
      {/* 方形、直角、图片略缩放的 hover 反馈 */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-900">
        {cover ? (
          <Image
            src={cover}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-sm text-white/60">
            No cover
          </div>
        )}
      </div>

      {/* 文案移到图片下方左侧 */}
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-semibold leading-tight line-clamp-2">
          {title}
        </h3>
        <div className="text-xs text-white/60">{formatDate(date)}</div>
      </div>
    </Link>
  )
}
