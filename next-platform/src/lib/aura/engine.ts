import OpenAI from 'openai';
import { AuraMemory } from './memory';

const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
    throw new Error("Missing OpenAI environment variable: OPENAI_API_KEY");
}

const openai = new OpenAI({
    apiKey: openaiApiKey,
});

export class AuraEngine {
    /**
     * Process a message from the user and generate an intelligent response
     */
    static async generateResponse(
        userId: string,
        query: string,
        chatHistory: OpenAI.Chat.ChatCompletionMessageParam[],
        mode: 'mentor' | 'professeur' | 'debat' | 'coach' = 'mentor'
    ): Promise<string | null> {
        const startTime = Date.now();

        // 1. Recall relevant memories (Parallelize for Speed)
        const [memories, ebooks] = await Promise.all([
            AuraMemory.recall(userId, query),
            AuraMemory.searchEbooks(query)
        ]);

        const contextStr = memories.map(m => `- ${m.content}`).join('\n');
        const psychProfile = memories.find(m => m.metadata?.type === 'user_evolution')?.content || "Profil en cours d'analyse.";
        const ebooksStr = ebooks.map(e => `- **${e.title}** : ${e.description ? e.description.substring(0, 100) + '...' : 'Pas de description.'}`).join('\n');

        // 4. Mode-Specific Instructions
        const modeInstructions = {
            mentor: "Ton ton est protecteur, inspirant et axé sur les résultats. Guide l'utilisateur vers ses objectifs avec bienveillance.",
            professeur: "Utilise la méthode Socratique. Pose des questions pour faire réfléchir l'utilisateur au lieu de donner des réponses directes. Sois exigeant mais juste.",
            debat: "Challenge les idées de l'utilisateur. Utilise la rhétorique, cherche les failles dans ses arguments pour le pousser à affiner sa pensée.",
            coach: "Focus sur l'action immédiate et la discipline. Analyse ses comportements et suggère des lectures pour briser ses blocages."
        };

        const systemPrompt = `
      Tu es Aura, l'intelligence mentor d'élite de Ferdinand TAMO.
      MODE ACTUEL : **${mode.toUpperCase()}**
      ${modeInstructions[mode]}
      
      ANALYSE PSYCHOLOGIQUE DE L'UTILISATEUR :
      ${psychProfile}

      SOUVENIRS SUR L'UTILISATEUR :
      ${contextStr || "C'est votre première interaction approfondie."}

      LIVRES CONSEILLÉS (1520 LIVRES DISPONIBLES) :
      ${ebooksStr || "Aucun livre spécifique ne ressort immédiatement."}

      DIRECTIVES :
      - Incarne parfaitement le mode choisi.
      - Adapte ton vocabulaire au profil psychologique détecté.
      - Utilise Markdown (gras, listes) pour une lecture premium.
    `;

        // 6. Generate response with LLM
        let response;
        try {
            response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: systemPrompt },
                    ...chatHistory,
                    { role: "user", content: query }
                ],
                temperature: 0.8,
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error("OpenAI Chat Error:", error);
            throw new Error(`OpenAI Chat failed: ${errorMessage}`);
        }

        const duration = Date.now() - startTime;
        console.log(`[Aura Monitor] User: ${userId} | Mode: ${mode} | Latency: ${duration}ms | Tokens: ${response.usage?.total_tokens || 'unknown'}`);

        const answer = response.choices?.[0]?.message?.content || null;

        // 4. Background task: If the query contains important info, save it to memory
        if (answer) {
            this.extractAndSaveMemory(userId, query, answer);
        }

        return answer;
    }

    private static async extractAndSaveMemory(userId: string, query: string, answer: string): Promise<void> {
        // 1. Immediate save for explicit intentions
        const triggerWords = ['je veux', 'mon but', 'j\'aime', 'passion', 'travaille', 'objectif'];
        if (triggerWords.some(w => query.toLowerCase().includes(w))) {
            await AuraMemory.save(userId, {
                content: `L'utilisateur a exprimé une intention/préférence : "${query}"`,
                metadata: { type: 'preference' }
            });
        }

        // 2. Periodic Consolidation (Evolutionary Brain)
        if (query.toLowerCase().includes('résume') || query.length > 500) {
            await AuraMemory.consolidate(userId, `User: ${query}\nAura: ${answer}`);
        }
    }
}
