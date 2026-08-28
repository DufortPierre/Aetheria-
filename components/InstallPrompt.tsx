'use client'

import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { useLanguage } from '@/contexts/LanguageContext'

const DISMISSED_KEY = 'aetheria_install_dismissed'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  const nav = window.navigator as Navigator & { standalone?: boolean }
  return window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true
}

export default function InstallPrompt() {
  const { isDarkMode } = useDarkMode()
  const { t } = useLanguage()
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isStandalone() || localStorage.getItem(DISMISSED_KEY) === 'true') {
      return
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setVisible(true)
    }

    const handleAppInstalled = () => {
      setVisible(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const dismiss = () => {
    setVisible(false)
    localStorage.setItem(DISMISSED_KEY, 'true')
  }

  const install = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setVisible(false)
  }

  if (!visible) return null

  return (
    // Se cale au-dessus du BottomSheet via la variable CSS qu'il écrit
    // directement (--aetheria-sheet-height, voir components/BottomSheet.tsx) —
    // le fallback à 0px couvre le desktop (pas de panneau) et le plein écran.
    // `md:bottom-6` prend le relais sur desktop.
    <div className="fixed left-4 right-[4.75rem] z-[9997] max-w-sm pointer-events-auto bottom-[calc(var(--aetheria-sheet-height,0px)+1rem)] md:left-6 md:right-auto md:bottom-6 md:w-full md:max-w-xs">
      <div
        className={`flex items-center gap-3 rounded-xl p-3 sm:p-4 backdrop-blur-md shadow-2xl border ${
          isDarkMode ? 'glass-strong bg-black/60 border-white/10' : 'bg-white border-slate-200'
        }`}
      >
        <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-cyan-400 to-blue-500 text-xl">
          🌤️
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {t.installTitle}
          </p>
          <p className={`text-[11px] sm:text-xs ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
            {t.installDescription}
          </p>
        </div>
        <button
          onClick={install}
          className="flex-shrink-0 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:opacity-90 transition-opacity flex items-center gap-1"
        >
          <Download className="w-3.5 h-3.5" />
          {t.installAction}
        </button>
        <button
          onClick={dismiss}
          aria-label={t.dismiss}
          className={`flex-shrink-0 p-1 rounded-md transition-colors ${
            isDarkMode ? 'text-white/50 hover:bg-white/10' : 'text-slate-400 hover:bg-slate-100'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
