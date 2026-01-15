'use client'

import { Maximize2, Minimize2, MapPin } from 'lucide-react'
import { useDarkMode } from '@/contexts/DarkModeContext'

interface MapActionStackProps {
  onGeolocate?: () => void
  onToggleFullscreen?: () => void
  isFullscreen?: boolean
  isGeolocating?: boolean
  isMobile?: boolean
}

export function MapActionStack({
  onGeolocate,
  onToggleFullscreen,
  isFullscreen = false,
  isGeolocating = false,
  isMobile = false,
}: MapActionStackProps) {
  const { isDarkMode } = useDarkMode()

  const buttonClass = `rounded-full w-12 h-12 ${isDarkMode ? 'glass bg-black/60 shadow-xl' : 'bg-white/95 border border-slate-200 shadow-xl'} backdrop-blur-md flex items-center justify-center ${isDarkMode ? 'hover:bg-white/20' : 'hover:bg-slate-100'} transition-colors active:scale-95`
  const iconClass = `w-5 h-5 ${isDarkMode ? 'text-white' : 'text-slate-700'}`

  // Cette stack est uniquement pour mobile
  if (!isMobile) {
    return null
  }

  return (
    <div className="fixed bottom-[180px] right-4 z-[1000] flex flex-row gap-4 pointer-events-auto md:hidden">
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

      {/* Bouton Plein Écran */}
      {onToggleFullscreen && (
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
      )}
    </div>
  )
}
