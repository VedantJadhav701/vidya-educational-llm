import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://vidya-edu.vercel.app'),
  title: 'Vidya - Multilingual NCERT Educational Companion',
  description:
    'Vidya is a multilingual NCERT-focused educational AI assistant supporting 11 Indian languages. Developed by Vedant Jadhav.',
  openGraph: {
    title: 'Vidya - Multilingual NCERT Educational Companion',
    description: 'An open-source educational AI ecosystem for Indian students. Ask questions in 11 languages, get step-by-step explanations with LaTeX, graphs, and images.',
    url: 'https://vidya-edu.vercel.app',
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
      <head>
        <link
          href="https://db.onlinewebfonts.com/c/8cb707a9b8a73f8a7403336b861c3074?family=BubbledotICG-FinePos"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
