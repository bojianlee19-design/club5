'use client';

import Link from 'next/link';
import * as React from 'react';

type Props = {
  /** 视频源（默认 3 列都用同一个） */
  src?: string;
  /** 封面兜底图（可选） */
  poster?: string;
  /** 主标题/副标题（可选） */
  heading?: string;
  subheading?: string;
  /** 点击后跳转（默认 /events） */
  href?: string;
};

export default function HeroTriptych({
  src = '/hero-b0.mp4',
  poster = '/hero-poster.jpg',
  heading = 'HAZY CLUB',
  subheading = 'NIGHTS · MUSIC · COMMUNITY',
  href = '/events',
}: Props) {
  const videoRefs = [React.useRef<HTMLVideoElement>(null), React.useRef<HTMLVideoElement>(null), React.useRef<HTMLVideoElement>(null)];

  // 进入视口后尝试播放
  React.useEffect(() => {
    const vids = videoRefs.map(r => r.current).filter(Boolean) as HTMLVideoElement[];
    vids.forEach(v => {
      v.muted = true;
      v.playsInline = true;
      v.loop = true;
      const tryPlay = async () => { try { await v.play(); } catch { /* ignore */ } };
      v.addEventListener('canplay', tryPlay, { once: true });
      // 如果 canplay 没触发也尝试一下
      tryPlay();
    });
    return () => {
      vids.forEach(v => v.pause());
    };
  }, []);

  return (
    <section className="relative isolate mt-16 bg-black">
      <Link href={href} className="block">
        <div className="grid h-[78vh] grid-cols-1 gap-2 md:h-[90vh] md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative overflow-hidden rounded-none md:rounded-none">
              <video
                ref={videoRefs[i]}
                className="h-full w-full object-cover"
                src={src}
                poster={poster}
                muted
                playsInline
                preload="auto"
                loop
                controls={false}
              />
              {/* 可选：轻微渐变遮罩，提升标题可读性 */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          ))}
        </div>

        {/* 中心标题层（可选） */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl bg-black/30 px-5 py-3 text-center backdrop-blur-md">
            <div className="text-xs tracking-[0.25em] text-white/80">{subheading}</div>
            <h1 className="mt-1 text-3xl font-extrabold tracking-wide md:text-5xl">{heading}</h1>
            <div className="mt-2 text-[11px] uppercase tracking-[0.25em] text-white/70">Tap / Click to view events</div>
          </div>
        </div>
      </Link>
    </section>
  );
}
