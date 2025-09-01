// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { BRAND } from '@/brand.config'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: `${BRAND.name} — ${BRAND.city}`,
  description:
    `${BRAND.name} at ${BRAND.addressLine}, ${BRAND.city} ${BRAND.postcode}. ` +
    `Nightlife, events & tickets.`,
  metadataBase: new URL(BRAND.siteUrl),
  openGraph: {
    title: `${BRAND.name} — ${BRAND.city}`,
    description:
      `${BRAND.name} at ${BRAND.addressLine}, ${BRAND.city} ${BRAND.postcode}.`,
    url: BRAND.siteUrl,
    siteName: BRAND.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND.name} — ${BRAND.city}`,
    description:
      `${BRAND.name} at ${BRAND.addressLine}, ${BRAND.city} ${BRAND.postcode}.`,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#0b0b0b] text-white">
        {/* 主体内容 */}
        {children}

        {/* 页脚（统一读取 BRAND 配置） */}
        <Footer />

        {/* 结构化数据：NightClub（防止错误抓取 MOS 地址） */}
        <script
          type="application/ld+json"
          // 防止服务端/客户端注水不一致的告警
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'NightClub',
              name: BRAND.name,
              url: BRAND.siteUrl,
              address: {
                '@type': 'PostalAddress',
                streetAddress: BRAND.addressLine,
                addressLocality: BRAND.city,
                postalCode: BRAND.postcode,
                addressCountry: BRAND.country,
              },
              email: BRAND.email || undefined,
              telephone: BRAND.phone || undefined,
            }),
          }}
        />
      </body>
    </html>
  )
}
