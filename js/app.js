import { ebooks } from '../data/ebooks.js';

// DOM Elements
const featuredGrid = document.getElementById('featured-grid');
const catalogGrid = document.getElementById('catalog-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');
const bookTemplate = document.getElementById('book-card-template');
let cart = [];
const cartBtn = document.getElementById('cart-btn');
const checkoutModal = document.getElementById('checkout-modal');
const closeModal = document.getElementById('close-modal');
const checkoutTotalDisplay = document.getElementById('checkout-total');

// State
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initFeatured();
    initCatalog();
    setupEventListeners();
    setupPaymentListeners();
    animateBackground();
});

function createBookCard(book) {
    const clone = bookTemplate.content.cloneNode(true);

    // Set 3D content
    const cover = clone.querySelector('.book-cover');
    // Use the generated complex gradient/color
    cover.style.background = book.coverColor;

    // Add subtle texture overlay if not present in CSS
    // (CSS handles the main glossy effect)

    clone.querySelector('.book-category-badge').textContent = book.category;

    // Visual Title & Author on the cover itself
    const titleEl = clone.querySelector('.book-title-visual');
    titleEl.textContent = book.title;
    // Dynamic font size for long titles
    if (book.title.length > 30) titleEl.style.fontSize = '1rem';

    clone.querySelector('.book-author-visual').textContent = book.author;

    // Decoration icon based on category
    const decoEl = clone.querySelector('.book-decoration');
    const icons = {
        'Business': '💰',
        'Roman': '❤️',
        'Science-Fiction': '🚀',
        'Classique': '🏛️',
        'Pratique': '💡',
        'Divers': '📚'
    };
    decoEl.textContent = icons[book.category] || '✦';

    // Price tag in panel
    clone.querySelector('.book-price-tag').textContent = `${book.price.toFixed(2)}€`;

    // Interaction
    const addBtn = clone.querySelector('.add-to-cart-btn');
    addBtn.textContent = `Ajouter (${book.price.toFixed(2)}€)`;
    addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(book);
    });

    // Whole card click for details (future use)
    clone.querySelector('.book-card').addEventListener('click', () => {
        // Could open a modal details view
        alert(`Détails: ${book.title}\n\nCe livre est disponible immédiatement.`);
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

    // Cart Button Click
    cartBtn.addEventListener('click', openCheckout);
}

function openCheckout() {
    if (cart.length === 0) {
        alert("Votre panier est vide !");
        return;
    }
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    checkoutTotalDisplay.textContent = `${total.toFixed(2)}€`;
    checkoutModal.classList.add('open');
}

function setupPaymentListeners() {
    closeModal.addEventListener('click', () => {
        checkoutModal.classList.remove('open');
    });

    document.querySelector('.payment-btn.paypal').addEventListener('click', () => {
        alert("Redirection vers PayPal sécurisé...");
        window.location.href = "https://www.paypal.com/checkoutnow";
    });

    document.querySelector('.payment-btn.skrill').addEventListener('click', () => {
        alert("Connexion à Skrill...");
        window.location.href = "https://www.skrill.com/pay";
    });

    // Close on outside click
    checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) checkoutModal.classList.remove('open');
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
    cart.push(book);
    cartBtn.textContent = `Panier (${cart.length})`;

    // Simple animation
    cartBtn.style.transform = 'scale(1.1)';
    setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);

    // Persuasive Bot reaction
    if (window.botFunctions && window.botFunctions.addMessage) {
        const botMessages = [
            `Excellent choix ! <b>"${book.title}"</b> est maintenant dans votre panier.`,
            `Superbe ! Vous allez adorer ce livre de ${book.author}.`,
            `C'est noté ! On passe au paiement ou vous voulez explorer d'autres pépites ?`
        ];
        window.botFunctions.addMessage(botMessages[Math.floor(Math.random() * botMessages.length)], 'bot');
    }
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
// ... (Existing code) ...

// =========================================
// 🧠 SALESMAN AI LOGIC (Advanced)
// =========================================

let chatContext = {
    lastBook: null,
    history: []
};

const SALES_SCRIPTS = {
    greetings: [
        "Bonjour ! 👋 Je suis votre assistant littéraire expert. Prêt à dénicher votre prochain trésor parmi nos 1200 ebooks ?",
        "Bienvenue ! Je connais chaque page de notre collection. Que recherchez-vous aujourd'hui : Business, Roman, ou peut-être un guide pratique ?",
        "Salut ! Envie d'apprendre ou de vous évader ? Dites-moi ce qui vous passionne, j'ai forcément le livre idéal."
    ],
    pitches: [
        "C'est une pépite absolue dans la catégorie {category}.",
        "Un incontournable ! Si vous aimez {category}, vous allez l'adorer.",
        "Ce titre est actuellement l'un de nos best-sellers en {category}.",
        "Un choix brillant qui ne manquera pas de vous inspirer."
    ],
    closing: [
        "Voulez-vous que je l'ajoute à votre panier ?",
        "À ce prix ({price}€), c'est une opportunité à ne pas manquer. On valide ?",
        "C'est un investissement pour votre esprit. Prêt à le lire ?",
        "Souhaitez-vous en savoir plus ou l'ajouter directement ?"
    ],
    notFound: [
        "Hum, je n'ai pas trouvé de correspondance exacte. Mais dites-moi, quel genre préférez-vous ?",
        "Pas de résultat direct, mais je peux vous surprendre avec nos nouveautés en Business ou Romans. Ça vous tente ?",
        "Je n'ai pas trouvé ce titre précis. Essayez un mot-clé plus simple ou demandez-moi une suggestion au hasard !"
    ]
};

// Simple Levenshtein distance for fuzzy matching
function levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

function initChatbot() {
    const chatHTML = `
        <button class="chat-widget-btn" id="chat-toggle">
            <span style="font-size: 1.5rem;">🤖</span>
        </button>

        <div class="chat-window" id="chat-window">
            <div class="chat-header">
                <div class="chat-title">
                    <span class="chat-status"></span>
                    Assistant Robot
                </div>
                <button style="background:none;border:none;color:white;cursor:pointer;" id="chat-close">✕</button>
            </div>
            <div class="chat-messages" id="chat-messages">
                <div class="message bot">
                    Bip Boop ! 🤖 Je suis votre assistant robotique expert en littérature. Prêt à dénicher votre prochain trésor parmi nos 1200 ebooks ?
                </div>
            </div>
            <div class="chat-input-area">
                <input type="text" class="chat-input" id="chat-input" placeholder="Je cherche un livre sur...">
                <button class="chat-send-btn" id="chat-send">➤</button>
            </div>
        </div>
    `;

    if (!document.getElementById('chat-window')) {
        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    const toggleBtn = document.getElementById('chat-toggle');
    const closeBtn = document.getElementById('chat-close');
    const chatWindow = document.getElementById('chat-window');
    const sendBtn = document.getElementById('chat-send');
    const input = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('chat-messages');

    toggleBtn.addEventListener('click', () => {
        chatWindow.classList.add('open');
        input.focus();
    });

    closeBtn.addEventListener('click', () => chatWindow.classList.remove('open'));

    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        input.value = '';

        showTyping();

        setTimeout(() => {
            removeTyping();
            const response = getBotResponse(text);
            addMessage(response, 'bot');
        }, 800 + Math.random() * 500);
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `message ${sender}`;
        div.innerHTML = text;
        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showTyping() {
        const div = document.createElement('div');
        div.className = 'message bot typing-indicator';
        div.id = 'typing';
        div.innerHTML = '<span></span><span></span><span></span>';
        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function removeTyping() {
        const typing = document.getElementById('typing');
        if (typing) typing.remove();
    }

    // Expose bot functions globally
    window.botFunctions = {
        addMessage: addMessage,
        toggle: () => chatWindow.classList.toggle('open')
    };
}

function getBotResponse(input) {
    let lowerInput = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Handle Follow-up intents (Introduction request)
    if ((lowerInput.includes('intro') || lowerInput.includes('resume') || lowerInput.includes('parle') || lowerInput.includes('detail') || lowerInput.includes('plus')) && chatContext.lastBook) {
        return generateBookIntro(chatContext.lastBook);
    }

    // Handle Purchase intent
    if ((lowerInput.includes('oui') || lowerInput.includes('acheter') || lowerInput.includes('panier') || lowerInput.includes('prend')) && chatContext.lastBook) {
        addToCart(chatContext.lastBook);
        return `Excellent choix ! 🎉 <b>"${chatContext.lastBook.title}"</b> a été ajouté à votre panier. Souhaitez-vous voir un autre livre dans le même genre ?`;
    }

    // Greetings
    if (lowerInput.match(/\b(bonjour|salut|hello|hi|yo)\b/)) {
        return SALES_SCRIPTS.greetings[Math.floor(Math.random() * SALES_SCRIPTS.greetings.length)];
    }

    // Hardcoded normalization for common typos reported by user
    const commonNorms = {
        'romence': 'roman',
        'romant': 'roman',
        'guidde': 'guide',
        'bizness': 'business',
        'bisness': 'business',
        'philosophie': 'philosophie',
        'scifi': 'science-fiction',
        'sf': 'science-fiction'
    };

    Object.keys(commonNorms).forEach(typo => {
        if (lowerInput.includes(typo)) {
            lowerInput = lowerInput.replace(typo, commonNorms[typo]);
        }
    });

    // Special category detection
    const genres = ['roman', 'business', 'science-fiction', 'classique', 'pratique', 'divers'];
    let detectedGenre = genres.find(g => lowerInput.includes(g));

    // Search keywords
    let keywords = lowerInput.split(' ').filter(k => k.length > 2);

    // Fuzzy match for keywords against genres if nothing found
    if (!detectedGenre) {
        keywords.forEach(k => {
            genres.forEach(g => {
                if (levenshtein(k, g) <= 1) detectedGenre = g;
            });
        });
    }

    let matches = ebooks.filter(book => {
        const bTitle = book.title.toLowerCase();
        const bAuthor = book.author.toLowerCase();
        const bCat = book.category.toLowerCase();

        let score = 0;

        // Priority to category if detected
        if (detectedGenre && bCat.includes(detectedGenre)) score += 10;

        keywords.forEach(k => {
            if (bTitle.includes(k)) score += 5;
            if (bAuthor.includes(k)) score += 3;
            if (bCat.includes(k)) score += 2;

            // Fuzzy match on title words
            bTitle.split(' ').forEach(tw => {
                if (tw.length > 3 && levenshtein(k, tw) <= 1) score += 2;
            });
        });
        return score > 1;
    });

    if (matches.length > 0) {
        const bestMatch = matches.sort((a, b) => {
            // Re-calculate scores for sorting
            const scoreA = keywords.reduce((s, k) => s + (bookScore(a, k, detectedGenre)), 0);
            const scoreB = keywords.reduce((s, k) => s + (bookScore(b, k, detectedGenre)), 0);
            return scoreB - scoreA;
        })[0];

        chatContext.lastBook = bestMatch;

        const pitchTemplate = SALES_SCRIPTS.pitches[Math.floor(Math.random() * SALES_SCRIPTS.pitches.length)];
        const closingTemplate = SALES_SCRIPTS.closing[Math.floor(Math.random() * SALES_SCRIPTS.closing.length)];

        return `J'ai trouvé exactement ce qu'il vous faut ! ✨<br><br>
                <b>📚 ${bestMatch.title}</b><br>
                <i>par ${bestMatch.author}</i><br><br>
                ${pitchTemplate.replace('{category}', bestMatch.category)}<br><br>
                Prix : <b>${bestMatch.price.toFixed(2)}€</b><br><br>
                Voulez-vous une petite introduction ou l'ajouter au panier ?`;
    }

    return SALES_SCRIPTS.notFound[Math.floor(Math.random() * SALES_SCRIPTS.notFound.length)];
}

function bookScore(book, k, detectedGenre) {
    let score = 0;
    const bTitle = book.title.toLowerCase();
    const bAuthor = book.author.toLowerCase();
    const bCat = book.category.toLowerCase();

    if (detectedGenre && bCat.includes(detectedGenre)) score += 10;
    if (bTitle.includes(k)) score += 5;
    if (bAuthor.includes(k)) score += 3;
    if (bCat.includes(k)) score += 2;

    return score;
}

function generateBookIntro(book) {
    const title = book.title;
    let desc = "";

    if (book.category === 'Business') {
        desc = `Dans "<b>${title}</b>", ${book.author} explore les rouages essentiels de la réussite. C'est un guide indispensable pour quiconque souhaite passer à l'action et transformer ses idées en succès concret.`;
    } else if (book.category === 'Roman') {
        desc = `Laissez-vous emporter par "<b>${title}</b>". ${book.author} nous livre ici une histoire vibrante d'émotions où chaque chapitre dévoile une nouvelle facette de l'âme humaine. Un voyage dont on ne ressort pas indemne.`;
    } else if (book.category === 'Science-Fiction') {
        desc = `Préparez-vous à dépasser les frontières du réel. Avec "<b>${title}</b>", ${book.author} nous propulse dans un futur imaginatif et saisissant de réalisme. Un must pour les amateurs d'anticipation.`;
    } else {
        desc = `"<b>${title}</b>" est un ouvrage de référence dans son domaine. ${book.author} synthétise avec brio les connaissances actuelles pour en faire une lecture aussi instructive que passionnante.`;
    }

    const closePrompt = SALES_SCRIPTS.closing[Math.floor(Math.random() * SALES_SCRIPTS.closing.length)].replace('{price}', book.price.toFixed(2));

    return `${desc}<br><br>🚀 ${closePrompt}`;
}

initChatbot();
