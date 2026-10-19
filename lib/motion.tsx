'use client'

import React, { useRef, useState, useEffect, type ReactNode } from 'react'
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useInView,
  animate,
  type Variants,
  type Transition,
} from 'framer-motion'

/* ==============================================================================
   CENTRAL SPRING MOTION SYSTEM (AWWWARDS / LINEAR / VERCEL GRADE)
   
   TWEAK SETTINGS HERE:
   All spring dynamics, stiffness, damping, and mass are centralized below.
   Modify these tokens to adjust the playful bounce or speed across the site.
   ============================================================================== */

export const springs = {
  /** Base playful spring with a subtle, luxurious overshoot (default for cards & reveals) */
  base: {
    type: 'spring' as const,
    stiffness: 180,
    damping: 16,
    mass: 0.9,
  },
  /** Extra bouncy spring for buttons, tags, chips, badges, and italic accent words */
  bouncy: {
    type: 'spring' as const,
    stiffness: 220,
    damping: 13,
    mass: 0.8,
  },
  /** Gentle, weighty spring for large containers, portrait cards, and hero elements */
  gentle: {
    type: 'spring' as const,
    stiffness: 160,
    damping: 18,
    mass: 1.0,
  },
  /** Snappy spring for quick micro-interactions, icons, and avatars */
  snappy: {
    type: 'spring' as const,
    stiffness: 240,
    damping: 14,
    mass: 0.7,
  },
  /** Clean, fast exit transition when an element scrolls out of view (prevents popping) */
  exit: {
    duration: 0.25,
    ease: [0.32, 0, 0.67, 0] as const,
  },
} as const

/** Standard viewport trigger configuration for all scroll animations (once: false ensures full replay) */
export const springViewport = {
  once: false,
  amount: 0.25,
  margin: '0px 0px -10% 0px',
} as const

/* ==============================================================================
   REUSABLE SPRING VARIANTS
   ============================================================================== */

export const createFadeUpVariant = (
  y = 32,
  delay = 0,
  spring: Transition = springs.base
): Variants => ({
  hidden: {
    opacity: 0,
    y,
    transition: springs.exit,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...spring, delay },
  },
})

export const createFromTopVariant = (
  y = -36,
  delay = 0,
  spring: Transition = springs.base
): Variants => ({
  hidden: {
    opacity: 0,
    y,
    transition: springs.exit,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...spring, delay },
  },
})

export const createFromSideVariant = (
  direction: 'left' | 'right' = 'right',
  distance = 50,
  rotate = 1.5,
  delay = 0,
  spring: Transition = springs.gentle
): Variants => {
  const x = direction === 'left' ? -distance : distance
  const rot = direction === 'left' ? -rotate : rotate
  return {
    hidden: {
      opacity: 0,
      x,
      rotate: rot,
      scale: 0.93,
      transition: springs.exit,
    },
    visible: {
      opacity: 1,
      x: 0,
      rotate: 0,
      scale: 1,
      transition: { ...spring, delay },
    },
  }
}

export const createPopInVariant = (
  scale = 0.82,
  delay = 0,
  spring: Transition = springs.bouncy
): Variants => ({
  hidden: {
    opacity: 0,
    scale,
    transition: springs.exit,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ...spring, delay },
  },
})

export const createStaggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {
    opacity: 0,
    transition: springs.exit,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
})

export const tagContainerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
}

export const tagPopInVariant: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.82,
    transition: springs.exit,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springs.bouncy,
  },
}

const cardVariantCache = new Map<string, Variants>()

/** Alternates spring entry directions (left -> bottom -> right) for sequential grids */
export const createCardSpringVariant = (index: number, isMobile = false): Variants => {
  const key = `${index}-${isMobile}`
  if (cardVariantCache.has(key)) return cardVariantCache.get(key)!

  const mod = index % 3
  const xDist = isMobile ? 18 : 45
  const yDist = isMobile ? 24 : 45
  const rot = isMobile ? 0.75 : 1.5

  let variant: Variants
  if (mod === 0) {
    // From left
    variant = {
      hidden: {
        opacity: 0,
        x: -xDist,
        rotate: -rot,
        scale: 0.95,
        transition: springs.exit,
      },
      visible: {
        opacity: 1,
        x: 0,
        rotate: 0,
        scale: 1,
        transition: { ...springs.base, delay: index * 0.08, when: 'beforeChildren' },
      },
    }
  } else if (mod === 1) {
    // From bottom with scale overshoot
    variant = {
      hidden: {
        opacity: 0,
        y: yDist,
        scale: 0.94,
        transition: springs.exit,
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { ...springs.base, delay: index * 0.08, when: 'beforeChildren' },
      },
    }
  } else {
    // From right
    variant = {
      hidden: {
        opacity: 0,
        x: xDist,
        rotate: rot,
        scale: 0.95,
        transition: springs.exit,
      },
      visible: {
        opacity: 1,
        x: 0,
        rotate: 0,
        scale: 1,
        transition: { ...springs.base, delay: index * 0.08, when: 'beforeChildren' },
      },
    }
  }

  cardVariantCache.set(key, variant)
  return variant
}

/* ==============================================================================
   1. REVEAL (Spring-driven directional entrance with replayable viewport)
   ============================================================================== */

export interface RevealProps {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right' | 'pop' | 'none'
  delay?: number
  distance?: number
  springType?: keyof typeof springs
  className?: string
  scale?: number
}

export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  distance = 32,
  springType = 'base',
  className = '',
  scale = 1,
}: RevealProps) {
  const reduce = useReducedMotion()

  const getVariants = (): Variants => {
    if (reduce) {
      return {
        hidden: { opacity: 0, transition: springs.exit },
        visible: { opacity: 1, transition: { duration: 0.3, delay } },
      }
    }

    const activeSpring = springs[springType] || springs.base

    switch (direction) {
      case 'down':
        return createFromTopVariant(-distance, delay, activeSpring)
      case 'left':
        return createFromSideVariant('left', distance, 1.5, delay, activeSpring)
      case 'right':
        return createFromSideVariant('right', distance, 1.5, delay, activeSpring)
      case 'pop':
        return createPopInVariant(scale || 0.82, delay, activeSpring)
      case 'none':
        return {
          hidden: { opacity: 0, transition: springs.exit },
          visible: { opacity: 1, transition: { ...activeSpring, delay } },
        }
      case 'up':
      default:
        return createFadeUpVariant(distance, delay, activeSpring)
    }
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={springViewport}
      variants={getVariants()}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}

/* ==============================================================================
   2. SPLIT TEXT (Spring line-by-line or word-by-word reveal with bounce for accents)
   ============================================================================== */

export interface SplitTextProps {
  text: string
  mode?: 'lines' | 'words'
  direction?: 'top' | 'up'
  className?: string
  lineClassName?: string
  wordClassName?: string
  delay?: number
  stagger?: number
  italicWords?: string[]
}

export function SplitText({
  text,
  mode = 'words',
  direction = 'up',
  className = '',
  lineClassName = '',
  wordClassName = '',
  delay = 0,
  stagger = 0.06,
  italicWords = [],
}: SplitTextProps) {
  const reduce = useReducedMotion()
  const words = text.split(' ')

  const yInit = direction === 'top' ? '-110%' : '110%'

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={springViewport}
      variants={createStaggerContainer(stagger, delay)}
      className={`inline-block ${className}`}
      aria-label={text}
    >
      {words.map((word, i) => {
        const isItalic = italicWords.some(
          (iw) => word.toLowerCase().includes(iw.toLowerCase())
        )

        return (
          <span
            key={i}
            className={`inline-block overflow-hidden align-top pb-[0.14em] -mb-[0.14em] mr-[0.25em] ${lineClassName}`}
            aria-hidden="true"
          >
            <motion.span
              variants={{
                hidden: {
                  y: reduce ? '0%' : yInit,
                  opacity: reduce ? 1 : 0,
                  scale: isItalic && !reduce ? 0.85 : 1,
                  transition: springs.exit,
                },
                visible: {
                  y: '0%',
                  opacity: 1,
                  scale: 1,
                  transition: isItalic ? springs.bouncy : springs.base,
                },
              }}
              className={`inline-block will-change-transform ${
                isItalic ? 'font-serif italic font-normal tracking-[-0.01em]' : ''
              } ${wordClassName}`}
            >
              {word}
            </motion.span>
          </span>
        )
      })}
    </motion.span>
  )
}

/* ==============================================================================
   3. STAGGER CONTAINER & CHILDREN (Spring-powered item cascading)
   ============================================================================== */

export interface StaggerProps {
  children: ReactNode
  className?: string
  stagger?: number
  delay?: number
}

export function Stagger({
  children,
  className = '',
  stagger = 0.08,
  delay = 0,
}: StaggerProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={springViewport}
      variants={createStaggerContainer(stagger, delay)}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          y: 28,
          scale: 0.96,
          transition: springs.exit,
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: springs.base,
        },
      }}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}

/* ==============================================================================
   4. POP IN (Springy scale-up bounce for buttons, chips, tags, avatars)
   ============================================================================== */

export interface PopInProps {
  children: ReactNode
  className?: string
  delay?: number
  scale?: number
}

export function PopIn({
  children,
  className = '',
  delay = 0,
  scale = 0.82,
}: PopInProps) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={springViewport}
      variants={
        reduce
          ? {
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.25, delay } },
            }
          : createPopInVariant(scale, delay, springs.bouncy)
      }
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}

/* ==============================================================================
   5. IMAGE REVEAL (Spring curtain + scale settle)
   ============================================================================== */

export interface ImageRevealProps {
  children: ReactNode
  className?: string
  direction?: 'left' | 'right' | 'up'
  delay?: number
}

export function ImageReveal({
  children,
  className = '',
  direction = 'right',
  delay = 0,
}: ImageRevealProps) {
  const reduce = useReducedMotion()
  const xInit = direction === 'left' ? -60 : direction === 'right' ? 60 : 0
  const yInit = direction === 'up' ? 40 : 0

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={springViewport}
      variants={{
        hidden: {
          opacity: 0,
          x: reduce ? 0 : xInit,
          y: reduce ? 0 : yInit,
          scale: reduce ? 1 : 0.92,
          rotate: direction === 'right' && !reduce ? 1.5 : direction === 'left' && !reduce ? -1.5 : 0,
          transition: springs.exit,
        },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotate: 0,
          transition: { ...springs.gentle, delay },
        },
      }}
      className={`overflow-hidden will-change-transform ${className}`}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}

/* ==============================================================================
   6. MAGNETIC (Interactive spring cursor tracking for desktop buttons)
   ============================================================================== */

export interface MagneticProps {
  children: ReactNode
  strength?: number
  className?: string
}

export function Magnetic({
  children,
  strength = 0.25,
  className = '',
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Calibrated spring physics for smooth cursor follow
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * strength)
    y.set((e.clientY - centerY) * strength)
  }

  const handlePointerLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`inline-flex ${className}`}
    >
      {children}
    </motion.div>
  )
}

/* ==============================================================================
   7. COUNT UP (Rolls numbers smoothly from 0 to value on scroll into view)
   ============================================================================== */

export interface CountUpProps {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}

export function CountUp({
  value,
  prefix = '',
  suffix = '',
  duration = 1.2,
  className = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [displayValue, setDisplayValue] = useState(0)
  const inView = useInView(ref, springViewport)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) {
      setDisplayValue(value)
      return
    }

    if (inView) {
      const controls = animate(0, value, {
        duration,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
      })
      return () => controls.stop()
    } else {
      setDisplayValue(0)
    }
  }, [inView, value, duration, reduce])

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}
