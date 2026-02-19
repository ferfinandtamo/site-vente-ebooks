'use client';

import React from 'react';
import Link from 'next/link';

export default function DashboardPage() {
    const stats = [
        { label: 'Ebooks Possédés', value: '12', icon: '📚' },
        { label: 'Heures de Lecture', value: '45h', icon: '⏱️' },
        { label: 'Points Expert', value: '850', icon: '🏆' },
        { label: 'Niveau Actuel', value: 'Intermédiaire', icon: '📈' },
    ];

    const recentEbooks = [
        { title: 'The Lean Startup', progress: 75, lastRead: 'Il y a 2 heures' },
        { title: 'Deep Work', progress: 40, lastRead: 'Hier' },
        { title: 'Zero to One', progress: 10, lastRead: 'Il y a 3 jours' },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex">
            {/* Sidebar */}
            <aside className="w-64 glass border-r border-white/10 p-6 flex flex-col gap-8 hidden md:flex">
                <div className="text-xl font-bold tracking-tighter">
                    Ebook<span className="text-purple-400">Store</span>
                </div>

                <nav className="flex flex-col gap-2">
                    <Link href="/dashboard" className="bg-purple-600/20 text-purple-400 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3">
                        <span>🏠</span> Dashboard
                    </Link>
                    <Link href="/library" className="text-gray-400 hover:text-white px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors">
                        <span>📖</span> Ma Bibliothèque
                    </Link>
                    <Link href="/community" className="text-gray-400 hover:text-white px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors">
                        <span>👥</span> Communauté
                    </Link>
                    <Link href="/settings" className="text-gray-400 hover:text-white px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors">
                        <span>⚙️</span> Paramètres
                    </Link>
                </nav>

                <div className="mt-auto glass p-4 rounded-2xl border-purple-500/20">
                    <div className="text-xs text-gray-400 mb-2">Plan Actuel</div>
                    <div className="text-sm font-bold text-purple-400 mb-3">Premium Ultra</div>
                    <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold transition-all">Gérer l'abo</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Bonjour, <span className="gradient-text">Ferdinand</span> 👋</h1>
                        <p className="text-gray-400 mt-1">Prêt pour votre prochaine dose de savoir ?</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 glass rounded-full flex items-center justify-center text-lg">🔔</button>
                        <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-full border-2 border-white/20"></div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((s, i) => (
                        <div key={i} className="glass p-6 rounded-3xl border-white/5 hover:border-purple-500/30 transition-all">
                            <div className="text-2xl mb-2">{s.icon}</div>
                            <div className="text-2xl font-black">{s.value}</div>
                            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Content Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Progress Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <h2 className="text-xl font-bold flex items-center gap-3">
                            <span className="w-2 h-8 bg-purple-600 rounded-full"></span>
                            Lectures en cours
                        </h2>

                        <div className="grid gap-6">
                            {recentEbooks.map((b, i) => (
                                <div key={i} className="glass p-6 rounded-3xl group cursor-pointer hover:border-purple-500/20 transition-all">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-lg">{b.title}</h3>
                                        <span className="text-xs text-gray-500">{b.lastRead}</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full"
                                            style={{ width: `${b.progress}%` }}
                                        ></div>
                                    </div>
                                    <div className="mt-2 text-right font-black text-xs text-purple-400">{b.progress}% complété</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Insights Sidebar */}
                    <div className="space-y-8">
                        <h2 className="text-xl font-bold flex items-center gap-3">
                            <span className="w-2 h-8 bg-cyan-500 rounded-full"></span>
                            Insights IA
                        </h2>

                        <div className="glass p-6 rounded-[32px] border-cyan-500/20 bg-gradient-to-b from-cyan-500/5 to-transparent">
                            <div className="w-12 h-12 bg-cyan-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-xl shadow-cyan-900/40">🤖</div>
                            <h4 className="font-bold text-lg mb-4">Challenge Apprentissage</h4>
                            <p className="text-sm text-gray-400 leading-relaxed mb-6">
                                Basé sur votre intérêt pour le <span className="text-white font-bold">Machine Learning</span>, je vous suggère de terminer les chapitres 4 et 5 de "Deep Work" pour optimiser votre concentration.
                            </p>
                            <button className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-cyan-900/20">
                                Lancer le Mode Focus
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
