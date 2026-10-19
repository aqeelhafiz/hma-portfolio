'use client'

import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'

/**
 * ==============================================================================
 * SCROLL PROGRESS BAR (TOP VIEWPORT EDGE)
 * ==============================================================================
 *
 * TUNING PARAMETERS:
 * - Height: 2px (subtle, non-distracting)
 * - Color: #15202F matching HMA ink with subtle elevation
 * - Easing: spring-smoothed with stiffness 280, damping 30
 * ==============================================================================
 */
export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const reduce = useReducedMotion()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 30,
    restDelta: 0.001,
  })

  if (reduce) return null

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] z-[120] pointer-events-none select-none"
    >
      <motion.div
        style={{ scaleX }}
        className="h-full w-full bg-[#15202F] origin-left shadow-[0_1px_4px_rgba(21,32,47,0.18)] will-change-transform"
      />
    </div>
  )
}
