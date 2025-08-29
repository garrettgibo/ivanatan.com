interface Question {
    question: string;
}

interface Category {
    category: string;
    questions: Question[];
}

interface RelationshipQuestions {
    categories: Category[];
}