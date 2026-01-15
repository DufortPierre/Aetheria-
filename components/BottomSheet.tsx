'use client'

import { useState, useEffect, useRef, ReactNode } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'

interface BottomSheetProps {
  children: ReactNode
  isOpen?: boolean
  defaultHeight?: number // Pourcentage de la hauteur de l'écran (0-100)
}

export default function BottomSheet({ 
  children, 
  isOpen = true,
  defaultHeight = 35 // Réduit à ~35% pour correspondre à ~140px de peek 
}: BottomSheetProps) {
  const { isDarkMode } = useDarkMode()
  const [height, setHeight] = useState(defaultHeight)
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [startHeight, setStartHeight] = useState(defaultHeight)
  const sheetRef = useRef<HTMLDivElement>(null)

  // Positions prédéfinies : collapsed, partial, expanded
  const snapPoints = [25, 50, 80] // Pourcentages de hauteur (réduit le max à 80%)

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartY(e.touches[0].clientY)
    setStartHeight(height)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    
    const currentY = e.touches[0].clientY
    const deltaY = startY - currentY // Inversé car on tire vers le haut
    const newHeight = startHeight + (deltaY / window.innerHeight) * 100
    
    // Limiter entre 10% et 90%
    const clampedHeight = Math.max(10, Math.min(90, newHeight))
    setHeight(clampedHeight)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    
    // Snap to nearest snap point
    const nearestSnap = snapPoints.reduce((prev, curr) => {
      return Math.abs(curr - height) < Math.abs(prev - height) ? curr : prev
    })
    setHeight(nearestSnap)
  }

  // Mouse events pour desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setStartY(e.clientY)
    setStartHeight(height)
  }

  useEffect(() => {
    if (!isDragging) return

    const mouseMoveHandler = (e: MouseEvent) => {
      const deltaY = startY - e.clientY
      const newHeight = startHeight + (deltaY / window.innerHeight) * 100
      const clampedHeight = Math.max(10, Math.min(90, newHeight))
      setHeight(clampedHeight)
    }

    const mouseUpHandler = () => {
      setIsDragging(false)
      const nearestSnap = snapPoints.reduce((prev, curr) => {
        return Math.abs(curr - height) < Math.abs(prev - height) ? curr : prev
      })
      setHeight(nearestSnap)
    }

    document.addEventListener('mousemove', mouseMoveHandler)
    document.addEventListener('mouseup', mouseUpHandler)
    document.body.style.cursor = 'grabbing'
    document.body.style.userSelect = 'none'
    
    return () => {
      document.removeEventListener('mousemove', mouseMoveHandler)
      document.removeEventListener('mouseup', mouseUpHandler)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging, startY, startHeight, height, snapPoints])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay pour fermer en tapant dessus */}
      {height > 50 && (
        <div
          className="fixed inset-0 bg-black/20 z-[450] md:hidden"
          onClick={() => setHeight(25)}
          style={{ touchAction: 'none' }}
        />
      )}
      
      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={`fixed left-0 right-0 z-[500] md:hidden transition-transform duration-300 ease-out ${
          isDarkMode ? 'glass-strong bg-black/50' : 'bg-white/95 border-t border-slate-200'
        } backdrop-blur-xl rounded-t-3xl shadow-2xl`}
        style={{
          height: `${height}vh`,
          bottom: 0,
          touchAction: 'pan-y',
          transition: isDragging ? 'none' : 'height 0.3s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle bar */}
        <div
          className="flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <div
            className={`w-12 h-1 rounded-full ${
              isDarkMode ? 'bg-white/30' : 'bg-slate-400'
            }`}
          />
        </div>

        {/* Content */}
        <div className="h-[calc(100%-3rem)] overflow-y-auto overscroll-contain px-4 pb-4">
          {children}
        </div>
      </div>
    </>
  )
}
