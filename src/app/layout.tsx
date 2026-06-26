import type { Metadata, Viewport } from 'next';
import {
  Cinzel,
  Cormorant_Garamond,
  Inter,
  Frank_Ruhl_Libre,
} from 'next/font/google';
import './globals.css';

// Capitales romaines luxe (logo CHMOUEL, BAR MITSVA, sections)
const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cinzel',
  display: 'swap',
});

// Serif raffinée (intro, "ont la joie de", noms famille)
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

// Sans moderne pour le corps de texte
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Hébreu (versets, noms hébraïques)
const frankHe = Frank_Ruhl_Libre({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '500', '700'],
  variable: '--font-frank',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bm-chmouel-journo.vercel.app'),
  title: 'Bar Mitsva Chmouel Journo',
  description:
    "Faire-part d'invitation — Bar Mitsva Chmouel Journo · Dimanche 30 août 2026",
  openGraph: {
    title: 'Bar Mitsva Chmouel Journo',
    description: 'Dimanche 30 août 2026 — Vous êtes conviés à célébrer ce grand jour.',
    type: 'website',
    locale: 'fr_FR',
    images: [
      { url: '/og.jpg', width: 1200, height: 1200, alt: 'Bar Mitsva Chmouel Journo' },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Bar Mitsva Chmouel Journo',
    description: 'Dimanche 30 août 2026 — Vous êtes conviés à célébrer ce grand jour.',
    images: ['/og.jpg'],
  },
};

// Empêche le zoom (pincement) sur mobile.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${cinzel.variable} ${cormorant.variable} ${inter.variable} ${frankHe.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
