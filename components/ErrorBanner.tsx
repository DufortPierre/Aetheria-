'use client'

import { AlertTriangle, X, RotateCw } from 'lucide-react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { useLanguage } from '@/contexts/LanguageContext'

interface ErrorBannerProps {
  message: string
  onRetry?: () => void
  onDismiss: () => void
}

export default function ErrorBanner({ message, onRetry, onDismiss }: ErrorBannerProps) {
  const { isDarkMode } = useDarkMode()
  const { t } = useLanguage()

  return (
    <div className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-[9998] w-[calc(100vw-2rem)] max-w-md pointer-events-auto">
      <div
        className={`flex items-center gap-3 rounded-xl p-3 sm:p-4 backdrop-blur-md shadow-xl border ${
          isDarkMode
            ? 'bg-red-950/70 border-red-500/30 glass-strong'
            : 'bg-red-50 border-red-200'
        }`}
      >
        <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
        <p className={`flex-1 text-xs sm:text-sm ${isDarkMode ? 'text-red-100' : 'text-red-800'}`}>{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className={`flex items-center gap-1 text-xs sm:text-sm font-medium px-2 py-1 rounded-md flex-shrink-0 transition-colors ${
              isDarkMode ? 'text-red-200 hover:bg-red-500/20' : 'text-red-700 hover:bg-red-100'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            {t.retry}
          </button>
        )}
        <button
          onClick={onDismiss}
          aria-label={t.dismiss}
          className={`flex-shrink-0 p-1 rounded-md transition-colors ${
            isDarkMode ? 'text-red-300 hover:bg-red-500/20' : 'text-red-600 hover:bg-red-100'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
