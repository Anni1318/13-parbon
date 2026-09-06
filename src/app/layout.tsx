import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Manrope, Rozha_One } from 'next/font/google';
import './globals.css';
import { FestivalProvider } from '@/context/FestivalContext';
import { LanguageProvider } from '@/context/LanguageContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PurohitMosaiWidget from '@/components/ui/PurohitMosaiWidget';
import InstallPWA from '@/components/ui/InstallPWA';
import Festive3DCanvas from '@/components/ui/Festive3DCanvas';
import SmoothScroll from '@/components/layout/SmoothScroll';
import StickyMetrics from '@/components/ui/StickyMetrics';
import SplashScreen from '@/components/ui/SplashScreen';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const rozhaOne = Rozha_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-rozha',
});

export const metadata: Metadata = {
  title: '13  Parbon — Your Festival Companion',
  description:
    'Navigate the heart of Bengal\'s grandest celebrations. Find pandals, plan your tour, and experience the festival like never before.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: '13  Parbon',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B0F19',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${manrope.variable} ${rozhaOne.variable} h-full`}>
      <head>
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className="min-h-full flex flex-col bg-mandala text-gray-100 antialiased overflow-x-hidden">
        <SplashScreen />
        <Festive3DCanvas />
        <SmoothScroll>
          <LanguageProvider>
            <FestivalProvider>
              <Navbar />
              <main className="flex-1 relative z-10 overflow-x-hidden">{children}</main>
              <Footer />
              <PurohitMosaiWidget />
              <InstallPWA />
            </FestivalProvider>
          </LanguageProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
