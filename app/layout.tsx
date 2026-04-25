import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Providers from './providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://clicoptique.ma'),
  title: {
    default: 'Clic Optique – Lunettes Premium en Ligne | Essayage Virtuel',
    template: '%s | Clic Optique',
  },
  description:
  "Découvrez notre collection de lunettes premium. Essayez vos lunettes virtuellement grâce à notre technologie IA avant d'acheter. Livraison gratuite dès 1 000 DH partout au Maroc.",
  keywords: [
    'lunettes',
    'opticien',
    'lunettes de vue',
    'solaires',
    'essayage virtuel',
    'clic optique',
    'montures',
    'verres progressifs',
  ],
  authors: [{ name: 'Clic Optique' }],
  creator: 'Clic Optique',
  publisher: 'Clic Optique',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_MA',
    url: 'https://clicoptique.ma',
    siteName: 'Clic Optique',
    title: 'Clic Optique – Lunettes Premium en Ligne',
    description:
      'Découvrez notre collection de lunettes premium avec essayage virtuel par IA.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Clic Optique – Collection Lunettes Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clic Optique – Lunettes Premium',
    description: 'Essayez vos lunettes virtuellement grâce à notre technologie IA.',
    images: ['/og-image.jpg'],
    creator: '@clicoptique',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'OpticalStore',
              name: 'Clic Optique',
              url: 'https://clicoptique.ma',
              logo: 'https://clicoptique.ma/logo.svg',
              description:
                'Opticien en ligne proposant lunettes de vue, solaires et essayage virtuel.',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '123 Bd Mohammed V',
                addressLocality: 'Casablanca',
                postalCode: '20000',
                addressCountry: 'MA',
              },
              telephone: '+212-5-22-48-97-00',
              email: 'contact@clicoptique.ma',
              openingHours: ['Mo-Sa 09:00-19:00'],
              priceRange: 'DH DH',
              sameAs: [
                'https://instagram.com/clicoptique.ma',
                'https://facebook.com/clicoptique.ma',
              ],
            }),
          }}
        />
      </head>
      <body className="font-sans bg-white text-black antialiased">
        <Providers>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0a0a0a',
              color: '#ffffff',
              borderRadius: '0',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
            },
          }}
        />
        </Providers>
      </body>
    </html>
  );
}
