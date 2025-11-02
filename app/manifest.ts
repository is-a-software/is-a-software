import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'is-a.software - Free Subdomains for Developers',
    short_name: 'is-a.software',
    description: 'Get your free .is-a.software subdomain for developers. Perfect for side projects, demos, and portfolios.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1c1c1c',
    theme_color: '#a855f7',
    icons: [
      {
        src: '/is-a-software.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/is-a-software.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  };
}
