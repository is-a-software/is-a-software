import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata: Metadata = {
  title: "is-a.software | Free subdomains for developers",
  description: "Get your free .is-a.software subdomain for developers. Perfect for side projects, demos, and showcasing your work to the world.",
  keywords: ["subdomain", "free", "developers", "projects", "demos", "is-a.software"],
  authors: [{ name: "is-a.software" }],
  creator: "is-a.software",
  publisher: "is-a.software",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://is-a.software"),
  openGraph: {
    title: "is-a.software | Free subdomains for developers",
    description: "Get your free .is-a.software subdomain for developers. Perfect for side projects, demos, and showcasing your work to the world.",
    url: "https://is-a.software",
    siteName: "is-a.software",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "is-a.software | Free subdomains for developers",
    description: "Get your free .is-a.software subdomain for developers. Perfect for side projects, demos, and showcasing your work to the world.",
    creator: "@is_a_software",
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

  return (
    <html lang="en" className="dark">
      <body className={`antialiased bg-gradient-to-br from-[#1c1c1c] to-[#111111] text-white`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        {analytics && <GoogleAnalytics gaId={analytics} />}
      </body>
    </html>
  );
}
