import type { Metadata, Viewport } from 'next'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { DarkModeProvider } from '@/contexts/DarkModeContext'

const siteUrl = 'https://aetheria-tr1u.onrender.com'
const title = 'Aetheria - Météo Immersive'
const description = 'Application météo moderne et immersive avec carte interactive mondiale et prévisions sur 7 jours.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: 'Aetheria',
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: 'Aetheria',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/opengraph-image'],
  },
}

// Autrefois dupliqué à la main dans <head> en plus du <meta viewport> par défaut
// de Next.js (deux balises viewport contradictoires dans le HTML final). En
// passant par cet export dédié, Next.js n'en génère qu'une seule.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // `lang` de secours pour le tout premier rendu serveur ; LanguageProvider le
    // met ensuite à jour côté client dès que la langue choisie est connue.
    <html lang="fr" className="h-full w-full">
      <body className="antialiased h-full w-full bg-[#0b0e14]">
        <DarkModeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </DarkModeProvider>
      </body>
    </html>
  )
}
