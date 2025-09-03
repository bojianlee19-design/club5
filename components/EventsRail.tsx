// components/EventsRail.tsx
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import EventCardWide from './EventCardWide';

type Item = { id?: string; slug: string; title: string; date?: string; cover?: string };

export default function EventsRail({ events }: { events: Item[] }) {
  const listRef = useRef<HTMLUListElement>(null);

  // 拖拽手感所需的状态与临时量
  const [dragging, setDragging] = useState(false); // 正在拖拽时，关闭 scroll-snap
  const startXRef = useRef(0);
  const startScrollRef = useRef(0);
  const isDownRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTRef = useRef(0);
  const velocityRef = useRef(0);
  const dragMovedPxRef = useRef(0);

  // 和样式保持一致：gap-6 -> 24px
  const GAP = 24;

  // 计算每张卡片的宽度 + 间距，用于惯性/吸附
  const stepWidth = useMemo(() => {
    const el = listRef.current;
    if (!el) return 360;
    const firstLi = el.querySelector('li') as HTMLLIElement | null;
    if (!firstLi) return 360;
    return firstLi.clientWidth + GAP;
  }, [events.length]);

  // 左右按钮滚动（桌面）
  const scrollByCard = (dir: number) => {
    const el = listRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * stepWidth, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      isDownRef.current = true;
      setDragging(true);
      el.setPointerCapture(e.pointerId);
      startXRef.current = e.clientX;
      startScrollRef.current = el.scrollLeft;
      lastXRef.current = e.clientX;
      lastTRef.current = performance.now();
      velocityRef.current = 0;
      dragMovedPxRef.current = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDownRef.current) return;
      const dx = e.clientX - startXRef.current;
      dragMovedPxRef.current = Math.max(dragMovedPxRef.current, Math.abs(dx));
      el.scrollLeft = startScrollRef.current - dx;

      // 记录速度
      const now = performance.now();
      const dt = now - lastTRef.current;
      if (dt > 0) {
        const vx = (e.clientX - lastXRef.current) / dt; // px/ms
        // 简单低通滤波，避免噪声
        velocityRef.current = velocityRef.current * 0.8 + vx * 0.2;
        lastXRef.current = e.clientX;
        lastTRef.current = now;
      }
    };

    const animateTo = (target: number) => {
      const start = el.scrollLeft;
      const distance = target - start;
      const duration = 380; // ms
      const t0 = performance.now();

      const tick = () => {
        const t = performance.now() - t0;
        const p = Math.min(1, t / duration);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - p, 3);
        el.scrollLeft = start + distance * eased;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const onPointerUp = () => {
      if (!isDownRef.current) return;
      isDownRef.current = false;

      // 惯性位移（像素）
      const inertia = velocityRef.current * 240; // 240 可调：越大“甩”的越远
      let target = el.scrollLeft - inertia;

      // 吸附到最近卡片中心
      const index = Math.round(target / stepWidth);
      target = index * stepWidth;
      // 边界夹紧
      target = Math.max(0, Math.min(target, el.scrollWidth - el.clientWidth));

      // 平滑动画到目标
      animateTo(target);

      // 结束后恢复 snap
      setTimeout(() => setDragging(false), 10);
    };

    el.addEventListener('pointerdown', onPointerDown, { passive: true });
    el.addEventListener('pointermove', onPointerMove, { passive: true });
    el.addEventListener('pointerup', onPointerUp, { passive: true });
    el.addEventListener('pointercancel', onPointerUp, { passive: true });
    el.addEventListener('pointerleave', onPointerUp, { passive: true });

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
      el.removeEventListener('pointerleave', onPointerUp);
    };
  }, [stepWidth]);

  // 防止“拖拽却误点进详情”
  const handleClickCapture = (e: React.MouseEvent) => {
    if (dragMovedPxRef.current > 8) {
      e.preventDefault();
      e.stopPropagation();
    }
    // 重置
    dragMovedPxRef.current = 0;
  };

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {/* 左右按钮（桌面端显示） */}
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
          'touch-pan-x overscroll-x-contain scroll-smooth',
          'snap-x', // 吸附方向
          dragging ? '[scroll-snap-type:none]' : '[scroll-snap-type:x_proximity]', // 拖拽时关闭 snap，手感更顺
          'no-scrollbar', // 隐藏滚动条（如果你有这类全局工具类）
          'select-none',  // 避免文字被选中
          '[-webkit-overflow-scrolling:touch]', // iOS 惯性
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
