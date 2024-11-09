'use client'

import React, { useState, useRef } from 'react'

interface GameObject {
  x: number
  y: number
}

interface GameMap {
  player: [number, number]
  portal: [number, number]
  platforms: GameObject[]
}

export default function PixelArtProcessor() {
  const [gameMap, setGameMap] = useState<GameMap | null>(null)
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const processImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.drawImage(img, 0, 0)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const map: GameMap = {
          player: [0, 0],
          portal: [0, 0],
          platforms: []
        }

        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4
            const r = imageData.data[index]
            const g = imageData.data[index + 1]
            const b = imageData.data[index + 2]

            if (r > 200 && g < 50 && b < 50) {
              map.player = [x, y]
            } else if (r > 200 && g > 200 && b < 50) {
              map.portal = [x, y]
            } else if (r < 50 && g < 50 && b > 200) {
              map.platforms.push({ x, y })
            }
          }
        }

        setGameMap(map)
        setError(null)
      }
      img.onerror = () => {
        setError('Failed to load the image. Please try again.')
      }
      img.src = event.target?.result as string
    }
    reader.onerror = () => {
      setError('Failed to read the file. Please try again.')
    }
    reader.readAsDataURL(file)
  }

  const downloadJSON = () => {
    if (!gameMap) return

    const jsonString = JSON.stringify(gameMap, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'game_map.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pixel Art Game Map Generator</h1>
          <div className="space-y-4">
            <div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={processImage}
                className="mt-1"
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {gameMap && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Processed Game Map</h2>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60">
                  {JSON.stringify(gameMap, null, 2)}
                </pre>
                <button onClick={downloadJSON} className="mt-4">
                  Download JSON
                </button>
              </div>
            )}
          </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}