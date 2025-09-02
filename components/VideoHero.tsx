// components/VideoHero.tsx
'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

type VideoHeroProps = {
  sources: string[];               // 例：['/hero-a.webm?v=1','/hero-a.mp4?v=1']
  poster?: string;                 // 例：'/hero-poster.jpg'
  heading?: string;
  subheading?: string;
  href?: string;                   // 整块点击跳转
};

export default function VideoHero({
  sources,
  poster = '/hero-poster.jpg',
  heading,
  subheading,
  href = '/events',
}: VideoHeroProps) {
  const v0 = useRef<HTMLVideoElement>(null);
  const v1 = useRef<HTMLVideoElement>(null);
  const v2 = useRef<HTMLVideoElement>(null);

  // 尝试自动播放（移动端需要 muted + playsInline）
  useEffect(() => {
    [v0.current, v1.current, v2.current].forEach((el) => {
      el?.play().catch(() => {/* ignore */});
    });
  }, []);

  const renderVideo = (ref: React.RefObject<HTMLVideoElement>, mirrored = false) => (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      style={{
        flex: '1 1 0%',
        width: '33.3333%',
        height: '100%',
        objectFit: 'cover',
        transform: mirrored ? 'scaleX(-1)' : undefined,
        backgroundColor: '#000',
      }}
      aria-label="Club hero"
    >
      {/* webm 优先，其次 mp4 */}
      {sources.map((src) => {
        const type = src.includes('.webm') ? 'video/webm' : 'video/mp4';
        return <source key={src} src={src} type={type} />;
      })}
    </video>
  );

  return (
    <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* 点击整块跳转到主推活动 */}
      <Link href={href} aria-label="Open featured event"
        style={{ position: 'absolute', inset: 0, zIndex: 10 }} />

      <div style={{ display: 'flex', height: '100%' }}>
        {renderVideo(v0, false)}
        {renderVideo(v1, true)}   {/* 中间镜像，MOS 同款视觉 */}
        {renderVideo(v2, false)}
      </div>

      {/* 文案覆盖层 */}
      {(heading || subheading) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            zIndex: 11,
            textAlign: 'center',
            color: '#fff',
            pointerEvents: 'none',
            background:
              'linear-gradient(180deg, rgba(0,0,0,.25) 0%, rgba(0,0,0,.25) 60%, rgba(0,0,0,.55) 100%)',
          }}
        >
          <div style={{ padding: '0 24px' }}>
            {heading && (
              <h1 style={{ fontSize: 'clamp(28px,4vw,64px)', letterSpacing: 2, margin: 0 }}>
                {heading}
              </h1>
            )}
            {subheading && (
              <p style={{ opacity: 0.9, marginTop: 8, fontSize: 'clamp(12px,1.6vw,18px)' }}>
                {subheading}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
