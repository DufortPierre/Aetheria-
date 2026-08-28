'use client'

import { Droplets } from 'lucide-react'
import { HourlyForecastData, WEATHER_CODES } from '@/lib/weatherService'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { useUnits } from '@/contexts/UnitsContext'
import { formatTemperature } from '@/lib/weatherService'

interface HourlyForecastProps {
  hourlyData: HourlyForecastData | null
  loading?: boolean
}

export default function HourlyForecast({ hourlyData, loading }: HourlyForecastProps) {
  const { language, t } = useLanguage()
  const { isDarkMode } = useDarkMode()
  const { temperatureUnit } = useUnits()

  if (loading) {
    return (
      <div className={`${isDarkMode ? 'glass-strong bg-black/40' : 'bg-white/80 border border-slate-200 shadow-xl'} rounded-xl sm:rounded-2xl p-4 w-full max-w-md ${isDarkMode ? 'backdrop-blur-md' : 'backdrop-blur-lg'}`}>
        <div className="animate-pulse flex gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 w-14 bg-white/10 rounded flex-shrink-0" />
          ))}
        </div>
      </div>
    )
  }

  if (!hourlyData || !hourlyData.hourly) {
    return null
  }

  const { hourly } = hourlyData

  return (
    <div className={`${isDarkMode ? 'glass-strong bg-black/40' : 'bg-white/80 border border-slate-200 shadow-xl'} rounded-xl md:rounded-2xl p-4 w-full max-w-md ${isDarkMode ? 'backdrop-blur-md' : 'backdrop-blur-lg'}`}>
      <h3 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white/80' : 'text-slate-900'}`}>
        {t.hourlyForecast}
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
        {hourly.time.map((time, index) => {
          const weatherInfo = WEATHER_CODES[hourly.weather_code[index]] || { label: '', emoji: '☁️' }
          const hour = new Date(time).toLocaleTimeString(
            language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : 'en-US',
            { hour: '2-digit' }
          )
          const precipProbability = hourly.precipitation_probability?.[index] ?? 0

          return (
            <div key={time} className="flex flex-col items-center gap-1 flex-shrink-0 w-12">
              <span className={`text-[10px] ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>{hour}</span>
              <span className="text-xl">{weatherInfo.emoji}</span>
              <span className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {formatTemperature(hourly.temperature_2m[index], temperatureUnit)}°
              </span>
              {precipProbability > 0 && (
                <span className={`flex items-center gap-0.5 text-[9px] ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  <Droplets className="w-2.5 h-2.5" />
                  {precipProbability}%
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
