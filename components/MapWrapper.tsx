'use client'

import dynamic from 'next/dynamic'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDarkMode } from '@/contexts/DarkModeContext'

// Import dynamique de la carte
const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#0b0e14] flex items-center justify-center" style={{ height: '100%', width: '100%' }}>
      <div className="text-white/60">Chargement de la carte...</div>
    </div>
  ),
})

interface MapWrapperProps {
  onLocationClick: (lat: number, lon: number) => void
  selectedLocation?: { lat: number; lon: number } | null
  flyToLocation?: { lat: number; lon: number; zoom?: number } | null
  isDarkMode?: boolean
  onGeolocate?: () => void
  onRecenter?: () => void
  onToggleFullscreen?: () => void
  isFullscreen?: boolean
  isGeolocating?: boolean
  showRecenter?: boolean
}

export default function MapWrapper({ 
  onLocationClick, 
  selectedLocation, 
  flyToLocation, 
  isDarkMode: isDarkModeProp = true,
  onGeolocate,
  onRecenter,
  onToggleFullscreen,
  isFullscreen = false,
  isGeolocating = false,
  showRecenter = false
}: MapWrapperProps) {
  const { t } = useLanguage()
  const { isDarkMode: isDarkModeContext } = useDarkMode()
  const isDarkMode = isDarkModeProp ?? isDarkModeContext

  return (
    <div 
      className="w-full h-full relative" 
      style={{ 
        height: '100vh', 
        width: '100vw', 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        overflow: 'visible', // Permet à la carte de s'afficher correctement
        pointerEvents: 'auto' // Permettre les interactions avec la carte
      }}
    >
      <Map
        onLocationClick={onLocationClick}
        selectedLocation={selectedLocation}
        flyToLocation={flyToLocation}
        isDarkMode={isDarkMode}
        onGeolocate={onGeolocate}
        onRecenter={onRecenter}
        onToggleFullscreen={onToggleFullscreen}
        isFullscreen={isFullscreen}
        isGeolocating={isGeolocating}
        showRecenter={showRecenter}
      />
      {/* Instructions traduites */}
      <div className="absolute bottom-4 left-4 z-[1000] pointer-events-none">
        <div className={`${isDarkMode ? 'glass bg-black/40' : 'bg-white/70'} rounded-lg p-3 backdrop-blur-md`}>
          <p className={`text-sm ${isDarkMode ? 'text-white/70' : 'text-slate-900/80'}`}>
            {t.clickOnMap}
          </p>
        </div>
      </div>
    </div>
  )
}
