// Système de traduction simple pour Aetheria

export type Language = 'fr' | 'en' | 'es'

export interface Translations {
  // Interface générale
  searchPlaceholder: string
  clickOnMap: string
  loading: string
  selectLocation: string
  
  // Données météo
  humidity: string
  pressure: string
  wind: string
  visibility: string
  airQuality: string
  airQualityIndex: string
  
  // Qualité de l'air
  good: string
  fair: string
  moderate: string
  poor: string
  veryPoor: string
  excellent: string
  acceptable: string
  sensitive: string
  unhealthy: string
  dangerous: string
  
  // Précipitations
  rain: string
  snow: string
  light: string
  moderateIntensity: string
  heavy: string
  
  // Phénomènes
  fog: string
  hail: string
  thunderstorm: string
  
  // Unités
  kmh: string
  km: string
  mmh: string
  percent: string
  hpa: string
  
  // Erreurs
  errorLoading: string
  noData: string
  
  // Prévisions
  forecast7Days: string
  today: string
  
  // Géolocalisation
  geolocating: string

  // Ressenti, lever/coucher, UV, rafales
  feelsLike: string
  sunrise: string
  sunset: string
  uvIndex: string
  gusts: string

  // Prévisions horaires
  hourlyForecast: string

  // Favoris
  favorites: string
  addToFavorites: string
  removeFromFavorites: string

  // Erreurs / messages
  errorWeatherLoad: string
  errorGeolocationDenied: string
  retry: string
  dismiss: string

  // Unités
  units: string
  celsius: string
  fahrenheit: string

  // Installation PWA
  installTitle: string
  installDescription: string
  installAction: string
}

export const translations: Record<Language, Translations> = {
  fr: {
    searchPlaceholder: 'Rechercher une ville...',
    clickOnMap: '👆 Cliquez sur la carte pour voir la météo',
    loading: 'Chargement...',
    selectLocation: 'Sélectionnez un lieu sur la carte',
    humidity: 'Humidité',
    pressure: 'Pression',
    wind: 'Vent',
    visibility: 'Visibilité',
    airQuality: 'Qualité de l\'air',
    airQualityIndex: 'Qualité de l\'air (AQI)',
    good: 'Bon',
    fair: 'Correct',
    moderate: 'Modéré',
    poor: 'Mauvais',
    veryPoor: 'Très mauvais',
    excellent: 'Qualité de l\'air excellente',
    acceptable: 'Qualité de l\'air acceptable',
    sensitive: 'Sensible aux personnes fragiles',
    unhealthy: 'Mauvais pour la santé',
    dangerous: 'Dangereux pour la santé',
    rain: 'Pluie',
    snow: 'Neige',
    light: 'Faible',
    moderateIntensity: 'Modérée',
    heavy: 'Forte',
    fog: 'Brouillard',
    hail: 'Grêle',
    thunderstorm: 'Orage',
    kmh: 'km/h',
    km: 'km',
    mmh: 'mm/h',
    percent: '%',
    hpa: 'hPa',
    errorLoading: 'Erreur lors du chargement des données',
    noData: 'Aucune donnée disponible',
    forecast7Days: 'Prévisions 7 jours',
    today: "Aujourd'hui",
    geolocating: 'Géolocalisation...',
    feelsLike: 'Ressenti',
    sunrise: 'Lever du soleil',
    sunset: 'Coucher du soleil',
    uvIndex: 'Indice UV',
    gusts: 'Rafales',
    hourlyForecast: 'Prochaines heures',
    favorites: 'Favoris',
    addToFavorites: 'Ajouter aux favoris',
    removeFromFavorites: 'Retirer des favoris',
    errorWeatherLoad: 'Impossible de charger la météo',
    errorGeolocationDenied: 'Géolocalisation refusée ou indisponible',
    retry: 'Réessayer',
    dismiss: 'Fermer',
    units: 'Unités',
    celsius: '°C',
    fahrenheit: '°F',
    installTitle: 'Installer Aetheria',
    installDescription: "Ajoutez l'app à votre écran d'accueil pour un accès rapide.",
    installAction: 'Installer',
  },
  en: {
    searchPlaceholder: 'Search for a city...',
    clickOnMap: '👆 Click on the map to see the weather',
    loading: 'Loading...',
    selectLocation: 'Select a location on the map',
    humidity: 'Humidity',
    pressure: 'Pressure',
    wind: 'Wind',
    visibility: 'Visibility',
    airQuality: 'Air Quality',
    airQualityIndex: 'Air Quality (AQI)',
    good: 'Good',
    fair: 'Fair',
    moderate: 'Moderate',
    poor: 'Poor',
    veryPoor: 'Very Poor',
    excellent: 'Excellent air quality',
    acceptable: 'Acceptable air quality',
    sensitive: 'Sensitive groups may experience effects',
    unhealthy: 'Unhealthy for everyone',
    dangerous: 'Hazardous to health',
    rain: 'Rain',
    snow: 'Snow',
    light: 'Light',
    moderateIntensity: 'Moderate',
    heavy: 'Heavy',
    fog: 'Fog',
    hail: 'Hail',
    thunderstorm: 'Thunderstorm',
    kmh: 'km/h',
    km: 'km',
    mmh: 'mm/h',
    percent: '%',
    hpa: 'hPa',
    errorLoading: 'Error loading data',
    noData: 'No data available',
    forecast7Days: '7-Day Forecast',
    today: 'Today',
    geolocating: 'Geolocating...',
    feelsLike: 'Feels like',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    uvIndex: 'UV Index',
    gusts: 'Gusts',
    hourlyForecast: 'Next hours',
    favorites: 'Favorites',
    addToFavorites: 'Add to favorites',
    removeFromFavorites: 'Remove from favorites',
    errorWeatherLoad: 'Unable to load weather data',
    errorGeolocationDenied: 'Location access denied or unavailable',
    retry: 'Retry',
    dismiss: 'Dismiss',
    units: 'Units',
    celsius: '°C',
    fahrenheit: '°F',
    installTitle: 'Install Aetheria',
    installDescription: 'Add the app to your home screen for quick access.',
    installAction: 'Install',
  },
  es: {
    searchPlaceholder: 'Buscar una ciudad...',
    clickOnMap: '👆 Haz clic en el mapa para ver el clima',
    loading: 'Cargando...',
    selectLocation: 'Selecciona un lugar en el mapa',
    humidity: 'Humedad',
    pressure: 'Presión',
    wind: 'Viento',
    visibility: 'Visibilidad',
    airQuality: 'Calidad del aire',
    airQualityIndex: 'Calidad del aire (AQI)',
    good: 'Bueno',
    fair: 'Regular',
    moderate: 'Moderado',
    poor: 'Malo',
    veryPoor: 'Muy malo',
    excellent: 'Calidad del aire excelente',
    acceptable: 'Calidad del aire aceptable',
    sensitive: 'Sensible para grupos vulnerables',
    unhealthy: 'Malo para la salud',
    dangerous: 'Peligroso para la salud',
    rain: 'Lluvia',
    snow: 'Nieve',
    light: 'Ligera',
    moderateIntensity: 'Moderada',
    heavy: 'Fuerte',
    fog: 'Niebla',
    hail: 'Granizo',
    thunderstorm: 'Tormenta',
    kmh: 'km/h',
    km: 'km',
    mmh: 'mm/h',
    percent: '%',
    hpa: 'hPa',
    errorLoading: 'Error al cargar los datos',
    noData: 'No hay datos disponibles',
    forecast7Days: 'Pronóstico 7 días',
    today: 'Hoy',
    geolocating: 'Geolocalización...',
    feelsLike: 'Sensación térmica',
    sunrise: 'Amanecer',
    sunset: 'Atardecer',
    uvIndex: 'Índice UV',
    gusts: 'Ráfagas',
    hourlyForecast: 'Próximas horas',
    favorites: 'Favoritos',
    addToFavorites: 'Añadir a favoritos',
    removeFromFavorites: 'Quitar de favoritos',
    errorWeatherLoad: 'No se pudo cargar el clima',
    errorGeolocationDenied: 'Geolocalización denegada o no disponible',
    retry: 'Reintentar',
    dismiss: 'Cerrar',
    units: 'Unidades',
    celsius: '°C',
    fahrenheit: '°F',
    installTitle: 'Instalar Aetheria',
    installDescription: 'Añade la app a tu pantalla de inicio para un acceso rápido.',
    installAction: 'Instalar',
  },
}

// Obtenir la langue depuis localStorage ou navigator
export function getInitialLanguage(): Language {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('aetheria_language')
    if (saved && (saved === 'fr' || saved === 'en' || saved === 'es')) {
      return saved as Language
    }
    
    // Détecter la langue du navigateur
    const browserLang = navigator.language.split('-')[0]
    if (browserLang === 'en' || browserLang === 'es') {
      return browserLang as Language
    }
  }
  return 'fr' // Par défaut
}

// Sauvegarder la langue
export function saveLanguage(lang: Language) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('aetheria_language', lang)
  }
}
