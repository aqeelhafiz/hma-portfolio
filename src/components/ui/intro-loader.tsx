'use client'

import { useState, useEffect, useMemo } from 'react'

// Precision cubic-bezier easing curve for the architectural curtain lift:
const CURTAIN_BEZIER = 'cubic-bezier(0.76, 0, 0.24, 1)'

// 7 architectural equal-width vertical columns across the viewport
const COL_COUNT = 7

export default function IntroLoader() {
  const [isReduced, setIsReduced] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
    return false
  })

  // Stages: 'hold' (0-400ms) -> 'wiping' (400-1150ms) -> 'settled' (>1150ms)
  const [stage, setStage] = useState<'hold' | 'wiping' | 'settled'>(() => (isReduced ? 'settled' : 'hold'))

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsReduced(true)
      setStage('settled')
      ;(window as unknown as { __HMA_INTRO_DONE__?: boolean }).__HMA_INTRO_DONE__ = true
      window.dispatchEvent(new CustomEvent('hma:intro-complete'))
      return
    }

    try {
      sessionStorage.removeItem('hma_intro_viewed')
    } catch {}

    const wipeTimer = setTimeout(() => {
      setStage('wiping')
    }, 100)

    const heroHandoffTimer = setTimeout(() => {
      ;(window as unknown as { __HMA_INTRO_DONE__?: boolean }).__HMA_INTRO_DONE__ = true
      window.dispatchEvent(new CustomEvent('hma:intro-complete'))
    }, 280)

    const finishTimer = setTimeout(() => {
      setStage('settled')
    }, 750)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearTimeout(wipeTimer)
        clearTimeout(heroHandoffTimer)
        clearTimeout(finishTimer)
        setStage('settled')
        ;(window as unknown as { __HMA_INTRO_DONE__?: boolean }).__HMA_INTRO_DONE__ = true
        window.dispatchEvent(new CustomEvent('hma:intro-complete'))
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(wipeTimer)
      clearTimeout(heroHandoffTimer)
      clearTimeout(finishTimer)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const columns = useMemo(() => Array.from({ length: COL_COUNT }, (_, i) => i), [])

  if (isReduced || stage === 'settled') {
    return null
  }

  const isWiping = stage === 'wiping'

  return (
    <div
      className={`fixed inset-0 z-[9999] select-none overflow-hidden ${
        isWiping ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      role="dialog"
      aria-label="HMA Creative Brand Intro"
    >
      {/* 
        ============================================================
        1. 7-COLUMN ARCHITECTURAL CURTAIN PRELOADER (GPU Composited)
        7 equal-width columns with 1px #E2E2E2 dividers
        ============================================================
      */}
      <div className="absolute inset-0 grid grid-cols-7 h-full w-full overflow-hidden" aria-hidden="true">
        {columns.map((idx) => {
          const delay = idx * 0.03

          return (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRight: idx < COL_COUNT - 1 ? '1px solid #E2E2E2' : 'none',
                transform: isWiping ? 'translate3d(0, -106%, 0)' : 'translate3d(0, 0%, 0)',
                transitionProperty: 'transform',
                transitionDuration: '600ms',
                transitionTimingFunction: CURTAIN_BEZIER,
                transitionDelay: isWiping ? `${delay}s` : '0s',
                willChange: 'transform',
              }}
              className="h-full w-full"
            />
          )
        })}
      </div>

      {/* 
        ============================================================
        2. NEW HMA LOGO ARTWORK (CENTERED IN PLACE, GPU Composited)
        ============================================================
      */}
      <div
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: isWiping
            ? 'translate3d(-50%, -50%, 0) scale(0.98)'
            : 'translate3d(-50%, -50%, 0) scale(1)',
          opacity: isWiping ? 0 : 1,
          transitionProperty: 'opacity, transform',
          transitionDuration: '300ms',
          transitionTimingFunction: CURTAIN_BEZIER,
          willChange: 'opacity, transform',
        }}
        className="z-10 select-none pointer-events-none"
      >
        <div className="relative w-[clamp(280px,42vw,500px)] aspect-[584/164] flex items-center justify-center">
          <img
            src="/images/hma_logo_exact@2x.webp"
            srcSet="/images/hma_logo_exact.webp 1x, /images/hma_logo_exact@2x.webp 2x"
            alt="HMA"
            width={584}
            height={164}
            fetchPriority="high"
            className="w-full h-full object-contain select-none pointer-events-none filter drop-shadow-[0_8px_24px_rgba(21,32,47,0.08)]"
            draggable={false}
          />
        </div>
      </div>
    </div>
  )
}
