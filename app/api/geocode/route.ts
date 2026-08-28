import { NextRequest, NextResponse } from 'next/server'

// Proxy serveur vers Nominatim (OpenStreetMap).
//
// Nominatim exige un User-Agent identifiant l'application et interdit les appels
// directs massifs depuis un navigateur (politique d'usage :
// https://operations.osmfoundation.org/policies/nominatim/). En passant par notre
// propre route API, on envoie un User-Agent correct, on évite d'exposer l'IP de
// chaque visiteur directement à Nominatim à chaque frappe, et on peut mettre en
// cache/limiter le débit si besoin plus tard.
const NOMINATIM_USER_AGENT = 'Aetheria-Weather-App/1.0 (https://aetheria-tr1u.onrender.com)'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim()
  const language = request.nextUrl.searchParams.get('lang') ?? 'fr'

  if (!query) {
    return NextResponse.json({ error: 'Paramètre "q" manquant' }, { status: 400 })
  }

  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', query)
  url.searchParams.set('format', 'json')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('limit', '10')
  url.searchParams.set('accept-language', language)

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': NOMINATIM_USER_AGENT },
      // Nominatim est un service gratuit partagé : on évite de le solliciter en boucle
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
