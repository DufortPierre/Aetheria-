'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, getInitialLanguage, saveLanguage, translations } from '@/lib/i18n'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: typeof translations.fr
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage)

  useEffect(() => {
    // Sauvegarder la langue à chaque changement
    saveLanguage(language)
  }, [language])

  // Garder <html lang="..."> synchronisé avec la langue choisie : la balise est
  // codée en dur côté serveur (rendu initial), donc c'est ici qu'on la met à jour
  // pour l'accessibilité (lecteurs d'écran) et le SEO à chaque changement.
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  const value = {
    language,
    setLanguage,
    t: translations[language],
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
