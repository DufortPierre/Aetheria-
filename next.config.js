/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // Ne pas exposer le framework utilisé (en-tête "X-Powered-By: Next.js").
  poweredByHeader: false,

  async headers() {
    // CSP pragmatique : l'app utilise beaucoup de styles inline (Tailwind en
    // valeurs arbitraires + calculs de position JS pour la carte), donc
    // 'unsafe-inline' reste nécessaire sur style-src/script-src tant qu'on ne
    // met pas en place un CSP à base de nonce (middleware Next.js). Le reste
    // (frame-ancestors, connect-src, img-src) est restreint à ce dont
    // l'application a réellement besoin.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://*.basemaps.cartocdn.com https://*.tile.openstreetmap.org",
      "font-src 'self' data:",
      "connect-src 'self' https://api.open-meteo.com https://air-quality-api.open-meteo.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(self), camera=(), microphone=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
