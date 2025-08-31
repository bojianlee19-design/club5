/** @type {import('next').NextConfig} */
import path from 'path'
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
    // Fallback alias to ensure "@/..." resolves on build servers
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname)
    }
    return config
  }
};
export default nextConfig;
