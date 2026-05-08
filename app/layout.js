import { Fondamento, Inter, Cinzel, Playfair_Display } from 'next/font/google';
import './globals.css';
import Footer from '@/components/footer';

const fondamento = Fondamento({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-fondamento',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-playfair',
});

export const metadata = {
  title: "Deepa's Vision",
  description: "Deepa's Vision — Vedic astrology, numerology & Lal Kitab guidance for career, relationships, and life.",
  metadataBase: new URL('https://deepas-vision.vercel.app'),
  openGraph: {
    title: "Deepa's Vision",
    description: "Vedic astrology, numerology & Lal Kitab guidance for career, relationships, and life.",
    url: 'https://deepas-vision.vercel.app',
    siteName: "Deepa's Vision",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "Deepa's Vision — Vedic Astrology Platform",
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Deepa's Vision",
    description: "Vedic astrology, numerology & Lal Kitab guidance for career, relationships, and life.",
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${fondamento.variable} ${inter.variable} ${cinzel.variable} ${playfair.variable} font-inter antialiased`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
