import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "is-a.software | Free subdomains for developers",
  description: "Cool subdomain for developers to use in their projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
