import React, { useState } from 'react';

interface FlashcardCategory {
  name: string;
  questions: string[];
}

interface FlashcardViewerProps {
  category: FlashcardCategory;
  onBack: () => void;
}

export function FlashcardViewer({ category, onBack }: FlashcardViewerProps) {
  const [questionIndex, setQuestionIndex] = useState(0);

  const isFirst = questionIndex === 0;
  const isLast = questionIndex === category.questions.length - 1;

  function goToNext() {
    if (!isLast) setQuestionIndex(questionIndex + 1);
  }

  function goToPrev() {
    if (!isFirst) setQuestionIndex(questionIndex - 1);
  }

  return (
    <div className="flashcard">
      <button className="flashcard-back" onClick={onBack}>
        ← Categories
      </button>
      <div className="flashcard-stack">
        <div className="flashcard-card">
          <div className="flashcard-category">{category.name}</div>
          <div className="flashcard-question">{category.questions[questionIndex]}</div>
        </div>
      </div>
      <div className="flashcard-controls">
        <button
          className="flashcard-prev"
          onClick={goToPrev}
          disabled={isFirst}
        >
          Prev
        </button>
        <button
          className="flashcard-next"
          onClick={goToNext}
          disabled={isLast}
        >
          Next
        </button>
      </div>
    </div>
  );

}

export default FlashcardViewer;