'use client'

import { Star } from 'lucide-react'
import { FavoriteCity } from '@/lib/weatherService'
import { useDarkMode } from '@/contexts/DarkModeContext'

interface FavoritesBarProps {
  favorites: FavoriteCity[]
  selectedLocation: { lat: number; lon: number } | null
  onSelect: (lat: number, lon: number, name: string) => void
}

// Rangée de villes favorites pour basculer rapidement entre elles. Ne s'affiche
// que s'il y en a au moins une (voir bouton étoile dans WeatherDisplay pour en
// ajouter/retirer).
export default function FavoritesBar({ favorites, selectedLocation, onSelect }: FavoritesBarProps) {
  const { isDarkMode } = useDarkMode()

  if (favorites.length === 0) return null

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 max-w-full pointer-events-auto">
      {favorites.map((city) => {
        const isSelected =
          selectedLocation &&
          Math.abs(selectedLocation.lat - city.lat) < 0.005 &&
          Math.abs(selectedLocation.lon - city.lon) < 0.005

        return (
          <button
            key={city.id}
            onClick={() => onSelect(city.lat, city.lon, city.name)}
            className={`flex-shrink-0 flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full backdrop-blur-md border transition-colors ${
              isSelected
                ? 'bg-cyan-500/30 border-cyan-400/50 text-cyan-100'
                : isDarkMode
                  ? 'bg-black/40 border-white/10 text-white/80 hover:bg-white/10'
                  : 'bg-white/90 border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
            }`}
          >
            <Star className="w-3 h-3 flex-shrink-0 fill-current" />
            <span className="truncate max-w-[100px]">{city.name}</span>
          </button>
        )
      })}
    </div>
  )
}
