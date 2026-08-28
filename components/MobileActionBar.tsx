'use client'

import { MapPin, Maximize2, Minimize2 } from 'lucide-react'
import { useDarkMode } from '@/contexts/DarkModeContext'

interface MobileActionBarProps {
  onGeolocate: () => void
  onToggleFullscreen: () => void
  isFullscreen: boolean
  isGeolocating: boolean
  // Hauteur courante du BottomSheet, en % de la hauteur d'écran. Les boutons se
  // calent toujours juste au-dessus du panneau (au lieu d'un décalage fixe en
  // pixels qui se décorrélait dès qu'on glissait le panneau ou changeait de
  // taille d'écran, et finissait par flotter au milieu de l'écran).
  sheetHeight: number
}

// Actions liées à la carte uniquement (Géolocalisation, Plein écran). Les
// réglages généraux (langue, thème, unités) sont dans MobileTopControls, en
// haut à côté de la recherche.
export default function MobileActionBar({
  onGeolocate,
  onToggleFullscreen,
  isFullscreen,
  isGeolocating,
  sheetHeight,
}: MobileActionBarProps) {
  const { isDarkMode } = useDarkMode()

  const buttonClass = `h-12 w-12 rounded-full ${isDarkMode ? 'glass bg-black/60 shadow-xl' : 'bg-white/95 border border-slate-200 shadow-xl'} backdrop-blur-md flex items-center justify-center ${isDarkMode ? 'hover:bg-white/20' : 'hover:bg-slate-100'} transition-colors active:scale-95`
  const iconClass = `w-5 h-5 ${isDarkMode ? 'text-white' : 'text-slate-700'}`

  return (
    <div
      className="fixed right-4 z-[1000] flex flex-col gap-3 pointer-events-auto md:hidden transition-[bottom] duration-200 ease-out"
      style={{ bottom: `calc(${sheetHeight}vh + 1rem)` }}
    >
      {/* Bouton Géolocalisation */}
      <button
        onClick={onGeolocate}
        disabled={isGeolocating}
        className={`${buttonClass} ${isGeolocating ? 'opacity-50' : ''}`}
        aria-label="Géolocalisation"
      >
        <MapPin className={`${iconClass} ${isGeolocating ? 'animate-pulse' : ''}`} />
      </button>

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
    </div>
  )
}
