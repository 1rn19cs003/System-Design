import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'System Design Architectures — HLD, LLD & Design Patterns',
  description:
    'A comprehensive, self-study guide for High-Level Design (HLD), Low-Level Design (LLD), and GoF Design Patterns with working multi-language code examples and case studies.',
  icons: {
    icon: '/assets/shared/logo-mark.svg',
  },
};

// The site itself is served as static HTML directly from /public (index.html, /pages/**.html,
// /assets/**) so it matches the original HTML site byte-for-byte. This app-router layout is not
// used to render any page content — it only exists so Next can emit /robots.txt and /sitemap.xml
// (see sitemap.ts / robots.ts) alongside the static export.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
