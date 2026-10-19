'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * ==============================================================================
 * LUXURY CUSTOM MAGNETIC CURSOR (DESKTOP ONLY)
 * ==============================================================================
 *
 * MODES:
 * - default: 6px center dot + 32px trailing glass ring
 * - pointer: scaled-up ring over links/buttons
 * - view: sleek dark pill with white "View" label over project cards
 *
 * ACCESSIBILITY & MOBILE:
 * - Strictly disabled on touch devices / coarse pointer media queries
 * - Disabled on prefers-reduced-motion: reduce
 * - pointer-events: none ensures zero click interference
 * ==============================================================================
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const viewBadgeRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Only activate on devices with a mouse/trackpad pointer and no reduced motion
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!hasFinePointer || prefersReducedMotion) return

    setMounted(true)

    const dot = dotRef.current
    const ring = ringRef.current
    const viewBadge = viewBadgeRef.current
    if (!dot || !ring || !viewBadge) return

    let mouseX = -200
    let mouseY = -200
    let ringX = -200
    let ringY = -200
    let isVisible = false
    let currentMode: 'default' | 'pointer' | 'view' = 'default'

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      if (!isVisible) {
        isVisible = true
        dot.style.opacity = '1'
        ring.style.opacity = '1'
      }

      // Instant center dot
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`

      // Check hover targets
      const target = e.target as HTMLElement | null
      const isCard = target?.closest('[data-cursor="view"], article[class*="rounded"]')
      const isInteractive = target?.closest('a, button, [role="button"], input, textarea, select, .cursor-pointer')

      if (isCard && !isInteractive) {
        if (currentMode !== 'view') {
          currentMode = 'view'
          viewBadge.style.opacity = '1'
          viewBadge.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(1)`
          ring.style.opacity = '0'
          dot.style.opacity = '0'
        } else {
          viewBadge.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(1)`
        }
      } else if (isInteractive) {
        if (currentMode !== 'pointer') {
          currentMode = 'pointer'
          viewBadge.style.opacity = '0'
          viewBadge.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(0.6)`
          ring.style.opacity = '1'
          ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(1.65)`
          ring.style.borderColor = 'rgba(21, 32, 47, 0.28)'
          ring.style.backgroundColor = 'rgba(21, 32, 47, 0.05)'
          dot.style.opacity = '0.4'
          dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(0.6)`
        }
      } else {
        if (currentMode !== 'default') {
          currentMode = 'default'
          viewBadge.style.opacity = '0'
          viewBadge.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(0.6)`
          ring.style.opacity = '1'
          ring.style.borderColor = 'rgba(21, 32, 47, 0.18)'
          ring.style.backgroundColor = 'transparent'
          dot.style.opacity = '1'
          dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(1)`
        }
      }
    }

    const onMouseLeave = () => {
      isVisible = false
      dot.style.opacity = '0'
      ring.style.opacity = '0'
      viewBadge.style.opacity = '0'
    }

    // Smooth trailing physics for outer ring
    let rafId: number
    const updateRing = () => {
      ringX += (mouseX - ringX) * 0.16
      ringY += (mouseY - ringY) * 0.16

      if (currentMode === 'default') {
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(1)`
      } else if (currentMode === 'pointer') {
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(1.65)`
      }

      rafId = requestAnimationFrame(updateRing)
    }
    rafId = requestAnimationFrame(updateRing)

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      cancelAnimationFrame(rafId)
    }
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Precision inner center dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-[#15202F] pointer-events-none z-[99999] opacity-0 select-none will-change-transform transition-opacity duration-200"
      />
      {/* Trailing magnetic ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full border border-[#15202F]/20 pointer-events-none z-[99998] opacity-0 select-none will-change-transform transition-all duration-200"
      />
      {/* "View" bubble badge for project card hover */}
      <div
        ref={viewBadgeRef}
        aria-hidden="true"
        className="fixed top-0 left-0 -ml-7 -mt-4 pointer-events-none z-[100000] opacity-0 select-none will-change-transform transition-opacity duration-200"
      >
        <span className="inline-flex items-center gap-1 rounded-full bg-[#15202F] text-white px-3 py-1 text-[11px] font-semibold tracking-wider uppercase shadow-[0_8px_20px_rgba(21,32,47,0.3)]">
          View
        </span>
      </div>
    </>
  )
}
