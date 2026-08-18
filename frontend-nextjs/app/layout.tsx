import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://vidya-educational-llm.vercel.app'),
  title: 'Vidya - Multilingual NCERT Educational Companion',
  description:
    'Vidya is a multilingual NCERT-focused educational AI assistant supporting 11 Indian languages. Developed by Vedant Jadhav.',
  openGraph: {
    title: 'Vidya - Multilingual NCERT Educational Companion',
    description: 'An open-source educational AI ecosystem for Indian students. Ask questions in 11 languages, get step-by-step explanations with LaTeX, graphs, and images.',
    url: 'https://vidya-educational-llm.vercel.app',
    siteName: 'Vidya',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
