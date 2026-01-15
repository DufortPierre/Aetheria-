'use client'

import { Calendar, Wind, CloudRain } from 'lucide-react'
import { ForecastData, WEATHER_CODES } from '@/lib/weatherService'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDarkMode } from '@/contexts/DarkModeContext'

interface ForecastDisplayProps {
  forecastData: ForecastData | null
  loading?: boolean
}

export default function ForecastDisplay({ forecastData, loading }: ForecastDisplayProps) {
  const { language, t } = useLanguage()
  const { isDarkMode } = useDarkMode()

  if (loading) {
    return (
      <div className={`${isDarkMode ? 'glass-strong bg-black/40' : 'bg-white/80 border border-slate-200 shadow-xl'} rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-md ${isDarkMode ? 'backdrop-blur-md' : 'backdrop-blur-lg'}`}>
        <div className="animate-pulse space-y-2 sm:space-y-3">
          <div className="h-5 sm:h-6 bg-white/10 rounded w-1/3"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 sm:h-16 bg-white/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!forecastData || !forecastData.daily) {
    return null
  }

  const { daily } = forecastData

  // Obtenir les 7 prochains jours (en excluant aujourd'hui si on veut)
  const forecastDays = daily.time.slice(0, 7).map((time, index) => ({
    date: new Date(time),
    weatherCode: daily.weather_code[index],
    tempMax: daily.temperature_2m_max[index],
    tempMin: daily.temperature_2m_min[index],
    precipitation: daily.precipitation_sum[index],
    windSpeed: daily.wind_speed_10m_max[index],
    windDirection: daily.wind_direction_10m_dominant[index],
  }))

  return (
    <div className={`${isDarkMode ? 'glass-strong bg-black/40' : 'bg-white/80 border border-slate-200 shadow-xl'} rounded-xl md:rounded-2xl p-4 md:p-6 w-full max-w-md ${isDarkMode ? 'backdrop-blur-md' : 'backdrop-blur-lg'}`}>
      <div className="flex items-center gap-2 mb-2 md:mb-3">
        <Calendar className={`w-4 h-4 md:w-5 md:h-5 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
        <h3 className={`text-base md:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.forecast7Days}</h3>
      </div>

      <div className="space-y-1.5 md:space-y-3">
        {forecastDays.map((day, index) => {
          const weatherInfo = WEATHER_CODES[day.weatherCode] || {
            label: 'Inconnu',
            emoji: '☁️',
          }

          const isToday = index === 0
          const dayName = isToday
            ? t.today
            : day.date.toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : 'en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })

          return (
            <div
              key={day.date.toISOString()}
              className={`p-2 md:p-3 rounded-lg border ${
                isToday 
                  ? isDarkMode 
                    ? 'border-cyan-500/30 bg-cyan-500/10' 
                    : 'border-cyan-500/40 bg-cyan-500/20'
                  : isDarkMode
                    ? 'bg-white/10 border-white/10'
                    : 'bg-slate-100/70 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-1.5 md:gap-2">
                <div className="flex items-center gap-1.5 md:gap-3 flex-1 min-w-0">
                  <div className="text-lg md:text-2xl flex-shrink-0">{weatherInfo.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-xs md:text-sm ${isToday ? 'text-cyan-300' : isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {dayName}
                    </p>
                    <p className={`text-[9px] md:text-xs truncate ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>{weatherInfo.label}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 md:gap-4 flex-shrink-0">
                  {/* Températures */}
                  <div className="text-right">
                    <p className={`text-xs md:text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {Math.round(day.tempMax)}°/{Math.round(day.tempMin)}°
                    </p>
                  </div>

                  {/* Précipitations */}
                  {day.precipitation > 0 && (
                    <div className={`flex items-center gap-0.5 md:gap-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      <CloudRain className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="text-[9px] md:text-xs">{day.precipitation.toFixed(1)}mm</span>
                    </div>
                  )}

                  {/* Vent */}
                  <div className={`flex items-center gap-0.5 md:gap-1 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    <Wind className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="text-[9px] md:text-xs">{Math.round(day.windSpeed)}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
