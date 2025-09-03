// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import TopNav from '@/components/TopNav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'HAZY Club',
  description: 'Nights · Music · Community',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-black text-white">
        <TopNav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
