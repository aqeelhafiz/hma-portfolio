'use client'

import { useEffect, useRef } from 'react'

export default function SilverAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // --- Orb definitions matching the reference image ---
    // Each orb has: position (%), size (% of canvas), color, opacity
    const orbs = [
      // LEFT SIDE — medium silver-gray
      { xPct: -0.05, yPct: 0.45, rx: 0.55, ry: 0.9, color: '200,204,212', opacity: 0.55, phaseX: 0, phaseY: 1.3, speed: 0.00018 },
      // TOP LEFT — lighter silver
      { xPct: 0.05, yPct: -0.05, rx: 0.55, ry: 0.5, color: '210,213,220', opacity: 0.45, phaseX: 2.1, phaseY: 0.7, speed: 0.00014 },
      // TOP RIGHT — very soft silver
      { xPct: 0.85, yPct: -0.1, rx: 0.45, ry: 0.45, color: '215,218,224', opacity: 0.35, phaseX: 1.1, phaseY: 2.5, speed: 0.00016 },
      // RIGHT SIDE — soft silver
      { xPct: 1.05, yPct: 0.5, rx: 0.5, ry: 0.8, color: '205,209,217', opacity: 0.40, phaseX: 3.2, phaseY: 0.4, speed: 0.00013 },
      // BOTTOM LEFT — slightly deeper
      { xPct: 0.0, yPct: 1.05, rx: 0.55, ry: 0.45, color: '195,200,210', opacity: 0.45, phaseX: 0.8, phaseY: 3.1, speed: 0.00015 },
      // BOTTOM RIGHT — slightly brighter
      { xPct: 1.0, yPct: 1.0, rx: 0.5, ry: 0.45, color: '218,221,227', opacity: 0.35, phaseX: 4.0, phaseY: 1.8, speed: 0.00012 },
      // CENTER BRIGHT CORE — always white
      { xPct: 0.5, yPct: 0.42, rx: 0.5, ry: 0.55, color: '255,255,255', opacity: 0.95, phaseX: 1.5, phaseY: 2.0, speed: 0.00010 },
    ]

    let startTime = performance.now()

    const draw = (now: number) => {
      const elapsed = now - startTime
      const w = canvas.width
      const h = canvas.height

      // Base: pure off-white
      ctx.fillStyle = '#F8F9FA'
      ctx.fillRect(0, 0, w, h)

      for (const orb of orbs) {
        // Very slow, gentle float — amplitude ±2% of width
        const driftX = Math.sin(elapsed * orb.speed + orb.phaseX) * w * 0.02
        const driftY = Math.cos(elapsed * orb.speed * 0.8 + orb.phaseY) * h * 0.025

        const cx = orb.xPct * w + driftX
        const cy = orb.yPct * h + driftY
        const rx = orb.rx * w
        const ry = orb.ry * h

        ctx.save()
        ctx.translate(cx, cy)
        ctx.scale(1, ry / rx)

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, rx)
        gradient.addColorStop(0, `rgba(${orb.color}, ${orb.opacity})`)
        gradient.addColorStop(0.4, `rgba(${orb.color}, ${orb.opacity * 0.5})`)
        gradient.addColorStop(0.75, `rgba(${orb.color}, ${orb.opacity * 0.15})`)
        gradient.addColorStop(1, `rgba(${orb.color}, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(0, 0, rx, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none select-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
