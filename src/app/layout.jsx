import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pokédex",
  description: "Pokédex aplikace vytvořená s Next.js a MongoDB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="cs">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="max-w-[1200px] mx-auto px-4">
          <header className="py-4 border-b border-gray-200">
            <Link href="/">
              <h1 className="text-2xl font-bold text-blue-600 cursor-pointer m-0">
                Pokédex
              </h1>
            </Link>
          </header>

          <main className="min-h-[calc(100vh-150px)] py-8">{children}</main>

          <footer className="py-4 border-t border-gray-200 text-center">
            <p>Vytvořeno s Next.js a MongoDB</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
