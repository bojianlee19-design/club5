// components/EventCardWide.tsx
import Image from 'next/image'

type Props = {
  slug: string
  title: string
  date?: string
  cover?: string
  className?: string
  ctaLabel?: string // 默认 Buy Tickets
  ratio?: '3/4' | '9/16' // 移动端也好看，默认 3/4
}

// 英文日期：FRI 12 SEP / 2025
function formatEN(dateStr?: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const dow = d.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase()
  const day = d.toLocaleDateString('en-GB', { day: '2-digit' })
  const mon = d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()
  const year = d.getFullYear()
  return `${dow} ${day} ${mon} ${year}`
}

export default function EventCardWide({
  title,
  date,
  cover,
  className,
  ctaLabel = 'Buy Tickets',
  ratio = '3/4',
}: Props) {
  const ratioClass = ratio === '9/16' ? 'aspect-[9/16]' : 'aspect-[3/4]'

  return (
    <div
      className={[
        'relative overflow-hidden rounded-2xl bg-zinc-900',
        ratioClass,
        className || '',
      ].join(' ')}
    >
      {/* 背景图 */}
      {cover ? (
        <Image
          src={cover}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 40vw, 400px"
          priority={false}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
      )}

      {/* 顶部左：日期条 */}
      {date && (
        <div className="absolute left-2 top-2 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold tracking-wider text-white backdrop-blur">
          {formatEN(date)}
        </div>
      )}

      {/* 底部左：标题 */}
      <div className="absolute inset-x-3 bottom-3">
        <div className="max-w-full rounded-xl bg-black/55 px-3 py-2 text-white backdrop-blur">
          <h3 className="line-clamp-2 text-base font-bold md:text-lg">{title}</h3>
        </div>
      </div>

      {/* 右下：CTA */}
      <div className="pointer-events-none absolute bottom-3 right-3 md:bottom-4 md:right-4">
        <span className="pointer-events-auto inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-black hover:opacity-90">
          {ctaLabel}
        </span>
      </div>
    </div>
  )
}
