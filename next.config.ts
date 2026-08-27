import type {NextConfig} from 'next';

const isExport = process.env.OUTPUT_EXPORT === 'true' || process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // In GitHub Pages SSG export mode, generate static html to 'out' directory
  ...(isExport ? { output: 'export' } : { output: 'standalone' }),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  transpilePackages: ['motion'],
  turbopack: {},
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
