import { NextRequest, NextResponse } from 'next/server'

// Voir app/api/geocode/route.ts pour le pourquoi de ce proxy serveur.
const NOMINATIM_USER_AGENT = 'Aetheria-Weather-App/1.0 (https://aetheria-tr1u.onrender.com)'

export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get('lat')
  const lon = request.nextUrl.searchParams.get('lon')
  const language = request.nextUrl.searchParams.get('lang') ?? 'fr'

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Paramètres "lat"/"lon" manquants' }, { status: 400 })
  }

  const url = new URL('https://nominatim.openstreetmap.org/reverse')
  url.searchParams.set('lat', lat)
  url.searchParams.set('lon', lon)
  url.searchParams.set('format', 'json')
  url.searchParams.set('accept-language', language)
  url.searchParams.set('zoom', '10')

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': NOMINATIM_USER_AGENT },
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Service de géocodage indisponible' }, { status: 502 })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Service de géocodage indisponible' }, { status: 502 })
  }
}
