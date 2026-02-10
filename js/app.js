import { ebooks } from '../data/ebooks.js';

// DOM Elements
const featuredGrid = document.getElementById('featured-grid');
const catalogGrid = document.getElementById('catalog-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');
const bookTemplate = document.getElementById('book-card-template');
let cartCount = 0;
const cartBtn = document.getElementById('cart-btn');

// State
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initFeatured();
    initCatalog();
    setupEventListeners();
    animateBackground();
});

function createBookCard(book) {
    const clone = bookTemplate.content.cloneNode(true);
    const card = clone.querySelector('.book-card');

    // Set content
    const cover = clone.querySelector('.book-cover');
    cover.style.background = book.coverColor;

    clone.querySelector('.book-category-badge').textContent = book.category;
    clone.querySelector('.book-title').textContent = book.title;
    clone.querySelector('.book-author').textContent = book.author;
    clone.querySelector('.book-price').textContent = `${book.price.toFixed(2)}€`;

    // Add interactions
    clone.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(book);
    });

    clone.querySelector('.quick-view-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        alert(`Aperçu de: ${book.title}\n\nRésumé indisponible dans cette démo.`);
    });

    return clone;
}

function initFeatured() {
    // Show 4 random books
    const shuffled = [...ebooks].sort(() => 0.5 - Math.random());
    const featured = shuffled.slice(0, 4);

    featuredGrid.innerHTML = '';
    featured.forEach(book => {
        featuredGrid.appendChild(createBookCard(book));
    });
}

function initCatalog() {
    renderCatalog(ebooks);
}

function renderCatalog(books) {
    catalogGrid.innerHTML = '';
    books.forEach(book => {
        catalogGrid.appendChild(createBookCard(book));
    });
}

function setupEventListeners() {
    // Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter.toLowerCase();
            currentFilter = filter;

            filterBooks();
        });
    });

    // Search
    searchInput.addEventListener('input', (e) => {
        filterBooks(e.target.value.toLowerCase());
    });
}

function filterBooks(searchTerm = '') {
    let filtered = ebooks;

    // Category Filter
    if (currentFilter !== 'all') {
        filtered = filtered.filter(book => {
            if (currentFilter === 'roman') return book.category === 'Roman' || book.category === 'Thriller';
            if (currentFilter === 'scifi') return book.category === 'Science-Fiction';
            return book.category.toLowerCase().includes(currentFilter);
        });
    }

    // Search Filter
    if (searchTerm) {
        filtered = filtered.filter(book =>
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm)
        );
    }

    renderCatalog(filtered);
}

function addToCart(book) {
    cartCount++;
    cartBtn.textContent = `Panier (${cartCount})`;

    // Simple animation
    const btn = document.getElementById('cart-btn');
    btn.style.transform = 'scale(1.1)';
    setTimeout(() => btn.style.transform = 'scale(1)', 200);
}

function animateBackground() {
    const globes = document.querySelectorAll('.globe');

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        globes.forEach((globe, index) => {
            const speed = (index + 1) * 20;
            const xOffset = (window.innerWidth / 2 - e.clientX) / speed;
            const yOffset = (window.innerHeight / 2 - e.clientY) / speed;

            globe.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });
}
