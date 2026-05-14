import { useState, useRef, useCallback } from 'react';
import './SlideShow.css';

export default function SlideShow({ targetSrc, viewportW, viewportH, children, enabled }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const onPointerDown = useCallback((e) => {
    e.preventDefault();
    dragging.current = true;
    e.target.setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  }, [updatePosition]);

  const onPointerMove = useCallback((e) => {
    if (!dragging.current) return;
    updatePosition(e.clientX);
  }, [updatePosition]);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const clipRight = 100 - (enabled ? position : 50);

  return (
    <div
      ref={containerRef}
      className="slideshow"
      style={{ width: viewportW, height: viewportH }}
    >
      <img
        className="slideshow-target"
        src={targetSrc}
        alt="target"
        width={viewportW}
        height={viewportH}
        draggable={false}
      />

      <div
        className="slideshow-user"
        style={enabled ? { clipPath: `inset(0 ${clipRight}% 0 0)` } : undefined}
      >
        {children}
      </div>

      {enabled && (
        <div
          className="slideshow-slider"
          style={{ left: `${position}%` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <div className="slideshow-line" />
          <div className="slideshow-grip" />
        </div>
      )}
    </div>
  );
}
