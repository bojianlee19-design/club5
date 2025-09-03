// components/EventsAutoScroller.tsx
import Link from "next/link";

type RawEvent = {
  _id?: string;
  slug?: string | { current?: string };
  title?: string;
  date?: string;
  cover?: string; // 已在服务器端把 Sanity 图片转成 URL 字符串
};

type Props = {
  events: RawEvent[];
  /** 整体滚动一圈所需时长（秒） */
  durationSec?: number;
};

function norm(e: RawEvent) {
  const slug =
    typeof e.slug === "string"
      ? e.slug
      : e.slug?.current ?? (e._id ? String(e._id) : "");
  return {
    id: e._id ?? slug,
    slug,
    title: e.title ?? "Untitled",
    date: e.date,
    cover: e.cover,
  };
}

export default function EventsAutoScroller({ events, durationSec = 28 }: Props) {
  const items = events.map(norm).filter((x) => !!x.id);
  const loop = [...items, ...items]; // 为无缝循环复制一遍

  return (
    <div className="relative mx-auto w-full max-w-6xl">
      <div className="pause-on-hover overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <ul
          className="flex w-max gap-4 animate-marquee"
          style={{ animationDuration: `${durationSec}s` }}
        >
          {loop.map((e, idx) => {
            const href = e.slug ? `/events/${e.slug}` : "/events";
            return (
              <li key={`${e.id}-${idx}`} className="w-[280px] shrink-0">
                <Link href={href} className="group block">
                  <div className="relative h-40 w-full overflow-hidden rounded-xl">
                    {e.cover ? (
                      // 用 <img> 避免 next/image 域名白名单
                      <img
                        src={e.cover}
                        alt={e.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-zinc-700 to-zinc-500" />
                    )}

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      {e.date && (
                        <div className="text-[11px] uppercase tracking-wide opacity-80">
                          {new Date(e.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      )}
                      <div className="text-sm font-semibold leading-tight">
                        {e.title}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
