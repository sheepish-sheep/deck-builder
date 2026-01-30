import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Deck Builder',
  description: 'Yu-Gi-Oh! Deck Builder',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased bg-slate-900 text-gray-100 font-sans overflow-x-hidden">
        {/* Old site: background blur orbs */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-700 opacity-20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-700 opacity-20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-cyan-700 opacity-10 rounded-full blur-2xl" />
        </div>
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
