import type { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  const rules: MetadataRoute.Robots = {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] }
  };
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    rules.sitemap = `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')}/sitemap.xml`;
  }
  return rules;
}
