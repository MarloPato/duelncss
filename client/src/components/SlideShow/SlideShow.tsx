import { useRef, useCallback, type ReactNode } from 'react';
import './SlideShow.css';

interface SlideShowProps {
  targetSrc: string;
  viewportW: number;
  viewportH: number;
  children: ReactNode;
  enabled: boolean;
}

export default function SlideShow({ targetSrc, viewportW, viewportH, children, enabled }: SlideShowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!enabled) return;
    const clientX = e.clientX;
    if (rafId.current) return;

    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || !userRef.current) return;

      const x = clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const clipRight = 100 - pct;

      userRef.current.style.clipPath = `inset(0 ${clipRight}% 0 0)`;

      if (lineRef.current) {
        lineRef.current.style.left = `${pct}%`;
        lineRef.current.style.opacity = '1';
      }
    });
  }, [enabled]);

  const onMouseLeave = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    if (userRef.current) {
      userRef.current.style.clipPath = '';
    }
    if (lineRef.current) {
      lineRef.current.style.opacity = '0';
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`slideshow ${enabled ? 'slideshow--active' : ''}`}
      style={{ width: viewportW, height: viewportH }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {enabled && (
        <img
          className="slideshow-target"
          src={targetSrc}
          alt="target"
          width={viewportW}
          height={viewportH}
          draggable={false}
        />
      )}

      <div ref={userRef} className="slideshow-user">
        {children}
      </div>

      {enabled && <div ref={lineRef} className="slideshow-line" />}
    </div>
  );
}
