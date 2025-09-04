// components/EventsRail.tsx
'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import EventCardWide from './EventCardWide';

type Item = {
  slug: string;
  title: string;
  date?: string;
  cover?: string;
  // id?: string; // 不再传入/使用
};

type Props = {
  events: Item[];
};

export default function EventsRail({ events }: Props) {
  const listRef = useRef<HTMLUListElement | null>(null);

  // 手势 & 滚动
  const draggingRef = useRef(false);
  const [dragging, setDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollStartRef = useRef(0);
  const movedPxRef = useRef(0);
  const [stepWidth, setStepWidth] = useState(360);

  // 计算每个卡片宽度（含 gap）
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const measure = () => {
      const first = el.querySelector('li') as HTMLElement | null;
      if (first) {
        const w = first.getBoundingClientRect().width;
        // 这里的 24 对应 tailwind 中 gap-6（6*4px）
        setStepWidth(w + 24);
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const snapToNearest = useCallback(() => {
    const el = listRef.current;
    if (!el || stepWidth <= 0) return;
    const i = Math.round(el.scrollLeft / stepWidth);
    const target = i * stepWidth;
    el.scrollTo({ left: target, behavior: 'smooth' });
  }, [stepWidth]);

  const scrollByCard = useCallback(
    (dir: number) => {
      const el = listRef.current;
      if (!el) return;
      const delta = stepWidth || Math.min(el.clientWidth * 0.8, 520);
      el.scrollBy({ left: dir * delta, behavior: 'smooth' });
    },
    [stepWidth]
  );

  // 原生事件（pointer + touch），增强移动端“拖拽”手感
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      draggingRef.current = true;
      setDragging(true);
      startXRef.current = e.clientX;
      scrollStartRef.current = el.scrollLeft;
      movedPxRef.current = 0;
      el.setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - startXRef.current;
      movedPxRef.current = Math.max(movedPxRef.current, Math.abs(dx));
      el.scrollLeft = scrollStartRef.current - dx;
    };

    const endPointer = (e?: PointerEvent) => {
      if (draggingRef.current) {
        draggingRef.current = false;
        setDragging(false);
        if (e) el.releasePointerCapture?.(e.pointerId);
        // 手指抬起后，吸附到最近卡片
        requestAnimationFrame(snapToNearest);
      }
    };

    const onPointerUp = (e: PointerEvent) => endPointer(e);
    const onPointerCancel = (e: PointerEvent) => endPointer(e);
    const onPointerLeave = () => endPointer();

    // 兼容 iOS 低版本，仅 touch 事件
    let touchStartX = 0;
    let touchStartScroll = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      draggingRef.current = true;
      setDragging(true);
      const t = e.touches[0];
      touchStartX = t.clientX;
      touchStartScroll = el.scrollLeft;
      movedPxRef.current = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!draggingRef.current || e.touches.length !== 1) return;
      const t = e.touches[0];
      const dx = t.clientX - touchStartX;
      movedPxRef.current = Math.max(movedPxRef.current, Math.abs(dx));
      el.scrollLeft = touchStartScroll - dx;
    };

    const onTouchEnd = () => {
      if (draggingRef.current) {
        draggingRef.current = false;
        setDragging(false);
        requestAnimationFrame(snapToNearest);
      }
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerCancel);
    el.addEventListener('pointerleave', onPointerLeave);

    el.addEventListener('touchstart', onTouchStart as any, { passive: true });
    el.addEventListener('touchmove', onTouchMove as any, { passive: true });
    el.addEventListener('touchend', onTouchEnd as any);

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
  }, [snapToNearest, stepWidth]);

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
          dragging ? 'snap-none' : 'snap-x snap-mandatory',
        ].join(' ')}
      >
        {events.map((e) => (
          <li
            key={e.slug}
            className="mx-auto w-[86vw] min-w-[280px] max-w-[420px] snap-center sm:w-[420px] md:w-[520px]"
          >
            <Link href={`/events/${e.slug}`} className="block" onClickCapture={handleClickCapture}>
              <EventCardWide
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
