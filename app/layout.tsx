// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import TopNav from '@/components/TopNav'

export const metadata: Metadata = {
  title: 'HAZY Club',
  description: 'Nights • Music • Community',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        {/* 顶部导航（居中悬浮，始终在最上层） */}
        <TopNav />
        {children}
      </body>
    </html>
  )
}
