import React, { useEffect, useRef, useState } from 'react';

interface FlashcardCategory {
  name: string;
  questions: string[];
}

interface FlashcardViewerProps {
  category: FlashcardCategory;
  categoryIndex?: number;
  onBack: () => void;
}

// Simplified Flashcard viewer without swipe/drag functionality
export function FlashcardViewer({ category, categoryIndex = 0, onBack }: FlashcardViewerProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const categoryRef = useRef<HTMLDivElement | null>(null);
  const questionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setQuestionIndex(0);
  }, [category]);

  // Auto-fit question text so it stays inside the card (keeps UX tidy)
  useEffect(() => {
    function fitText() {
      const qEl = questionRef.current;
      const cEl = cardRef.current;
      const catEl = categoryRef.current;
      if (!qEl || !cEl) return;

      const cardStyles = window.getComputedStyle(cEl);
      const paddingTop = parseFloat(cardStyles.paddingTop || '0');
      const paddingBottom = parseFloat(cardStyles.paddingBottom || '0');
      const catHeight = catEl ? catEl.offsetHeight : 0;
      const available = Math.max(40, cEl.clientHeight - paddingTop - paddingBottom - catHeight - 16);

      qEl.style.maxHeight = available + 'px';

      const initial = 20;
      const minFont = 12;
      let font = initial;
      qEl.style.fontSize = font + 'px';
      while (qEl.scrollHeight > qEl.clientHeight && font > minFont) {
        font -= 1;
        qEl.style.fontSize = font + 'px';
      }
    }

    fitText();
    const onResize = () => fitText();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [questionIndex, category]);

  const isFirst = questionIndex === 0;
  const isLast = questionIndex === (category.questions?.length ?? 0) - 1;

  function goNext() { if (!isLast) setQuestionIndex(i => i + 1); }
  function goPrev() { if (!isFirst) setQuestionIndex(i => i - 1); }

  function categoryPaletteVar(i: number) {
    const idx = ((i % 6) + 6) % 6;
    switch (idx) {
      case 0: return '--cp-rosewater';
      case 1: return '--cp-pink';
      case 2: return '--cp-peach';
      case 3: return '--cp-green';
      case 4: return '--cp-sky';
      case 5: return '--cp-lavender';
      default: return '--cp-blue';
    }
  }

  return (
    <div className="flashcard-viewer">
      <div className="flashcard-panel" role="region" aria-label="Flashcard viewer" style={{ ['--flashcard-category-accent' as any]: `var(${categoryPaletteVar(categoryIndex)})` }}>
        <header className="flashcard-header">
          <button className="flashcard-back" onClick={onBack} aria-label="Back to categories">← Categories</button>
        </header>

        <main className="flashcard-main">
          <div ref={cardRef} className="flashcard-card" role="article" aria-label="Flashcard">
            <div ref={categoryRef} className="flashcard-category">{category.name}</div>
            <div ref={questionRef} className="flashcard-question">{category.questions?.[questionIndex]}</div>
          </div>
        </main>

        <footer className="flashcard-controls" role="group" aria-label="Flashcard controls">
          <button className="flashcard-nav flashcard-prev" onClick={goPrev} disabled={isFirst} aria-label="Previous question">‹</button>
          <div className="flashcard-progress" aria-hidden>{category.questions ? `${questionIndex + 1} / ${category.questions.length}` : '0 / 0'}</div>
          <button className="flashcard-nav flashcard-next" onClick={goNext} disabled={isLast} aria-label="Next question">›</button>
        </footer>
      </div>
    </div>
  );
}

export default FlashcardViewer;
