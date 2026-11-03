import type { MetadataRoute } from 'next';

const productSlugs = [
  'yellow-mustard-oil', 'groundnut-seeds', 'sesame-seeds', 'sesame-oil',
  'yellow-mustard-seeds', 'black-mustard-seeds', 'black-sesame-seeds',
  'yellow-mustard-cake', 'black-mustard-cake'
];

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!configuredUrl) return [];
  const base = configuredUrl.replace(/\/$/, '');
  return [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    ...productSlugs.map((slug) => ({ url: `${base}/products/${slug}`, changeFrequency: 'monthly' as const, priority: 0.7 }))
  ];
}
