async function fetchPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/news`, { cache: 'no-store' })
  const data = await res.json()
  return data.posts as any[]
}

export default async function NewsPost({ params }: { params: { id: string }}) {
  const posts = await fetchPosts()
  const p = posts.find(x => x.id === params.id)
  if (!p) return <div className="container-max py-12"><h1>Not found</h1></div>
  return (
    <div className="container-max py-12">
      <div className="card p-6 space-y-3">
        <div className="text-white/50 text-sm">{new Date(p.date).toLocaleDateString()}</div>
        <h1 className="text-3xl font-semibold">{p.title}</h1>
        {p.coverUrl && <img className="rounded-xl border border-white/10" src={p.coverUrl} alt="" />}
        {p.body && <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: p.body }} />}
      </div>
    </div>
  )
}
