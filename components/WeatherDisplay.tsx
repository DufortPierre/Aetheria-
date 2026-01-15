'use client'

import {
  Droplets,
  Wind,
  Gauge,
  Eye,
  CloudRain,
  Snowflake,
  CloudFog,
  CloudLightning,
} from 'lucide-react'
import {
  WeatherData,
  AirQualityData,
  getAQILabel,
  getPrecipitationIntensity,
  WEATHER_CODES,
  getWindSpeedKmh,
} from '@/lib/weatherService'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDarkMode } from '@/contexts/DarkModeContext'

interface WeatherDisplayProps {
  weatherData: WeatherData | null
  airQualityData: AirQualityData | null
  loading?: boolean
  locationName?: string
}

// Skeleton loader avec effet shimmer
function SkeletonLoader({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className={`${isDarkMode ? 'glass-strong bg-black/40' : 'bg-white/80 border border-slate-200 shadow-xl'} rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-md ${isDarkMode ? 'backdrop-blur-md' : 'backdrop-blur-lg'}`}>
      <div className="animate-pulse space-y-3 sm:space-y-4">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-10 sm:h-12 bg-white/10 rounded w-3/4"></div>
          <div className="h-3 sm:h-4 bg-white/10 rounded w-1/2"></div>
        </div>
        
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <div className="h-16 sm:h-20 bg-white/10 rounded"></div>
          <div className="h-16 sm:h-20 bg-white/10 rounded"></div>
        </div>
        
        {/* Wind skeleton */}
        <div className="h-12 sm:h-16 bg-white/10 rounded"></div>
        
        {/* AQI skeleton */}
        <div className="h-20 sm:h-24 bg-white/10 rounded"></div>
      </div>
    </div>
  )
}

export default function WeatherDisplay({
  weatherData,
  airQualityData,
  loading,
  locationName,
}: WeatherDisplayProps) {
  const { language, t } = useLanguage()
  const { isDarkMode } = useDarkMode()

  if (loading) {
    return <SkeletonLoader isDarkMode={isDarkMode} />
  }

  if (!weatherData) {
    return (
      <div className={`${isDarkMode ? 'glass-strong bg-black/40' : 'bg-white/80 border border-slate-200 shadow-xl'} rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-md ${isDarkMode ? 'backdrop-blur-md' : 'backdrop-blur-lg'}`}>
        <p className={`${isDarkMode ? 'text-white/60' : 'text-slate-600'} text-xs sm:text-sm`}>{t.selectLocation}</p>
      </div>
    )
  }

  const current = weatherData.current
  const weatherCode = WEATHER_CODES[current.weather_code] || {
    label: 'Inconnu',
    icon: 'cloud',
    emoji: '☁️',
  }

  const precipitation = getPrecipitationIntensity(
    current.precipitation,
    current.rain,
    current.snowfall
  )

  const windSpeedKmh = getWindSpeedKmh(current.wind_speed_10m)

  // Détecter les phénomènes spéciaux
  const hasFog = current.weather_code === 45 || current.weather_code === 48
  const hasHail = current.weather_code === 96 || current.weather_code === 99
  const hasThunderstorm = current.weather_code >= 95

      // Obtenir la couleur AQI
      const aqiInfo = airQualityData ? getAQILabel(airQualityData.current.us_aqi, isDarkMode) : null

      // Traduire les labels AQI
      const getAQILabelTranslated = (aqi: number) => {
        if (aqi <= 50) return t.good
        if (aqi <= 100) return t.fair
        if (aqi <= 150) return t.moderate
        if (aqi <= 200) return t.poor
        return t.veryPoor
      }

      const getAQIDescriptionTranslated = (aqi: number) => {
        if (aqi <= 50) return t.excellent
        if (aqi <= 100) return t.acceptable
        if (aqi <= 150) return t.sensitive
        if (aqi <= 200) return t.unhealthy
        return t.dangerous
      }

      // Traduire l'intensité des précipitations
      const getPrecipitationIntensityTranslated = (intensity: string) => {
        if (intensity === 'Faible' || intensity === 'Light' || intensity === 'Ligera') return t.light
        if (intensity === 'Modérée' || intensity === 'Moderate' || intensity === 'Moderada') return t.moderateIntensity
        return t.heavy
      }

  return (
    <div className={`${isDarkMode ? 'glass-strong bg-black/40' : 'bg-white/80 border border-slate-200 shadow-xl'} rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-md ${isDarkMode ? 'backdrop-blur-md' : 'backdrop-blur-lg'} space-y-3 sm:space-y-4`}>
      {/* En-tête avec température */}
      <div className="mb-3 sm:mb-4">
        {locationName && (
          <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-white/60' : 'text-slate-600'} mb-1 truncate`}>{locationName}</p>
        )}
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <span className={`text-4xl sm:text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{Math.round(current.temperature_2m)}°C</span>
          <div className="text-3xl sm:text-4xl">{weatherCode.emoji}</div>
        </div>
        <p className={`text-xs sm:text-sm mb-1 ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>{weatherCode.label}</p>
        <p className={`text-[10px] sm:text-xs ${isDarkMode ? 'text-white/80' : 'text-slate-700'}`}>
          {new Date(current.time).toLocaleString(language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : 'en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      {/* Phénomènes spéciaux */}
      {(hasFog || hasHail || hasThunderstorm) && (
        <div className={`p-2 sm:p-3 rounded-lg ${isDarkMode ? 'bg-yellow-500/20 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {hasThunderstorm && <CloudLightning className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`} />}
            {hasFog && <CloudFog className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`} />}
            {hasHail && <Snowflake className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`} />}
            <p className={`font-medium text-xs sm:text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
              {hasThunderstorm && t.thunderstorm}
              {hasFog && t.fog}
              {hasHail && t.hail}
            </p>
          </div>
        </div>
      )}

      {/* Précipitations */}
      {precipitation.type !== 'none' && (
        <div className={`p-3 sm:p-4 rounded-lg ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
          <div className="flex items-center gap-2 sm:gap-3">
            {precipitation.type === 'rain' ? (
              <CloudRain className={`w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            ) : (
              <Snowflake className={`w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`} />
            )}
            <div>
              <p className={`font-medium text-xs sm:text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {precipitation.type === 'rain' ? t.rain : t.snow}: {getPrecipitationIntensityTranslated(precipitation.intensity)}
              </p>
              <p className={`text-[10px] sm:text-xs ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
                {precipitation.value.toFixed(1)} {t.mmh}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats principales */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <div className={`p-2 sm:p-3 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-slate-100/50 border border-slate-200'}`}>
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
            <Droplets className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-[10px] sm:text-xs ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>{t.humidity}</span>
          </div>
          <p className={`text-base sm:text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{current.relative_humidity_2m}{t.percent}</p>
        </div>

        <div className={`p-2 sm:p-3 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-slate-100/50 border border-slate-200'}`}>
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
            <Gauge className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <span className={`text-[10px] sm:text-xs ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>{t.pressure}</span>
          </div>
          <p className={`text-base sm:text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{Math.round(current.surface_pressure)} {t.hpa}</p>
        </div>
      </div>

      {/* Vent avec flèche pivotante */}
      <div className={`p-3 sm:p-4 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-slate-100/50 border border-slate-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Wind className={`w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
            <div>
              <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.wind}</p>
              <p className={`text-[10px] sm:text-xs ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>{windSpeedKmh} {t.kmh}</p>
            </div>
          </div>
          <div
            className={`transition-transform duration-300 ease-out ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}
            style={{
              transform: `rotate(${current.wind_direction_10m}deg)`,
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="sm:w-6 sm:h-6"
            >
              <path d="M12 2v20M12 2l4 4M12 2L8 6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Visibilité */}
      {current.visibility > 0 && (
        <div className={`p-2 sm:p-3 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-slate-100/50 border border-slate-200'}`}>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Eye className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-[10px] sm:text-xs ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>{t.visibility}</span>
            <span className={`ml-auto text-xs sm:text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {(current.visibility / 1000).toFixed(1)} {t.km}
            </span>
          </div>
        </div>
      )}

      {/* Qualité de l'air avec pastille de couleur */}
      {airQualityData && aqiInfo && (
        <div className={`pt-3 sm:pt-4 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
          <div className={`p-3 sm:p-4 rounded-lg border ${aqiInfo.bgColor}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-white/80' : 'text-slate-900'}`}>{t.airQualityIndex}</span>
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Pastille de couleur */}
                <div
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${
                    airQualityData.current.us_aqi <= 50
                      ? isDarkMode ? 'bg-green-400' : 'bg-green-500'
                      : airQualityData.current.us_aqi <= 100
                      ? isDarkMode ? 'bg-yellow-400' : 'bg-yellow-500'
                      : airQualityData.current.us_aqi <= 150
                      ? isDarkMode ? 'bg-orange-400' : 'bg-orange-500'
                      : isDarkMode ? 'bg-red-400' : 'bg-red-500'
                  }`}
                />
                <span className={`text-xl sm:text-2xl font-bold ${isDarkMode ? aqiInfo.color : 'text-slate-900'}`}>
                  {airQualityData.current.us_aqi}
                </span>
              </div>
            </div>
            <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? aqiInfo.color : 'text-slate-900'}`}>
              {getAQILabelTranslated(airQualityData.current.us_aqi)}
            </p>
            <p className={`text-[10px] sm:text-xs mt-1 ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
              {getAQIDescriptionTranslated(airQualityData.current.us_aqi)}
            </p>
            <div className={`grid grid-cols-2 gap-2 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
              <div>
                <p className={`text-[10px] sm:text-xs ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>PM2.5</p>
                <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {airQualityData.current.pm2_5.toFixed(1)} μg/m³
                </p>
              </div>
              <div>
                <p className={`text-[10px] sm:text-xs ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>NO₂</p>
                <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {airQualityData.current.no2.toFixed(1)} μg/m³
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
