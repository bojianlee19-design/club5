// components/HeroTriptych.tsx
import Link from "next/link";

type Props = {
  /** 视频文件路径（public/ 下），比如 "/hero-b0.mp4" */
  src: string;
  /** 可选：poster 静态图 */
  poster?: string;
};

export default function HeroTriptych({ src, poster }: Props) {
  const sources = [src, src, src]; // 三联同源；以后想换成三段不同视频也很容易

  return (
    <section className="relative bg-black">
      {/* 整块可点击进入 What's On（/events） */}
      <Link
        href="/events"
        aria-label="Go to What's On"
        className="absolute inset-0 z-10"
      />
      {/* 容器：桌面三列，移动一列；高度与 MOS 相近 */}
      <div className="mx-auto grid h-[70vh] max-w-7xl grid-cols-1 gap-2 px-2 md:h-[85vh] md:grid-cols-3">
        {sources.map((s, i) => (
          <video
            key={i}
            className="h-full w-full rounded-2xl object-cover"
            autoPlay
            muted
            playsInline
            loop
            preload="metadata"
            poster={poster}
          >
            <source src={s} type="video/mp4" />
          </video>
        ))}
      </div>
    </section>
  );
}
