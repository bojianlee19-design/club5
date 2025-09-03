// components/EventsRail.tsx
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import EventCardWide from './EventCardWide';

type Item = { id?: string; slug: string; title: string; date?: string; cover?: string };

export default function EventsRail({ events }: { events: Item[] }) {
  const listRef = useRef<HTMLUListElement>(null);

  // 拖拽/惯性相关
  const [dragging, setDragging] = useState(false);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTRef = useRef(0);
  const velocityRef = useRef(0);
  const movedPxRef = useRef(0);

  // gap-6 => 24
  const GAP = 24;

  const stepWidth = useMemo(() => {
    const el = listRef.current;
    if (!el) return 360;
    const first = el.querySelector('li') as HTMLLIElement | null;
    if (!first) return 360;
    return first.clientWidth + GAP;
  }, [events.length]);

  // 桌面左右按钮
  const scrollByCard = (dir: number) => {
    const el = listRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * stepWidth, behavior: 'smooth' });
  };

  // —— 工具：动画到目标位置（松手时吸附）——
  const animateTo = (target: number) => {
    const el = listRef.current!;
    const start = el.scrollLeft;
    const distance = target - start;
    const duration = 380;
    const t0 = performance.now();

    const tick = () => {
      const p = Math.min(1, (performance.now() - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.scrollLeft = start + distance * eased;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // —— 开/关 snap + smooth（用内联样式直接控制，兼容度最高）——
  const setSnap = (on: boolean) => {
    const el = listRef.current;
    if (!el) return;
    el.style.scrollBehavior = on ? 'smooth' : 'auto';
    // Tailwind 的 snap-x 在内联上等价于 scrollSnapType: 'x mandatory'
    el.style.scrollSnapType = on ? 'x mandatory' as any : 'none';
  };

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    // ===== Pointer 事件（大多数现代浏览器）=====
    const onPointerDown = (e: PointerEvent) => {
      isDownRef.current = true;
      setDragging(true);
      setSnap(false); // 关闭 snap + smooth，让拖拽实时跟随
      el.setPointerCapture?.(e.pointerId);
      startXRef.current = e.clientX;
      startScrollRef.current = el.scrollLeft;
      lastXRef.current = e.clientX;
      lastTRef.current = performance.now();
      velocityRef.current = 0;
      movedPxRef.current = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDownRef.current) return;
      const dx = e.clientX - startXRef.current;
      movedPxRef.current = Math.max(movedPxRef.current, Math.abs(dx));
      // 实时拖拽：直接设置 scrollLeft
      el.scrollLeft = startScrollRef.current - dx;

      const now = performance.now();
      const dt = now - lastTRef.current;
      if (dt > 0) {
        const vx = (e.clientX - lastXRef.current) / dt; // px/ms
        velocityRef.current = velocityRef.current * 0.8 + vx * 0.2;
        lastXRef.current = e.clientX;
        lastTRef.current = now;
      }
    };

    const finishDrag = () => {
      if (!isDownRef.current) return;
      isDownRef.current = false;

      // 惯性位移
      const inertia = velocityRef.current * 240;
      let target = el.scrollLeft - inertia;

      // 吸附最近卡片
      const idx = Math.round(target / stepWidth);
      target = idx * stepWidth;
      target = Math.max(0, Math.min(target, el.scrollWidth - el.clientWidth));

      animateTo(target);

      // 稍后恢复 snap + smooth
      setTimeout(() => {
        setSnap(true);
        setDragging(false);
      }, 20);
    };

    const onPointerUp = finishDrag;
    const onPointerCancel = finishDrag;
    const onPointerLeave = finishDrag;

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerCancel);
    el.addEventListener('pointerleave', onPointerLeave);

    // ===== Touch 事件（iOS 兼容保险）=====
    const getTouchX = (te: TouchEvent) => te.touches[0]?.clientX ?? te.changedTouches[0]?.clientX ?? 0;

    const onTouchStart = (te: TouchEvent) => {
      isDownRef.current = true;
      setDragging(true);
      setSnap(false);
      const x = getTouchX(te);
      startXRef.current = x;
      startScrollRef.current = el.scrollLeft;
      lastXRef.current = x;
      lastTRef.current = performance.now();
      velocityRef.current = 0;
      movedPxRef.current = 0;
    };

    const onTouchMove = (te: TouchEvent) => {
      if (!isDownRef.current) return;
      const x = getTouchX(te);
      const dx = x - startXRef.current;
      movedPxRef.current = Math.max(movedPxRef.current, Math.abs(dx));
      el.scrollLeft = startScrollRef.current - dx;

      const now = performance.now();
      const dt = now - lastTRef.current;
      if (dt > 0) {
        const vx = (x - lastXRef.current) / dt;
        velocityRef.current = velocityRef.current * 0.8 + vx * 0.2;
        lastXRef.current = x;
        lastTRef.current = now;
      }
      // 阻止页面纵向滚动干扰，仅在横向移动明显时阻止
      if (Math.abs(dx) > 6) te.preventDefault();
    };

    const onTouchEnd = () => finishDrag();

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerCancel);
      el.removeEventListener('pointerleave', onPointerLeave);

      el.removeEventListener('touchstart', onTouchStart as any);
      el.removeEventListener('touchmove', onTouchMove as any);
      el.removeEventListener('touchend', onTouchEnd as any);
    };
  }, [stepWidth]);

  // 防“拖拽→误点开详情”
  const handleClickCapture = (e: React.MouseEvent) => {
    if (movedPxRef.current > 8) {
      e.preventDefault();
      e.stopPropagation();
    }
    movedPxRef.current = 0;
  };

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {/* 桌面左右箭头 */}
      <button
        onClick={() => scrollByCard(-1)}
        aria-label="Prev"
        className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/15 p-2 text-white ring-1 ring-white/20 backdrop-blur hover:bg-white/25 md:block"
      >
        ←
      </button>
      <button
        onClick={() => scrollByCard(1)}
        aria-label="Next"
        className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/15 p-2 text-white ring-1 ring-white/20 backdrop-blur hover:bg-white/25 md:block"
      >
        →
      </button>

      <ul
        ref={listRef}
        className={[
          'mx-auto flex w-full gap-6 overflow-x-auto px-2 pb-2',
          'select-none no-scrollbar',
          '[-webkit-overflow-scrolling:touch]',
          'touch-pan-x', // 允许横向手势
          // 拖拽时关闭 snap（用内联 setSnap 更可靠，这里保持语义类）
          dragging ? 'snap-none' : 'snap-x snap-mandatory',
        ].join(' ')}
      >
        {events.map((e) => (
          <li
            key={e.slug}
            className="snap-center w-[86vw] min-w-[280px] max-w-[420px] sm:w-[420px] md:w-[520px] mx-auto"
          >
            <Link
              href={`/events/${e.slug}`}
              className="block"
              onClickCapture={handleClickCapture}
            >
              <EventCardWide
                id={e.id ?? e.slug}
                slug={e.slug}
                title={e.title}
                date={e.date}
                cover={e.cover ?? undefined}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
