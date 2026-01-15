import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { DarkModeProvider } from '@/contexts/DarkModeContext'

export const metadata: Metadata = {
  title: 'Aetheria - Météo Immersive',
  description: 'Application météo moderne et immersive avec cartes interactives',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="h-full w-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var originalWarn = console.warn;
                var originalError = console.error;
                var originalLog = console.log;
                
                function shouldSuppress(message) {
                  if (!message) return false;
                  return message.indexOf('-webkit-text-size-adjust') !== -1 ||
                    message.indexOf('-moz-osx-font-smoothing') !== -1 ||
                    message.indexOf('image-rendering') !== -1 ||
                    message.indexOf('behavior') !== -1 ||
                    message.indexOf('progid') !== -1 ||
                    message.indexOf('Déclaration abandonnée') !== -1 ||
                    message.indexOf('Jeu de règles ignoré') !== -1 ||
                    (message.indexOf('Erreur') !== -1 && message.indexOf('analyse') !== -1) ||
                    (message.indexOf('Propriété') !== -1 && message.indexOf('inconnue') !== -1) ||
                    message.indexOf('mozPressure') !== -1 ||
                    message.indexOf('mozInputSource') !== -1 ||
                    message.indexOf('PointerEvent.pressure') !== -1 ||
                    message.indexOf('PointerEvent.pointerType') !== -1 ||
                    message.indexOf('est obsolète') !== -1 ||
                    message.indexOf('obsolète') !== -1 ||
                    message.indexOf('deprecated') !== -1;
                }
                
                console.warn = function() {
                  var message = Array.prototype.join.call(arguments, ' ');
                  if (!shouldSuppress(message)) {
                    originalWarn.apply(console, arguments);
                  }
                };
                
                console.error = function() {
                  var message = Array.prototype.join.call(arguments, ' ');
                  if (!shouldSuppress(message)) {
                    originalError.apply(console, arguments);
                  }
                };
                
                console.log = function() {
                  var message = Array.prototype.join.call(arguments, ' ');
                  if (!shouldSuppress(message)) {
                    originalLog.apply(console, arguments);
                  }
                };
              })();
            `,
          }}
        />
      </head>
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
