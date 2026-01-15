'use client'

import { useMap } from 'react-leaflet'
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Target, MapPin } from 'lucide-react'
import { useDarkMode } from '@/contexts/DarkModeContext'

interface MapActionStackProps {
  onGeolocate?: () => void
  onRecenter?: () => void
  onToggleFullscreen?: () => void
  isFullscreen?: boolean
  isGeolocating?: boolean
  showRecenter?: boolean
  isMobile?: boolean
}

export function MapActionStack({
  onGeolocate,
  onRecenter,
  onToggleFullscreen,
  isFullscreen = false,
  isGeolocating = false,
  showRecenter = false,
  isMobile = false,
}: MapActionStackProps) {
  const map = useMap()
  const { isDarkMode } = useDarkMode()

  const handleZoomIn = () => {
    if (map) {
      map.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (map) {
      map.zoomOut()
    }
  }

  const buttonClass = `rounded-full w-12 h-12 ${isDarkMode ? 'glass bg-black/60 shadow-xl' : 'bg-white/95 border border-slate-200 shadow-xl'} backdrop-blur-md flex items-center justify-center ${isDarkMode ? 'hover:bg-white/20' : 'hover:bg-slate-100'} transition-colors active:scale-95`
  const iconClass = `w-5 h-5 ${isDarkMode ? 'text-white' : 'text-slate-700'}`

  if (!isMobile) {
    // Sur desktop, on ne montre pas cette stack (les boutons sont ailleurs)
    return null
  }

  return (
    <div className="fixed bottom-40 right-4 z-[450] flex flex-col gap-3 pointer-events-auto">
      {/* Bouton Plein Écran */}
      <button
        onClick={onToggleFullscreen}
        className={buttonClass}
        aria-label={isFullscreen ? 'Quitter le mode plein écran' : 'Mode plein écran'}
      >
        {isFullscreen ? (
          <Minimize2 className={iconClass} />
        ) : (
          <Maximize2 className={iconClass} />
        )}
      </button>

      {/* Bouton Recentrer (Ma Position) */}
      {showRecenter && onRecenter && (
        <button
          onClick={onRecenter}
          className={buttonClass}
          aria-label="Recentrer la carte"
        >
          <Target className={iconClass} />
        </button>
      )}

      {/* Bouton Géolocalisation */}
      {onGeolocate && (
        <button
          onClick={onGeolocate}
          disabled={isGeolocating}
          className={`${buttonClass} ${isGeolocating ? 'opacity-50' : ''}`}
          aria-label="Géolocalisation"
        >
          <MapPin className={`${iconClass} ${isGeolocating ? 'animate-pulse' : ''}`} />
        </button>
      )}

      {/* Bouton Zoom In */}
      <button
        onClick={handleZoomIn}
        className={buttonClass}
        aria-label="Zoom in"
      >
        <ZoomIn className={iconClass} />
      </button>

      {/* Bouton Zoom Out */}
      <button
        onClick={handleZoomOut}
        className={buttonClass}
        aria-label="Zoom out"
      >
        <ZoomOut className={iconClass} />
      </button>
    </div>
  )
}
