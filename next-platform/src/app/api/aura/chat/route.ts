import { NextRequest, NextResponse } from 'next/server';
import { AuraEngine } from '@/lib/aura/engine';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const { messages, query, userId, mode } = await req.json();

        if (!query || !userId) {
            return NextResponse.json({ error: "Missing query or userId" }, { status: 400 });
        }

        const response = await AuraEngine.generateResponse(userId, query, messages || [], mode || 'mentor');

        return NextResponse.json({ text: response });
    } catch (error: any) {
        console.error("Aura API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
