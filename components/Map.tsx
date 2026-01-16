'use client'

import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet'
import type { Map as LeafletMap } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Language } from '@/lib/i18n'


interface MapProps {
  onLocationClick: (lat: number, lon: number) => void
  selectedLocation?: { lat: number; lon: number } | null
  flyToLocation?: { lat: number; lon: number; zoom?: number } | null
  isDarkMode?: boolean
  onGeolocate?: () => void
  onRecenter?: () => void
  onToggleFullscreen?: () => void
  isFullscreen?: boolean
  isGeolocating?: boolean
  showRecenter?: boolean
}

// Composant pour supprimer définitivement les contrôles inutiles (boussole, rotation, etc.)
function RemoveControls() {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    const removeAllNavigationControls = () => {
      try {
        // Supprimer les contrôles dans le conteneur de la carte
        const container = map.getContainer()
        if (container) {
          // Sélectionner tous les contrôles possibles
          const selectors = [
            '.leaflet-control-compass',
            '.leaflet-control-rotate',
            '.leaflet-control-rotate-screen',
            '.leaflet-control-navigation',
            '.mapboxgl-ctrl-compass',
            '.mapboxgl-ctrl-navigation',
            '[class*="compass"]',
            '[class*="navigation-control"]',
            '[class*="rotate"]',
            'button[aria-label*="N"]',
            'button[aria-label*="North"]',
            'a[aria-label*="N"]',
            'a[aria-label*="North"]',
          ]

          selectors.forEach((selector) => {
            const elements = container.querySelectorAll(selector)
            elements.forEach((element) => {
              try {
                element.remove()
              } catch (e) {
                // Ignorer
              }
            })
          })

          // Supprimer aussi dans le body au cas où (certains plugins ajoutent des éléments là)
          selectors.forEach((selector) => {
            const elements = document.querySelectorAll(selector)
            elements.forEach((element) => {
              if (container.contains(element) || element.closest('.leaflet-container')) {
                try {
                  element.remove()
                } catch (e) {
                  // Ignorer
                }
              }
            })
          })
        }

        // Supprimer les contrôles Leaflet enregistrés
        const controls = (map as any)._controls || []
        controls.forEach((control: any) => {
          try {
            if (control && (
              control.options?.className?.includes('compass') ||
              control.options?.className?.includes('rotate') ||
              control.options?.className?.includes('navigation')
            )) {
              map.removeControl(control)
            }
          } catch (e) {
            // Ignorer
          }
        })
      } catch (e) {
        // Ignorer silencieusement
      }
    }

    // Exécuter immédiatement
    removeAllNavigationControls()

    // Réessayer après un court délai (au cas où les contrôles sont ajoutés après)
    const timer1 = setTimeout(removeAllNavigationControls, 100)
    const timer2 = setTimeout(removeAllNavigationControls, 500)
    const timer3 = setTimeout(removeAllNavigationControls, 1000)

    // Observer les mutations du DOM pour supprimer les contrôles qui apparaissent dynamiquement
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            const element = node as Element
            if (element.classList?.contains('leaflet-control-compass') ||
                element.classList?.contains('leaflet-control-rotate') ||
                element.classList?.contains('leaflet-control-navigation') ||
                element.classList?.contains('mapboxgl-ctrl-compass') ||
                element.querySelector?.('.leaflet-control-compass, .leaflet-control-rotate, .leaflet-control-navigation')) {
              try {
                element.remove()
              } catch (e) {
                // Ignorer
              }
            }
          }
        })
      })
    })

    const container = map.getContainer()
    if (container) {
      observer.observe(container, {
        childList: true,
        subtree: true,
      })
    }

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      observer.disconnect()
    }
  }, [map])

  return null
}

// Composant pour initialiser la carte et gérer les instances globales
function MapInitializer() {
  const map = useMap()

  useEffect(() => {
    // Si une carte existe déjà globalement et que ce n'est pas celle-ci, la détruire
    if (globalMapInstance && globalMapInstance !== map) {
      try {
        // Vérifier que l'ancienne instance existe encore avant de la supprimer
        const oldContainer = globalMapInstance.getContainer()
        if (oldContainer && oldContainer.parentNode) {
          globalMapInstance.remove()
        }
      } catch (e) {
        // Ignorer les erreurs silencieusement
      }
    }
    globalMapInstance = map
    
    // Forcer le redimensionnement de la carte une seule fois après un court délai
    const timer1 = setTimeout(() => {
      try {
        if (map && map.getContainer() && map.getContainer().offsetHeight > 0) {
          map.invalidateSize()
        }
      } catch (e) {
        // Ignorer les erreurs silencieusement
      }
    }, 100)

    const timer2 = setTimeout(() => {
      try {
        if (map && map.getContainer() && map.getContainer().offsetHeight > 0) {
          map.invalidateSize()
        }
      } catch (e) {
        // Ignorer les erreurs silencieusement
      }
    }, 500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [map])

  return null
}

// Composant pour capturer les clics sur la carte
function MapClickHandler({ onClick }: { onClick: (lat: number, lon: number) => void }) {
  // Utiliser useRef pour éviter le stale closure
  const onClickRef = useRef(onClick)
  
  // Mettre à jour la ref quand onClick change
  useEffect(() => {
    onClickRef.current = onClick
  }, [onClick])
  
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng
      // Utiliser la ref pour éviter le stale closure
      onClickRef.current(lat, lng)
    },
  })
  return null
}

// Composant pour changer la vue de la carte quand la position change
function ChangeView({ center, zoom }: { center: [number, number]; zoom?: number }) {
  const map = useMap()
  
  useEffect(() => {
    if (map && center && center[0] !== undefined && center[1] !== undefined && !isNaN(center[0]) && !isNaN(center[1])) {
      // Utiliser setView pour un positionnement immédiat et précis
      const targetZoom = zoom || map.getZoom()
      map.setView(center, targetZoom, { animate: true, duration: 0.3 })
      // Forcer Leaflet à recalculer les positions des éléments
      setTimeout(() => {
        map.invalidateSize()
      }, 100)
    }
  }, [map, center, zoom])
  
  return null
}

// Composant pour afficher un point simple à la position cliquée
function ClickPoint({ selectedLocation, isDarkMode }: { selectedLocation: { lat: number; lon: number } | null | undefined; isDarkMode: boolean }) {
  const map = useMap()
  const [pointPosition, setPointPosition] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (selectedLocation && map) {
      const latlng = [selectedLocation.lat, selectedLocation.lon] as [number, number]
      const point = map.latLngToContainerPoint(latlng)
      setPointPosition({ x: point.x, y: point.y })
    } else {
      setPointPosition(null)
    }
  }, [selectedLocation, map])

  // Mettre à jour la position du point quand la carte bouge
  useEffect(() => {
    if (!map || !selectedLocation) return

    const updatePoint = () => {
      const latlng = [selectedLocation.lat, selectedLocation.lon] as [number, number]
      const point = map.latLngToContainerPoint(latlng)
      setPointPosition({ x: point.x, y: point.y })
    }

    map.on('move', updatePoint)
    map.on('zoom', updatePoint)

    return () => {
      map.off('move', updatePoint)
      map.off('zoom', updatePoint)
    }
  }, [map, selectedLocation])

  if (!pointPosition || !selectedLocation) return null

  return (
    <div
      style={{
        position: 'absolute',
        left: `${pointPosition.x}px`,
        top: `${pointPosition.y}px`,
        transform: 'translate(-50%, -50%)',
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: '#3b82f6',
        border: `2px solid ${isDarkMode ? 'white' : '#1e293b'}`,
        boxShadow: `0 0 8px rgba(59, 130, 246, 0.8)`,
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    />
  )
}

// Composant pour faire voler la carte vers une position
function FlyToLocation({ location }: { location: { lat: number; lon: number; zoom?: number } | null }) {
  const map = useMap()

  useEffect(() => {
    if (location) {
      // Vérifier que la carte est prête avant d'appeler flyTo
      const tryFlyTo = () => {
        try {
          if (map && map.getContainer() && map.getContainer().offsetHeight > 0) {
            const container = map.getContainer()
            // Vérifier que la carte Leaflet est bien initialisée
            if (container && (container as any)._leaflet_id) {
              map.flyTo([location.lat, location.lon], location.zoom || 10, {
                duration: 1.5,
              })
            } else {
              // Retry après un court délai si la carte n'est pas encore prête
              setTimeout(tryFlyTo, 100)
            }
          }
        } catch (e) {
          // Retry silencieusement
          setTimeout(tryFlyTo, 200)
        }
      }
      
      // Attendre un peu que la carte soit complètement initialisée
      setTimeout(tryFlyTo, 100)
    }
  }, [location, map])

  return null
}


// Variable globale pour tracker l'instance de carte
let globalMapInstance: LeafletMap | null = null

export default function Map({ 
  onLocationClick, 
  selectedLocation, 
  flyToLocation, 
  isDarkMode = true,
  onGeolocate,
  onRecenter,
  onToggleFullscreen,
  isFullscreen = false,
  isGeolocating = false,
  showRecenter = false
}: MapProps) {
  const { language } = useLanguage()
  const [isClient, setIsClient] = useState(false)
  const mapRef = useRef<LeafletMap | null>(null)

  useEffect(() => {
    setIsClient(true)
    
    // Cleanup : détruire la carte si elle existe
    return () => {
      // Ne pas nettoyer immédiatement, laisser React gérer le démontage
      // pour éviter les conflits avec le remontage en mode strict
    }
  }, [])

  // Éviter le problème de SSR avec Leaflet
  if (!isClient) {
    return (
      <div className={`w-full h-full ${isDarkMode ? 'bg-[#0b0e14]' : 'bg-slate-100'} flex items-center justify-center`} style={{ height: '100%', width: '100%' }}>
        <div className={isDarkMode ? 'text-white/60' : 'text-slate-900/70'}>Chargement de la carte...</div>
      </div>
    )
  }

  // Choisir les tuiles selon le mode
  const tileUrl = isDarkMode
    ? `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
    : `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
  const attribution = isDarkMode
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

  return (
    <div 
      className="w-full h-full relative" 
      style={{ 
        height: '100vh', 
        width: '100vw', 
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'visible',
        zIndex: 0,
        pointerEvents: 'auto' // Permettre les interactions avec la carte
      }}
    >
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2.5}
        style={{ 
          height: '100vh', 
          width: '100vw', 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          zIndex: 0,
          backgroundColor: isDarkMode ? '#0b0e14' : '#f1f5f9',
          pointerEvents: 'auto' // Permettre les interactions
        }}
        className="dark-map"
        scrollWheelZoom={true}
        dragging={true} // Activer le drag
        touchZoom={true} // Activer le zoom tactile pour mobile
        worldCopyJump={true}
        preferCanvas={false}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
        zoomControl={false} // Désactiver les contrôles de zoom par défaut (on utilise des boutons personnalisés)
        attributionControl={false}
        doubleClickZoom={true}
        boxZoom={false} // Désactiver boxZoom sur mobile (peut causer des problèmes)
        keyboard={true}
      >
        {/* Tuiles principales - Change selon le mode */}
        <TileLayer
          key={`tiles-${isDarkMode ? 'dark' : 'light'}-${language}`}
          attribution={attribution}
          url={tileUrl}
          subdomains={isDarkMode ? "abcd" : "abc"}
          maxZoom={19}
          tileSize={256}
          zoomOffset={0}
          opacity={isDarkMode ? 0.8 : 1.0}
        />
        
        <RemoveControls />
        <MapInitializer />
        <MapClickHandler onClick={onLocationClick} />
        <FlyToLocation location={flyToLocation || null} />

        {/* Forcer la mise à jour de la vue quand selectedLocation change */}
        {selectedLocation && (
          <ChangeView center={[selectedLocation.lat, selectedLocation.lon]} />
        )}

        {/* Point simple à la position cliquée */}
        <ClickPoint selectedLocation={selectedLocation} isDarkMode={isDarkMode} />

        {/* Action Stack pour mobile (toujours visible, même en plein écran) */}

      </MapContainer>
    </div>
  )
}
