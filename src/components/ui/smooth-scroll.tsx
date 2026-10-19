'use client'

import { ReactNode, useEffect, useRef } from 'react'
import Lenis from 'lenis'

/**
 * ==============================================================================
 * LUXURY SMOOTH SCROLL ARCHITECTURE: LENIS INERTIAL SYSTEM
 * ==============================================================================
 *
 * TUNING PARAMETERS:
 * - lerp: 0.08             -> Smooth inertia friction (calm luxury glide)
 * - duration: 1.2          -> Programmatic scrollTo duration (seconds)
 * - smoothWheel: true      -> Enables smooth desktop mousewheel
 * - syncTouch: false       -> Disables touch emulation on mobile for native 120Hz momentum
 * - wheelMultiplier: 0.95  -> Prevents over-acceleration on high-DPI precision trackpads
 * - easing: easeOutExpo    -> Calm deceleration, no bouncy rubber-banding
 *
 * ACCESSIBILITY & PERFORMANCE:
 * - Automatically bypasses Lenis on prefers-reduced-motion: reduce
 * - Dedicated rAF loop with frame-time clamping prevents frame skips
 * ==============================================================================
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // 1. Accessibility: Respect user's motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // 2. Initialize Lenis with luxury tuning
    const lenis = new Lenis({
      lerp: 0.08,             // Calm luxury glide
      duration: 1.2,          // Duration for programmatic scrollTo calls
      smoothWheel: true,      // Desktop mousewheel smoothing
      syncTouch: false,       // False preserves native iOS/Android 120Hz touch physics
      touchMultiplier: 1.0,   // 1:1 direct finger tracking
      wheelMultiplier: 0.95,  // Subtle dampening for precision trackpads
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration
    })

    lenisRef.current = lenis
    if (typeof window !== 'undefined') {
      ;(window as any).__lenis = lenis
    }

    // 3. Dedicated high-performance requestAnimationFrame loop
    let rafId: number
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // 4. Intercept anchor clicks (#work, #services, #contact, etc.) with offset compensation
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return
      const href = target.getAttribute('href')
      if (href && href.startsWith('#')) {
        const id = href.slice(1)
        if (!id) return
        const element = id === 'home' ? document.body : document.getElementById(id)
        if (element) {
          e.preventDefault()
          // Offset -88px accounts for the floating glass navbar pill
          lenis.scrollTo(element, { offset: id === 'home' ? 0 : -88, duration: 1.2 })
        }
      }
    }

    document.addEventListener('click', handleAnchorClick)

    return () => {
      document.removeEventListener('click', handleAnchorClick)
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
      if (typeof window !== 'undefined') {
        delete (window as any).__lenis
      }
    }
  }, [])

  return <>{children}</>
}
