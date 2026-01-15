'use client'

import { useState } from 'react'
import { Globe, Sun, Moon, MapPin, Maximize2, Minimize2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { Language } from '@/lib/i18n'

interface MobileActionBarProps {
  onGeolocate: () => void
  onToggleFullscreen: () => void
  isFullscreen: boolean
  isGeolocating: boolean
}

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
]

export default function MobileActionBar({
  onGeolocate,
  onToggleFullscreen,
  isFullscreen,
  isGeolocating,
}: MobileActionBarProps) {
  const { language, setLanguage } = useLanguage()
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)

  const buttonClass = `h-12 w-12 rounded-full ${isDarkMode ? 'glass bg-black/60 shadow-xl' : 'bg-white/95 border border-slate-200 shadow-xl'} backdrop-blur-md flex items-center justify-center ${isDarkMode ? 'hover:bg-white/20' : 'hover:bg-slate-100'} transition-colors active:scale-95`
  const iconClass = `w-5 h-5 ${isDarkMode ? 'text-white' : 'text-slate-700'}`

  return (
    <div className="fixed bottom-[280px] right-4 z-[1000] flex flex-row gap-3 pointer-events-auto md:hidden">
      {/* Bouton Langue */}
      <div className="relative">
        <button
          onClick={() => setIsLanguageOpen(!isLanguageOpen)}
          className={buttonClass}
          aria-label="Select language"
        >
          <Globe className={iconClass} />
        </button>

        {isLanguageOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsLanguageOpen(false)}
            />
            <div className={`absolute bottom-full right-0 mb-2 ${isDarkMode ? 'glass-strong bg-black/40' : 'bg-white border border-slate-200 shadow-xl'} rounded-lg overflow-hidden backdrop-blur-md z-20 min-w-[120px]`}>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code)
                    setIsLanguageOpen(false)
                  }}
                  className={`w-full text-left px-4 py-2 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'} transition-colors flex items-center gap-2 ${
                    language === lang.code 
                      ? isDarkMode 
                        ? 'bg-cyan-500/20 text-cyan-300' 
                        : 'bg-cyan-500/20 text-cyan-700'
                      : isDarkMode
                        ? 'text-white'
                        : 'text-slate-900'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bouton Thème */}
      <button
        onClick={toggleDarkMode}
        className={buttonClass}
        aria-label={isDarkMode ? 'Mode jour' : 'Mode nuit'}
      >
        {isDarkMode ? (
          <Sun className={iconClass} />
        ) : (
          <Moon className={iconClass} />
        )}
      </button>

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
