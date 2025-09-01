import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/App';

function ensureRoot(): HTMLElement {
    let root = document.getElementById('app');
    if (!root) {
        root = document.createElement('div');
        root.id = 'app';
        root.style.padding = '12px';
        document.body.appendChild(root);
    }
    return root;
}

// React entry point
function initializeApp() {
    const root = ensureRoot();
    createRoot(root).render(<App />);
}

initializeApp();
