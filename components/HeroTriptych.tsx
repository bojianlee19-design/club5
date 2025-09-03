// components/HeroTriptych.tsx
'use client';

type Props = {
  src: string;
  poster?: string;
};

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
            </video>
          </div>
        ))}
      </div>

      {/* 中心文案（不遮挡点击） */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-[0.18em] text-white drop-shadow md:text-6xl">
            HAZY&nbsp;CLUB
          </h1>
          <p className="mt-3 text-xs font-semibold tracking-[0.22em] text-white/85 md:text-sm">
            NIGHTS · MUSIC · COMMUNITY
          </p>
        </div>
      </div>
    </div>
  );
}
