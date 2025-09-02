// components/VideoHero.tsx
import Link from "next/link";

type Source = string | { src: string; type?: string };

type Props = {
  sources: Source[];
  poster?: string;
  heading?: string;
  subheading?: string;
  cta?: { href: string; label: string };
  href?: string; // 点击整块跳转（默认 /events）
};

export default function VideoHero({
  sources = [],
  poster,
  heading,
  subheading,
  cta,
  href = "/events",
}: Props) {
  return (
    <section className="relative isolate">
      {/* 点击整块跳转 */}
      <Link href={href} className="absolute inset-0 z-10" aria-label="Go to What's On">
        <span className="sr-only">Go to What's On</span>
      </Link>

      <div className="relative h-[70vh] min-h-[460px] w-full overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
          poster={poster}
        >
          {sources.map((s, i) =>
            typeof s === "string" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <source key={i} src={s} />
            ) : (
              <source key={i} src={s.src} type={s.type} />
            )
          )}
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="relative z-20 h-full w-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 pb-10 w-full">
            {heading ? (
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight">{heading}</h1>
            ) : null}
            {subheading ? (
              <p className="mt-3 text-base sm:text-lg text-white/80">{subheading}</p>
            ) : null}
            {cta ? (
              <Link
                href={cta.href}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-2 text-sm font-semibold hover:bg-white/90 transition"
              >
                {cta.label} →
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
