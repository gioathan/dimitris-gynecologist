import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '') ?? '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year — never re-optimize the same image
    deviceSizes: [640, 1080, 1920],
    imageSizes: [64, 256, 384],
  },
};

export default nextConfig;
