'use client';

import Link from 'next/link';
import { useMemo } from 'react';

type Source = string | { src: string; type?: string };

export type Props = {
  sources: Source[];
  poster?: string;
  heading: string;
  subheading?: string;
  cta?: { href: string; label: string };
  linkTo?: string; // 整个英雄区点击跳转
};

function VideoColumn({ sources, poster, mirrored }: { sources: Source[]; poster?: string; mirrored?: boolean }) {
  const id = useMemo(() => Math.random().toString(36).slice(2), []);
  return (
    <video
      key={id}
      className={`h-full w-full object-cover ${mirrored ? 'scale-x-[-1]' : ''}`}
      playsInline
      muted
      autoPlay
      loop
      poster={poster}
    >
      {sources.map((s, i) =>
        typeof s === 'string' ? (
          <source key={i} src={s} />
        ) : (
          <source key={i} src={s.src} type={s.type} />
        )
      )}
    </video>
  );
}

export default function VideoHero({ sources, poster, heading, subheading, cta, linkTo = '/events' }: Props) {
  const content = (
    <div className="relative">
      {/* 三列视频铺满 */}
      <div className="absolute inset-0 grid grid-cols-3 gap-2">
        <VideoColumn sources={sources} poster={poster} mirrored />
        <VideoColumn sources={sources} poster={poster} />
        <VideoColumn sources={sources} poster={poster} mirrored />
      </div>

      {/* 渐变遮罩让文字可读 */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

      {/* 居中文案 */}
      <div className="relative z-10 mx-auto flex h-[72svh] max-w-7xl items-end px-4 pb-10">
        <div className="rounded-2xl bg-black/45 p-6 text-white backdrop-blur">
          <h1 className="text-4xl font-black tracking-wider md:text-6xl">{heading}</h1>
          {subheading && <p className="mt-2 text-sm md:text-base">{subheading}</p>}
          {cta && (
            <Link
              href={cta.href}
              className="mt-4 inline-block rounded-full bg-white px-5 py-2 text-black hover:bg-neutral-200"
            >
              {cta.label}
            </Link>
          )}
        </div>
      </div>
      <div className="h-[72svh]" />
    </div>
  );

  return (
    <Link href={linkTo} className="block">
      {content}
    </Link>
  );
}
