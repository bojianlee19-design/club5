// app/events/page.tsx
import TopNav from "@/components/TopNav";
import Link from "next/link";
import { getUpcomingEvents } from "@/lib/sanity";

// 保证页面每次请求都拿到最新活动（Sanity 无需缓存）
export const dynamic = "force-dynamic";

type RawEvent = {
  _id?: string;
  slug?: string | { current?: string };
  title?: string;
  date?: string;
  cover?: string; // 已在 lib/sanity 侧尽量转成 URL；这里仍做兜底
};

function asSlug(s?: string | { current?: string }) {
  if (!s) return "";
  return typeof s === "string" ? s : s.current ?? "";
}

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function EventsPage() {
  // 你的 getUpcomingEvents() 是无参版本，这里不传参
  const docs = ((await getUpcomingEvents()) || []) as RawEvent[];

  const events = docs
    .map((e) => ({
      id: e._id ?? asSlug(e.slug),
      slug: asSlug(e.slug),
      title: e.title ?? "Untitled",
      date: e.date,
      cover: e.cover, // 可能 undefined
    }))
    .filter((e) => !!e.id && !!e.slug);

  return (
    <main className="bg-black text-white">
      <TopNav />

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-28">
        <header className="mb-8 flex items-end justify-between gap-4">
          <h1 className="text-3xl font-extrabold tracking-wide md:text-4xl">
            What’s On
          </h1>

          {/* 右上角返回首页 / 购票入口（与 MOS 行为一致） */}
          <div className="flex items-center gap-4 text-sm font-medium uppercase tracking-wide">
            <Link href="/" className="opacity-80 hover:opacity-100">
              Back home
            </Link>
            <Link href="/events" className="opacity-80 hover:opacity-100">
              Tickets
            </Link>
          </div>
        </header>

        {/* 活动网格 */}
        {events.length === 0 ? (
          <p className="opacity-70">No upcoming events yet. Please check back later.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => {
              const href = `/events/${e.slug}`;
              const when = formatDate(e.date);

              return (
                <li key={e.id} className="group">
                  <Link href={href} className="block">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                      {e.cover ? (
                        <img
                          src={e.cover}
                          alt={e.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-500 text-sm opacity-80">
                          No cover
                        </div>
                      )}

                      {/* 底部渐变信息条 */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4">
                        {when && (
                          <div className="text-[11px] uppercase tracking-wide opacity-90">
                            {when}
                          </div>
                        )}
                        <div className="text-base font-semibold leading-tight">
                          {e.title}
                        </div>
                      </div>
                    </div>

                    {/* CTA 行 */}
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="opacity-80">View details →</span>
                      {/* 预留“Book”按钮，如需可改成直达外部售票链接 */}
                      <span className="rounded-full border border-white/20 px-3 py-1 opacity-80 transition-opacity group-hover:opacity-100">
                        Book
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* 页脚（与首页一致，保持站点信息完整） */}
      <footer className="mt-4 border-t border-white/10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-3">
          <div>
            <div className="font-bold">Visit us</div>
            <div>28 Eyre St, Sheffield City Centre, Sheffield S1 4QY</div>
          </div>
          <div>
            <div className="font-bold">Contact</div>
            <a href="mailto:matt@hazyclub.co.uk" className="underline">
              matt@hazyclub.co.uk
            </a>
          </div>
          <div>
            <div className="font-bold">Follow</div>
            <div>@hazyclub</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
