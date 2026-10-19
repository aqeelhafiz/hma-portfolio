'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Precision cubic-bezier easing curve for the architectural curtain lift:
const CURTAIN_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]

// 7 architectural equal-width vertical columns across the viewport
const COL_COUNT = 7

export default function IntroLoader() {
  const [isReduced, setIsReduced] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
    return false
  })

  // Stages: 'hold' (0-800ms) -> 'wiping' (800-1900ms) -> 'settled' (>1900ms)
  const [stage, setStage] = useState<'hold' | 'wiping' | 'settled'>(() => (isReduced ? 'settled' : 'hold'))

  // Sequence controller
  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Accessibility: Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsReduced(true)
      setStage('settled')
      document.body.style.overflow = 'auto'
      ;(window as unknown as { __HMA_INTRO_DONE__?: boolean }).__HMA_INTRO_DONE__ = true
      window.dispatchEvent(new CustomEvent('hma:intro-complete'))
      return
    }

    // Lock page scrolling during intro animation
    document.body.style.overflow = 'hidden'

    // Clean up any stale session flags
    try {
      sessionStorage.removeItem('hma_intro_viewed')
    } catch {}

    // Timeline Choreography (max 1.2s total):
    // 0ms - 400ms: Initial Hold (pure white columns with centered HMA logo)
    // 400ms: Columns wipe upward, centered logo smoothly fades out
    const wipeTimer = setTimeout(() => {
      setStage('wiping')
    }, 400)

    // 650ms: Columns clear past middle; dispatch event to reveal homepage hero & navbar underneath
    const heroHandoffTimer = setTimeout(() => {
      ;(window as unknown as { __HMA_INTRO_DONE__?: boolean }).__HMA_INTRO_DONE__ = true
      window.dispatchEvent(new CustomEvent('hma:intro-complete'))
    }, 650)

    // 1150ms: Columns fully cleared; unlock scroll and unmount intro overlay completely
    const finishTimer = setTimeout(() => {
      setStage('settled')
      document.body.style.overflow = 'auto'
    }, 1150)

    // Keyboard support: Escape key skips immediately to settled state
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearTimeout(wipeTimer)
        clearTimeout(heroHandoffTimer)
        clearTimeout(finishTimer)
        setStage('settled')
        document.body.style.overflow = 'auto'
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
      document.body.style.overflow = 'auto'
    }
  }, [])

  const columns = useMemo(() => Array.from({ length: COL_COUNT }, (_, i) => i), [])

  if (isReduced || stage === 'settled') {
    return null
  }

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9999] select-none pointer-events-none overflow-hidden"
        role="dialog"
        aria-label="HMA Creative Brand Intro"
      >
        {/* 
          ============================================================
          1. 7-COLUMN ARCHITECTURAL CURTAIN PRELOADER
          7 equal-width columns with 1px #E2E2E2 dividers
          ============================================================
        */}
        <div className="absolute inset-0 grid grid-cols-7 h-full w-full overflow-hidden" aria-hidden="true">
          {columns.map((idx) => {
            // Stagger timing: 0.03s per column
            const delay = idx * 0.03

            return (
              <motion.div
                key={idx}
                initial={{ y: '0%' }}
                animate={stage === 'hold' ? { y: '0%' } : { y: '-106%' }}
                transition={{
                  duration: 0.75,
                  delay: stage === 'hold' ? 0 : delay,
                  ease: CURTAIN_EASE,
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRight: idx < COL_COUNT - 1 ? '1px solid #E2E2E2' : 'none',
                }}
                className="h-full w-full will-change-transform"
              />
            )
          })}
        </div>

        {/* 
          ============================================================
          2. NEW HMA LOGO ARTWORK (CENTERED IN PLACE)
          ============================================================
        */}
        <motion.div
          initial={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
          animate={
            stage === 'hold'
              ? { opacity: 1, scale: 1, x: '-50%', y: '-50%' }
              : {
                  opacity: 0,
                  scale: 0.98,
                  x: '-50%',
                  y: '-50%',
                  transition: { duration: 0.4, ease: CURTAIN_EASE },
                }
          }
          style={{
            position: 'fixed',
            left: '50%',
            top: '50%',
          }}
          className="z-10 select-none pointer-events-none will-change-transform"
        >
          <div className="relative w-[clamp(280px,42vw,500px)] aspect-[584/164] flex items-center justify-center">
            <img
              src="/images/hma_logo_exact@2x.png"
              srcSet="/images/hma_logo_exact.png 1x, /images/hma_logo_exact@2x.png 2x"
              alt="HMA"
              className="w-full h-full object-contain select-none pointer-events-none filter drop-shadow-[0_8px_24px_rgba(21,32,47,0.08)]"
              draggable={false}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
