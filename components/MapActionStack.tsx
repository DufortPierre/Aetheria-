'use client'

import { Maximize2, Minimize2 } from 'lucide-react'
import { useDarkMode } from '@/contexts/DarkModeContext'

interface MapActionStackProps {
  onToggleFullscreen?: () => void
  isFullscreen?: boolean
  isMobile?: boolean
}

export function MapActionStack({
  onToggleFullscreen,
  isFullscreen = false,
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
    <div className="fixed bottom-32 right-4 z-[9999] flex flex-col gap-2 pointer-events-auto md:hidden">
      {/* Bouton Plein Écran uniquement (essentiel pour quitter le mode plein écran) */}
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
