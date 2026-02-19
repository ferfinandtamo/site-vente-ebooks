import DynamicCatalog from '@/components/catalog/DynamicCatalog';
import AuraBot from '@/components/ai-bot/AIGuideBot';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full z-0 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 blur-[130px] rounded-full z-0"></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-100 bg-black/20 backdrop-blur-2xl border-b border-white/5 px-8 py-6 flex justify-between items-center transition-all duration-500">
        <div className="text-2xl font-heading font-black tracking-tighter uppercase group cursor-pointer">
          Ebook<span className="text-white group-hover:text-purple-400 transition-colors">Elite</span>
        </div>
        <div className="hidden md:flex space-x-12 text-[10px] uppercase font-bold tracking-[0.3em] text-gray-500">
          <Link href="#collection" className="hover:text-white transition-all">Collections</Link>
          <Link href="#aura" className="hover:text-white transition-all">Aura IA</Link>
          <Link href="/login" className="hover:text-white transition-all">Elite Access</Link>
        </div>
        <button className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-purple-600 hover:text-white transition-all active:scale-95 shadow-2xl shadow-white/5">
          Démarrer
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-48 pb-32 px-6 max-w-7xl mx-auto text-center md:text-left flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1">
          <span className="inline-block px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-widest mb-6 animate-pulse">
            Nouvelle Ére de l'Éducation Digital
          </span>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-8 font-heading">
            S'élever par le <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Savoir Absolu</span>
          </h1>
          <p className="text-xl text-gray-400/80 max-w-xl mb-12 leading-relaxed font-sans">
            Accédez à une collection d'élite de 1520 ebooks. Laissez <span className="text-white border-b border-cyan-500/30">Aura</span>, votre mentor IA, sculpter votre expertise dans le Trading, le Business et la Psychologie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-10 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl font-bold text-lg hover:shadow-[0_0_40px_rgba(147,51,234,0.3)] transition-all active:scale-95">
              Démarrer l'Apprentissage
            </button>
            <button className="px-10 py-5 glass rounded-2xl font-bold text-lg hover:bg-white/5 transition-all active:scale-95 border-white/5">
              Explorer le Catalogue
            </button>
          </div>
        </div>

        <div className="flex-1 relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
          <div className="relative glass p-4 rounded-3xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
            {/* Placeholder for 3D Book Mockup */}
            <div className="aspect-[4/5] bg-gradient-to-br from-gray-800 to-black rounded-2xl flex flex-col items-center justify-center p-8 border border-white/5">
              <div className="w-full h-full border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center">
                <span className="text-gray-500 text-sm font-mono text-center">Aperçu Dynamique <br /> 3D Premium Mockup</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Catalog Section */}
      <DynamicCatalog />

      {/* Advanced AI Guide Bot */}
      <AuraBot />
    </main>
  );
}
