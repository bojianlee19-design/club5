// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-800 bg-black px-4 py-10 text-sm text-neutral-300">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
        <div>
          <div className="text-white">Visit us</div>
          <div className="mt-2">28 Eyre St, Sheffield City Centre, Sheffield S1 4QY</div>
          <a
            href="https://maps.google.com/?q=28 Eyre St, Sheffield S1 4QY"
            target="_blank"
            className="mt-1 inline-block underline"
          >
            Open in Maps →
          </a>
        </div>
        <div>
          <div className="text-white">Contact</div>
          <a href="mailto:matt@hazyclub.co.uk" className="mt-2 inline-block underline">
            matt@hazyclub.co.uk
          </a>
        </div>
        <div>
          <div className="text-white">Follow</div>
          <div className="mt-2 opacity-70">Instagram / TikTok / Facebook</div>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-6xl opacity-60">© {new Date().getFullYear()} HAZY Club. All rights reserved.</div>
    </footer>
  );
}
