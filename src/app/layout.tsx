import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'System Design Architectures — HLD, LLD & Design Patterns',
  description:
    'A comprehensive, self-study guide for High-Level Design (HLD), Low-Level Design (LLD), and GoF Design Patterns with working multi-language code examples and case studies.',
  icons: {
    icon: '/assets/shared/logo-mark.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/assets/shared/logo-mark.svg" />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
