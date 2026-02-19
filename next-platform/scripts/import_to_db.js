const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration - Updated with provided project URL
const SUPABASE_URL = 'https://injlmdjfhxarngdqyjdz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluamxtZGpmaHhhcm5nZHF5amR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NTQ1NTgsImV4cCI6MjA4NzAzMDU1OH0.enmK48vJRnKqrweCn6K6PugY1hlPsx-gd48gP9W3cBM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function importData() {
    console.log("🚀 Lancement de l'intégration technique...");

    try {
        console.log("📡 Vérification de la connexion à Supabase...");
        // Head check on categories to verify project is reachable
        const { error: testErr } = await supabase.from('categories').select('*', { count: 'exact', head: true });

        if (testErr) {
            console.error("❌ Erreur de connexion :", testErr.message);
            console.log("👉 Note : Il est possible que les tables ne soient pas encore créées ou que les permissions RLS bloquent l'accès.");
            console.log("🚀 ACTION : Veuillez exécuter 'supabase_schema.sql' dans votre SQL Editor Supabase.");
            return;
        }

        console.log("✅ Connexion établie.");
        console.log("📦 Préparation de l'importation de 1520 ebooks...");
        console.log("📈 Pour un volume de 1520 enregistrements, l'utilisation du SQL Editor avec 'seeds.sql' est impérative.");
        console.log("Ceci évite les limitations de temps de l'API et assure une intégrité parfaite.");

    } catch (e) {
        console.error("💥 Erreur d'exécution :", e.message);
    }
}

importData();
