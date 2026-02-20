'use client';

import Image from 'next/image';
import React from 'react';

interface Ebook {
    id: string;
    title: string;
    authors?: { name: string };
    categories?: { name: string };
    author?: string;
    category?: string;
    price: number;
    cover_url?: string;
}

export default function BookCard({ ebook }: { ebook: Ebook }) {
    return (
        <div className="group relative glass-card rounded-3xl p-5 transition-all duration-500 cursor-pointer">
            <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-gray-900 to-black overflow-hidden relative border border-white/5 mb-5 shadow-2xl">
                {ebook.cover_url ? (
                    <Image
                        src={ebook.cover_url}
                        alt={ebook.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#05050a]">
                        <div className="text-4xl mb-4 animate-float">📚</div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600 leading-tight font-heading">L&apos;Élite du <br /> Savoir</div>
                    </div>
                )}
                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-xl px-3 py-1.5 rounded-full text-[9px] font-bold text-white/70 border border-white/10 uppercase tracking-widest">
                    {ebook.categories?.name || ebook.category}
                </div>
                {ebook.price > 15 && (
                    <div className="absolute top-3 left-3 bg-white text-black px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter shadow-xl">
                        Elite Selection
                    </div>
                )}
            </div>

            <div className="px-1">
                <h3 className="font-heading font-bold text-white text-lg tracking-tight truncate mb-1 group-hover:text-purple-400 transition-colors uppercase">{ebook.title}</h3>
                <p className="text-[11px] text-gray-500 mb-6 font-sans uppercase tracking-widest">par {ebook.authors?.name || ebook.author || 'Édition Elite'}</p>

                <div className="flex justify-between items-center mt-auto">
                    <span className="text-2xl font-black text-white font-sans">{ebook.price.toFixed(2)}€</span>
                    <button className="bg-white text-black hover:bg-purple-600 hover:text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full transition-all active:scale-95">
                        Détails
                    </button>
                </div>
            </div>
        </div>
    );
}
