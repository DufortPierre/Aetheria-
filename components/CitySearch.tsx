'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, Loader2 } from 'lucide-react'
import { searchCity, GeocodingResult } from '@/lib/weatherService'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDarkMode } from '@/contexts/DarkModeContext'

interface CitySearchProps {
  onCitySelect: (lat: number, lon: number, name: string) => void
}

export default function CitySearch({ onCitySelect }: CitySearchProps) {
  const { language, t } = useLanguage()
  const { isDarkMode } = useDarkMode()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeocodingResult[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Délai pour éviter trop de requêtes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (query.length < 1) {
      setResults([])
      setIsOpen(false)
      return
    }

    timeoutRef.current = setTimeout(async () => {
      setLoading(true)
      const cities = await searchCity(query, language)
      setResults(cities)
      setIsOpen(cities.length > 0)
      setLoading(false)
    }, 300)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [query, language])

  // Fermer les résultats en cliquant à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (city: GeocodingResult) => {
    onCitySelect(city.latitude, city.longitude, city.name)
    setQuery(city.name)
    setIsOpen(false)
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className={`absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`} />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true)
          }}
          onKeyDown={(e) => {
            // Validation par la touche Entrée
            if (e.key === 'Enter' && results.length > 0) {
              handleSelect(results[0])
            }
          }}
          placeholder={t.searchPlaceholder}
          className={`w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-3 text-sm sm:text-base ${isDarkMode ? 'bg-white/10 border-white/20 text-white placeholder-white/50' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-600 shadow-lg'} backdrop-blur-md border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? 'focus:ring-cyan-400/50 focus:border-cyan-400/50' : 'focus:ring-cyan-500/50 focus:border-cyan-500/50'} transition-all`}
        />
        {loading && (
          <Loader2 className={`absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDarkMode ? 'text-white/60' : 'text-slate-600'} animate-spin`} />
        )}
      </div>

      {/* Résultats de recherche */}
      {isOpen && results.length > 0 && (
        <div className={`absolute top-full mt-2 w-full ${isDarkMode ? 'glass-strong bg-black/40' : 'bg-white border border-slate-200 shadow-xl'} rounded-lg overflow-hidden backdrop-blur-md z-50 max-h-64 overflow-y-auto`}>
          {results.map((city) => (
            <button
              key={city.id}
              onClick={() => handleSelect(city)}
              className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'} transition-colors flex items-center gap-2 sm:gap-3`}
            >
              <MapPin className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'} flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className={`text-xs sm:text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{city.name}</p>
                {(city.admin1 || city.country) && (
                  <p className={`text-[10px] sm:text-xs truncate ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
                    {city.admin1 && `${city.admin1}${city.country ? ', ' : ''}`}
                    {city.country}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.length >= 1 && !loading && results.length === 0 && (
        <div className={`absolute top-full mt-2 w-full ${isDarkMode ? 'glass-strong bg-black/40' : 'bg-white border border-slate-200 shadow-xl'} rounded-lg p-3 sm:p-4 backdrop-blur-md z-50`}>
          <p className={`text-xs sm:text-sm text-center ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>{t.noData}</p>
        </div>
      )}
    </div>
  )
}
