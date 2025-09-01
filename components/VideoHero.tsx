// components/VideoHero.tsx
'use client';

import * as React from 'react';

type SourceItem = string | { src: string; type?: string };

type Props = {
  sources: SourceItem[];                    // 既支持 '/a.mp4' 也支持 {src,type}
  poster?: string;
  heading: string;
  subheading?: string;
  cta?: { href: string; label: string };
};

export default function VideoHero({
  sources,
  poster,
  heading,
  subheading,
  cta,
}: Props) {
  // 规范化成 {src,type}
  const normalized = sources.map((s) =>
    typeof s === 'string'
      ? {
          src: s,
          type: s.endsWith('.webm')
            ? 'video/webm'
            : s.endsWith('.mp4')
            ? 'video/mp4'
            : undefined,
        }
      : s
  );

  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  // iOS/Safari 等浏览器需要 muted+playsInline 才能自动播放；若失败再尝试 play()
  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const tryPlay = async () => {
      try {
        await v.play();
      } catch {
        // 自动播放受阻时，不再报错，由浏览器显示控件
        v.controls = true;
      }
    };

    // 确保 muted 才能自动播放
    v.muted = true;
    v.playsInline = true;
    tryPlay();
  }, []);

  return (
    <section className="relative h-[80vh] min-h-[560px] w-full overflow-hidden">
      {/* 背景视频 */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
      >
        {normalized.map((s, i) => (
          <source key={i} src={s.src} type={s.type} />
        ))}
        {/* 旧浏览器兜底文案 */}
        您的浏览器不支持 HTML5 视频。
      </video>

      {/* 顶部黑色渐变遮罩，让标题更清晰 */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />

      {/* 前景文字与按钮 */}
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-start justify-end gap-4 px-6 pb-14 text-white">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
          {heading}
        </h1>
        {subheading ? (
          <p className="text-lg opacity-90 md:text-2xl">{subheading}</p>
        ) : null}
        {cta ? (
          <a
            href={cta.href}
            className="mt-2 inline-flex items-center rounded-full bg-white/10 px-6 py-3 text-sm font-semibold ring-1 ring-white/30 backdrop-blur hover:bg-white/20"
          >
            {cta.label}
          </a>
        ) : null}
      </div>
    </section>
  );
}
