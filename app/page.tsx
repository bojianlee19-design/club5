// app/page.tsx
import VideoHero from "@/components/VideoHero";
import Link from "next/link";

// 如果你项目里有 sanity/image.ts（你之前创建过），就用它把对象图转 URL
let urlForImage: any = undefined;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  urlForImage = require("@/sanity/image").urlForImage;
} catch {}

type EventLite = {
  slug?: string | { current?: string };
  title?: string;
  name?: string;
  date?: string;
  when?: string;
  cover?: any;
  image?: any;
  poster?: any;
  images?: any[];
  gallery?: any[];
};

// ====== Demo 数据源说明 ======
// 这里假设你已有 /api/events 返回活动列表（或你已经在本文件中 fetch Sanity）。
// 如果你已有其它数据获取方式，保留即可，把结果映射成 EventLite[]。
async function getEvents(): Promise<EventLite[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/events`, {
      // Edge/Server 可直接相对路径：await fetch('/api/events', { cache: 'no-store' })
      // 但某些部署场景需要绝对路径；两种都兼容：
      cache: "no-store",
      next: { revalidate: 0 },
    }).catch(() => null);
    if (!res || !res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function ensureUrl(img: any): string | undefined {
  if (!img) return undefined;
  if (typeof img === "string") return img;
  if (img?.asset?.url) return img.asset.url;
  if (urlForImage && img?.asset?._ref) return urlForImage(img).width(800).url();
  return undefined;
}

function pickCover(ev: EventLite): string | undefined {
  const cands = [
    ensureUrl(ev.cover),
    ensureUrl(ev.image),
    ensureUrl(ev.poster),
    ensureUrl(ev.images?.[0]),
    ensureUrl(ev.gallery?.[0]),
  ].filter(Boolean) as string[];
  return cands[0];
}

function formatBadge(d?: string) {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "";
  const day = dt.toLocaleDateString("en-GB", { day: "2-digit" });
  const mon = dt.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
  return `${day} ${mon}`;
}

export default async function Page() {
  const events = (await getEvents()) ?? [];
  const safe = Array.isArray(events) ? events : [];

  return (
    <main>
      {/* 英雄屏 —— 整块可点，进入 /events */}
      <VideoHero
        href="/events"
        sources={[
          { src: "/hero-a.webm?v=1", type: "video/webm" },
          { src: "/hero-a.mp4?v=1", type: "video/mp4" },
          { src: "/hero-b0.mp4?v=1", type: "video/mp4" }, // 你说目前可播的文件
        ]}
        poster="/hero-poster.jpg"
        heading="HAZY CLUB"
        subheading="NIGHTS · MUSIC · COMMUNITY"
        cta={{ href: "/events", label: "Get Tickets" }}
      />

      {/* WHAT'S ON —— MOS 风格横向自动滚动（封面兜底） */}
      <section className="relative py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">WHAT’S ON</h2>
            <Link href="/events" className="text-sm underline hover:no-underline">
              View all
            </Link>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex gap-4 will-change-transform px-4"
            style={{ animation: "hazy-scroll 28s linear infinite" }}
          >
            {[...safe, ...safe].map((ev, i) => {
              const title = ev.title ?? ev.name ?? "Untitled Event";
              const date = ev.date ?? ev.when;
              const img = pickCover(ev);
              const slug =
                typeof ev.slug === "string" ? ev.slug : ev.slug?.current ?? "";

              return (
                <Link
                  href={slug ? `/events/${slug}` : "/events"}
                  key={`${slug || "no-slug"}-${i}`}
                  className="group w-[260px] sm:w-[320px] shrink-0 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors overflow-hidden"
                >
                  <div className="relative aspect-[4/3] bg-white/5">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img}
                        alt={title}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : null}
                    {date ? (
                      <div className="absolute top-2 left-2 text-[11px] font-bold px-2 py-1 rounded-md bg-black/70 backdrop-blur">
                        {formatBadge(date)}
                      </div>
                    ) : null}
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-white/60 mb-1">
                      {date
                        ? new Date(date).toLocaleDateString("en-GB", {
                            weekday: "short",
                            day: "2-digit",
                            month: "short",
                          })
                        : ""}
                    </div>
                    <div className="text-lg font-semibold leading-tight line-clamp-2">
                      {title}
                    </div>
                    <div className="mt-2 text-sm underline opacity-80 group-hover:opacity-100">
                      View Details →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <style>{`
          @keyframes hazy-scroll { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
        `}</style>
      </section>
    </main>
  );
}
