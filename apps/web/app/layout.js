import "./globals.css";
import { WaitlistProvider } from '@/lib/waitlist';
import WaitlistModal from '@/components/WaitlistModal';

export const metadata = {
  title: "is-a.software | Free subdomains for developers",
  description: "Get your own subdomain for your software projects",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        <WaitlistProvider>
          {children}
          <WaitlistModal />
        </WaitlistProvider>
      </body>
    </html>
  );
}
