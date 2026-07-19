import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // A stray lockfile in the home directory makes Next.js guess the wrong
    // workspace root; pin it to this project.
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply COOP/COEP headers for WebContainer support
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            // `credentialless` keeps the cross-origin isolation WebContainer needs
            // (SharedArrayBuffer) while allowing cross-origin resources without a
            // CORP header — e.g. Mux video thumbnails and Google/GitHub avatars —
            // to load (fetched without credentials). `require-corp` blocks those.
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
