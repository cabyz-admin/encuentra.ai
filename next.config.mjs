/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: [
    '@v1/ui',
    '@v1/supabase',
    '@v1/analytics',
    '@v1/kv',
    '@v1/logger'
  ]
};

export default nextConfig;