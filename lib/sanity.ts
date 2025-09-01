// lib/sanity.ts
/**
 * 极简 Sanity HTTP API 封装。
 * - 公共 dataset 可不带 token。
 * - 私有 dataset 需在 Vercel 配置 SANITY_READ_TOKEN（只读 token）。
 */
export async function sanityFetch<T = any>(query: string): Promise<T> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  if (!projectId) return [] as unknown as T

  const url = new URL(`https://${projectId}.api.sanity.io/v2023-10-01/data/query/${dataset}`)
  url.searchParams.set('query', query)

  const token = process.env.SANITY_READ_TOKEN
  const res = await fetch(url.toString(), {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Sanity fetch failed: ${res.status} ${res.statusText} ${text}`)
  }

  const json = await res.json()
  return json.result as T
}
