import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "600", "700", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "EbookStore Elite | L'Avenir du Savoir Digital",
  description: "Accédez à plus de 1500 ebooks premium. Mentorat IA personnalisé, design futuriste et apprentissage auto-évolutif. Dominez votre expertise dès aujourd'hui.",
  keywords: ["ebooks", "intelligence artificielle", "mentoring", "trading", "business", "développement personnel", "premium"],
  openGraph: {
    title: "EbookStore Elite | Marketplace IA",
    description: "La première marketplace d'ebooks propulsée par l'IA Aura.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body
        className={`${outfit.variable} ${inter.variable} font-sans antialiased bg-[#020205] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
