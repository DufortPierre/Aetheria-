'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { TemperatureUnit, SpeedUnit } from '@/lib/weatherService'

interface UnitsContextType {
  temperatureUnit: TemperatureUnit
  speedUnit: SpeedUnit
  toggleUnits: () => void
}

const UnitsContext = createContext<UnitsContextType | undefined>(undefined)

// Le système métrique (°C, km/h) et impérial (°F, mph) sont couplés : on bascule
// les deux ensemble, comme le fait la plupart des apps météo grand public.
export function UnitsProvider({ children }: { children: ReactNode }) {
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('celsius')

  useEffect(() => {
    const saved = localStorage.getItem('aetheria_units')
    if (saved === 'imperial') {
      setTemperatureUnit('fahrenheit')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('aetheria_units', temperatureUnit === 'fahrenheit' ? 'imperial' : 'metric')
  }, [temperatureUnit])

  const toggleUnits = () => {
    setTemperatureUnit((prev) => (prev === 'celsius' ? 'fahrenheit' : 'celsius'))
  }

  const speedUnit: SpeedUnit = temperatureUnit === 'fahrenheit' ? 'mph' : 'kmh'

  return (
    <UnitsContext.Provider value={{ temperatureUnit, speedUnit, toggleUnits }}>
      {children}
    </UnitsContext.Provider>
  )
}

export function useUnits() {
  const context = useContext(UnitsContext)
  if (context === undefined) {
    throw new Error('useUnits must be used within a UnitsProvider')
  }
  return context
}
