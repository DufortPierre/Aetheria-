'use client'

import { useState, useEffect } from 'react'
import MapWrapper from '@/components/MapWrapper'
import WeatherDisplay from '@/components/WeatherDisplay'
import ForecastDisplay from '@/components/ForecastDisplay'
import CitySearch from '@/components/CitySearch'
import LanguageSelector from '@/components/LanguageSelector'
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
import { Loader2, Maximize2, Minimize2, MapPin, Sun, Moon } from 'lucide-react'
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
        />
      </div>

      {/* Barre de recherche en haut - Responsive */}
      {!isFullscreen && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[400] w-[calc(100%-2rem)] max-w-md sm:max-w-lg md:max-w-md px-4 sm:px-0">
          <CitySearch onCitySelect={(lat, lon, name) => handleCitySelect(lat, lon, name, true)} />
        </div>
      )}

      {/* Titre de l'application et contrôles - Responsive */}
      <div className="absolute top-4 right-2 sm:right-4 z-[400] flex items-center gap-1.5 sm:gap-3 flex-wrap justify-end max-w-[calc(100%-1rem)]">
        {!isFullscreen && (
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>
        )}
        
        {/* Bouton bascule jour/nuit */}
        <button
          onClick={toggleDarkMode}
          className={`${isDarkMode ? 'glass bg-black/40' : 'bg-white/90 border border-slate-200 shadow-lg'} rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 backdrop-blur-md flex items-center gap-1 sm:gap-2 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'} transition-colors`}
          aria-label={isDarkMode ? 'Mode jour' : 'Mode nuit'}
        >
          {isDarkMode ? (
            <Sun className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDarkMode ? 'text-white' : 'text-slate-700'}`} />
          ) : (
            <Moon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDarkMode ? 'text-white' : 'text-slate-700'}`} />
          )}
        </button>
        
        {/* Bouton géolocalisation */}
        <button
          onClick={handleGeolocate}
          disabled={isGeolocating}
          className={`${isDarkMode ? 'glass bg-black/40' : 'bg-white/90 border border-slate-200 shadow-lg'} rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 backdrop-blur-md flex items-center gap-1 sm:gap-2 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'} transition-colors disabled:opacity-50`}
          aria-label="Géolocalisation"
        >
          <MapPin className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isGeolocating ? 'animate-pulse' : ''} ${isDarkMode ? 'text-white' : 'text-slate-700'}`} />
        </button>

        {/* Bouton mode plein écran */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className={`${isDarkMode ? 'glass bg-black/40' : 'bg-white/90 border border-slate-200 shadow-lg'} rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 backdrop-blur-md flex items-center gap-1 sm:gap-2 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'} transition-colors`}
          aria-label={isFullscreen ? 'Quitter le mode plein écran' : 'Mode plein écran'}
        >
          {isFullscreen ? (
            <Minimize2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDarkMode ? 'text-white' : 'text-slate-700'}`} />
          ) : (
            <Maximize2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDarkMode ? 'text-white' : 'text-slate-700'}`} />
          )}
        </button>

        {!isFullscreen && (
          <>
            {/* Sélecteur de langue mobile (visible uniquement sur mobile) */}
            <div className="sm:hidden">
              <LanguageSelector />
            </div>
            
            {/* Titre - Responsive */}
            <div className={`${isDarkMode ? 'glass bg-black/40' : 'bg-white/90 border border-slate-200 shadow-lg'} rounded-lg px-3 sm:px-6 py-1.5 sm:py-3 backdrop-blur-md hidden sm:block`}>
              <h1 className={`text-lg sm:text-2xl font-bold ${isDarkMode ? 'bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent' : 'bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent'}`}>
                Aetheria
              </h1>
            </div>
          </>
        )}
      </div>

      {/* Panneaux latéraux avec les informations météo - Responsive */}
      {!isFullscreen && (
        <div 
          className="absolute top-16 sm:top-20 left-0 sm:left-4 right-0 sm:right-auto bottom-0 sm:bottom-auto z-[400] max-h-[calc(100vh-4.5rem)] sm:max-h-[calc(100vh-6rem)] overflow-y-auto space-y-3 sm:space-y-4 px-2 sm:px-0 pb-2 sm:pb-0" 
          style={{ 
            position: 'relative', 
            zIndex: 50,
            pointerEvents: 'none', // Laisser passer les clics vers la carte
            maxWidth: '100%',
            // Sur mobile, les panneaux prennent toute la largeur en bas
            // Sur desktop, ils restent à gauche avec une largeur limitée
          }}
        >
          <div style={{ pointerEvents: 'auto' }} className="w-full sm:max-w-[420px]">
            <WeatherDisplay
              weatherData={weatherData}
              airQualityData={airQualityData}
              loading={loading}
              locationName={locationName}
            />
          </div>
          
          {forecastData && (
            <div style={{ pointerEvents: 'auto' }} className="w-full sm:max-w-[420px]">
              <ForecastDisplay
                forecastData={forecastData}
                loading={loading}
              />
            </div>
          )}
        </div>
      )}

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
