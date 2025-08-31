async function fetchImages() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/gallery`, { cache: 'no-store' })
  const data = await res.json()
  return data.images as { url: string }[]
}

export default async function GalleryStrip() {
  const images = (await fetchImages()).slice(0, 8)
  if (images.length === 0) return null
  return (
    <section className="py-12">
      <div className="container-max">
        <h2 className="text-2xl font-semibold mb-4">Scenes</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {images.map((img, i) => (
            <a key={i} href="/gallery" className="block aspect-square overflow-hidden rounded-xl border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
