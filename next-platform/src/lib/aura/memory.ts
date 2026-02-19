import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface MemoryItem {
    content: string;
    metadata?: {
        type?: string;
        [key: string]: unknown;
    };
}

export class AuraMemory {
    /**
     * Vectorize content using OpenAI embeddings
     */
    static async getEmbedding(text: string) {
        try {
            const response = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: text.replace(/\n/g, ' '),
            });
            return response.data[0].embedding;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error("OpenAI Embedding Error:", error);
            throw new Error(`OpenAI Embedding failed: ${errorMessage}`);
        }
    }

    /**
     * Save a new memory fragment for a user
     */
    static async save(userId: string, item: MemoryItem) {
        const embedding = await this.getEmbedding(item.content);

        const { error } = await supabase.from('aura_memory').insert({
            user_id: userId,
            content: item.content,
            embedding: embedding,
            metadata: item.metadata || {}
        });

        if (error) console.error("Error saving Aura memory:", error);
    }

    /**
     * Retrieve relevant memories based on a query
     */
    static async recall(userId: string, query: string, count = 5) {
        const embedding = await this.getEmbedding(query);

        const { data, error } = await supabase.rpc('match_aura_memory', {
            query_embedding: embedding,
            match_threshold: 0.5,
            match_count: count,
            p_user_id: userId
        });

        if (error) {
            console.error("Error recalling Aura memory:", error);
            return [];
        }

        return (data as any[]) || [];
    }

    /**
     * Search for ebooks semantically
     */
    static async searchEbooks(query: string, count = 3) {
        const embedding = await this.getEmbedding(query);

        const { data, error } = await supabase.rpc('match_ebooks', {
            query_embedding: embedding,
            match_threshold: 0.4,
            match_count: count
        });

        if (error) {
            console.error("Error searching ebooks:", error);
            return [];
        }

        return (data as any[]) || [];
    }

    /**
     * Create a summarized "Knowledge Block" from conversation history
     */
    static async consolidate(userId: string, history: string) {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Analyse cette conversation. Extrait : 1. Le profil psychologique (ex: motivé, anxieux, curieux). 2. Les domaines d'intérêt précis. 3. Les objectifs à long terme. Formate pour une mémoire IA." },
                { role: "user", content: history }
            ]
        });

        const summary = response.choices[0].message.content;
        if (summary) {
            await this.save(userId, {
                content: `Mise à jour du profil : ${summary}`,
                metadata: { type: 'user_evolution', timestamp: new Date().toISOString() }
            });
        }
    }
}
