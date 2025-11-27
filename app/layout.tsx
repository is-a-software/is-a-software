import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { GoogleAnalytics } from '@next/third-parties/google';
import { Inter, Poppins } from 'next/font/google';
import { SponsorWidget } from "./components/SponsorWidget";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: {
    default: "is-a.software | Free Subdomains for Developers",
    template: "%s | is-a.software"
  },
  description: "Get your free .is-a.software subdomain for developers. Perfect for side projects, demos, portfolios, and showcasing your work. Easy DNS management with GitHub authentication.",
  authors: [{ name: "Priyansh Prajapat", url: "https://priyanzsh.github.io" }],
  creator: "Priyansh Prajapat",
  publisher: "Priyansh Prajapat",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://is-a.software"),
  alternates: {
    canonical: "https://is-a.software",
  },
  openGraph: {
    title: "is-a.software | Free Subdomains for Developers & Projects",
    description: "Get your free .is-a.software subdomain for developers. Perfect for side projects, demos, portfolios, and showcasing your work. Easy DNS management with GitHub authentication.",
    url: "https://is-a.software",
    siteName: "is-a.software",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/is-a-software.png",
        width: 1200,
        height: 630,
        alt: "is-a.software - Free Subdomains for Developers"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "is-a.software | Free Subdomains for Developers & Projects",
    description: "Get your free .is-a.software subdomain for developers. Perfect for side projects, demos, portfolios, and showcasing your work.",
    creator: "Priyansh Prajapat",
    images: ["/is-a-software.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const analytics = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "is-a.software",
    "url": "https://is-a.software",
    "description": "Free subdomain service for developers. Get your .is-a.software subdomain for side projects, demos, and portfolios.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://is-a.software/dashboard?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "creator": {
      "name": "Priyansh Prajapat",
      "url": "https://priyanzsh.github.io"
    }
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}/>
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-poppins antialiased bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a] text-white`}>
        <AuthProvider>
          {children}
          <SponsorWidget />
        </AuthProvider>
        {analytics && <GoogleAnalytics gaId={analytics} />}
      </body>
    </html>
  );
}
