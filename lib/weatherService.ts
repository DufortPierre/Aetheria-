// Service météo utilisant Open-Meteo (gratuit, pas de clé API requise)

export interface WeatherData {
  latitude: number
  longitude: number
  current: {
    temperature_2m: number
    relative_humidity_2m: number
    weather_code: number
    wind_speed_10m: number
    wind_direction_10m: number
    surface_pressure: number
    precipitation: number
    rain: number
    snowfall: number
    visibility: number
    time: string
  }
  current_units: {
    temperature_2m: string
    relative_humidity_2m: string
    wind_speed_10m: string
    wind_direction_10m: string
    surface_pressure: string
    precipitation: string
    rain: string
    snowfall: string
    visibility: string
  }
}

export interface ForecastData {
  latitude: number
  longitude: number
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_sum: number[]
    wind_speed_10m_max: number[]
    wind_direction_10m_dominant: number[]
  }
  daily_units: {
    temperature_2m_max: string
    temperature_2m_min: string
    precipitation_sum: string
    wind_speed_10m_max: string
    wind_direction_10m_dominant: string
  }
}

export interface AirQualityData {
  latitude: number
  longitude: number
  current: {
    us_aqi: number
    pm2_5: number
    pm10: number
    no2: number
    o3: number
    time: string
  }
}

export interface GeocodingResult {
  id: number
  name: string
  latitude: number
  longitude: number
  country: string
  admin1?: string
}

export interface ReverseGeocodingResult {
  name: string
  display_name: string
  address?: {
    city?: string
    town?: string
    village?: string
    municipality?: string
    state?: string
    country?: string
  }
}

// Codes météo Open-Meteo (WMO Weather interpretation codes)
export const WEATHER_CODES: Record<number, { label: string; icon: string; emoji: string }> = {
  0: { label: 'Ciel dégagé', icon: 'sun', emoji: '☀️' },
  1: { label: 'Principalement dégagé', icon: 'sun', emoji: '🌤️' },
  2: { label: 'Partiellement nuageux', icon: 'cloud', emoji: '⛅' },
  3: { label: 'Couvert', icon: 'cloud', emoji: '☁️' },
  45: { label: 'Brouillard', icon: 'cloud-fog', emoji: '🌫️' },
  48: { label: 'Brouillard givrant', icon: 'cloud-fog', emoji: '🌫️' },
  51: { label: 'Bruine légère', icon: 'cloud-drizzle', emoji: '🌦️' },
  53: { label: 'Bruine modérée', icon: 'cloud-drizzle', emoji: '🌦️' },
  55: { label: 'Bruine dense', icon: 'cloud-drizzle', emoji: '🌦️' },
  56: { label: 'Bruine verglaçante légère', icon: 'cloud-drizzle', emoji: '🌨️' },
  57: { label: 'Bruine verglaçante dense', icon: 'cloud-drizzle', emoji: '🌨️' },
  61: { label: 'Pluie légère', icon: 'cloud-rain', emoji: '🌧️' },
  63: { label: 'Pluie modérée', icon: 'cloud-rain', emoji: '🌧️' },
  65: { label: 'Pluie forte', icon: 'cloud-rain', emoji: '⛈️' },
  66: { label: 'Pluie verglaçante légère', icon: 'cloud-rain', emoji: '🌨️' },
  67: { label: 'Pluie verglaçante forte', icon: 'cloud-rain', emoji: '🌨️' },
  71: { label: 'Chute de neige légère', icon: 'snowflake', emoji: '❄️' },
  73: { label: 'Chute de neige modérée', icon: 'snowflake', emoji: '❄️' },
  75: { label: 'Chute de neige forte', icon: 'snowflake', emoji: '❄️' },
  77: { label: 'Grains de neige', icon: 'snowflake', emoji: '🌨️' },
  80: { label: 'Averses de pluie légères', icon: 'cloud-rain', emoji: '🌦️' },
  81: { label: 'Averses de pluie modérées', icon: 'cloud-rain', emoji: '🌧️' },
  82: { label: 'Averses de pluie violentes', icon: 'cloud-rain', emoji: '⛈️' },
  85: { label: 'Averses de neige légères', icon: 'snowflake', emoji: '❄️' },
  86: { label: 'Averses de neige fortes', icon: 'snowflake', emoji: '❄️' },
  95: { label: 'Orage', icon: 'cloud-lightning', emoji: '⛈️' },
  96: { label: 'Orage avec grêle', icon: 'cloud-lightning', emoji: '⛈️' },
  99: { label: 'Orage avec grêle violente', icon: 'cloud-lightning', emoji: '⛈️' },
}

// Obtenir les données météo actuelles
export async function getCurrentWeather(
  lat: number,
  lon: number,
  lang: string = 'fr'
): Promise<WeatherData | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,precipitation,rain,snowfall,visibility&timezone=auto&language=${lang}`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données météo')
    }

    const data = await response.json()
    return data as WeatherData
  } catch (error) {
    console.error('Erreur API météo:', error)
    return null
  }
}

// Obtenir les prévisions sur plusieurs jours
export async function getForecast(
  lat: number,
  lon: number,
  days: number = 7,
  lang: string = 'fr'
): Promise<ForecastData | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto&forecast_days=${days}&language=${lang}`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des prévisions')
    }

    const data = await response.json()
    return data as ForecastData
  } catch (error) {
    console.error('Erreur API prévisions:', error)
    return null
  }
}

// Obtenir la qualité de l'air
export async function getAirQuality(
  lat: number,
  lon: number
): Promise<AirQualityData | null> {
  try {
    // Limiter les coordonnées à 4 décimales pour éviter les erreurs de précision
    const latFixed = parseFloat(lat.toFixed(4))
    const lonFixed = parseFloat(lon.toFixed(4))
    
    // L'API Open-Meteo Air Quality utilise les noms de variables exacts :
    // pm10, pm2_5, nitrogen_dioxide (pas no2), ozone (pas o3), sulphur_dioxide, us_aqi
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latFixed}&longitude=${lonFixed}&hourly=pm10,pm2_5,nitrogen_dioxide,ozone,us_aqi&timezone=auto`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      // Si l'API retourne une erreur, retourner null silencieusement
      return null
    }

    const data = await response.json()
    
    // Vérifier si les données horaires sont valides
    if (!data || !data.hourly || !data.hourly.time || data.hourly.time.length === 0) {
      return null
    }
    
    // Prendre la première valeur (la plus récente) des données horaires
    const firstIndex = 0
    
    // Vérifier que les valeurs ne sont pas toutes null/undefined
    const us_aqi = data.hourly.us_aqi?.[firstIndex]
    const hasValidData = us_aqi !== null && us_aqi !== undefined
    
    if (!hasValidData) {
      return null
    }
    
    // Convertir les données horaires en format current
    // Note: l'API retourne nitrogen_dioxide et ozone, on les mappe vers no2 et o3
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      current: {
        us_aqi: us_aqi ?? 0,
        pm2_5: data.hourly.pm2_5?.[firstIndex] ?? 0,
        pm10: data.hourly.pm10?.[firstIndex] ?? 0,
        no2: data.hourly.nitrogen_dioxide?.[firstIndex] ?? 0,
        o3: data.hourly.ozone?.[firstIndex] ?? 0,
        time: data.hourly.time[firstIndex] ?? new Date().toISOString(),
      }
    } as AirQualityData
  } catch (error) {
    // Erreur silencieuse - la qualité de l'air n'est pas critique
    return null
  }
}

// Recherche de ville (géocodage) avec Nominatim - Support universel (Chinois, Japonais, Arabe, etc.)
export async function searchCity(query: string, lang: string = 'fr'): Promise<GeocodingResult[]> {
  if (!query || query.length < 1) {
    return []
  }

  try {
    // Utiliser Nominatim pour un support universel de tous les alphabets
    // encodeURIComponent() gère correctement UTF-8 pour tous les caractères
    const encodedQuery = encodeURIComponent(query)
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&addressdetails=1&limit=10&accept-language=${lang}`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Aetheria Weather App', // Nominatim requiert un User-Agent
        'Accept': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error('Erreur lors de la recherche de ville')
    }

    const data = await response.json()
    
    // Convertir le format Nominatim vers notre format GeocodingResult
    return data.map((item: any, index: number) => {
      const address = item.address || {}
      // Utiliser le nom principal ou le display_name pour le nom de la ville
      // display_name contient souvent le nom dans la langue locale
      const cityName = item.name || 
                      address.city || 
                      address.town || 
                      address.village || 
                      address.municipality ||
                      item.display_name?.split(',')[0] || 
                      ''
      
      return {
        id: item.place_id || index,
        name: cityName,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        country: address.country || '',
        admin1: address.state || address.region || address.province || address.county || '',
      } as GeocodingResult
    })
  } catch (error) {
    console.error('Erreur recherche ville:', error)
    return []
  }
}

// Reverse geocoding : transformer des coordonnées en nom de ville (Nominatim - OpenStreetMap)
export async function reverseGeocode(
  lat: number,
  lon: number,
  lang: string = 'fr'
): Promise<string> {
  try {
    // Utiliser Nominatim avec le paramètre de langue
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1&accept-language=${lang}`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Aetheria Weather App', // Requis par Nominatim
      },
    })
    
    if (!response.ok) {
      return `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`
    }

    const data = await response.json()
    
    // Extraire le nom de la ville
    if (data.address) {
      const city = data.address.city || 
                   data.address.town || 
                   data.address.village || 
                   data.address.municipality ||
                   data.address.county ||
                   data.address.state ||
                   ''
      
      const country = data.address.country || ''
      
      if (city) {
        return country ? `${city}, ${country}` : city
      }
      
      // Fallback sur le display_name
      if (data.display_name) {
        const parts = data.display_name.split(',')
        return parts.slice(0, 2).join(', ').trim()
      }
    }
    
    return `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`
  } catch (error) {
    console.warn('Erreur reverse geocoding:', error)
    return `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`
  }
}

// Obtenir le label AQI
export function getAQILabel(aqi: number, isDarkMode: boolean = true): {
  label: string
  color: string
  bgColor: string
  description: string
} {
  if (aqi <= 50) {
    return {
      label: 'Bon',
      color: isDarkMode ? 'text-green-400' : 'text-green-700',
      bgColor: isDarkMode ? 'bg-green-500/20 border-green-500/30' : 'bg-green-100 border-green-300',
      description: 'Qualité de l\'air excellente',
    }
  } else if (aqi <= 100) {
    return {
      label: 'Correct',
      color: isDarkMode ? 'text-yellow-400' : 'text-yellow-700',
      bgColor: isDarkMode ? 'bg-yellow-500/20 border-yellow-500/30' : 'bg-yellow-100 border-yellow-300',
      description: 'Qualité de l\'air acceptable',
    }
  } else if (aqi <= 150) {
    return {
      label: 'Modéré',
      color: isDarkMode ? 'text-orange-400' : 'text-orange-700',
      bgColor: isDarkMode ? 'bg-orange-500/20 border-orange-500/30' : 'bg-orange-100 border-orange-300',
      description: 'Sensible aux personnes fragiles',
    }
  } else if (aqi <= 200) {
    return {
      label: 'Mauvais',
      color: isDarkMode ? 'text-red-400' : 'text-red-700',
      bgColor: isDarkMode ? 'bg-red-500/20 border-red-500/30' : 'bg-red-100 border-red-300',
      description: 'Mauvais pour la santé',
    }
  } else {
    return {
      label: 'Très mauvais',
      color: isDarkMode ? 'text-red-600' : 'text-red-800',
      bgColor: isDarkMode ? 'bg-red-600/20 border-red-600/30' : 'bg-red-100 border-red-300',
      description: 'Dangereux pour la santé',
    }
  }
}

// Convertir la vitesse du vent de km/h (déjà en km/h dans Open-Meteo)
export function getWindSpeedKmh(windSpeed: number): number {
  return Math.round(windSpeed)
}

// Obtenir l'intensité des précipitations
export function getPrecipitationIntensity(
  precipitation: number,
  rain?: number,
  snow?: number
): {
  type: 'rain' | 'snow' | 'none'
  intensity: 'Faible' | 'Modérée' | 'Forte'
  value: number
} {
  const value = rain || snow || precipitation || 0

  if (value === 0) {
    return { type: 'none', intensity: 'Faible', value: 0 }
  }

  const type = snow && snow > 0 ? 'snow' : 'rain'

  if (value < 0.5) {
    return { type, intensity: 'Faible', value }
  } else if (value < 2.0) {
    return { type, intensity: 'Modérée', value }
  } else {
    return { type, intensity: 'Forte', value }
  }
}

// Sauvegarder la dernière ville dans localStorage
export function saveLastLocation(lat: number, lon: number, name: string) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('aetheria_last_location', JSON.stringify({ lat, lon, name }))
    } catch (e) {
      console.warn('Impossible de sauvegarder la dernière localisation')
    }
  }
}

// Récupérer la dernière ville depuis localStorage
export function getLastLocation(): { lat: number; lon: number; name: string } | null {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('aetheria_last_location')
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.warn('Impossible de récupérer la dernière localisation')
    }
  }
  return null
}

// Obtenir la géolocalisation de l'utilisateur
export function getUserLocation(): Promise<{ lat: number; lon: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Géolocalisation non supportée par le navigateur')
      resolve(null)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
      },
      (error) => {
        console.warn('Erreur géolocalisation:', error.message)
        resolve(null)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  })
}
