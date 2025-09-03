// components/HeroTriptych.tsx
import Link from 'next/link';

type Props = {
  src?: string;           // 传已有能播的 /hero-b0.mp4
  poster?: string;        // 可选占位
  href?: string;          // 点击跳转（默认 /events）
};

export default function HeroTriptych({ src = '/hero-b0.mp4', poster = '/hero-poster.jpg', href = '/events' }: Props) {
  const common = "h-[78vh] w-full object-cover";
  return (
    <section className="relative">
      {/* 点击覆盖层 */}
      <Link href={href} className="absolute inset-0 z-10" aria-label="Go to What's On" />

      {/* 视频：md 以上三联，md 以下单联 */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <video className={`${common}`} playsInline muted loop autoPlay preload="auto" poster={poster} src={src}/>
        <video className={`${common} hidden md:block`} playsInline muted loop autoPlay preload="auto" poster={poster} src={src}/>
        <video className={`${common} hidden md:block`} playsInline muted loop autoPlay preload="auto" poster={poster} src={src}/>
      </div>

      {/* 中央文案 */}
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
        <div className="rounded-2xl bg-black/30 px-6 py-4 text-center backdrop-blur-md">
          <h1 className="text-3xl font-extrabold tracking-widest md:text-5xl">HAZY CLUB</h1>
          <p className="mt-2 text-sm md:text-base opacity-90">NIGHTS · MUSIC · COMMUNITY</p>
          <p className="mt-3 text-xs opacity-70">Click to view events</p>
        </div>
      </div>
    </section>
  );
}
