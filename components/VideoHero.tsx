'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

type Source = { src: string; type?: string };

interface Props {
  sources: Source[]; // 同一条视频的多种格式（会被每列复用）
  poster?: string;
  heightClass?: string; // 可自定义高度，默认 h-[88vh]
}

export default function VideoHero({
  sources,
  poster = '/hero-poster.jpg',
  heightClass = 'h-[88vh]',
}: Props) {
  // 为了确保移动端也能自动播放，强制 muted + playsInline，并在挂载后调 play()
  const refs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];

  useEffect(() => {
    refs.forEach(r => {
      const el = r.current;
      if (!el) return;
      // 尝试播放（有些浏览器需要用户手势，但 muted + playsInline 一般可自动播）
      const p = el.play();
      if (p && typeof p.catch === 'function') p.catch(() => {/* ignore */});
    });
  }, []);

  const VideoEl = (idx: number) => (
    <Link href="/events" className="group relative block h-full w-full overflow-hidden">
      <video
        ref={refs[idx]}
        className={`h-full w-full object-cover`}
        muted
        playsInline
        autoPlay
        loop
        preload="metadata"
        poster={poster}
      >
        {sources.map((s, i) => (
          <source key={i} src={s.src} type={s.type} />
        ))}
      </video>
      {/* hover 微弱暗化以提示可点击 */}
      <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
    </Link>
  );

  return (
    <section className={`w-full ${heightClass}`}>
      <div className="grid h-full w-full grid-cols-1 md:grid-cols-3 gap-[2px] bg-black">
        <div className="relative">{VideoEl(0)}</div>
        <div className="relative hidden md:block">{VideoEl(1)}</div>
        <div className="relative hidden md:block">{VideoEl(2)}</div>
      </div>
    </section>
  );
}
