import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scaleRef = useRef(1);
  const targetScaleRef = useRef(1);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e: MouseEvent) => {
      posRef.current.targetX = e.clientX;
      posRef.current.targetY = e.clientY;

      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, [role="button"], input, textarea, select, .cursor-pointer, .interactive');
      targetScaleRef.current = isInteractive ? 2.5 : 1;
    };

    const onMouseLeave = () => {
      targetScaleRef.current = 0;
    };

    const onMouseEnter = () => {
      targetScaleRef.current = 1;
    };

    let raf: number;
    const animate = () => {
      const p = posRef.current;
      p.x += (p.targetX - p.x) * 0.12;
      p.y += (p.targetY - p.y) * 0.12;
      scaleRef.current += (targetScaleRef.current - scaleRef.current) * 0.1;

      cursor.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) scale(${scaleRef.current})`;
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="cursor-star"
      style={{
        width: 24,
        height: 24,
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 99999,
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z"
          fill="rgba(239, 182, 255, 0.9)"
          style={{ filter: 'drop-shadow(0 0 6px rgba(239, 182, 255, 0.6))' }}
        />
      </svg>
    </div>
  );
}
