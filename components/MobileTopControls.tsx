'use client'

import { useState } from 'react'
import { Globe, Sun, Moon } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { useUnits } from '@/contexts/UnitsContext'
import { Language } from '@/lib/i18n'

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
]

// Réglages peu fréquents (langue, thème, unités) : groupés en haut à droite, à
// côté de la recherche, plutôt que mélangés avec les actions de carte en bas —
// voir MobileActionBar pour Géolocalisation/Plein écran.
export default function MobileTopControls() {
  const { language, setLanguage } = useLanguage()
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const { temperatureUnit, toggleUnits } = useUnits()
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)

  const buttonClass = `h-11 w-11 flex-shrink-0 rounded-full ${isDarkMode ? 'glass bg-black/60 shadow-xl' : 'bg-white/95 border border-slate-200 shadow-xl'} backdrop-blur-md flex items-center justify-center ${isDarkMode ? 'hover:bg-white/20' : 'hover:bg-slate-100'} transition-colors active:scale-95`
  const iconClass = `w-4 h-4 ${isDarkMode ? 'text-white' : 'text-slate-700'}`

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {/* Unités */}
      <button
        onClick={toggleUnits}
        className={buttonClass}
        aria-label="Toggle units"
      >
        <span className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>
          {temperatureUnit === 'fahrenheit' ? '°F' : '°C'}
        </span>
      </button>

      {/* Thème */}
      <button
        onClick={toggleDarkMode}
        className={buttonClass}
        aria-label={isDarkMode ? 'Mode jour' : 'Mode nuit'}
      >
        {isDarkMode ? <Sun className={iconClass} /> : <Moon className={iconClass} />}
      </button>

      {/* Langue */}
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
            <div className="fixed inset-0 z-10" onClick={() => setIsLanguageOpen(false)} />
            <div className={`absolute top-full right-0 mt-2 ${isDarkMode ? 'glass-strong bg-black/40' : 'bg-white border border-slate-200 shadow-xl'} rounded-lg overflow-hidden backdrop-blur-md z-20 min-w-[120px]`}>
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
    </div>
  )
}
