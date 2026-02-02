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
      <body className="min-h-screen antialiased bg-slate-950 text-gray-100 font-sans overflow-x-hidden">
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[32rem] h-[32rem] bg-blue-800 rounded-full blur-3xl orb-animate-1" />
          <div className="absolute -bottom-32 -left-32 w-[32rem] h-[32rem] bg-indigo-800 rounded-full blur-3xl orb-animate-2" />
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-700 rounded-full blur-3xl orb-animate-3" />
        </div>
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
