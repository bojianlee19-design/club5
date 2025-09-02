// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import TopNav from '@/components/TopNav';

export const metadata: Metadata = {
  title: 'Hazy Club — Nights · Music · Community',
  description:
    'Hazy Club official site. Discover our latest events, book tickets, and explore membership, venue hire, and more.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-black text-white antialiased">
        {/* 顶部导航（固定定位），Hero 区块已在自身做了 mt-16 抬头处理 */}
        <TopNav />
        {children}
      </body>
    </html>
  );
}
