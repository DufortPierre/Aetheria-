'use client'

import { useState, useEffect } from 'react'
import MapWrapper from '@/components/MapWrapper'
import WeatherDisplay from '@/components/WeatherDisplay'
import ForecastDisplay from '@/components/ForecastDisplay'
import CitySearch from '@/components/CitySearch'
import LanguageSelector from '@/components/LanguageSelector'
import BottomSheet from '@/components/BottomSheet'
import { 
  getCurrentWeather, 
  getAirQuality,
  getForecast,
  reverseGeocode,
  saveLastLocation,
  getLastLocation,
  getUserLocation,
  WeatherData, 
  AirQualityData,
  ForecastData
} from '@/lib/weatherService'
import { Loader2, Maximize2, Minimize2, MapPin, Sun, Moon, Target, ZoomIn, ZoomOut } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDarkMode } from '@/contexts/DarkModeContext'

export default function Home() {
  const { language, t } = useLanguage()
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [locationName, setLocationName] = useState<string>('')
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null)
  const [forecastData, setForecastData] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(false)
  const [flyToLocation, setFlyToLocation] = useState<{ lat: number; lon: number; zoom?: number } | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isGeolocating, setIsGeolocating] = useState(false)

  // Géolocalisation automatique au démarrage
  useEffect(() => {
    const initializeLocation = async () => {
      // D'abord, essayer de charger la dernière localisation
      const lastLocation = getLastLocation()
      if (lastLocation) {
        handleCitySelect(lastLocation.lat, lastLocation.lon, lastLocation.name, false)
        return
      }

      // Sinon, essayer la géolocalisation
      setIsGeolocating(true)
      const userLocation = await getUserLocation()
      setIsGeolocating(false)

      if (userLocation) {
        await handleLocationClick(userLocation.lat, userLocation.lon, true)
      }
    }

    initializeLocation()
  }, [])

  // Recharger les données météo quand la langue change
  useEffect(() => {
    if (selectedLocation) {
      handleLocationClick(selectedLocation.lat, selectedLocation.lon, false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language])

  // Actualisation automatique des données météo toutes les 5 minutes
  useEffect(() => {
    if (!selectedLocation) return

    const interval = setInterval(() => {
      // Actualiser les données silencieusement (sans loader) toutes les 5 minutes
      handleLocationClick(selectedLocation.lat, selectedLocation.lon, false, false)
    }, 5 * 60 * 1000) // 5 minutes = 300 000 millisecondes

    // Nettoyer l'intervalle quand le composant se démonte ou la localisation change
    return () => clearInterval(interval)
  }, [selectedLocation, language]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleLocationClick = async (lat: number, lon: number, updateLocation = true, showLoading = true) => {
    if (updateLocation) {
      setSelectedLocation({ lat, lon })
    }
    if (showLoading) {
      setLoading(true)
    }

    try {
      // Reverse geocoding pour obtenir le nom de la ville dans la langue sélectionnée
      const cityName = await reverseGeocode(lat, lon, language)
      setLocationName(cityName)

      // Charger les données en parallèle avec la langue
      const [weather, airQuality, forecast] = await Promise.all([
        getCurrentWeather(lat, lon, language),
        getAirQuality(lat, lon),
        getForecast(lat, lon, 7, language),
      ])

      setWeatherData(weather)
      setAirQualityData(airQuality)
      setForecastData(forecast)

      // Sauvegarder la dernière localisation
      if (updateLocation) {
        saveLastLocation(lat, lon, cityName)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }

  const handleCitySelect = async (lat: number, lon: number, name: string, shouldFly = true) => {
    setLocationName(name)
    setSelectedLocation({ lat, lon })
    
    // Faire voler la carte vers la ville sélectionnée
    if (shouldFly) {
      setFlyToLocation({ lat, lon, zoom: 10 })
    }

    setLoading(true)

    try {
      // Charger les données en parallèle avec la langue
      const [weather, airQuality, forecast] = await Promise.all([
        getCurrentWeather(lat, lon, language),
        getAirQuality(lat, lon),
        getForecast(lat, lon, 7, language),
      ])

      setWeatherData(weather)
      setAirQualityData(airQuality)
      setForecastData(forecast)

      // Sauvegarder la dernière localisation
      saveLastLocation(lat, lon, name)
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGeolocate = async () => {
    setIsGeolocating(true)
    const userLocation = await getUserLocation()
    setIsGeolocating(false)

    if (userLocation) {
      await handleLocationClick(userLocation.lat, userLocation.lon, true)
      setFlyToLocation({ lat: userLocation.lat, lon: userLocation.lon, zoom: 12 })
    }
  }

  const handleRecenter = async () => {
    if (selectedLocation) {
      setFlyToLocation({ lat: selectedLocation.lat, lon: selectedLocation.lon, zoom: 12 })
    } else {
      // Si pas de localisation, utiliser la géolocalisation
      await handleGeolocate()
    }
  }

  return (
    <main className={`relative w-screen h-screen ${isDarkMode ? 'bg-[#0b0e14]' : 'bg-slate-100'}`} style={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'visible' }}>
      {/* Carte en arrière-plan */}
      <div 
        className="absolute inset-0 w-full h-full" 
        style={{ 
          height: '100vh', 
          width: '100vw', 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          zIndex: 0,
          overflow: 'visible',
          pointerEvents: 'auto' // Permettre les interactions avec la carte
        }}
      >
        <MapWrapper
          onLocationClick={(lat, lon) => handleLocationClick(lat, lon, true)}
          selectedLocation={selectedLocation}
          flyToLocation={flyToLocation}
          isDarkMode={isDarkMode}
          onGeolocate={handleGeolocate}
          onRecenter={handleRecenter}
          onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          isFullscreen={isFullscreen}
          isGeolocating={isGeolocating}
          showRecenter={!!selectedLocation}
          showActionStack={true} // Toujours true, l'ActionStack gère elle-même l'affichage mobile
        />
      </div>

      {/* BARRE DE RECHERCHE - Mobile et Desktop séparés */}
      {/* Mobile */}
      <div className="md:hidden absolute top-4 left-1/2 transform -translate-x-1/2 z-[9999] w-[calc(100vw-2rem)]">
        <CitySearch onCitySelect={(lat, lon, name) => handleCitySelect(lat, lon, name, true)} />
      </div>
      
      {/* Desktop - Centrée en haut */}
      <div className="hidden md:block absolute top-4 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md">
        <CitySearch onCitySelect={(lat, lon, name) => handleCitySelect(lat, lon, name, true)} />
      </div>

      {/* CONTROLES EN HAUT À DROITE */}
      <div className="absolute top-4 md:top-20 right-2 md:right-4 z-[9999] flex items-center gap-2 md:gap-3">
        {/* Mobile : Langue et Thème sous la barre de recherche */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSelector />
          <button
            onClick={toggleDarkMode}
            className={`${isDarkMode ? 'glass bg-black/40' : 'bg-white/90 border border-slate-200 shadow-lg'} rounded-lg px-2 py-1.5 backdrop-blur-md flex items-center gap-1 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'} transition-colors`}
            aria-label={isDarkMode ? 'Mode jour' : 'Mode nuit'}
          >
            {isDarkMode ? (
              <Sun className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-slate-700'}`} />
            ) : (
              <Moon className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-slate-700'}`} />
            )}
          </button>
        </div>

        {/* Desktop : Titre, Langue, Thème, Géolocalisation, Plein écran */}
        <div className="hidden md:flex items-center gap-3">
          <div className={`${isDarkMode ? 'glass bg-black/40' : 'bg-white/90 border border-slate-200 shadow-lg'} rounded-lg px-6 py-3 backdrop-blur-md`}>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent' : 'bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent'}`}>
              Aetheria
            </h1>
          </div>
          <LanguageSelector />
          <button
            onClick={toggleDarkMode}
            className={`${isDarkMode ? 'glass bg-black/40' : 'bg-white/90 border border-slate-200 shadow-lg'} rounded-lg px-3 py-2 backdrop-blur-md flex items-center gap-2 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'} transition-colors`}
            aria-label={isDarkMode ? 'Mode jour' : 'Mode nuit'}
          >
            {isDarkMode ? (
              <Sun className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-slate-700'}`} />
            ) : (
              <Moon className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-slate-700'}`} />
            )}
          </button>
          <button
            onClick={handleGeolocate}
            disabled={isGeolocating}
            className={`rounded-lg px-3 py-2 ${isDarkMode ? 'glass bg-black/40' : 'bg-white/90 border border-slate-200 shadow-lg'} backdrop-blur-md flex items-center gap-2 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'} transition-colors disabled:opacity-50`}
            aria-label="Géolocalisation"
          >
            <MapPin className={`w-4 h-4 ${isGeolocating ? 'animate-pulse' : ''} ${isDarkMode ? 'text-white' : 'text-slate-700'}`} />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`rounded-lg px-3 py-2 ${isDarkMode ? 'glass bg-black/40' : 'bg-white/90 border border-slate-200 shadow-lg'} backdrop-blur-md flex items-center gap-2 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'} transition-colors`}
            aria-label={isFullscreen ? 'Quitter le mode plein écran' : 'Mode plein écran'}
          >
            {isFullscreen ? (
              <Minimize2 className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-slate-700'}`} />
            ) : (
              <Maximize2 className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-slate-700'}`} />
            )}
          </button>
        </div>
      </div>

      {/* BOTTOM SHEET - Mobile uniquement */}
      <div className="md:hidden">
        {!isFullscreen && (
          <BottomSheet isOpen={true} defaultHeight={35}>
            <div className="space-y-3">
              <WeatherDisplay
                weatherData={weatherData}
                airQualityData={airQualityData}
                loading={loading}
                locationName={locationName}
              />
              
              {forecastData && (
                <ForecastDisplay
                  forecastData={forecastData}
                  loading={loading}
                />
              )}
            </div>
          </BottomSheet>
        )}
      </div>

      {/* ACTION STACK - Mobile uniquement (rendue dans Map pour accéder à useMap) */}
      {/* L'ActionStack est rendue dans Map.tsx avec showActionStack */}

      {/* PANNEAUX LATÉRAUX - Desktop uniquement */}
      <div 
        className="hidden md:block absolute top-20 left-4 z-[9999] max-h-[calc(100vh-6rem)] overflow-y-auto space-y-4" 
        style={{ 
          pointerEvents: 'none',
        }}
      >
        <div style={{ pointerEvents: 'auto' }} className="w-full max-w-[420px]">
          <WeatherDisplay
            weatherData={weatherData}
            airQualityData={airQualityData}
            loading={loading}
            locationName={locationName}
          />
        </div>
        
        {forecastData && (
          <div style={{ pointerEvents: 'auto' }} className="w-full max-w-[420px]">
            <ForecastDisplay
              forecastData={forecastData}
              loading={loading}
            />
          </div>
        )}
      </div>

      {/* Indicateur de chargement global */}
      {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[500] pointer-events-none">
          <div className="glass-strong rounded-full p-4 backdrop-blur-md">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
        </div>
      )}

      {/* Indicateur de géolocalisation - Responsive */}
      {isGeolocating && (
        <div className="absolute top-16 sm:top-20 right-2 sm:right-4 z-[500] pointer-events-none">
          <div className="glass-strong rounded-lg p-2 sm:p-3 backdrop-blur-md">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
              <span>{t.geolocating}</span>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}
