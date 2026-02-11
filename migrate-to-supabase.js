const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse the ebooks.js file which is an ES module
const fileContent = fs.readFileSync(path.join(__dirname, 'data', 'ebooks.js'), 'utf8');
const jsonString = fileContent.replace('export const ebooks = ', '').replace(/;$/, '');
const ebooks = JSON.parse(jsonString);

// ⚠️ REMPLACEZ PAR VOS CLÉS SUPABASE
const SUPABASE_URL = 'https://dlwwxqwoxrybesntuydl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsd3d4cXdveHJ5YmVzbnR1eWRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NjUzMjcsImV4cCI6MjA4NjM0MTMyN30.vXaBzHs5qFYbnc6vHxBnpVXbrq-dab_UYtuc4MzGBho';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function migrate() {
    console.log(`🚀 Début de la migration de ${ebooks.length} ebooks...`);

    // Préparation des données pour Supabase (mapping des clés)
    const formattedData = ebooks.map(b => ({
        id: b.id,
        title: b.title,
        author: b.author,
        category: b.category,
        price: b.price,
        cover_color: b.coverColor,
        file_path: b.path
    }));

    // Insertion par paquets de 100 pour éviter les erreurs de timeout
    const chunkSize = 100;
    for (let i = 0; i < formattedData.length; i += chunkSize) {
        const chunk = formattedData.slice(i, i + chunkSize);
        const { error } = await supabase.from('ebooks').insert(chunk);

        if (error) {
            console.error(`❌ Erreur au paquet ${i}:`, error.message);
        } else {
            console.log(`✅ Paquet ${i + chunk.length} inséré.`);
        }
    }

    console.log("🏁 Migration terminée !");
}

migrate();
