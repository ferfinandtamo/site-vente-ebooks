const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Define directories
const dirs = [
    { path: "f:\\MesFormations\\amour et sex-20251028T012407Z-1-001\\amour et sex", category: "Relations & Sensation" },
    { path: "f:\\MesFormations\\EBOOKS-20251022T013313Z-1-001\\EBOOKS", category: null },
    { path: "f:\\MesFormations\\Pack 1200 Ebooks", category: "Littérature Classique" }
];

const categoryMapping = {
    "EBOOKS CHATGPT": "IA & Tech",
    "Trading827": "Finance & Trading",
    "Sport": "Santé & Performance",
    "Independance financiere et argent": "Richesse & Liberté",
    "Leadership": "Business & Leadership",
    "Management": "Business & Leadership",
    "Marketing digital": "Marketing Digital",
    "Marketing et vente": "Vente & Marketing",
    "Psychologie": "Psychologie & Mental",
    "Generalisté 1": "Culture Générale",
    "Generalisté 2": "Culture Générale",
    "Livres best seller": "Best-Sellers",
    "Medecine": "Science & Santé"
};

function sanitizeMetadata(filename) {
    const name = path.parse(filename).name;
    if (name.includes("_-_")) {
        const parts = name.split("_-_");
        let author = parts[0].replace(/_/g, " ").trim().replace(/\b\w/g, c => c.toUpperCase());
        let title = parts[1].replace(/_/g, " ").trim().replace(/\b\w/g, c => c.toUpperCase());

        if (author.includes("Balzac")) author = "Honoré de Balzac";
        if (author.includes("Zola")) author = "Émile Zola";
        if (author.includes("Hugo")) author = "Victor Hugo";
        if (author.includes("Maupassant")) author = "Guy de Maupassant";

        return { title, author };
    }

    let title = name.replace(/_/g, " ").replace(/-/g, " ").trim().replace(/\b\w/g, c => c.toUpperCase());
    return { title, author: "Édition Collection" };
}

const ebooks = [];
const categoriesSet = new Set();
const authorsSet = new Set();

dirs.forEach(d => {
    if (!fs.existsSync(d.path)) {
        console.log(`Directory not found: ${d.path}`);
        return;
    }

    if (d.category === null) { // EBOOKS dir logic
        const subdirs = fs.readdirSync(d.path);
        subdirs.forEach(subdir => {
            const subdirPath = path.join(d.path, subdir);
            if (fs.statSync(subdirPath).isDirectory()) {
                const cat = categoryMapping[subdir] || "Développement";
                const files = fs.readdirSync(subdirPath);
                files.forEach(f => {
                    if (f.toLowerCase().endsWith('.pdf')) {
                        const meta = sanitizeMetadata(f);
                        ebooks.push({ ...meta, category: cat });
                        categoriesSet.add(cat);
                        authorsSet.add(meta.author);
                    }
                });
            }
        });
    } else {
        const files = fs.readdirSync(d.path);
        files.forEach(f => {
            const fullPath = path.join(d.path, f);
            if (fs.statSync(fullPath).isDirectory()) return;
            if (f.toLowerCase().endsWith('.pdf')) {
                const meta = sanitizeMetadata(f);
                ebooks.push({ ...meta, category: d.category });
                categoriesSet.add(d.category);
                authorsSet.add(meta.author);
            }
        });
    }
});

let sql = `-- ########################################################
-- # EBOOKSTORE SEEDS - AUTO-GENERATED
-- ########################################################

`;

Array.from(categoriesSet).sort().forEach(cat => {
    const id = crypto.randomUUID();
    sql += `INSERT INTO public.categories (id, name) VALUES ('${id}', '${cat.replace(/'/g, "''")}') ON CONFLICT (name) DO NOTHING;\n`;
});

sql += "\n";

Array.from(authorsSet).sort().forEach(author => {
    const id = crypto.randomUUID();
    sql += `INSERT INTO public.authors (id, name) VALUES ('${id}', '${author.replace(/'/g, "''")}') ON CONFLICT (id) DO NOTHING;\n`;
});

sql += "\n";

ebooks.forEach(b => {
    const id = crypto.randomUUID();
    const price = 19.99;
    sql += `INSERT INTO public.ebooks (id, title, author_id, category_id, price) VALUES ('${id}', '${b.title.replace(/'/g, "''")}', (SELECT id FROM public.authors WHERE name = '${b.author.replace(/'/g, "''")}' LIMIT 1), (SELECT id FROM public.categories WHERE name = '${b.category.replace(/'/g, "''")}' LIMIT 1), ${price});\n`;
});

const outputPath = "f:\\MesFormations\\Pack 1200 Ebooks\\site-vente-ebooks\\seeds.sql";
fs.writeFileSync(outputPath, sql);

console.log(`Successfully generated seeds for ${ebooks.length} ebooks at ${outputPath}`);
