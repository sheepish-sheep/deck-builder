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
      <body className="min-h-screen antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
