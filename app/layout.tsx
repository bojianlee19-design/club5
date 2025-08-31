import './globals.css'
import type { Metadata } from 'next'
import { brand } from '@/brand.config'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'HAZY Club',
  description: 'Nightlife. Events. Sound.',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'HAZY Club',
    description: 'Nightlife. Events. Sound.',
    type: 'website'
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <style>{`:root{--bg:${brand.bg};--fg:${brand.fg};--primary:${brand.primary};--secondary:${brand.secondary};--accent:${brand.accent};}`}</style>
        <div className="min-h-screen flex flex-col">
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
