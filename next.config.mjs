/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.blob.vercel-storage.com' },
      { protocol: 'https', hostname: '**.vercel-storage.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ]
  },
  experimental: { serverActions: { allowedOrigins: ['*'] } },
  // 不配置 webpack alias，已用相对路径，最稳
}
export default nextConfig
