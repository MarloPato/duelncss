import { useRef, useCallback } from 'react';
import './SlideShow.css';

export default function SlideShow({ targetSrc, viewportW, viewportH, children, enabled }) {
  const containerRef = useRef(null);
  const userRef = useRef(null);
  const lineRef = useRef(null);
  const rafId = useRef(null);

  const onMouseMove = useCallback((e) => {
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
