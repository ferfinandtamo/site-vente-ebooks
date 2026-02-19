'use client';

import React from 'react';
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-12">
                    <Link href="/" className="text-3xl font-black tracking-tighter inline-block mb-4">
                        Ebook<span className="text-purple-400">Store</span> <span className="text-xs uppercase bg-purple-500/20 px-2 py-1 rounded-full text-purple-300 ml-2">Premium</span>
                    </Link>
                    <h2 className="text-xl font-medium text-gray-400">Accédez à votre espace exclusif</h2>
                </div>

                <div className="glass p-10 rounded-[40px] border-white/10 shadow-2xl">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email Professionnel</label>
                            <input
                                type="email"
                                placeholder="nom@entreprise.com"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-purple-500/50 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Mot de Passe</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-purple-500/50 transition-all font-medium"
                            />
                        </div>

                        <Link href="/dashboard" className="block w-full text-center py-5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/40 transition-all active:scale-95">
                            Se Connecter
                        </Link>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                            <div className="relative flex justify-center text-xs uppercase tracking-widest text-gray-600"><span className="bg-[#0a0a0f] px-4">Ou continuer avec</span></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="glass py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/5 transition-all">
                                <span className="text-lg">G</span> <span className="text-xs font-bold font-mono">Google</span>
                            </button>
                            <button className="glass py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/5 transition-all">
                                <span className="text-lg">A</span> <span className="text-xs font-bold font-mono">Apple</span>
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-center mt-8 text-sm text-gray-500 font-medium">
                    Pas encore membre ? <Link href="/register" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">Rejoignez l&apos;élite</Link>
                </p>
            </div>
        </div>
    );
}
