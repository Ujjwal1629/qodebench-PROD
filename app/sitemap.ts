import type { MetadataRoute } from 'next';
import { PUBLIC_TOOLS } from '@/lib/public-tools';
import { getAllPosts } from '@/lib/blog';

const BASE = (process.env.NEXT_PUBLIC_APP_URL || 'https://qodebench.com').replace(/\/$/, '');

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/courses', '/pricing', '/about', '/testing-tools', '/blog'];
  return [
    ...pages.map((p) => ({ url: `${BASE}${p}` })),
    ...PUBLIC_TOOLS.map((t) => ({ url: `${BASE}/testing-tools/${t.slug}` })),
    ...getAllPosts().map((p) => ({ url: `${BASE}/blog/${p.slug}`, lastModified: p.date || undefined })),
  ];
}
