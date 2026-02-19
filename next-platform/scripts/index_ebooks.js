const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // Needs service role for bulk insert
);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function indexEbooks() {
    console.log("📚 Début de l'indexation sémantique des 1520 ebooks...");

    // 1. Fetch all ebooks without embeddings
    const { data: ebooks, error: fetchError } = await supabase
        .from('ebooks')
        .select('id, title, description')
        .limit(10); // Batch size for testing, increase to 1000+ later

    if (fetchError) {
        console.error("Erreur lors de la récupération des ebooks:", fetchError);
        return;
    }

    console.log(`🔍 Traitement de ${ebooks.length} ebooks...`);

    for (const ebook of ebooks) {
        const textToEmbed = `${ebook.title}. ${ebook.description || ''}`;

        try {
            // 2. Generate Embedding
            const embeddingResponse = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: textToEmbed.replace(/\n/g, ' '),
            });

            const embedding = embeddingResponse.data[0].embedding;

            // 3. Update Ebook with Vector
            // NOTE: We need a column 'embedding' in the 'ebooks' table.
            // I will add this to the schema if not present.
            const { error: updateError } = await supabase
                .from('ebooks')
                .update({ embedding: embedding })
                .eq('id', ebook.id);

            if (updateError) console.error(`❌ Erreur pour ${ebook.title}:`, updateError.message);
            else console.log(`✅ Indexé : ${ebook.title}`);

        } catch (e) {
            console.error(`💥 Erreur fatale pour ${ebook.title}:`, e.message);
        }
    }

    console.log("🏁 Indexation terminée.");
}

indexEbooks();
