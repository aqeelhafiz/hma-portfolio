'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * ==============================================================================
 * GSAP SCROLLTRIGGER MASTER CONTROLLER (MOBILE & DESKTOP)
 * ==============================================================================
 *
 * TUNING PARAMETERS:
 * - EASING: 'power3.out' (calm, luxurious deceleration)
 * - HERO DURATION: 1.0s, Y: 40px (desktop) / 24px (mobile)
 * - SECTION TRIGGER: 'top 85%' (enters comfortably before center viewport)
 * - SECTION STAGGER: 0.1s (desktop) / 0.05s (mobile)
 * - IMAGE SCALE REVEAL: 1.15 -> 1.0 with 12% parallax (desktop) / 6% (mobile)
 * - CARDS / LISTS STAGGER: 0.08s (desktop) / 0.05s (mobile)
 *
 * ACCESSIBILITY & PERFORMANCE:
 * - Content is visible by default in HTML/CSS (zero JS-failure blank screen risk)
 * - Automatically killed on prefers-reduced-motion: reduce
 * - Cleaned up completely on unmount via gsap.matchMedia() mm.revert()
 * ==============================================================================
 */
export default function GsapScrollAnimations() {
  useEffect(() => {
    // 1. Accessibility: Skip animations if user requested reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // 2. Initialize gsap.matchMedia for desktop / mobile split
    const mm = gsap.matchMedia()

    // ==========================================================================
    // DESKTOP CONFIGURATION (>= 1024px)
    // ==========================================================================
    mm.add('(min-width: 1024px)', () => {
      // 1. HERO STAGGERED REVEAL: [data-gsap="hero-reveal"]
      const heroElements = document.querySelectorAll('[data-gsap="hero-reveal"]')
      if (heroElements.length > 0) {
        gsap.fromTo(
          heroElements,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.2, // Coordinates smoothly after initial page reveal
          }
        )
      }

      // 2. SECTION FADE-UP WITH CHILD STAGGER: [data-gsap="section"]
      const sections = document.querySelectorAll<HTMLElement>('[data-gsap="section"]')
      sections.forEach((section) => {
        const children = section.querySelectorAll('[data-gsap="section-child"]')
        if (children.length > 0) {
          gsap.fromTo(
            children,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play reverse play reverse',
              },
            }
          )
        }
      })

      // 3. IMAGE SCALE + PARALLAX REVEAL: [data-gsap="image-reveal"]
      const imageWrappers = document.querySelectorAll<HTMLElement>('[data-gsap="image-reveal"]')
      imageWrappers.forEach((wrapper) => {
        const img = wrapper.querySelector('img, video')
        if (!img) return

        // Scale reveal on first enter (1.15 -> 1.0)
        gsap.fromTo(
          img,
          { scale: 1.15 },
          {
            scale: 1.0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: wrapper,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse',
            },
          }
        )

        // Subtle desktop parallax (12% translation scrub)
        gsap.to(img, {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })

      // 4. CARD GRIDS / LISTS SEQUENTIAL STAGGER: [data-gsap="card-grid"]
      const cardGrids = document.querySelectorAll<HTMLElement>('[data-gsap="card-grid"]')
      cardGrids.forEach((grid) => {
        const cards = grid.children
        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              stagger: 0.08,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: grid,
                start: 'top 85%',
                toggleActions: 'play reverse play reverse',
              },
            }
          )
        }
      })

      // 5. LINE-BY-LINE HEADINGS MASK REVEAL: [data-gsap="heading-mask"]
      const headings = document.querySelectorAll<HTMLElement>('[data-gsap="heading-mask"]')
      headings.forEach((heading) => {
        const lines = heading.querySelectorAll('.mask-line')
        if (lines.length > 0) {
          gsap.fromTo(
            lines,
            { y: '100%', opacity: 0 },
            {
              y: '0%',
              opacity: 1,
              duration: 0.95,
              stagger: 0.07,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: heading,
                start: 'top 85%',
                toggleActions: 'play reverse play reverse',
              },
            }
          )
        }
      })
    })

    // ==========================================================================
    // MOBILE & TABLET CONFIGURATION (< 1024px)
    // Lightweight, reduced motion travel, optimized for 60fps compositor
    // ==========================================================================
    mm.add('(max-width: 1023px)', () => {
      // 1. MOBILE HERO REVEAL: Reduced travel (24px) & quicker stagger (0.06s)
      const heroElements = document.querySelectorAll('[data-gsap="hero-reveal"]')
      if (heroElements.length > 0) {
        gsap.fromTo(
          heroElements,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.06,
            ease: 'power3.out',
            delay: 0.15,
          }
        )
      }

      // 2. MOBILE SECTION FADE-UP: Triggered at 'top 88%' for fast rendering
      const sections = document.querySelectorAll<HTMLElement>('[data-gsap="section"]')
      sections.forEach((section) => {
        const children = section.querySelectorAll('[data-gsap="section-child"]')
        if (children.length > 0) {
          gsap.fromTo(
            children,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.06,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 88%',
                toggleActions: 'play reverse play reverse',
              },
            }
          )
        }
      })

      // 3. MOBILE IMAGE REVEAL: Gentle scale (1.08 -> 1.0) & minimal 5% parallax
      const imageWrappers = document.querySelectorAll<HTMLElement>('[data-gsap="image-reveal"]')
      imageWrappers.forEach((wrapper) => {
        const img = wrapper.querySelector('img, video')
        if (!img) return

        gsap.fromTo(
          img,
          { scale: 1.08 },
          {
            scale: 1.0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: wrapper,
              start: 'top 88%',
              toggleActions: 'play reverse play reverse',
            },
          }
        )

        // Light mobile parallax (5% only to prevent mobile scroll desync)
        gsap.to(img, {
          yPercent: -5,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })

      // 4. MOBILE CARDS: Sequential stagger with 20px travel
      const cardGrids = document.querySelectorAll<HTMLElement>('[data-gsap="card-grid"]')
      cardGrids.forEach((grid) => {
        const cards = grid.children
        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.05,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: grid,
                start: 'top 88%',
                toggleActions: 'play reverse play reverse',
              },
            }
          )
        }
      })
    })

    // 3. Ensure ScrollTrigger accurately calculates positions once all media has resolved
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 400)

    // 4. Clean up all GSAP matchMedia contexts and ScrollTriggers on unmount
    return () => {
      clearTimeout(refreshTimer)
      mm.revert()
    }
  }, [])

  return null
}
