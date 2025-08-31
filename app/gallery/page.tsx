async function fetchImages() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/gallery`, { cache: 'no-store' })
  const data = await res.json()
  return data.images as { url: string, pathname: string }[]
}

export default async function GalleryPage() {
  const images = await fetchImages()
  return (
    <div className="container-max py-12">
      <h1 className="text-3xl font-semibold mb-6">Gallery</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <a key={img.url} href={img.url} target="_blank" className="block aspect-square overflow-hidden rounded-2xl border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="" className="w-full h-full object-cover" />
          </a>
        ))}
      </div>
    </div>
  )
}
