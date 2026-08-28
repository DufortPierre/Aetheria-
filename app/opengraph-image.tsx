import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0b0e14',
          backgroundImage: 'radial-gradient(circle at 25% 25%, #0e2a3d 0%, #0b0e14 60%)',
        }}
      >
        <div style={{ fontSize: 120, marginBottom: 16 }}>🌤️</div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: 2,
            backgroundImage: 'linear-gradient(90deg, #22d3ee 0%, #3b82f6 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            display: 'flex',
          }}
        >
          Aetheria
        </div>
        <div style={{ fontSize: 34, color: 'rgba(255,255,255,0.7)', marginTop: 12, display: 'flex' }}>
          Météo immersive & carte interactive mondiale
        </div>
      </div>
    ),
    { ...size }
  )
}
