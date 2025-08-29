import { Flashcard } from './components/Flashcard';

async function loadQuestions() {
    const response = await fetch('./data/relationship_questions.json');
    const data = await response.json();
    return data;
}

function ensureRoot(): HTMLElement {
    let root = document.getElementById('app');
    if (!root) {
        root = document.createElement('div');
        root.id = 'app';
        // minimal padding so content isn't flush with screen edges on iPhone
        root.style.padding = '12px';
        document.body.appendChild(root);
    }
    return root;
}

// ...existing code...
export function renderCategorySelector(container: HTMLElement, data: any) {
    container.innerHTML = '';

    // Header row: title + surprise me + nav hint
    const headerRow = document.createElement('div');
    headerRow.className = 'category-header';
    headerRow.style.display = 'flex';
    headerRow.style.alignItems = 'center';
    headerRow.style.justifyContent = 'space-between';
    headerRow.style.marginBottom = '12px';

    const header = document.createElement('h2');
    header.textContent = 'Choose a category';
    header.style.margin = '0';
    headerRow.appendChild(header);

    const controlsWrap = document.createElement('div');
    controlsWrap.style.display = 'flex';
    controlsWrap.style.gap = '8px';
    controlsWrap.style.alignItems = 'center';

    const randomBtn = document.createElement('button');
    randomBtn.className = 'button';
    randomBtn.type = 'button';
    randomBtn.textContent = 'Surprise me';
    randomBtn.setAttribute('aria-label', 'Choose a random category');
    randomBtn.addEventListener('click', () => {
        const categories = Array.isArray(data?.categories) ? data.categories : [];
        if (!categories.length) return;
        const idx = Math.floor(Math.random() * categories.length);
        const flashcard = new Flashcard();
        if (typeof (flashcard as any).setCategory === 'function') {
            (flashcard as any).setCategory(idx);
        }
        if (typeof flashcard.render === 'function') {
            flashcard.render(container, { onBack: () => renderCategorySelector(container, data) });
        }
    });
    controlsWrap.appendChild(randomBtn);

    // hint text for small screens
    const hint = document.createElement('div');
    hint.className = 'category-hint';
    hint.textContent = 'Swipe cards →';
    hint.style.opacity = '0.7';
    hint.style.fontSize = '13px';
    controlsWrap.appendChild(hint);

    headerRow.appendChild(controlsWrap);
    container.appendChild(headerRow);

    // Carousel root
    const carouselRoot = document.createElement('div');
    carouselRoot.className = 'category-carousel';

    // Left / right nav for accessibility (visible on wider screens)
    const navLeft = document.createElement('button');
    navLeft.className = 'carousel-nav carousel-nav-left';
    navLeft.setAttribute('aria-label', 'Previous categories');
    navLeft.innerHTML = '◀';
    carouselRoot.appendChild(navLeft);

    const track = document.createElement('div');
    track.className = 'category-carousel-track';
    track.setAttribute('role', 'list');
    track.setAttribute('aria-label', 'Categories');
    carouselRoot.appendChild(track);

    const navRight = document.createElement('button');
    navRight.className = 'carousel-nav carousel-nav-right';
    navRight.setAttribute('aria-label', 'Next categories');
    navRight.innerHTML = '▶';
    carouselRoot.appendChild(navRight);

    container.appendChild(carouselRoot);

    const categories = Array.isArray(data?.categories) ? data.categories : [];

    if (!categories.length) {
        const none = document.createElement('div');
        none.textContent = 'No categories available.';
        none.style.opacity = '0.8';
        container.appendChild(none);
        return;
    }

    // Build cards
    categories.forEach((c: any, idx: number) => {
        const title = c?.category ?? `Category ${idx + 1}`;
        const firstQ = Array.isArray(c?.questions) && c.questions.length ? c.questions[0] : '';

        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'category-card carousel-item';
        card.setAttribute('role', 'listitem');
        card.setAttribute('aria-label', `Open category ${title}`);
        card.dataset.index = String(idx);

        const t = document.createElement('div');
        t.className = 'category-card-title';
        t.textContent = title;
        card.appendChild(t);

        const preview = document.createElement('div');
        preview.className = 'category-card-preview';
        preview.textContent = firstQ ? (firstQ.length > 80 ? firstQ.slice(0, 80) + '…' : firstQ) : 'No preview';
        card.appendChild(preview);

        card.addEventListener('click', () => {
            const flashcard = new Flashcard();
            if (typeof (flashcard as any).setCategory === 'function') {
                (flashcard as any).setCategory(idx);
            }
            if (typeof flashcard.render === 'function') {
                flashcard.render(container, { onBack: () => renderCategorySelector(container, data) });
            }
        });

        track.appendChild(card);
    });

    // Helpers to scroll by card width
    function scrollByCard(dir = 1) {
        const first = track.querySelector<HTMLElement>('.carousel-item');
        if (!first) return;
        const gap = parseInt(getComputedStyle(track).gap || '12', 10) || 12;
        const cardWidth = first.offsetWidth + gap;
        track.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
    }

    navLeft.addEventListener('click', () => scrollByCard(-1));
    navRight.addEventListener('click', () => scrollByCard(1));

    // Show/hide nav based on overflow
    function updateNavVisibility() {
        const needsNav = track.scrollWidth > track.clientWidth + 4;
        navLeft.style.display = needsNav ? 'flex' : 'none';
        navRight.style.display = needsNav ? 'flex' : 'none';
    }
    // initial
    requestAnimationFrame(updateNavVisibility);
    // re-evaluate on resize
    window.addEventListener('resize', updateNavVisibility);

    // keyboard support: arrow keys when focus inside track
    track.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); scrollByCard(-1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); scrollByCard(1); }
    });

    // ensure first card is focusable for keyboard users
    const firstCard = track.querySelector<HTMLElement>('.carousel-item') as HTMLElement | null;
    if (firstCard) firstCard.tabIndex = 0;
}
 // ...existing code...

function initializeApp(questions: any) {
    try {
        const root = ensureRoot();

        const container = document.getElementById('flashcard-container') || root;
        // show the category selector first
        renderCategorySelector(container as HTMLElement, questions);
    } catch (err) {
        console.error('Error initializing app:', err);
    }
}

loadQuestions().then(initializeApp).catch(error => {
    console.error('Error loading questions:', error);
});