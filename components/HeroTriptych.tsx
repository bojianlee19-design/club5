// components/HeroTriptych.tsx
'use client';

type Props = {
  /** 英雄视频（你现在用的 /hero-b0.mp4） */
  src: string;
  /** 备用海报图 */
  poster?: string;
};

/**
 * 桌面端：三联视频（md 及以上显示 3 列）
 * 移动端：单个视频，竖向高度占满整屏（100svh/100vh）
 */
export default function HeroTriptych({ src, poster }: Props) {
  return (
    <div className="relative w-full overflow-hidden bg-black min-h-screen min-h-[100svh] md:min-h-[80vh]">
      <div className="grid h-full grid-cols-1 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`relative ${i === 0 ? 'block' : 'hidden md:block'} h-[100svh] min-h-screen md:h-[80vh]`}
          >
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              playsInline
              loop
              poster={poster}
            >
              <source src={src} type="video/mp4" />
              {/* 如后面补了 webm，也可加：
              <source src="/hero-b0.webm" type="video/webm" /> */}
            </video>
          </div>
        ))}
      </div>
    </div>
  );
}
