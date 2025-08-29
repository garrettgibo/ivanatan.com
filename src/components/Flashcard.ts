import questionsData from '../data/relationship_questions.json';

export class Flashcard {
    private currentCategoryIndex: number;
    private currentQuestionIndex: number;
    private questions: string[];

    // DOM refs
    private rootEl: HTMLElement | null = null;
    private questionEl: HTMLElement | null = null;
    private categoryEl: HTMLElement | null = null;
    private prevBtn: HTMLButtonElement | null = null;
    private nextBtn: HTMLButtonElement | null = null;
    private backBtn: HTMLButtonElement | null = null;

    constructor() {
        this.currentCategoryIndex = 0;
        this.currentQuestionIndex = 0;
        this.questions = this.loadQuestions();
    }

    // expose category names for UI
    public getCategories(): string[] {
        const cats = (questionsData as any).categories;
        if (!Array.isArray(cats)) return [];
        return cats.map((c: any, i: number) => c?.category ?? `Category ${i + 1}`);
    }

    // switch to a specific category index and reload questions
    public setCategory(index: number): void {
        const total = ((questionsData as any).categories?.length ?? 0);
        if (total === 0) return;
        this.currentCategoryIndex = ((index % total) + total) % total;
        this.questions = this.loadQuestions();
        this.currentQuestionIndex = 0;
        // update UI if already rendered
        this.updateUI();
    }

    private loadQuestions(): string[] {
        const categories = (questionsData as any).categories;
        if (!Array.isArray(categories) || categories.length === 0) return [];
        const cat = categories[this.currentCategoryIndex];
        return Array.isArray(cat?.questions) ? cat.questions : [];
    }

    public getCurrentQuestion(): string {
        return this.questions[this.currentQuestionIndex] ?? '';
    }

    public nextQuestion(): void {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
        } else {
            this.currentQuestionIndex = 0; // Reset to first question
            const totalCats = (questionsData as any).categories.length || 1;
            this.currentCategoryIndex = (this.currentCategoryIndex + 1) % totalCats; // Move to next category
            this.questions = this.loadQuestions(); // Load new questions
        }
        this.updateUI();
    }

    public previousQuestion(): void {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
        } else {
            const totalCats = (questionsData as any).categories.length || 1;
            this.currentCategoryIndex = (this.currentCategoryIndex - 1 + totalCats) % totalCats; // Move to previous category
            this.questions = this.loadQuestions(); // Load new questions
            this.currentQuestionIndex = Math.max(0, this.questions.length - 1); // Go to last question of the new category
        }
        this.updateUI();
    }

    // Render UI into container (selector, element, or undefined -> fallback)
    // options.onBack: optional callback invoked when user clicks Back
    public render(container?: string | HTMLElement, options?: { onBack?: () => void }): void {
        // Resolve container element
        let root: Element | null = null;
        if (container === undefined) {
            root = document.getElementById('app') || document.querySelector('main') || document.querySelector('#root') || document.body;
        } else if (typeof container === 'string') {
            root = document.querySelector(container) || document.getElementById(container.replace(/^#/, '')) || null;
        } else {
            root = container;
        }

        if (!root) {
            console.warn('Flashcard.render: container selector not found — creating fallback #flashcard-root appended to <body>');
            const fallback = document.createElement('div');
            fallback.id = 'flashcard-root';
            document.body.appendChild(fallback);
            root = fallback;
        }

        this.rootEl = root as HTMLElement;

        // Ensure we have questions loaded
        if (!Array.isArray(this.questions) || this.questions.length === 0) {
            this.questions = this.loadQuestions();
        }

        // Clear container
        this.rootEl.innerHTML = '';

        // Create card
        const card = document.createElement('div');
        card.className = 'flashcard-card';
        card.style.maxWidth = '420px';
        card.style.margin = '12px auto 0';

        // Back button (to return to category selector)
        if (this.backBtn) this.backBtn.remove();
        const backBtn = document.createElement('button');
        backBtn.type = 'button';
        backBtn.className = 'flashcard-back button';
        backBtn.textContent = '← Back';
        backBtn.addEventListener('click', () => {
            if (typeof options?.onBack === 'function') {
                options!.onBack!();
            } else {
                // fallback: clear container
                if (this.rootEl) this.rootEl.innerHTML = '';
            }
        });
        card.appendChild(backBtn);
        this.backBtn = backBtn;


        // Category label
        const categoryEl = document.createElement('div');
        categoryEl.className = 'flashcard-category';
        card.appendChild(categoryEl);
        this.categoryEl = categoryEl;

        // Question text
        const questionEl = document.createElement('div');
        questionEl.className = 'flashcard-question';
        card.appendChild(questionEl);
        this.questionEl = questionEl;

        this.rootEl.appendChild(card);


        // Controls
        // --- Swipe gesture support ---
        let touchStartX = 0;
        let touchEndX = 0;
        const minSwipeDistance = 40; // px

        card.addEventListener('touchstart', (e: TouchEvent) => {
            if (e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
            }
        });

        card.addEventListener('touchmove', (e: TouchEvent) => {
            if (e.touches.length === 1) {
                touchEndX = e.touches[0].clientX;
            }
        });

        card.addEventListener('touchend', () => {
            const dx = touchEndX - touchStartX;
            if (Math.abs(dx) > minSwipeDistance) {
                if (dx < 0) {
                    this.nextQuestion();
                } else {
                    this.previousQuestion();
                }
            }
            touchStartX = 0;
            touchEndX = 0;
        });

        // Optional: Keyboard arrow support for accessibility
        card.tabIndex = 0;
        card.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                this.previousQuestion();
            } else if (e.key === 'ArrowRight') {
                this.nextQuestion();
            }
        });

        // Initial UI update
        this.updateUI();
    }

    private updateUI(): void {
        if (!this.rootEl) return;

        // Update questions array if it became invalid for some reason
        if (!Array.isArray(this.questions) || this.questions.length === 0) {
            this.questions = this.loadQuestions();
        }

        const categories = (questionsData as any).categories;
        const categoryLabel = categories?.[this.currentCategoryIndex]?.category ?? `Category ${this.currentCategoryIndex + 1}`;

        if (this.categoryEl) this.categoryEl.textContent = categoryLabel;
        if (this.questionEl) this.questionEl.textContent = this.getCurrentQuestion() || 'No question available';

        // Enable/disable buttons depending on availability
        const hasAny = Array.isArray(this.questions) && this.questions.length > 0;
        if (this.prevBtn) this.prevBtn.disabled = !hasAny && ((questionsData as any).categories?.length ?? 0) <= 1;
        if (this.nextBtn) this.nextBtn.disabled = !hasAny && ((questionsData as any).categories?.length ?? 0) <= 1;
    }
}

export default Flashcard;