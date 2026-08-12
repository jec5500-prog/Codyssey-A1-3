import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/common/Navbar';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { AuthProvider } from '@/lib/auth/AuthContext';

export const metadata: Metadata = {
  title: 'SPOT - Global Spatial Design Intelligence',
  description:
    'Capture, explore, compare, and analyze global window displays, store interiors, pop-ups, facades, and exhibitions with multimodal AI design intelligence.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                if (!window.crypto) window.crypto = {};
                if (!window.crypto.randomUUID) {
                  window.crypto.randomUUID = function() {
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                      return v.toString(16);
                    });
                  };
                }
              }
            `,
          }}
        />
      </head>
      <body className="bg-[#121214] text-zinc-100 min-h-screen flex flex-col antialiased">
        <AuthProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 md:pb-8">
              {children}
            </main>
            <footer className="border-t border-zinc-800/80 bg-[#121214]/90 backdrop-blur-md py-6 text-center text-xs text-zinc-400">
              <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p>
                  © 2026 SPOT Global Spatial Design Intelligence MVP. Built with Next.js, Supabase & Multimodal AI.
                </p>
                <span className="font-mono text-[11px] text-orange-400 font-semibold">
                  Dark Gray & Neon Orange Edition
                </span>
              </div>
            </footer>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
