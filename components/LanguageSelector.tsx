'use client'

import { useState } from 'react'
import { Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { Language } from '@/lib/i18n'

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
]

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const { isDarkMode } = useDarkMode()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isDarkMode ? 'glass bg-black/40' : 'bg-white/90 border border-slate-200 shadow-lg'} rounded-lg px-3 py-2 backdrop-blur-md flex items-center gap-2 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'} transition-colors`}
        aria-label="Select language"
      >
        <Globe className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-slate-700'}`} />
        <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          {languages.find(l => l.code === language)?.flag} {language.toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute top-full right-0 mt-2 ${isDarkMode ? 'glass-strong bg-black/40' : 'bg-white border border-slate-200 shadow-xl'} rounded-lg overflow-hidden backdrop-blur-md z-20 min-w-[120px]`}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code)
                  setIsOpen(false)
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
  )
}
