// ...existing code...
import React, { useEffect, useRef, useState } from 'react';

interface Category {
  name: string;
  questions?: string[];
}

interface CategoryPickerProps {
  categories: Category[];
  onSelect: (index: number) => void;
}

export function CategoryPicker({ categories, onSelect }: CategoryPickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const didMount = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [translate, setTranslate] = useState(0);

  // Keep constants in sync with CSS (--carousel-item-w, --carousel-gap)
  const ITEM_W = 170;
  const GAP = 16;

  // Compute translate so active item is centered
  useEffect(() => {
    function update() {
      const container = containerRef.current;
      if (!container) return;
      const cW = container.clientWidth;
      const centerOffset = cW / 2 - ITEM_W / 2;
      setTranslate(centerOffset - activeIndex * (ITEM_W + GAP));
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [activeIndex]);

  // Selection is explicit: user must confirm (Enter or double-click).
  // We keep didMount in case it's needed later, but do NOT auto-call onSelect on activeIndex change.
  useEffect(() => {
    if (!didMount.current) didMount.current = true;
  }, []);

  // Keyboard navigation and activation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (categories.length === 0) return;
      if (e.key === 'ArrowRight') {
        setActiveIndex(i => (i + 1) % categories.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex(i => (i - 1 + categories.length) % categories.length);
      } else if (e.key === 'Enter') {
        onSelect(activeIndex);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIndex, categories.length, onSelect]);

  // Pointer swipe for track
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let startX = 0;
    let dragging = false;
    let activePointerId: number | null = null;

    function down(e: PointerEvent) {
      dragging = true;
      startX = e.clientX;
      activePointerId = e.pointerId;
      try {
        (e.target as Element).setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
    function move(e: PointerEvent) {
      if (!dragging) return;
      const dx = e.clientX - startX;
      track.style.transform = `translateX(${translate + dx}px)`;
    }
    function up(e: PointerEvent) {
      if (!dragging) return;
      dragging = false;
      const dx = e.clientX - startX;
      const threshold = ITEM_W * 0.25;
      if (categories.length === 0) return;
      if (dx < -threshold) {
        setActiveIndex(i => (i + 1) % categories.length);
      } else if (dx > threshold) {
        setActiveIndex(i => (i - 1 + categories.length) % categories.length);
      } else {
        // snap back to computed translate
        track.style.transform = `translateX(${translate}px)`;
      }
      if (activePointerId !== null) {
        try {
          (e.target as Element).releasePointerCapture(activePointerId);
        } catch {
          // ignore
        }
        activePointerId = null;
      }
    }

    track.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);

    return () => {
      track.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [translate, categories.length]);

  // Random pick
  function pickRandom() {
    if (categories.length === 0) return;
    if (categories.length === 1) {
      setActiveIndex(0);
      return;
    }
    let rand = Math.floor(Math.random() * categories.length);
    if (rand === activeIndex) {
      rand = (rand + 1) % categories.length;
    }
    setActiveIndex(rand);
  }

  return (
    <div className="carousel-container">
      <div className="carousel" aria-roledescription="carousel" aria-label="Category carousel">
        <div className="carousel-window" ref={containerRef}>
          <div
            className="carousel-track"
            ref={trackRef}
            style={{ transform: `translateX(${translate}px)` }}
            role="list"
          >
            {categories.map((cat, idx) => {
              const isActive = idx === activeIndex;
              return (
                <div
                  key={cat.name}
                  role="option"
                  aria-selected={isActive}
                  className={`carousel-item ${isActive ? 'active' : ''}`}
                  title={cat.name}
                  onClick={() => onSelect(idx)}
                  tabIndex={0}
                >
                  <div className="carousel-card">
                    <div className="carousel-card-title">{cat.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="carousel-controls" role="group" aria-label="Carousel controls">
          <button
            className="carousel-nav"
            aria-label="Previous category"
            title="Previous category"
            onClick={() => {
                if (categories.length === 0) return;
                setActiveIndex(i => (i - 1 + categories.length) % categories.length);
              }}
          >
            ‹
          </button>

          <button
            className="carousel-random"
            aria-label="Pick a random category"
            onClick={pickRandom}
            title="Surprise me"
          >
            🎲
          </button>

          <button
            className="carousel-nav"
            aria-label="Next category"
            title="Next category"
            onClick={() => {
                if (categories.length === 0) return;
                setActiveIndex(i => (i + 1) % categories.length);
              }}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoryPicker
// ...existing code...