// components/Header.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header
        style={{
          position: 'fixed',
          insetInline: 0,
          top: 0,
          zIndex: 30,
          display: 'grid',
          placeItems: 'center',
          padding: '14px 12px',
          pointerEvents: 'none',
        }}
      >
        <nav
          style={{
            display: 'flex',
            gap: 24,
            alignItems: 'center',
            background: 'rgba(0,0,0,.45)',
            border: '1px solid rgba(255,255,255,.12)',
            backdropFilter: 'blur(8px)',
            borderRadius: 999,
            padding: '10px 18px',
            pointerEvents: 'auto',
          }}
        >
          <button onClick={() => setOpen(true)} style={btnStyle}>Menu</button>
          <Link href="/tables" style={btnStyle}>Tables</Link>
          <Link href="/tickets" style={btnStyle}>Tickets</Link>
        </nav>
      </header>

      {/* Overlay Menu */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            background: 'rgba(0,0,0,.7)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(92vw, 560px)',
              background: 'rgba(20,20,20,.95)',
              border: '1px solid rgba(255,255,255,.1)',
              borderRadius: 16,
              padding: 24,
              color: '#fff',
            }}
          >
            <h3 style={{ marginTop: 0 }}>Menu</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
              <li><Link href="/events" style={menuLink}>Events</Link></li>
              <li><Link href="/gallery" style={menuLink}>Gallery</Link></li>
              <li><Link href="/news" style={menuLink}>News</Link></li>
              <li><Link href="/venue-hire" style={menuLink}>Venue Hire</Link></li>
              <li><Link href="/vip" style={menuLink}>VIP</Link></li>
              <li><Link href="/faq" style={menuLink}>FAQ</Link></li>
            </ul>
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <button onClick={() => setOpen(false)} style={btnStyle}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const btnStyle: React.CSSProperties = {
  color: '#fff',
  background: 'transparent',
  border: '1px solid rgba(255,255,255,.18)',
  borderRadius: 999,
  padding: '8px 14px',
  cursor: 'pointer',
  textDecoration: 'none',
};

const menuLink: React.CSSProperties = {
  display: 'block',
  padding: '10px 12px',
  borderRadius: 10,
  color: '#fff',
  textDecoration: 'none',
  border: '1px solid rgba(255,255,255,.12)',
  background: 'rgba(255,255,255,.03)',
};
