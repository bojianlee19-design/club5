import { list, put, del } from '@vercel/blob'
const token = process.env.BLOB_READ_WRITE_TOKEN

export async function listPrefix(prefix: string) {
  const res = await list({ prefix, token })
  return res.blobs
}
export async function saveJSON(pathname: string, data: any) {
  const { url } = await put(pathname, JSON.stringify(data, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
    token
  })
  return url
}
export async function deleteBlob(pathname: string) {
  await del(pathname, { token })
}
export async function uploadFile(pathname: string, file: File) {
  const { url } = await put(pathname, file, { access: 'public', addRandomSuffix: true, token })
  return url
}
