'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function AuraBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<'mentor' | 'professeur' | 'debat' | 'coach'>('mentor');
    const [messages, setMessages] = useState([
        { role: 'bot', text: "Bonjour Ferdinand ! Je suis **Ferdy**, votre Guide Mentor IA. Je connais vos 1520 ouvrages et j'apprends de chaque échange. Comment puis-je vous aider à évoluer aujourd'hui ?" }
    ]);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/aura/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: input,
                    messages: messages.slice(-10),
                    userId: '00000000-0000-0000-0000-000000000000',
                    mode: mode
                })
            });

            const data = await response.json();
            if (data.text) {
                setMessages(prev => [...prev, { role: 'bot', text: data.text }]);
            } else {
                const errorMsg = data.error || "Désolé, j'ai rencontré une petite perturbation dans ma matrice. Réessayez ?";
                setMessages(prev => [...prev, { role: 'bot', text: `⚠️ **Ferdy Error:** ${errorMsg}` }]);
            }
        } catch (error) {
            console.error("Ferdy connection error:", error);
            setMessages(prev => [...prev, { role: 'bot', text: "Je n'arrive pas à me connecter à ma mémoire centrale. Vérifiez votre connexion ou l'API Key." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const modes = [
        { id: 'mentor', icon: '💎', label: 'Mentor' },
        { id: 'professeur', icon: '🎓', label: 'Prof' },
        { id: 'debat', icon: '⚔️', label: 'Débat' },
        { id: 'coach', icon: '⚡', label: 'Coach' },
    ];

    return (
        <>
            {/* Mini Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-8 right-8 z-50 glass p-6 rounded-3xl shadow-2xl animate-bounce-slow border-purple-500/20 group hover:border-purple-500/50 transition-all shadow-purple-500/20"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-cyan-600 rounded-full flex items-center justify-center text-xl shadow-lg">✨</div>
                        <div className="text-left">
                            <div className="text-sm font-bold">Ferdy Intelligence</div>
                            <div className="text-[10px] text-cyan-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span> Apprentissage actif
                            </div>
                        </div>
                    </div>
                </button>
            )}

            {/* Full Chat Window */}
            {isOpen && (
                <div className="fixed bottom-8 right-8 z-50 glass w-[480px] h-[720px] rounded-[48px] shadow-2xl flex flex-col overflow-hidden border-purple-500/20 animate-in fade-in slide-in-from-bottom-10 duration-700">
                    <div className="p-8 border-b border-white/10 flex flex-col gap-6 bg-gradient-to-b from-purple-500/10 to-transparent">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center text-lg shadow-xl shadow-purple-900/40">✨</div>
                                <div>
                                    <span className="font-bold text-lg tracking-tight block">Ferdy AI Mentor</span>
                                    <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">Intelligence d&apos;Élite</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setMessages([{ role: 'bot', text: "Mémoire flash nettoyée. Prête pour une nouvelle session d'évolution." }])}
                                    title="Réinitialiser la session"
                                    className="text-gray-500 hover:text-red-400 p-2 rounded-full hover:bg-white/5 transition-all"
                                >
                                    🗑️
                                </button>
                                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white text-2xl p-2 rounded-full hover:bg-white/5 transition-all">✕</button>
                            </div>
                        </div>

                        {/* Mode Selector */}
                        <div className="flex bg-black/40 p-1.5 rounded-2xl gap-1 border border-white/5">
                            {modes.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setMode(m.id as 'mentor' | 'professeur' | 'debat' | 'coach')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-bold transition-all ${mode === m.id
                                        ? 'bg-purple-600 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-gray-200'
                                        }`}
                                >
                                    <span>{m.icon}</span>
                                    <span>{m.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar scroll-smooth">
                        <div className="flex justify-start">
                            <div className="glass p-4 rounded-3xl rounded-tl-none border-white/5 text-sm text-purple-300 italic">
                                Ferdy est en mode **{mode.toUpperCase()}**.
                            </div>
                        </div>
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${m.role === 'user'
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20 rounded-tr-none'
                                    : 'glass text-gray-200 rounded-tl-none border-white/5'
                                    }`}>
                                    <div className="prose prose-invert prose-sm">
                                        <ReactMarkdown>{m.text}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="glass p-4 rounded-3xl rounded-tl-none flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-6 border-t border-white/10 bg-black/20">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Evoluons ensemble..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-purple-500/50 transition-all text-sm"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading}
                                className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center hover:bg-purple-500 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-purple-900/40"
                            >
                                <span className="text-lg">✦</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
