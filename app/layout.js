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
  description: "Deepa's Vision - A platform for personal growth and self-discovery.",
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
