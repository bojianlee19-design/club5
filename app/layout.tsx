// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import TopNav from '@/components/TopNav'

export const metadata: Metadata = {
  title: 'HAZY Club',
  description: 'Nights · Music · Community',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        {/* 顶部居中导航 */}
        <TopNav />
        {children}
      </body>
    </html>
  )
}
