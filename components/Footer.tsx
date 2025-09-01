// components/Footer.tsx
import Link from 'next/link'
import { BRAND } from '@/brand.config'

export default function Footer() {
  const fullAddress = `${BRAND.addressLine}, ${BRAND.city} ${BRAND.postcode}`

  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <h4 className="text-sm uppercase tracking-widest text-white/60 mb-3">
            Visit us
          </h4>
          <p className="text-white/90 leading-relaxed">
            {fullAddress}
            <br />
            <Link
              href={BRAND.mapUrl}
              target="_blank"
              className="underline underline-offset-4 hover:text-white"
            >
              Open in Maps →
            </Link>
          </p>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-widest text-white/60 mb-3">
            Contact
          </h4>
          <p className="text-white/90">
            {BRAND.email ? (
              <a href={`mailto:${BRAND.email}`} className="hover:underline">
                {BRAND.email}
              </a>
            ) : (
              '—'
            )}
            <br />
            {BRAND.phone ? <span>{BRAND.phone}</span> : null}
          </p>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-widest text-white/60 mb-3">
            Follow
          </h4>
          <ul className="space-y-1 text-white/90">
            {BRAND.socials.instagram && (
              <li>
                <a
                  href={BRAND.socials.instagram}
                  target="_blank"
                  className="hover:underline"
                >
                  Instagram
                </a>
              </li>
            )}
            {BRAND.socials.tiktok && (
              <li>
                <a
                  href={BRAND.socials.tiktok}
                  target="_blank"
                  className="hover:underline"
                >
                  TikTok
                </a>
              </li>
            )}
            {BRAND.socials.facebook && (
              <li>
                <a
                  href={BRAND.socials.facebook}
                  target="_blank"
                  className="hover:underline"
                >
                  Facebook
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 text-center text-white/60 text-sm py-4">
        © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
      </div>
    </footer>
  )
}
