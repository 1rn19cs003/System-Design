import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'System Design Architectures',
  description:
    'A self-study guide for system design and object-oriented design — theory, diagrams, trade-offs, interview questions, and working code in Java, Python, JavaScript, and C++ for every topic.',
  icons: {
    icon: '/assets/shared/logo-mark.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
