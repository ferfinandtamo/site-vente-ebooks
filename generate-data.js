const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve('../');
const OUTPUT_FILE = path.join(__dirname, 'data', 'ebooks.js');
const EXTENSIONS = ['.pdf', '.epub', '.mobi'];

// ==========================================
// 🎨 PREMIUM GRADIENTS & THEMES
// ==========================================
const THEMES = {
    business: [
        "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop')",
        "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop')"
    ],
    romance: [
        "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=800&auto=format&fit=crop')",
        "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop')"
    ],
    scifi: [
        "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop')",
        "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=800&auto=format&fit=crop')"
    ],
    classic: [
        "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop')",
        "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1453733190371-0a9bedd82893?q=80&w=800&auto=format&fit=crop')"
    ],
    default: [
        "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop')",
        "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop')"
    ]
};

// Mots-clés pour mapper le contenu au thème
const KEYWORDS = {
    business: ['argent', 'rich', 'succès', 'marketing', 'vente', 'business', 'money', 'entreprise', 'bourse', 'crypto', 'bitcoin'],
    romance: ['amour', 'love', 'coeur', 'passion', 'mariage', 'femme', 'homme', 'baiser', 'romance'],
    scifi: ['futur', 'espace', 'galaxie', 'robot', 'ia', 'alien', 'science', 'tech', 'cyber'],
    classic: ['histoire', 'guerre', 'siècle', 'roi', 'dieu', 'philosophie', 'art', 'poésie']
};

function getThemeByTitle(title) {
    const lowerTitle = title.toLowerCase();

    for (const [key, words] of Object.entries(KEYWORDS)) {
        if (words.some(w => lowerTitle.includes(w))) {
            const palette = THEMES[key];
            return palette[Math.floor(Math.random() * palette.length)];
        }
    }

    // Fallback Random
    const all = [].concat(...Object.values(THEMES));
    return all[Math.floor(Math.random() * all.length)];
}

function scanDirectory(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            if (file !== 'site-vente-ebooks' && file !== '.git' && file !== 'node_modules') {
                scanDirectory(filePath, fileList);
            }
        } else {
            const ext = path.extname(file).toLowerCase();
            if (EXTENSIONS.includes(ext)) {
                fileList.push(filePath);
            }
        }
    });
    return fileList;
}

function parseFileInfo(filePath) {
    const filename = path.basename(filePath, path.extname(filePath));
    let author = "Auteur Inconnu";
    let title = filename;

    let cleanName = filename.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
    if (cleanName.includes(' - ')) {
        const parts = cleanName.split(' - ');
        if (parts.length >= 2) {
            author = parts[0].trim();
            title = parts.slice(1).join(' - ').trim();
        }
    }

    // Catégorie intelligente
    let category = "Divers";
    const lowerTitle = title.toLowerCase();

    if (KEYWORDS.business.some(w => lowerTitle.includes(w))) category = "Business";
    else if (KEYWORDS.romance.some(w => lowerTitle.includes(w))) category = "Roman";
    else if (KEYWORDS.scifi.some(w => lowerTitle.includes(w))) category = "Science-Fiction";
    else if (KEYWORDS.classic.some(w => lowerTitle.includes(w))) category = "Classique";
    else if (lowerTitle.includes('tuto') || lowerTitle.includes('guide')) category = "Pratique";

    // Random price logic
    let price = 9.99;
    if (category === "Business") price = 24.99;
    if (category === "Science-Fiction") price = 14.99;
    price = Math.floor(price * (0.8 + Math.random() * 0.4) * 100) / 100; // variance

    return {
        id: Math.random().toString(36).substr(2, 9),
        title: title,
        author: author,
        category: category,
        price: price,
        coverColor: getThemeByTitle(title),
        path: filePath
    };
}

console.log("🎨 Génération des Mockups Premium...");
const allFiles = scanDirectory(ROOT_DIR);
console.log(`📚 ${allFiles.length} fichiers trouvés.`);

const ebooksData = allFiles.map(parseFileInfo);
const fileContent = `export const ebooks = ${JSON.stringify(ebooksData, null, 4)};`;

fs.writeFileSync(OUTPUT_FILE, fileContent);
console.log(`✅ Base de données mise à jour avec styles intelligents !`);
