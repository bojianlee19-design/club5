type Post = { id:string; title:string; date:string; body?:string; coverUrl?:string }
async function fetchPosts(): Promise<Post[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/news`, { cache: 'no-store' })
  const data = await res.json()
  return data.posts as Post[]
}

export default async function NewsList() {
  const posts = await fetchPosts()
  return (
    <div className="container-max py-12 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">News & Features</h1>
        <p className="text-white/70">What’s happening, and what’s next.</p>
      </div>
      <div className="space-y-4">
        {posts.map(p => (
          <a key={p.id} href={`/news/${p.id}`} className="card p-6 block">
            <div className="text-white/50 text-sm">{new Date(p.date).toLocaleDateString()}</div>
            <div className="text-xl font-semibold">{p.title}</div>
            {p.body && <p className="text-white/70 line-clamp-2">{p.body}</p>}
          </a>
        ))}
      </div>
    </div>
  )
}
