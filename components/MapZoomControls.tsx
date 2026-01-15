'use client'

import { useMap } from 'react-leaflet'
import { ZoomIn, ZoomOut } from 'lucide-react'
import { useDarkMode } from '@/contexts/DarkModeContext'

interface MapZoomControlsProps {
  className?: string
}

export function MapZoomControls({ className = '' }: MapZoomControlsProps) {
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

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <button
        onClick={handleZoomIn}
        className={`rounded-full w-12 h-12 ${isDarkMode ? 'glass bg-black/60 shadow-xl' : 'bg-white/95 border border-slate-200 shadow-xl'} backdrop-blur-md flex items-center justify-center ${isDarkMode ? 'hover:bg-white/20' : 'hover:bg-slate-100'} transition-colors active:scale-95`}
        aria-label="Zoom in"
      >
        <ZoomIn className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-slate-700'}`} />
      </button>
      <button
        onClick={handleZoomOut}
        className={`rounded-full w-12 h-12 ${isDarkMode ? 'glass bg-black/60 shadow-xl' : 'bg-white/95 border border-slate-200 shadow-xl'} backdrop-blur-md flex items-center justify-center ${isDarkMode ? 'hover:bg-white/20' : 'hover:bg-slate-100'} transition-colors active:scale-95`}
        aria-label="Zoom out"
      >
        <ZoomOut className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-slate-700'}`} />
      </button>
    </div>
  )
}
