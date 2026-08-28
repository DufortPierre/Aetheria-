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
  // `getInitialLanguage()` lit localStorage/navigator.language, qui n'existent
  // pas côté serveur : l'appeler directement dans l'initialiseur de useState
  // faisait diverger le tout premier rendu client (langue détectée) du rendu
  // serveur (toujours "fr"), et React levait une erreur d'hydratation sur
  // quasiment toutes les visites non francophones. On démarre donc avec le même
  // défaut que le serveur, puis on détecte la vraie langue juste après montage.
  const [language, setLanguageState] = useState<Language>('fr')

  useEffect(() => {
    setLanguageState(getInitialLanguage())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
