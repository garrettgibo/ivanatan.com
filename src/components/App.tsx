import React, { useState } from 'react';
import { CategoryPicker } from './CategoryPicker';
import { FlashcardViewer } from './FlashcardViewer';
// @ts-ignore
import questionsData from '../data/relationship_questions.json';

interface FlashcardCategory {
  name: string;
  questions: string[];
}

interface QuestionsData {
  categories: FlashcardCategory[];
}

export function App() {
  const data: QuestionsData = questionsData;
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);

  if (selectedCategoryIndex === null) {
    return (
      <CategoryPicker
        categories={data.categories}
        onSelect={setSelectedCategoryIndex}
      />
    );
  }

  return (
    <FlashcardViewer
      category={data.categories[selectedCategoryIndex]}
      onBack={() => setSelectedCategoryIndex(null)}
    />
  );
}

export default App;