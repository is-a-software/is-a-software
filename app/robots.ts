import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/subdomains/*/edit'],
      },
    ],
    sitemap: 'https://is-a.software/sitemap.xml',
  };
}
