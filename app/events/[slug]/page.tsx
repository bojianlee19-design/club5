// app/events/[slug]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/lib/sanity';


export const dynamic = 'force-dynamic';

type Props = { params: { slug: string } };

// 简易富文本渲染（不额外安装 @portabletext/react）
function RichText({ value }: { value?: any[] }) {
  if (!value || !Array.isArray(value)) return null;
  return (
    <div className="prose prose-invert max-w-none">
      {value.map((block, i) => {
        if (block?._type === 'block') {
          const text = (block.children || [])
            .map((c: any) => (typeof c?.text === 'string' ? c.text : ''))
            .join('');
          if (!text) return null;
          const Tag =
            block.style === 'h2' ? 'h2' :
            block.style === 'h3' ? 'h3' :
            block.style === 'h4' ? 'h4' :
            'p';
          return <Tag key={i}>{text}</Tag>;
        }
        return null;
      })}
    </div>
  );
}

export default async function EventDetailPage({ params }: Props) {
  const ev = await getEventBySlug(params.slug);

  if (!ev) return notFound();

  const dateStr = ev.date
    ? new Date(ev.date).toLocaleString('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <main className="mx-auto max-w-6xl bg-black px-4 pb-24 pt-28 text-white">
      {/* 返回 */}
      <div className="mb-6">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-sm text-white/90 hover:bg-white/10"
        >
          ← Back to What&apos;s On
        </Link>
      </div>

      {/* 标题 + 日期 */}
      <h1 className="text-3xl font-extrabold tracking-wide md:text-5xl">{ev.title}</h1>
      {dateStr && <div className="mt-2 text-white/70">{dateStr}</div>}

      {/* 封面 */}
      {ev.cover && (
        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl">
          <Image src={ev.cover} alt={ev.title} fill className="object-cover" />
        </div>
      )}

      {/* 主体两栏：左正文，右侧信息 */}
      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_320px]">
        {/* 左：摘要 + 正文 */}
        <div>
          {ev.summary && (
            <p className="mb-6 text-lg leading-relaxed text-white/85">{ev.summary}</p>
          )}
          <RichText value={ev.body} />
        </div>

        {/* 右：信息卡 + 购票按钮 */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur">
            <h2 className="mb-4 text-sm font-semibold tracking-wider text-white/70">
              EVENT INFO
            </h2>
            <dl className="space-y-3 text-sm">
              {ev.venue && (
                <div className="flex justify-between gap-4">
                  <dt className="text-white/60">Venue</dt>
                  <dd className="text-white">{ev.venue}</dd>
                </div>
              )}
              {ev.doorsTime && (
                <div className="flex justify-between gap-4">
                  <dt className="text-white/60">Doors</dt>
                  <dd className="text-white">{ev.doorsTime}</dd>
                </div>
              )}
              {ev.endTime && (
                <div className="flex justify-between gap-4">
                  <dt className="text-white/60">Ends</dt>
                  <dd className="text-white">{ev.endTime}</dd>
                </div>
              )}
              {ev.price && (
                <div className="flex justify-between gap-4">
                  <dt className="text-white/60">Price</dt>
                  <dd className="text-white">{ev.price}</dd>
                </div>
              )}
              {ev.ageRestriction && (
                <div className="flex justify-between gap-4">
                  <dt className="text-white/60">Age</dt>
                  <dd className="text-white">{ev.ageRestriction}</dd>
                </div>
              )}
              {ev.lineup && ev.lineup.length > 0 && (
                <div>
                  <dt className="mb-1 text-white/60">Line-up</dt>
                  <dd className="text-white">
                    {ev.lineup.join(', ')}
                  </dd>
                </div>
              )}
            </dl>

            {/* 外链购票 */}
            {ev.ticketUrl && (
              <a
                href={ev.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-white/25 bg-white/10 px-4 py-2 font-semibold text-white hover:bg-white/20"
              >
                BUY TICKETS
              </a>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
