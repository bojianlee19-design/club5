/** @type {import('next').NextConfig} */
import path from 'path'
import { fileURLToPath } from 'url'

// 这两行是关键：在 ESM（.mjs）里手动得到 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.blob.vercel-storage.com' },
      { protocol: 'https', hostname: '**.vercel-storage.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ]
  },
  experimental: {
    serverActions: { allowedOrigins: ['*'] }
  },
  webpack: (config) => {
    // "@/..." 指向项目根目录
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname)
    }
    return config
  }
}

export default nextConfig
fix: esm dirname
