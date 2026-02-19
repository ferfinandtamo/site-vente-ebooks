'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import BookCard from './BookCard';

interface Ebook {
    id: string;
    title: string;
    authors?: { name: string };
    categories?: { name: string };
    author?: string; // Fallback
    category?: string; // Fallback
    price: number;
    cover_url?: string;
}

export default function DynamicCatalog() {
    const [ebooks, setEbooks] = useState<Ebook[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = [
        'All',
        'IA & Tech',
        'Finance & Trading',
        'Business & Leadership',
        'Richesse & Liberté',
        'Littérature Classique',
        'Marketing Digital',
        'Psychologie & Mental',
        'Relations & Sensation',
        'Santé & Performance',
        'Science & Santé',
        'Best-Sellers'
    ];

    useEffect(() => {
        fetchEbooks();
    }, []);

    const fetchEbooks = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('ebooks')
            .select(`
                *,
                authors (name),
                categories (name)
            `)
            .limit(100);

        if (error) {
            console.error("Error fetching ebooks:", error);
            // Fallback to empty or mock if needed
            setEbooks([]);
        } else {
            // Flatten for easier use if preferred, or handle in components
            setEbooks(data || []);
        }
        setLoading(false);
    };

    const [displayCount, setDisplayCount] = useState(12);

    const filteredEbooks = ebooks.filter(b => {
        const authorName = b.authors?.name || b.author || '';
        const categoryName = b.categories?.name || b.category || '';

        const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            authorName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || categoryName === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const displayedEbooks = filteredEbooks.slice(0, displayCount);

    return (
        <section id="collection" className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div>
                    <span className="text-purple-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">Premium Collection</span>
                    <h2 className="text-5xl md:text-6xl font-black tracking-tighter mt-2 font-heading">
                        La Bibliothèque <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">des Maîtres</span>
                    </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Rechercher une pépite..."
                            className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl outline-none w-full sm:w-80 focus:border-purple-500/50 transition-all text-sm font-sans"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">🔍</span>
                    </div>
                </div>
            </div>

            <div className="flex overflow-x-auto pb-8 gap-4 no-scrollbar">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => {
                            setActiveCategory(cat);
                            setDisplayCount(12); // Reset on category change
                        }}
                        className={`px-8 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${activeCategory === cat
                            ? 'bg-white text-black border-white shadow-xl shadow-white/10'
                            : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:border-white/20'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="aspect-[3/4] bg-white/5 rounded-3xl"></div>
                    ))}
                </div>
            ) : displayedEbooks.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {displayedEbooks.map(ebook => (
                            <BookCard key={ebook.id} ebook={ebook} />
                        ))}
                    </div>

                    {filteredEbooks.length > displayCount && (
                        <div className="mt-20 text-center">
                            <button
                                onClick={() => setDisplayCount(prev => prev + 12)}
                                className="bg-white/5 border border-white/10 px-12 py-5 rounded-2xl text-[12px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all active:scale-95 group"
                            >
                                <span className="group-hover:mr-2 transition-all">Charger plus d&apos;ouvrages</span>
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20 glass rounded-3xl border-dashed border-2 border-white/5">
                    <div className="text-4xl mb-4 animate-float">📚</div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600 leading-tight font-heading">L&apos;Élite du <br /> Savoir</div>
                </div>
            )}
        </section>
    );
}
