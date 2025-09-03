// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import TopNav from '@/components/TopNav'

export const metadata: Metadata = {
  title: 'HAZY Club',
  description: 'NIGHTS · MUSIC · COMMUNITY',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        <TopNav />
        <div className="pt-16">{children}</div>

        {/* Footer：地址/联系 */}
        <footer className="mt-16 border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-10 grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="font-extrabold tracking-wide">Visit us</h3>
              <p className="opacity-80 mt-2">
                28 Eyre St, Sheffield City Centre, Sheffield S1 4QY
              </p>
              <a
                href="https://maps.google.com/?q=28+Eyre+St,+Sheffield+S1+4QY"
                className="underline mt-1 inline-block"
                target="_blank"
                rel="noreferrer"
              >
                Open in Maps →
              </a>
            </div>
            <div>
              <h3 className="font-extrabold tracking-wide">Contact</h3>
              <a href="mailto:matt@hazyclub.co.uk" className="underline mt-2 inline-block">
                matt@hazyclub.co.uk
              </a>
            </div>
            <div className="opacity-70">
              © {new Date().getFullYear()} HAZY Club. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
