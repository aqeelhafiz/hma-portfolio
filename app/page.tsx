'use client'

import { useEffect, useRef, useState, useCallback, memo, type ReactNode } from 'react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useInView,
  easeInOut,
  type MotionValue,
} from 'framer-motion'
import SnakeMarquee from '@/src/components/ui/SnakeMarquee'
import Reveal from '@/src/components/ui/reveal'
import { ChevronUp, ChevronDown, Volume2, VolumeX, Sparkles, ArrowUpRight, X, Maximize2, Play } from 'lucide-react'
import {
  springs,
  springViewport,
  createFadeUpVariant,
  createFromTopVariant,
  createFromSideVariant,
  createPopInVariant,
  createStaggerContainer,
  createCardSpringVariant,
  tagContainerVariant,
  tagPopInVariant,
} from '@/lib/motion'

/* ============================================================
   DESIGN TOKENS & SYSTEM
   ============================================================ */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
// Hero choreography synchronizes as the intro loader (2.35s) completes
const HERO_DELAY = 2.35
const CONTAINER = 'relative z-10 mx-auto w-full max-w-[1320px] px-4 sm:px-8 lg:px-12'
const SECTION_Y = 'py-14 sm:py-24 lg:py-32'
// STUDIO CONFIGURATION: Update with your primary domain email if different
const EMAIL = 'inbid8409@gmail.com'
const WHATSAPP_NUMBER = '+923262851468'
const WHATSAPP_URL = 'https://wa.me/923262851468'

const NAV_ITEMS = [
  { label: 'Work', href: '#work', id: 'work' },
  { label: 'Services', href: '#services', id: 'services' },
  { label: 'Process', href: '#process', id: 'process' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Contact', href: '#contact', id: 'contact' },
]

const PROJECTS = [
  {
    n: '01',
    category: 'AI Web Design',
    title: 'WaqasGFX',
    description:
      'A custom portfolio experience for a thumbnail designer and video editor, combining a distinctive visual identity with modern web development.',
    src: 'https://res.cloudinary.com/ds6xosm2j/video/upload/f_auto,q_auto/v1790316294/Screen_Recording_2026-09-14_185240_pobr0u.mp4',
    vertical: false,
    formatLabel: 'Interactive Web',
  },
  {
    n: '02',
    category: 'AI UGC Commercial',
    title: 'Sneaker Campaign',
    description:
      'A cinematic AI-generated sneaker campaign featuring realistic materials, studio-inspired lighting, and social-first creative direction.',
    src: 'https://res.cloudinary.com/ds6xosm2j/video/upload/f_auto,q_auto/v1790316374/Creating_fashion_video_with_snea__20260918153012_wooon2.mp4',
    vertical: true,
    formatLabel: 'Vertical Reel',
  },
  {
    n: '03',
    category: 'CGI Commercial',
    title: 'Perfume Film',
    description:
      'A luxury-inspired fragrance film built around atmospheric lighting, fluid visuals, and cinematic product storytelling.',
    src: 'https://res.cloudinary.com/ds6xosm2j/video/upload/f_auto,q_auto/v1790316408/Man_spraying_perfume_1080p_20260918154146_nd9suw.mp4',
    vertical: false,
    formatLabel: 'Cinematic CGI',
  },
]

interface SelectedWorkItem {
  n: string
  title: string
  tag: string
  description: string
  client: string
  role: string
  stack: string
  badge: string
  src: string
  poster?: string
  aspect: 'landscape' | 'portrait'
  vertical: boolean
  buttonType: 'web' | 'film'
  siteUrl?: string
}

const SELECTED_PROJECTS: SelectedWorkItem[] = [
  {
    n: '01',
    title: 'WaqasGFX',
    tag: 'WEBSITE DESIGN & DEVELOPMENT',
    description:
      'A custom portfolio experience for a thumbnail designer and video editor, combining a distinctive visual identity with modern web development.',
    client: 'WaqasGFX',
    role: 'Lead Dev & Design',
    stack: 'Next.js · Framer Motion',
    badge: 'INTERACTIVE WEB',
    src: 'https://res.cloudinary.com/ds6xosm2j/video/upload/f_auto,q_auto/v1790316294/Screen_Recording_2026-09-14_185240_pobr0u.mp4',
    poster: 'https://res.cloudinary.com/ds6xosm2j/video/upload/f_auto,q_auto,so_2/v1790316294/Screen_Recording_2026-09-14_185240_pobr0u.jpg',
    aspect: 'landscape',
    vertical: false,
    buttonType: 'web',
    siteUrl: 'https://waqasgfx.com',
  },
  {
    n: '02',
    title: 'Sneaker Campaign',
    tag: 'VERTICAL REEL & AI COMMERCIAL',
    description:
      'A cinematic AI-generated sneaker campaign featuring realistic materials, studio-inspired lighting, and social-first creative direction.',
    client: 'Concept Project',
    role: 'AI Film Direction',
    stack: 'Generative AI · 4K CGI',
    badge: 'VERTICAL REEL (9:16)',
    src: 'https://res.cloudinary.com/ds6xosm2j/video/upload/f_auto,q_auto/v1790316374/Creating_fashion_video_with_snea__20260918153012_wooon2.mp4',
    poster:
      'https://res.cloudinary.com/ds6xosm2j/video/upload/f_auto,q_auto,so_1/v1790316374/Creating_fashion_video_with_snea__20260918153012_wooon2.jpg',
    aspect: 'portrait',
    vertical: true,
    buttonType: 'film',
  },
  {
    n: '03',
    title: 'Perfume Film',
    tag: 'CGI PRODUCT COMMERCIAL',
    description:
      'A luxury-inspired fragrance film built around atmospheric lighting, fluid visuals, and cinematic product storytelling.',
    client: 'Concept Project',
    role: 'Generative CGI',
    stack: 'CGI Simulation · Sound Design',
    badge: 'CINEMATIC CGI (16:9)',
    src: 'https://res.cloudinary.com/ds6xosm2j/video/upload/f_auto,q_auto/v1790316408/Man_spraying_perfume_1080p_20260918154146_nd9suw.mp4',
    poster:
      'https://res.cloudinary.com/ds6xosm2j/video/upload/f_auto,q_auto,so_1/v1790316408/Man_spraying_perfume_1080p_20260918154146_nd9suw.jpg',
    aspect: 'landscape',
    vertical: false,
    buttonType: 'film',
  },
]

interface TestimonialItem {
  id: string
  name: string
  company?: string
  service: string
  review: string
  featured?: boolean
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'james',
    name: 'James',
    service: 'AI Ads · Creative Editing',
    review:
      'Honestly, the AI ads turned out way better than I expected. The videos looked real, the editing was clean, and the hooks actually made my products look interesting. Really happy with how they came out.',
    featured: false,
  },
  {
    id: 'waqas',
    name: 'Waqas',
    company: 'WaqasGFX',
    service: 'Website Design & Development',
    review:
      'Hafiz Aqeel did a great job with my website. I wanted something clean but still different from other design portfolios, and he understood the vibe pretty quickly. The animations and overall look came out really nice. Small details made a big difference.',
    featured: true,
  },
  {
    id: 'emma',
    name: 'Emma',
    service: 'AI Ads · Product Videos',
    review:
      'The AI video ads came out really good. The product shots looked natural and the editing kept everything interesting without making it feel overdone. Definitely a much better way to show my products on social media.',
    featured: false,
  },
]

const SERVICES = [
  {
    letter: 'A',
    n: '01',
    title: 'Website Design & Development',
    eyebrow: 'Interactive Engineering',
    description:
      'High-performance bespoke websites and web applications built with Next.js, bespoke micro-interactions, and AI workflows.',
    deliverables: 'Design system · Next.js codebase · Responsive mobile QA',
    ctaLabel: 'Discuss a Website Project',
    inquiryMessage: "Hi HMA, I'd like to discuss a website project.",
    tags: ['UI/UX Design', 'Next.js 16', 'Framer Motion', 'TypeScript'],
  },
  {
    letter: 'B',
    n: '02',
    title: 'Product & UGC Commercials',
    eyebrow: 'Generative Cinema',
    description:
      'Photorealistic generative CGI commercials, AI product visuals, and high-converting video assets engineered for premium digital campaigns.',
    deliverables: '4K master cut · Social variations (9:16 & 16:9) · Sound design',
    ctaLabel: 'Discuss an AI Ad',
    inquiryMessage: "Hi HMA, I'd like to discuss an AI ad campaign.",
    tags: ['AI Video', 'CGI Commercials', 'Product Visuals', 'UGC Ads'],
  },
  {
    letter: 'C',
    n: '03',
    title: 'Creative Systems & Automations',
    eyebrow: 'Scalable Intelligence',
    description:
      'Tailored AI visual architectures and automation pipelines that eliminate production bottlenecks and scale creative output.',
    deliverables: 'Custom AI pipeline · Workflow architecture · Integration support',
    ctaLabel: 'Discuss a Creative Project',
    inquiryMessage: "Hi HMA, I'd like to discuss a creative automation project.",
    tags: ['AI Pipelines', 'Python', 'LLM Agents', 'Automation'],
  },
]

const STEPS = [
  {
    n: '01',
    phase: 'Phase 01',
    estimate: '~3–5 Days',
    subtitle: 'Strategic Scope',
    title: 'Discover',
    description:
      'Align on core objectives, technical constraints, visual narrative, and user architecture before writing code.',
    deliverables: ['Scope Matrix', 'User Journeys', 'Moodboard'],
  },
  {
    n: '02',
    phase: 'Phase 02',
    estimate: '~1–2 Weeks',
    subtitle: 'High-Fidelity Architecture',
    title: 'Design',
    description:
      'Architect bespoke high-fidelity UI, typography hierarchy, motion patterns, and design systems with obsessive restraint.',
    deliverables: ['Figma System', 'Interaction Models', '3D UI Specs'],
  },
  {
    n: '03',
    phase: 'Phase 03',
    estimate: '~2–3 Weeks',
    subtitle: 'Production Engineering',
    title: 'Build',
    description:
      'Engineer production-grade Next.js frontend, generative AI pipelines, micro-interactions, and robust TypeScript code.',
    deliverables: ['Clean TypeScript', 'AI Pipelines', 'Motion Engine'],
  },
  {
    n: '04',
    phase: 'Phase 04',
    estimate: '~3–5 Days',
    subtitle: 'Global Deployment',
    title: 'Launch',
    description:
      'Rigorous performance tuning, cross-device QA, edge CDN optimization, and zero-downtime deployment for launch readiness.',
    deliverables: ['Vercel Edge Deploy', 'Lighthouse 95+', 'Asset Vault'],
  },
]

const TOOLS = [
  { name: 'Claude', imgSrc: '/images/logo_claude_opt.png' },
  { name: 'ChatGPT', imgSrc: '/images/logo_chatgpt_opt.png' },
  { name: 'Higgsfield', imgSrc: '/images/logo_higgsfield_opt.png' },
  { name: 'React', imgSrc: '/images/logo_react_opt.jpg' },
  { name: 'Next.js', imgSrc: '/images/logo_nextjs_opt.png' },
  { name: 'Node.js', imgSrc: '/images/logo_nodejs_opt.jpg' },
  { name: 'Figma', imgSrc: '/images/logo_figma_opt.png' },
  { name: 'TypeScript', imgSrc: '/images/logo_typescript_opt.png' },
  { name: 'Tailwind CSS', imgSrc: '/images/logo_tailwindcss_opt.jpg' },
  { name: 'Python', imgSrc: '/images/logo_python_opt.jpg' },
]

interface SocialItem {
  name: string
  url?: string
  path: string
}

const FACEBOOK_URL = 'https://web.facebook.com/hma.solutions1'

// STUDIO CONFIGURATION: Update with your verified social handles
const SOCIALS: SocialItem[] = [
  {
    name: 'WhatsApp',
    url: WHATSAPP_URL,
    path: 'M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44s-.56-1.35-.77-1.85c-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29',
  },
  {
    name: 'Facebook',
    url: FACEBOOK_URL,
    path: 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.704 0-1.527.186-1.748.595-.145.267-.184.697-.184 1.411v1.974h4.156l-.547 3.667h-3.609v7.98h-4.832z',
  },
]

const FAQS = [
  {
    q: 'What services do you provide?',
    a: 'I design and build bespoke high-performance websites, produce AI-powered product and commercial video assets, and engineer creative automation workflows for founders and digital brands.',
  },
  {
    q: 'How is project pricing determined?',
    a: 'Pricing is structured on a clear, flat project basis based on technical scope, design complexity, and schedule requirements. You receive an itemized proposal with clear milestones and no hidden surprises.',
  },
  {
    q: 'How do revisions and milestone approvals work?',
    a: 'Work moves through deliberate checkpoints: discovery, high-fidelity design, and engineering preview. We review progress collaboratively at each stage so you are in control before moving forward.',
  },
  {
    q: 'Who owns the final code and creative assets?',
    a: 'You retain full intellectual property ownership of all custom code repositories, UI designs, and rendered master assets upon project completion and final settlement.',
  },
  {
    q: 'How long does a typical project take?',
    a: 'Timelines vary by scope. A focused portfolio or landing page typically takes 2 to 3 weeks, while custom web applications or multi-asset AI commercial campaigns generally range between 3 to 6 weeks.',
  },
  {
    q: 'Do you collaborate with international clients?',
    a: 'Yes. I partner with founders and brands worldwide, using structured asynchronous Figma reviews, video walk-throughs, and direct messaging to maintain velocity across time zones.',
  },
  {
    q: 'How do we start a project?',
    a: "Reach out via WhatsApp or email with your project overview, timeline, and goals. We'll review your scope and determine the right creative and technical approach.",
  },
]

/* ============================================================
   EDITORIAL PRIMITIVES & COMPONENTS
   ============================================================ */

/** Editorial serif italic accent with signature playful bounce */
function Serif({ children }: { children: ReactNode }) {
  return (
    <motion.span
      variants={{
        hidden: { scale: 0.92, y: -2 },
        visible: {
          scale: 1,
          y: 0,
          transition: springs.bouncy,
        },
      }}
      className="inline-block font-serif italic font-normal tracking-[-0.01em]"
    >
      {children}
    </motion.span>
  )
}

/** Small uppercase eyebrow with section index */
function Eyebrow({ index, children, className = '' }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-[#536174] ${className}`}>
      {index && <span className="tabular-nums text-[#15202F] font-semibold">({index})</span>}
      <span className="tracking-[0.16em]">{children}</span>
    </p>
  )
}

/** Smooth spring scroll reveal with replayable viewport trigger and reduced-motion support */
function FadeIn({
  children,
  delay = 0,
  y = 24,
  className = '',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={springViewport}
      variants={{
        hidden: {
          opacity: 0,
          y: reduce ? 0 : y,
          transition: springs.exit,
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: { ...springs.base, delay },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

/** Masked line-by-line editorial reveal with spring physics, replayable viewport trigger and soft blur-to-sharp */
function MaskText({
  lines,
  delay = 0,
  stagger = 0.08,
  fromTop = false,
  animate,
}: {
  lines: ReactNode[]
  delay?: number
  onMount?: boolean
  stagger?: number
  fromTop?: boolean
  animate?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.span
      className="block"
      initial="hidden"
      {...(animate
        ? { animate }
        : {
            whileInView: 'visible',
            viewport: springViewport,
          })}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
          <motion.span
            className="block will-change-transform"
            variants={{
              hidden: {
                y: reduce ? '0%' : fromTop ? '-108%' : '108%',
                opacity: reduce ? 1 : 0,
                transition: springs.exit,
              },
              visible: {
                y: '0%',
                opacity: 1,
                transition: {
                  ...springs.base,
                  delay: delay + i * stagger,
                },
              },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

/** Subtle magnetic attraction for mouse pointers */
function Magnetic({ children, strength = 0.25, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 240, damping: 20, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 240, damping: 20, mass: 0.4 })

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      className={`inline-flex ${className}`}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse' || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

/** Primary CTA with interactive arrow disc */
function PrimaryCTA({
  href,
  children,
  size = 'md',
  target,
  rel,
}: {
  href: string
  children: ReactNode
  size?: 'md' | 'lg'
  target?: string
  rel?: string
}) {
  const lg = size === 'lg'
  return (
    <Magnetic strength={0.25}>
      <a
        href={href}
        target={target}
        rel={rel}
        className={`group relative inline-flex items-center gap-3 sm:gap-4 rounded-full bg-[#15202F] text-white font-medium shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_18px_40px_-18px_rgba(21,32,47,0.45)] transition-all duration-500 hover:bg-[#0f1722] hover:shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_24px_50px_-18px_rgba(21,32,47,0.55)] hover:-translate-y-0.5 active:translate-y-0 ${
          lg
            ? 'h-12 xs:h-13 sm:h-[72px] pl-6 xs:pl-7 sm:pl-10 pr-1.5 sm:pr-2 text-[13.5px] xs:text-[14.5px] sm:text-lg'
            : 'h-10 xs:h-11 sm:h-14 pl-5 xs:pl-6 sm:pl-7 pr-1.5 sm:pr-2 text-[12.5px] xs:text-[13.5px] sm:text-[15px]'
        }`}
      >
        <span>{children}</span>
        <span
          className={`grid place-items-center rounded-full bg-white text-[#15202F] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-45 ${
            lg ? 'h-9 w-9 xs:h-10 xs:w-10 sm:h-14 sm:w-14' : 'h-7 w-7 xs:h-8 xs:w-8 sm:h-10 sm:w-10'
          }`}
          aria-hidden="true"
        >
          →
        </span>
      </a>
    </Magnetic>
  )
}

/** Section header grid across Work / Services / Process with customizable heading scale */
function SectionHeader({
  index,
  label,
  title,
  intro,
  titleClassName = 'text-[21px] xs:text-[24px] sm:text-[clamp(1.9rem,3.8vw,3.3rem)]',
}: {
  index: string
  label: string
  title: ReactNode[]
  intro?: string
  titleClassName?: string
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-2.5 sm:gap-y-6 gap-x-10 mb-6 sm:mb-16 lg:mb-24">
      <FadeIn className="lg:col-span-4 lg:pt-3">
        <Eyebrow index={index}>{label}</Eyebrow>
      </FadeIn>
      <div className="lg:col-span-8">
        <h2 className={`${titleClassName} font-medium leading-[1.08] sm:leading-[1.02] tracking-[-0.035em] sm:tracking-[-0.04em] text-[#15202F]`}>
          <MaskText lines={title} />
        </h2>
        {intro && (
          <FadeIn delay={0.15}>
            <p className="mt-2 sm:mt-5 max-w-[520px] text-[12.5px] xs:text-[13px] sm:text-[17px] leading-[1.5] sm:leading-[1.6] text-[#536174]">{intro}</p>
          </FadeIn>
        )}
      </div>
    </div>
  )
}

/* ============================================================
   SELECTED WORK: LIGHT THEME STICKY STACKING CARDS & MOBILE STACK
   ============================================================ */

function DesktopCardContent({
  project,
  alternate,
  onOpenVideo,
  isActive = true,
}: {
  project: SelectedWorkItem
  alternate: boolean
  onOpenVideo: (p: SelectedWorkItem) => void
  isActive?: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (!isActive) {
      v.pause()
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && isActive) {
          const p = v.play()
          if (p !== undefined) p.catch(() => {})
        } else {
          v.pause()
        }
      },
      { threshold: 0.15 }
    )
    io.observe(v)
    return () => io.disconnect()
  }, [isActive])

  return (
    <article
      data-cursor="view"
      className="relative w-full min-h-[calc(100svh-140px)] max-h-[calc(100svh-100px)] h-[min(calc(100svh-120px),780px)] rounded-[28px] lg:rounded-[32px] bg-white border border-[rgba(15,23,42,0.06)] shadow-[0_24px_60px_-24px_rgba(15,23,42,0.18)] p-6 lg:p-8 xl:p-10 flex flex-col justify-between overflow-hidden select-none hover:-translate-y-1.5 transition-all duration-500 hover:shadow-[0_32px_70px_-24px_rgba(15,23,42,0.22)]"
    >
      {/* 1. TOP ROW */}
      <div className="flex items-center justify-between pb-4 border-b border-[rgba(15,23,42,0.06)] w-full">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4F5F7] border border-[rgba(15,23,42,0.06)] text-[12px] font-mono uppercase tracking-[0.12em] text-[#0F172A] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            Project {project.n}
          </span>
          <span className="text-[12px] font-mono uppercase tracking-[0.1em] text-[#5B6475] hidden sm:inline">
            {project.tag}
          </span>
        </div>
        <span className="text-[12px] font-mono tracking-wider text-[#0F172A] font-bold">
          {project.n} / 03
        </span>
      </div>

      {/* 2. MAIN 2-COLUMN GRID (5fr text : 7fr preview, gap at least 48px) */}
      <div className="grid grid-cols-12 gap-10 lg:gap-14 items-center flex-1 my-auto py-2">
        {/* TEXT COLUMN (5fr) */}
        <div
          className={`col-span-12 lg:col-span-5 flex flex-col justify-center text-left ${
            alternate ? 'lg:order-2' : 'lg:order-1'
          }`}
        >
          {/* Category Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4F5F7] border border-[rgba(15,23,42,0.06)] text-[12px] font-mono uppercase tracking-[0.12em] text-[#0F172A] w-fit mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            <span>{project.tag}</span>
          </div>

          {/* Title: clamp(2.25rem, 4.5vw, 4.5rem), weight 600, max 2 lines */}
          <h3 className="text-[clamp(2.25rem,4.2vw,4.5rem)] font-semibold tracking-[-0.03em] text-[#0F172A] leading-[1.04] line-clamp-2">
            {project.title}
          </h3>

          {/* Description: 16 to 18px, line-height 1.6, color --ink-2, max 46ch */}
          <p className="mt-3.5 text-[16px] lg:text-[17px] leading-[1.6] text-[#5B6475] max-w-[46ch] line-clamp-3">
            {project.description}
          </p>

          {/* Meta: Tidy 3-column list (CLIENT / ROLE / STACK) */}
          <div className="grid grid-cols-3 gap-3 pt-5 mt-5 border-t border-[rgba(15,23,42,0.06)]">
            <div>
              <span className="block text-[12px] font-mono uppercase tracking-[0.08em] text-[#8A93A3] mb-1">
                CLIENT
              </span>
              <span className="block text-[13.5px] lg:text-[14px] font-medium text-[#0F172A] leading-snug">
                {project.client}
              </span>
            </div>
            <div>
              <span className="block text-[12px] font-mono uppercase tracking-[0.08em] text-[#8A93A3] mb-1">
                ROLE
              </span>
              <span className="block text-[13.5px] lg:text-[14px] font-medium text-[#0F172A] leading-snug">
                {project.role}
              </span>
            </div>
            <div>
              <span className="block text-[12px] font-mono uppercase tracking-[0.08em] text-[#8A93A3] mb-1">
                STACK
              </span>
              <span className="block text-[13.5px] lg:text-[14px] font-medium text-[#0F172A] leading-snug">
                {project.stack}
              </span>
            </div>
          </div>

          {/* Button: "View Site" for web, "Watch Film" for film */}
          <div className="mt-6 flex items-center gap-3">
            {project.buttonType === 'web' ? (
              <div className="flex items-center gap-2.5">
                <a
                  href={project.siteUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0F172A] text-white text-[13.5px] font-semibold tracking-tight shadow-md hover:bg-[#1E293B] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0F172A] focus-visible:outline-none"
                >
                  <span>View Site</span>
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </a>
                <button
                  type="button"
                  onClick={() => onOpenVideo(project)}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#F4F5F7] border border-[rgba(15,23,42,0.08)] text-[#0F172A] text-[13px] font-medium hover:bg-[#EAECEF] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0F172A]"
                >
                  <Play className="w-3.5 h-3.5 fill-[#0F172A]" />
                  <span>Preview Video</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onOpenVideo(project)}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#0F172A] text-white text-[13.5px] font-semibold tracking-tight shadow-md hover:bg-[#1E293B] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0F172A] focus-visible:outline-none"
              >
                <Play className="w-3.5 h-3.5 fill-white text-white" />
                <span>Watch Film</span>
              </button>
            )}
          </div>
        </div>

        {/* PREVIEW COLUMN (7fr) */}
        <div
          className={`col-span-12 lg:col-span-7 relative flex items-center justify-center h-full min-h-[320px] ${
            alternate ? 'lg:order-1' : 'lg:order-2'
          }`}
        >
          <div
            onClick={() => onOpenVideo(project)}
            className={`group/preview relative cursor-pointer overflow-hidden bg-[#EEF0F3] border border-[rgba(15,23,42,0.08)] shadow-[0_16px_36px_-16px_rgba(15,23,42,0.12)] transition-all duration-300 hover:shadow-[0_22px_45px_-16px_rgba(15,23,42,0.2)] ${
              project.vertical
                ? 'aspect-[9/16] h-[min(calc(100svh-260px),500px)] w-auto max-w-[280px] rounded-[22px]'
                : 'aspect-[16/9] w-full max-w-[620px] max-h-[calc(100svh-260px)] rounded-[22px]'
            }`}
          >
            <video
              ref={videoRef}
              src={project.src}
              poster={project.poster}
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />

            {/* Hover to Open Overlay */}
            <div className="absolute inset-0 bg-[#0F172A]/15 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#0F172A] text-[12px] font-semibold shadow-lg">
                <Play className="w-3.5 h-3.5 fill-[#0F172A]" />
                <span>{project.buttonType === 'web' ? 'Preview Case Study' : 'Watch Film'}</span>
              </div>
            </div>

            {/* Top Left Pill */}
            <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-black/10 text-[11px] font-mono uppercase tracking-wider text-[#0F172A] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              <span>{project.badge}</span>
            </div>

            {/* Top Right Expand Icon */}
            <div className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-white/90 backdrop-blur-md border border-black/10 text-[#0F172A] shadow-sm group-hover/preview:scale-105 transition-transform">
              <Maximize2 className="w-3.5 h-3.5" />
            </div>

            {/* Bottom Counter Bar */}
            <div className="absolute bottom-3.5 left-3.5 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-black/10 text-[11px] font-mono text-[#0F172A] shadow-sm">
              <span className="font-bold text-[#0F172A]">{project.n}</span>
              <span className="text-[#8A93A3]">/</span>
              <span className="text-[#8A93A3]">03</span>
              <span className="h-2.5 w-px bg-black/10 mx-0.5" />
              <span className="text-[#0F172A] font-sans text-[11px] font-medium">{project.title}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function DesktopSelectedWork({ onOpenVideo }: { onOpenVideo: (p: SelectedWorkItem) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [isInSection, setIsInSection] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)

  // Track scroll progress through the pinned track (0 to 1)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Sync activeIdx with scroll progress:
  // 0.00 - 0.28: Project 1 (WaqasGFX)
  // 0.28 - 0.72: Project 2 (Sneaker Campaign)
  // 0.72 - 1.00: Project 3 (Perfume Film)
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      if (v < 0.28) {
        setActiveIdx(0)
      } else if (v < 0.72) {
        setActiveIdx(1)
      } else {
        setActiveIdx(2)
      }
    })
    return () => unsub()
  }, [scrollYProgress])

  // Track section entry/exit for floating progress bar visibility
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        setIsInSection(entry.isIntersecting)
      },
      {
        rootMargin: '-5% 0px -5% 0px',
        threshold: 0,
      }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Smooth scroll to card when clicking indicator dot
  const scrollToCard = (index: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const scrollTop = window.scrollY || window.pageYOffset
    const startTop = scrollTop + rect.top
    const totalPinnedScroll = containerRef.current.offsetHeight - window.innerHeight
    const targetProgress = index === 0 ? 0.04 : index === 1 ? 0.50 : 0.95
    const targetY = startTop + totalPinnedScroll * targetProgress
    window.scrollTo({ top: targetY, behavior: 'smooth' })
  }

  // Card 0 (Project 01: WaqasGFX): Centered at start, exits to LEFT on Transition 1
  const x0 = useTransform(
    scrollYProgress,
    [0, 0.12, 0.44, 1],
    reduce ? ['0vw', '0vw', '0vw', '0vw'] : ['0vw', '0vw', '-100vw', '-100vw'],
    { clamp: true }
  )
  const opacity0 = useTransform(
    scrollYProgress,
    [0, 0.12, 0.38, 0.44, 1],
    [1, 1, 0.05, 0, 0],
    { clamp: true }
  )

  // Card 1 (Project 02: Sneaker Campaign): Slides in from RIGHT, exits to RIGHT on Transition 2
  const x1 = useTransform(
    scrollYProgress,
    [0, 0.12, 0.44, 0.56, 0.88, 1],
    reduce
      ? ['0vw', '0vw', '0vw', '0vw', '0vw', '0vw']
      : ['100vw', '100vw', '0vw', '0vw', '100vw', '100vw'],
    { clamp: true }
  )
  const opacity1 = useTransform(
    scrollYProgress,
    [0, 0.12, 0.16, 0.44, 0.56, 0.84, 0.88, 1],
    [0, 0, 0.05, 1, 1, 0.05, 0, 0],
    { clamp: true }
  )

  // Card 2 (Project 03: Perfume Film): Slides in from LEFT on Transition 2, stays centered until pin release
  const x2 = useTransform(
    scrollYProgress,
    [0, 0.56, 0.88, 1],
    reduce ? ['0vw', '0vw', '0vw', '0vw'] : ['-100vw', '-100vw', '0vw', '0vw'],
    { clamp: true }
  )
  const opacity2 = useTransform(
    scrollYProgress,
    [0, 0.56, 0.60, 0.88, 1],
    [0, 0, 0.05, 1, 1],
    { clamp: true }
  )

  return (
    <div ref={containerRef} className="relative w-full h-[320vh]">
      {/* Side Progress UI on Desktop (Floating right - ONLY appears while inside Selected Work) */}
      <AnimatePresence>
        {isInSection && (
          <motion.aside
            key="selected-work-progress"
            initial={{ opacity: 0, x: 28, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 28, scale: 0.92 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Selected work progress"
            className="hidden xl:flex fixed right-6 2xl:right-10 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-3 select-none py-3.5 px-2.5 rounded-full bg-white/85 backdrop-blur-md border border-[rgba(15,23,42,0.08)] shadow-[0_8px_30px_rgba(15,23,42,0.08)] pointer-events-auto"
          >
            <div className="flex items-center text-[11px] font-mono font-bold text-[#0F172A] tabular-nums">
              <span className="inline-block overflow-hidden h-[15px] w-[15px]">
                <motion.span
                  key={activeIdx}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                  className="block text-center"
                >
                  0{activeIdx + 1}
                </motion.span>
              </span>
              <span className="text-[#8A93A3] mx-0.5">/</span>
              <span className="text-[#8A93A3]">03</span>
            </div>
            <div className="w-[2px] h-16 bg-neutral-200 rounded-full relative overflow-hidden">
              <motion.div
                animate={{ height: `${((activeIdx + 1) / 3) * 100}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                className="w-full bg-[#0F172A]"
              />
            </div>
            <div className="flex flex-col gap-2">
              {SELECTED_PROJECTS.map((p, idx) => (
                <button
                  key={p.n}
                  onClick={() => scrollToCard(idx)}
                  aria-label={`Scroll to Project ${p.n}: ${p.title}`}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0F172A] focus-visible:outline-none ${
                    activeIdx === idx
                      ? 'bg-[#0F172A] scale-125'
                      : 'bg-[#8A93A3]/40 hover:bg-[#8A93A3]'
                  }`}
                />
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Sticky 100svh Container */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col justify-center pt-20 lg:pt-24 pb-6 px-4 sm:px-8 lg:px-12 z-20">
        <div className="relative w-full max-w-[1320px] mx-auto h-[min(calc(100svh-120px),780px)]">
          {/* CARD 0 (Project 01: WaqasGFX) */}
          <motion.div
            style={{
              x: x0,
              opacity: opacity0,
              zIndex: 10,
              pointerEvents: activeIdx === 0 ? 'auto' : 'none',
              willChange: 'transform, opacity',
            }}
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            <motion.div
              animate={{
                scale: activeIdx === 0 ? 1 : 0.94,
                y: activeIdx === 0 ? 0 : 10,
              }}
              transition={{ ...springs.bouncy }}
              className="w-full h-full flex items-center justify-center"
            >
              <DesktopCardContent
                project={SELECTED_PROJECTS[0]}
                alternate={false}
                onOpenVideo={onOpenVideo}
                isActive={activeIdx === 0}
              />
            </motion.div>
          </motion.div>

          {/* CARD 1 (Project 02: Sneaker Campaign - Alternating preview left) */}
          <motion.div
            style={{
              x: x1,
              opacity: opacity1,
              zIndex: 20,
              pointerEvents: activeIdx === 1 ? 'auto' : 'none',
              willChange: 'transform, opacity',
            }}
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            <motion.div
              animate={{
                scale: activeIdx === 1 ? 1 : 0.94,
                y: activeIdx === 1 ? 0 : 10,
              }}
              transition={{ ...springs.bouncy }}
              className="w-full h-full flex items-center justify-center"
            >
              <DesktopCardContent
                project={SELECTED_PROJECTS[1]}
                alternate={true}
                onOpenVideo={onOpenVideo}
                isActive={activeIdx === 1}
              />
            </motion.div>
          </motion.div>

          {/* CARD 2 (Project 03: Perfume Film) */}
          <motion.div
            style={{
              x: x2,
              opacity: opacity2,
              zIndex: 30,
              pointerEvents: activeIdx === 2 ? 'auto' : 'none',
              willChange: 'transform, opacity',
            }}
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            <motion.div
              animate={{
                scale: activeIdx === 2 ? 1 : 0.94,
                y: activeIdx === 2 ? 0 : 10,
              }}
              transition={{ ...springs.bouncy }}
              className="w-full h-full flex items-center justify-center"
            >
              <DesktopCardContent
                project={SELECTED_PROJECTS[2]}
                alternate={false}
                onOpenVideo={onOpenVideo}
                isActive={activeIdx === 2}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function MobileCardContent({
  project,
  onOpenVideo,
  isActive = true,
}: {
  project: SelectedWorkItem
  onOpenVideo: (p: SelectedWorkItem) => void
  isActive?: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = true
    v.defaultMuted = true
    if (!isActive) {
      v.pause()
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && isActive) {
          const p = v.play()
          if (p !== undefined) p.catch(() => {})
        } else {
          v.pause()
        }
      },
      { threshold: 0.15 }
    )
    io.observe(v)
    return () => io.disconnect()
  }, [isActive])

  return (
    <article className="relative w-full max-w-[420px] mx-auto h-[min(calc(100svh-95px),640px)] rounded-[22px] xs:rounded-[26px] bg-white border border-[rgba(15,23,42,0.08)] p-4 xs:p-5 shadow-[0_16px_40px_-20px_rgba(15,23,42,0.14)] flex flex-col justify-between overflow-hidden select-none">
      {/* 1. Header Row */}
      <div className="flex items-center justify-between pb-2 border-b border-[rgba(15,23,42,0.06)] w-full">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F4F5F7] border border-[rgba(15,23,42,0.06)] text-[10.5px] font-mono uppercase tracking-[0.1em] text-[#0F172A] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
          <span>Project {project.n}</span>
        </div>
        <span className="text-[11px] font-mono tracking-wider text-[#0F172A] font-bold">
          {project.n} / 03
        </span>
      </div>

      {/* 2. Media Preview - sized strictly according to video aspect ratio */}
      <div className="relative w-full my-auto flex justify-center items-center py-1">
        {project.vertical ? (
          <div
            onClick={() => onOpenVideo(project)}
            className="group/mob relative cursor-pointer aspect-[9/16] h-[min(calc(100svh-360px),270px)] min-h-[185px] w-auto rounded-[16px] overflow-hidden bg-[#0F172A]/5 border border-[rgba(15,23,42,0.08)] shadow-sm flex items-center justify-center"
          >
            <video
              ref={videoRef}
              src={project.src}
              poster={project.poster}
              loop
              muted
              playsInline
              // @ts-expect-error webkit prefix for iOS Safari
              webkit-playsinline="true"
              preload="auto"
              className="w-full h-full object-contain"
            />
            <div className="absolute top-2 left-2 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-black/10 text-[9px] font-mono font-medium text-[#0F172A] uppercase shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              <span>{project.badge}</span>
            </div>
            <div className="absolute inset-0 bg-[#0F172A]/15 opacity-0 active:opacity-100 transition-opacity flex items-center justify-center">
              <div className="p-2 rounded-full bg-white text-[#0F172A] shadow-md">
                <Play className="w-3.5 h-3.5 fill-[#0F172A]" />
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => onOpenVideo(project)}
            className="group/mob relative cursor-pointer aspect-[16/9] w-full rounded-[16px] overflow-hidden bg-[#0F172A]/5 border border-[rgba(15,23,42,0.08)] shadow-sm flex items-center justify-center"
          >
            <video
              ref={videoRef}
              src={project.src}
              poster={project.poster}
              loop
              muted
              playsInline
              // @ts-expect-error webkit prefix for iOS Safari
              webkit-playsinline="true"
              preload="auto"
              className="w-full h-full object-contain"
            />
            <div className="absolute top-2 left-2 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-black/10 text-[9px] font-mono font-medium text-[#0F172A] uppercase shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              <span>{project.badge}</span>
            </div>
            <div className="absolute inset-0 bg-[#0F172A]/15 opacity-0 active:opacity-100 transition-opacity flex items-center justify-center">
              <div className="p-2 rounded-full bg-white text-[#0F172A] shadow-md">
                <Play className="w-3.5 h-3.5 fill-[#0F172A]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Text & Meta Info */}
      <div className="w-full flex flex-col gap-1 text-left">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.1em] text-[#5B6475]">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
          <span>{project.tag}</span>
        </div>

        <h3 className="text-[clamp(1.4rem,5.5vw,1.85rem)] font-semibold tracking-[-0.03em] text-[#0F172A] leading-[1.08]">
          {project.title}
        </h3>

        <p className="text-[12px] xs:text-[12.5px] leading-[1.48] text-[#5B6475] line-clamp-2">
          {project.description}
        </p>

        {/* 3-column Meta */}
        <div className="grid grid-cols-3 gap-2 pt-2 pb-1 border-t border-[rgba(15,23,42,0.06)] text-left">
          <div>
            <span className="block text-[9.5px] font-mono uppercase tracking-[0.08em] text-[#8A93A3]">
              CLIENT
            </span>
            <span className="block text-[11px] xs:text-[11.5px] font-medium text-[#0F172A] truncate">
              {project.client}
            </span>
          </div>
          <div>
            <span className="block text-[9.5px] font-mono uppercase tracking-[0.08em] text-[#8A93A3]">
              ROLE
            </span>
            <span className="block text-[11px] xs:text-[11.5px] font-medium text-[#0F172A] truncate">
              {project.role}
            </span>
          </div>
          <div>
            <span className="block text-[9.5px] font-mono uppercase tracking-[0.08em] text-[#8A93A3]">
              STACK
            </span>
            <span className="block text-[11px] xs:text-[11.5px] font-medium text-[#0F172A] truncate">
              {project.stack}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="pt-2 border-t border-[rgba(15,23,42,0.06)] w-full">
        {project.buttonType === 'web' ? (
          <div className="flex gap-2 w-full">
            <a
              href={project.siteUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-10 xs:h-11 min-h-[40px] flex items-center justify-center gap-1.5 rounded-full bg-[#0F172A] text-white text-[12.5px] font-semibold tracking-tight shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
            >
              <span>View Site</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white" />
            </a>
            <button
              type="button"
              onClick={() => onOpenVideo(project)}
              className="h-10 xs:h-11 min-h-[40px] px-3.5 flex items-center justify-center gap-1.5 rounded-full bg-[#F4F5F7] border border-[rgba(15,23,42,0.08)] text-[#0F172A] text-[12px] font-medium active:scale-[0.98] transition-transform cursor-pointer"
            >
              <Play className="w-3 h-3 fill-[#0F172A]" />
              <span>Video</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onOpenVideo(project)}
            className="w-full h-10 xs:h-11 min-h-[40px] flex items-center justify-center gap-2 rounded-full bg-[#0F172A] text-white text-[12.5px] font-semibold tracking-tight shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white text-white" />
            <span>Watch Film</span>
          </button>
        )}
      </div>
    </article>
  )
}

function MobileSelectedWork({ onOpenVideo }: { onOpenVideo: (p: SelectedWorkItem) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [activeIdx, setActiveIdx] = useState(0)

  // Track scroll progress through the pinned track (0 to 1)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      if (v < 0.28) {
        setActiveIdx(0)
      } else if (v < 0.72) {
        setActiveIdx(1)
      } else {
        setActiveIdx(2)
      }
    })
    return () => unsub()
  }, [scrollYProgress])

  // Smooth scroll to card when tapping indicator dot
  const scrollToCard = (index: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const scrollTop = window.scrollY || window.pageYOffset
    const startTop = scrollTop + rect.top
    const totalPinnedScroll = containerRef.current.offsetHeight - window.innerHeight
    const targetProgress = index === 0 ? 0.04 : index === 1 ? 0.50 : 0.95
    const targetY = startTop + totalPinnedScroll * targetProgress
    window.scrollTo({ top: targetY, behavior: 'smooth' })
  }

  // Card 0 (WaqasGFX): Centered at start, exits to LEFT
  const x0 = useTransform(
    scrollYProgress,
    [0, 0.12, 0.44, 1],
    reduce ? ['0vw', '0vw', '0vw', '0vw'] : ['0vw', '0vw', '-100vw', '-100vw'],
    { clamp: true }
  )
  const opacity0 = useTransform(
    scrollYProgress,
    [0, 0.12, 0.38, 0.44, 1],
    [1, 1, 0.05, 0, 0],
    { clamp: true }
  )

  // Card 1 (Sneaker Campaign): Slides in from RIGHT, exits to RIGHT
  const x1 = useTransform(
    scrollYProgress,
    [0, 0.12, 0.44, 0.56, 0.88, 1],
    reduce
      ? ['0vw', '0vw', '0vw', '0vw', '0vw', '0vw']
      : ['100vw', '100vw', '0vw', '0vw', '100vw', '100vw'],
    { clamp: true }
  )
  const opacity1 = useTransform(
    scrollYProgress,
    [0, 0.12, 0.16, 0.44, 0.56, 0.84, 0.88, 1],
    [0, 0, 0.05, 1, 1, 0.05, 0, 0],
    { clamp: true }
  )

  // Card 2 (Perfume Film): Slides in from LEFT, stays until pin release
  const x2 = useTransform(
    scrollYProgress,
    [0, 0.56, 0.88, 1],
    reduce ? ['0vw', '0vw', '0vw', '0vw'] : ['-100vw', '-100vw', '0vw', '0vw'],
    { clamp: true }
  )
  const opacity2 = useTransform(
    scrollYProgress,
    [0, 0.56, 0.60, 0.88, 1],
    [0, 0, 0.05, 1, 1],
    { clamp: true }
  )

  return (
    <div ref={containerRef} className="relative w-full h-[300vh]">
      {/* Sticky 100svh Container */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col justify-center pt-14 xs:pt-16 pb-3 px-3.5 xs:px-4 z-20">
        <div className="relative w-full max-w-[420px] mx-auto h-[min(calc(100svh-95px),640px)]">
          {/* CARD 0 (Project 01: WaqasGFX) */}
          <motion.div
            style={{
              x: x0,
              opacity: opacity0,
              zIndex: 10,
              pointerEvents: activeIdx === 0 ? 'auto' : 'none',
              willChange: 'transform, opacity',
            }}
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            <motion.div
              animate={{
                scale: activeIdx === 0 ? 1 : 0.95,
                y: activeIdx === 0 ? 0 : 8,
              }}
              transition={{ ...springs.bouncy }}
              className="w-full h-full flex items-center justify-center"
            >
              <MobileCardContent
                project={SELECTED_PROJECTS[0]}
                onOpenVideo={onOpenVideo}
                isActive={activeIdx === 0}
              />
            </motion.div>
          </motion.div>

          {/* CARD 1 (Project 02: Sneaker Campaign) */}
          <motion.div
            style={{
              x: x1,
              opacity: opacity1,
              zIndex: 20,
              pointerEvents: activeIdx === 1 ? 'auto' : 'none',
              willChange: 'transform, opacity',
            }}
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            <motion.div
              animate={{
                scale: activeIdx === 1 ? 1 : 0.95,
                y: activeIdx === 1 ? 0 : 8,
              }}
              transition={{ ...springs.bouncy }}
              className="w-full h-full flex items-center justify-center"
            >
              <MobileCardContent
                project={SELECTED_PROJECTS[1]}
                onOpenVideo={onOpenVideo}
                isActive={activeIdx === 1}
              />
            </motion.div>
          </motion.div>

          {/* CARD 2 (Project 03: Perfume Film) */}
          <motion.div
            style={{
              x: x2,
              opacity: opacity2,
              zIndex: 30,
              pointerEvents: activeIdx === 2 ? 'auto' : 'none',
              willChange: 'transform, opacity',
            }}
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            <motion.div
              animate={{
                scale: activeIdx === 2 ? 1 : 0.95,
                y: activeIdx === 2 ? 0 : 8,
              }}
              transition={{ ...springs.bouncy }}
              className="w-full h-full flex items-center justify-center"
            >
              <MobileCardContent
                project={SELECTED_PROJECTS[2]}
                onOpenVideo={onOpenVideo}
                isActive={activeIdx === 2}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile Mini Progress Indicator Dots */}
        <div className="flex items-center justify-center gap-2 mt-2 select-none">
          {SELECTED_PROJECTS.map((p, idx) => (
            <button
              key={p.n}
              type="button"
              onClick={() => scrollToCard(idx)}
              aria-label={`Scroll to Project 0${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeIdx === idx ? 'w-6 bg-[#0F172A]' : 'w-2 bg-[#0F172A]/25'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function VideoLightboxModal({
  video,
  onClose,
}: {
  video: SelectedWorkItem | null
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[200] bg-black/92 backdrop-blur-2xl flex flex-col items-center justify-center p-4 sm:p-6"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.35, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl flex flex-col items-center gap-3"
          >
            {/* Modal Top Bar */}
            <div className="w-full flex items-center justify-between px-2 text-white">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider">
                  {video.badge}
                </span>
                <h4 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  {video.title}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                {video.siteUrl && (
                  <a
                    href={video.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#0F172A] text-[12px] font-semibold hover:bg-neutral-100 transition-colors"
                  >
                    <span>Visit Live Site</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={onClose}
                  aria-label="Close video"
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Player */}
            <div
              className={`relative overflow-hidden rounded-2xl bg-black border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex items-center justify-center ${
                video.vertical
                  ? 'h-[75vh] max-h-[720px] aspect-[9/16] w-auto'
                  : 'w-full max-w-4xl aspect-[16/9]'
              }`}
            >
              <video
                src={video.src}
                poster={video.poster}
                autoPlay
                controls
                playsInline
                className="w-full h-full object-contain bg-black"
              />
            </div>

            {/* Caption */}
            <p className="text-xs sm:text-sm text-white/70 max-w-2xl text-center px-4">
              {video.description}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SelectedWorkSection() {
  const [selectedVideo, setSelectedVideo] = useState<SelectedWorkItem | null>(null)

  return (
    <section id="work" className="relative z-10 w-full">
      {/* Mobile Stack (< 1024px) */}
      <div className="block lg:hidden">
        <div className={`${CONTAINER} pt-12 sm:pt-16 pb-4 sm:pb-6`}>
          <SectionHeader
            index="01"
            label="Selected Work"
            titleClassName="text-[24px] xs:text-[28px] sm:text-[clamp(1.85rem,3.5vw,3rem)]"
            title={[
              'Selected work',
              <>
                that <Serif>speaks</Serif> for itself.
              </>,
            ]}
            intro="Websites, commercials, and AI visual systems built with precision and aesthetic restraint."
          />
        </div>
        <div className="w-full">
          <MobileSelectedWork onOpenVideo={setSelectedVideo} />
        </div>
      </div>

      {/* Desktop Sticky Stacking Pattern (>= 1024px) */}
      <div className="hidden lg:block">
        <div className={`${CONTAINER} pt-16 sm:pt-20 pb-4 lg:pb-6`}>
          <SectionHeader
            index="01"
            label="Selected Work"
            titleClassName="text-[clamp(2rem,3.5vw,3.2rem)]"
            title={[
              'Selected work',
              <>
                that <Serif>speaks</Serif> for itself.
              </>,
            ]}
            intro="Websites, commercials, and AI visual systems built with precision and aesthetic restraint."
          />
        </div>
        <div className="w-full">
          <DesktopSelectedWork onOpenVideo={setSelectedVideo} />
        </div>
      </div>

      {/* Shared Lightbox Video Modal */}
      <VideoLightboxModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </section>
  )
}

/* ============================================================
   NAVIGATION
   ============================================================ */

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState<string>('home')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [introDone, setIntroDone] = useState(false)
  const [footerInView, setFooterInView] = useState(false)

  useEffect(() => {
    const isDone =
      (typeof window !== 'undefined' && (window as unknown as { __HMA_INTRO_DONE__?: boolean }).__HMA_INTRO_DONE__) ||
      (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    if (isDone) {
      setIntroDone(true)
      return
    }

    const onIntroComplete = () => setIntroDone(true)
    window.addEventListener('hma:intro-complete', onIntroComplete, { once: true })
    const timer = setTimeout(() => setIntroDone(true), 2500)
    return () => {
      window.removeEventListener('hma:intro-complete', onIntroComplete)
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 30)
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = ['home', 'work', 'services', 'process', 'testimonials', 'faq', 'about', 'contact']
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-30% 0px -50% 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const footer = document.getElementById('footer')
    if (!footer) return
    const io = new IntersectionObserver(
      ([entry]) => {
        setFooterInView(entry.isIntersecting)
      },
      { threshold: 0.08 }
    )
    io.observe(footer)
    return () => io.disconnect()
  }, [])

  const showNav = introDone && !footerInView

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -45 }}
        animate={showNav ? { opacity: 1, y: 0 } : { opacity: 0, y: -45 }}
        transition={{ ...springs.base, delay: showNav ? 0.15 : 0 }}
        className="fixed inset-x-0 top-3 sm:top-5 z-[100] flex justify-center px-3 sm:px-4 pointer-events-none"
      >
        {/* Mobile Header Bar (<md) — Apple Glass Frosted Aesthetic */}
        <div className="flex md:hidden w-full max-w-[390px] items-center justify-between pointer-events-auto">
          <div
            className={`w-full flex items-center justify-between rounded-full border px-4 py-2 transition-all duration-500 backdrop-blur-2xl backdrop-saturate-[180%] ${
              scrolled || mobileOpen
                ? 'border-white/70 bg-white/85 shadow-[0_8px_30px_rgba(21,32,47,0.1),inset_0_1px_1.5px_rgba(255,255,255,0.95)]'
                : 'border-white/60 bg-white/70 shadow-[0_6px_22px_rgba(21,32,47,0.06),inset_0_1px_1.5px_rgba(255,255,255,0.9)]'
            }`}
          >
            <a
              href="#home"
              className="text-[15px] font-bold tracking-[-0.03em] text-[#15202F]"
              aria-label="HMA"
              onClick={() => setMobileOpen(false)}
            >
              HMA
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#15202F] text-white px-3 py-1 text-[11px] font-medium tracking-[0.06em] uppercase transition-transform active:scale-95"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              <span>{mobileOpen ? 'Close' : 'Menu'}</span>
              <span className="text-[9px] font-mono">{mobileOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {/* Desktop Navigation Pill (>=md) — Apple Glass Frosted Aesthetic */}
        <motion.div
          animate={{ scale: scrolled ? 0.98 : 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto hidden md:inline-flex items-center gap-7 sm:gap-9 rounded-full border px-6 sm:px-7 py-2.5 sm:py-3 transition-all duration-500 backdrop-blur-2xl backdrop-saturate-[180%] ${
            scrolled
              ? 'border-white/70 bg-white/85 shadow-[0_12px_36px_-8px_rgba(21,32,47,0.14),inset_0_1px_1.5px_rgba(255,255,255,0.95)]'
              : 'border-white/60 bg-white/70 shadow-[0_8px_28px_-6px_rgba(21,32,47,0.08),inset_0_1px_1.5px_rgba(255,255,255,0.9)]'
          }`}
        >
          <a
            href="#home"
            className="text-[15px] font-bold tracking-[-0.03em] text-[#15202F] hover:opacity-80 transition-opacity"
            aria-label="HMA"
          >
            HMA
          </a>

          <div className="flex items-center gap-5 sm:gap-7">
            {NAV_ITEMS.map((item, idx) => {
              const isActive = active === item.id
              return (
                <motion.a
                  key={item.id}
                  href={item.href}
                  initial={{ opacity: 0, y: -12 }}
                  animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
                  transition={{ ...springs.bouncy, delay: 0.22 + idx * 0.05 }}
                  className={`relative text-[13px] font-medium transition-colors duration-300 py-1 ${
                    isActive ? 'text-[#15202F]' : 'text-[#536174] hover:text-[#15202F]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-0.5 inset-x-0 h-[2px] bg-[#15202F] rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </motion.a>
              )
            })}
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="fixed inset-0 z-[95] flex flex-col bg-[#FBFBFC]/98 px-6 pt-20 pb-8 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col justify-between h-full">
              <div className="flex flex-col gap-6 pt-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B7280]">Navigation</p>
                <div className="flex flex-col gap-3">
                  {[
                    { label: 'Home', href: '#home', id: 'home' },
                    { label: 'Selected Work', href: '#work', id: 'work' },
                    { label: 'Services', href: '#services', id: 'services' },
                    { label: 'Process', href: '#process', id: 'process' },
                    { label: 'About', href: '#about', id: 'about' },
                    { label: 'Contact', href: '#contact', id: 'contact' },
                  ].map((item, idx) => (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between py-2 text-[22px] font-medium tracking-tight text-[#15202F] border-b border-black/[0.05] transition-colors active:text-[#536174]"
                    >
                      <span>{item.label}</span>
                      <span className="text-[11px] font-mono text-[#6B7280]">0{idx + 1}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-6 border-t border-black/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[12px] text-[#536174]">Available for select projects</span>
                </div>
                <a
                  href={`mailto:${EMAIL}`}
                  onClick={() => setMobileOpen(false)}
                  className="text-[14px] font-medium text-[#15202F] tracking-tight"
                >
                  {EMAIL}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ============================================================
   HERO
   ============================================================ */

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // Refined, subtle desktop depth — never drifts excessively
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 24])

  // Desktop mouse-parallax (max 12px)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springParallaxX = useSpring(mouseX, { stiffness: 100, damping: 20 })
  const springParallaxY = useSpring(mouseY, { stiffness: 100, damping: 20 })

  // Hero scroll-out: scale 1→0.95, opacity 1→0, y 0→-60px over first 500px of scroll
  const { scrollY } = useScroll()
  const heroScale = useTransform(scrollY, [0, 500], reduce ? [1, 1] : [1, 0.95])
  const heroOpacity = useTransform(scrollY, [0, 500], reduce ? [1, 1] : [1, 0])
  const heroY = useTransform(scrollY, [0, 500], reduce ? [0, 0] : [0, -60])

  // Track intro loader choreography and viewport-based replay
  const [introReady, setIntroReady] = useState(false)
  const isHeroInView = useInView(ref, { once: false, amount: 0.25, margin: '0px 0px -10% 0px' })

  useEffect(() => {
    const isDone =
      (typeof window !== 'undefined' && (window as unknown as { __HMA_INTRO_DONE__?: boolean }).__HMA_INTRO_DONE__) ||
      (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    if (isDone) {
      setIntroReady(true)
      return
    }

    const onCurtainStart = () => {
      setIntroReady(true)
    }
    const onIntroComplete = () => {
      setIntroReady(true)
    }
    window.addEventListener('hma:curtain-start', onCurtainStart)
    window.addEventListener('hma:intro-complete', onIntroComplete)
    const fallbackTimer = setTimeout(() => setIntroReady(true), 3500)
    return () => {
      window.removeEventListener('hma:curtain-start', onCurtainStart)
      window.removeEventListener('hma:intro-complete', onIntroComplete)
      clearTimeout(fallbackTimer)
    }
  }, [])

  const currentHeroState = introReady ? (isHeroInView ? 'visible' : 'hidden') : 'hidden'

  return (
    <motion.section
      id="home"
      ref={ref}
      style={{ scale: heroScale, opacity: heroOpacity, y: heroY, willChange: 'transform, opacity' }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse' || !ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
        const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
        mouseX.set(relX * 12)
        mouseY.set(relY * 12)
      }}
      onPointerLeave={() => {
        mouseX.set(0)
        mouseY.set(0)
      }}
      className="relative z-10 mx-auto w-full max-w-[1320px] px-4 sm:px-8 lg:px-12 flex min-h-[100svh] flex-col justify-center pt-16 xs:pt-20 sm:pt-28 pb-10 sm:pb-16 overflow-hidden"
    >
      <div className="relative z-10 grid grid-cols-1 items-center gap-y-6 xs:gap-y-8 sm:gap-y-12 lg:grid-cols-12 lg:gap-x-10">
        {/* Left Side: Meta columns + Main Headline */}
        <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-10 lg:gap-12">
          {/* Micro Meta Stack (Focus & Expertise) — Desktop Only */}
          <motion.div
            initial="hidden"
            animate={currentHeroState}
            variants={{
              hidden: { opacity: 0, y: 24, transition: springs.exit },
              visible: { opacity: 1, y: 0, transition: { ...springs.base, delay: 0.14 } },
            }}
            className="hidden sm:flex flex-col gap-5 sm:gap-6 shrink-0 min-w-[130px] text-left"
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B7280] mb-1">FOCUS</p>
              <p className="text-[12px] text-[#536174] leading-snug font-normal">AI-powered web experiences</p>
            </div>
            <div className="h-px w-6 bg-black/[0.08]" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B7280] mb-1">EXPERTISE</p>
              <p className="text-[12px] text-[#536174] leading-snug font-normal">Creative · Web · AI</p>
            </div>
          </motion.div>

          {/* Main Headline & Action Controls */}
          <div className="flex flex-col w-full">
            {/* Status Line on Mobile (Priority 1 — Centered on mobile) */}
            <motion.div
              initial="hidden"
              animate={currentHeroState}
              variants={{
                hidden: { opacity: 0, y: -10, transition: springs.exit },
                visible: { opacity: 1, y: 0, transition: { ...springs.base, delay: 0.04 } },
              }}
              className="sm:hidden inline-flex items-center gap-2 rounded-full border border-black/[0.07] bg-white/80 px-2.5 py-0.5 mb-3 backdrop-blur-md self-center mx-auto"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10.5px] font-medium tracking-tight text-[#15202F]">Available for select projects</span>
            </motion.div>

            {/* Main Headline (Headline comes down from the TOP with word/line stagger) */}
            <h1
              data-gsap="hero-reveal"
              className="text-center sm:text-left mx-auto sm:mx-0 text-[25px] xs:text-[29px] sm:text-[clamp(2.4rem,4.8vw,4.6rem)] font-medium leading-[1.08] sm:leading-[0.98] tracking-[-0.035em] sm:tracking-[-0.04em] text-[#15202F]"
            >
              <MaskText
                animate={currentHeroState}
                fromTop={true}
                delay={0.05}
                stagger={0.08}
                lines={[
                  <span key="line1" className="sm:whitespace-nowrap">I turn ideas into</span>,
                  <span key="line2" className="whitespace-nowrap"><Serif>AI&#8209;powered</Serif> digital</span>,
                  'experiences.',
                ]}
              />
            </h1>

            {/* Desktop Supporting Value Proposition */}
            <motion.p
              data-gsap="hero-reveal"
              initial="hidden"
              animate={currentHeroState}
              variants={{
                hidden: { opacity: 0, y: 24, transition: springs.exit },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { ...springs.base, delay: 0.16 },
                },
              }}
              className="hidden sm:block mt-4 lg:mt-5 text-[15px] lg:text-[16.5px] leading-[1.6] text-[#536174] max-w-[520px]"
            >
              I partner with ambitious founders and brands to build distinctive websites, AI-powered ads, and digital experiences designed to make their next move count.
            </motion.p>

            {/* Mobile Short Supporting Description (Priority 3: Centered on mobile) */}
            <motion.p
              initial="hidden"
              animate={currentHeroState}
              variants={{
                hidden: { opacity: 0, y: 20, transition: springs.exit },
                visible: { opacity: 1, y: 0, transition: { ...springs.base, delay: 0.14 } },
              }}
              className="sm:hidden mt-2.5 text-center mx-auto text-[12px] xs:text-[12.5px] leading-[1.55] text-[#536174] max-w-[340px]"
            >
              Partnering with ambitious founders and brands to build distinctive websites, AI-powered ads, and digital experiences.
            </motion.p>

            {/* Mobile Portrait (Centerpiece Showcase on mobile, slides in from right with spring) */}
            <figure className="sm:hidden w-full max-w-[170px] xs:max-w-[190px] mx-auto mt-3 mb-2.5 relative z-10">
              <motion.div
                initial="hidden"
                animate={currentHeroState}
                variants={{
                  hidden: { opacity: 0, x: 26, scale: 0.9, rotate: 1.5, transition: springs.exit },
                  visible: {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    rotate: 0,
                    transition: { ...springs.gentle, delay: 0.25 },
                  },
                }}
                className="relative aspect-[4/5] w-full overflow-hidden rounded-[18px] xs:rounded-[22px] bg-neutral-200 ring-1 ring-black/[0.08] shadow-[0_12px_32px_-16px_rgba(21,32,47,0.16)] will-change-transform"
              >
                <img
                  src="/portrait.jpg"
                  alt="Hafiz Muhammad Aqeel, Creative Developer & AI Builder"
                  className="h-full w-full object-cover object-[50%_25%] grayscale"
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/50" />
              </motion.div>
            </figure>

            {/* Mobile Social Proof Badge (Priority 4: Lower side of portrait) */}
            <motion.div
              initial="hidden"
              animate={currentHeroState}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.92, transition: springs.exit },
                visible: { opacity: 1, y: 0, scale: 1, transition: { ...springs.snappy, delay: 0.3 } },
              }}
              className="sm:hidden inline-flex items-center justify-center gap-2 rounded-full border border-black/[0.06] bg-white/70 px-2.5 py-1 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.03)] w-fit mx-auto self-center mb-2.5"
            >
              <div className="flex items-center -space-x-1.5">
                <img src="/images/avatar1_opt.webp" alt="Client avatar" className="h-4.5 w-4.5 rounded-full object-cover ring-1.5 ring-white" />
                <img src="/images/avatar2_opt.webp" alt="Client avatar" className="h-4.5 w-4.5 rounded-full object-cover ring-1.5 ring-white" />
                <img src="/images/avatar3_opt.webp" alt="Client avatar" className="h-4.5 w-4.5 rounded-full object-cover ring-1.5 ring-white" />
                <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#15202F] text-[8.5px] font-bold text-white ring-1.5 ring-white">
                  10+
                </span>
              </div>
              <p className="text-[11px] text-[#536174]">
                Trusted by <strong className="font-semibold text-[#15202F]">10+</strong> founders &amp; brands worldwide.
              </p>
            </motion.div>

            {/* Mobile CTA Buttons (Priority 5: Lower side of portrait, >=44px min touch target) */}
            <motion.div
              initial="hidden"
              animate={currentHeroState}
              variants={{
                hidden: { opacity: 0, y: 24, scale: 0.92, transition: springs.exit },
                visible: { opacity: 1, y: 0, scale: 1, transition: { ...springs.bouncy, delay: 0.22 } },
              }}
              className="sm:hidden flex items-center justify-center gap-2.5 mx-auto"
            >
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 min-h-[44px] items-center gap-2 rounded-full bg-[#15202F] px-4.5 xs:px-5 text-[12.5px] xs:text-[13px] font-medium text-white shadow-[0_4px_14px_rgba(21,32,47,0.18)] transition-all active:scale-95"
              >
                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span>Let&apos;s Talk</span>
              </a>

              <a
                href="#work"
                className="inline-flex h-11 min-h-[44px] items-center gap-1.5 rounded-full border border-black/[0.08] bg-white/80 px-4 xs:px-4.5 text-[12.5px] xs:text-[13px] font-medium text-[#15202F] backdrop-blur-md shadow-sm transition-all active:scale-95"
              >
                <svg className="w-3.5 h-3.5 text-[#15202F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
                </svg>
                <span>View My Work</span>
              </a>
            </motion.div>

            {/* Desktop CTA Buttons (Preserved on Desktop with spring pop) */}
            <motion.div
              data-gsap="hero-reveal"
              initial="hidden"
              animate={currentHeroState}
              variants={{
                hidden: { opacity: 0, y: 24, scale: 0.94, transition: springs.exit },
                visible: { opacity: 1, y: 0, scale: 1, transition: { ...springs.bouncy, delay: 0.22 } },
              }}
              className="hidden sm:flex mt-7 lg:mt-8 flex-wrap items-center gap-4"
            >
              <Magnetic strength={0.2}>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-2.5 rounded-full bg-[#15202F] px-6 text-[14px] font-medium text-white shadow-[0_4px_16px_rgba(21,32,47,0.2)] transition-all duration-300 hover:bg-[#0f1722] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                >
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>Let&apos;s Talk</span>
                </a>
              </Magnetic>

              <Magnetic strength={0.2}>
                <a
                  href="#work"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-black/[0.08] bg-white/70 px-6 text-[14px] font-medium text-[#15202F] backdrop-blur-md shadow-sm transition-all duration-300 hover:bg-white/95 hover:border-black/15 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <svg className="w-4 h-4 text-[#15202F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
                  </svg>
                  <span>View My Work</span>
                </a>
              </Magnetic>
            </motion.div>

            {/* Desktop Social Proof Badge (Preserved on Desktop with spring) */}
            <motion.div
              initial="hidden"
              animate={currentHeroState}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.94, transition: springs.exit },
                visible: { opacity: 1, y: 0, scale: 1, transition: { ...springs.snappy, delay: 0.3 } },
              }}
              className="hidden sm:inline-flex mt-7 items-center gap-3 rounded-full border border-black/[0.06] bg-white/60 px-3.5 py-1.5 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.03)] w-fit"
            >
              <div className="flex items-center -space-x-2">
                <img src="/images/avatar1_opt.webp" alt="Client avatar" className="h-6 w-6 rounded-full object-cover ring-2 ring-white" />
                <img src="/images/avatar2_opt.webp" alt="Client avatar" className="h-6 w-6 rounded-full object-cover ring-2 ring-white" />
                <img src="/images/avatar3_opt.webp" alt="Client avatar" className="h-6 w-6 rounded-full object-cover ring-2 ring-white" />
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#15202F] text-[10px] font-bold text-white ring-2 ring-white">
                  10+
                </span>
              </div>
              <p className="text-[12px] text-[#536174]">
                Trusted by <strong className="font-semibold text-[#15202F]">10+</strong> founders &amp; brands worldwide.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right Side: Portrait Card — Desktop & Tablet (slides in from RIGHT with spring, slight scale-up 0.9 -> 1, rotation settle) */}
        <motion.figure
          style={{ y: portraitY, x: springParallaxX }}
          className="hidden sm:block lg:col-span-5 w-full sm:max-w-[360px] lg:max-w-[430px] mx-auto lg:mx-0 lg:justify-self-end mt-2 lg:mt-0 relative z-10"
        >
          <motion.div
            initial="hidden"
            animate={currentHeroState}
            variants={{
              hidden: {
                opacity: 0,
                x: reduce ? 0 : 70,
                scale: reduce ? 1 : 0.9,
                rotate: reduce ? 0 : 2,
                transition: springs.exit,
              },
              visible: {
                opacity: 1,
                x: 0,
                scale: 1,
                rotate: 0,
                transition: { ...springs.gentle, delay: 0.28 },
              },
            }}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px] sm:rounded-[30px] bg-neutral-200 ring-1 ring-black/[0.08] sm:shadow-[0_24px_60px_-24px_rgba(21,32,47,0.22)] will-change-transform"
          >
            {/* Subtle continuous float (±6px, 6s loop) and Y mouse-parallax */}
            <motion.div
              animate={reduce || currentHeroState !== 'visible' ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ y: springParallaxY }}
              className="h-full w-full"
            >
              <img
                src="/portrait.jpg"
                alt="Hafiz Muhammad Aqeel, Creative Developer & AI Builder"
                className="h-full w-full object-cover object-[50%_25%] grayscale"
              />
            </motion.div>
            {/* Top specular reflection */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/50" />
          </motion.div>
        </motion.figure>
      </div>

      {/* Gentle bobbing scroll indicator with spring entrance */}
      <motion.div
        initial="hidden"
        animate={currentHeroState}
        variants={{
          hidden: { opacity: 0, y: 14, transition: springs.exit },
          visible: { opacity: 1, y: 0, transition: { ...springs.base, delay: 0.45 } },
        }}
        className="hidden sm:flex absolute bottom-4 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 pointer-events-none select-none z-20"
      >
        <span className="text-[9.5px] font-mono tracking-[0.2em] text-[#8A93A3] uppercase">Scroll</span>
        <div className="w-4 h-6 rounded-full border border-black/[0.14] flex justify-center p-0.5">
          <motion.div
            animate={reduce || currentHeroState !== 'visible' ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-1.5 rounded-full bg-[#15202F]"
          />
        </div>
      </motion.div>
    </motion.section>
  )
}

/* ============================================================
   3D TILT CARD & INTERACTION SYSTEM
   ============================================================ */

function TiltCardInner({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseX = useSpring(x, { stiffness: 220, damping: 24, mass: 0.25 })
  const mouseY = useSpring(y, { stiffness: 220, damping: 24, mass: 0.25 })

  // Calibrated to subtle max 4° tilt
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [4, -4])
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-4, 4])
  const glareX = useTransform(mouseX, [-0.5, 0.5], ['15%', '85%'])
  const glareY = useTransform(mouseY, [-0.5, 0.5], ['15%', '85%'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const relX = (e.clientX - rect.left) / width
    const relY = (e.clientY - rect.top) / height
    x.set(relX - 0.5)
    y.set(relY - 0.5)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`group/tilt relative [perspective:1000px] ${className}`}
    >
      {/* Glare/gradient highlight following pointer */}
      <motion.div
        style={{
          background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.25) 0%, transparent 65%)`,
        }}
        className="pointer-events-none absolute inset-0 rounded-[24px] sm:rounded-[30px] z-30 opacity-0 group-hover/tilt:opacity-100 transition-opacity duration-300"
      />
      {children}
    </motion.div>
  )
}

function TiltCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  const [canTilt, setCanTilt] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setCanTilt(true)
    }
  }, [])

  if (!canTilt || reduce) {
    return <div className={`relative ${className}`}>{children}</div>
  }

  return <TiltCardInner className={className}>{children}</TiltCardInner>
}

/* ============================================================
   SERVICES 3D VISUAL MODULES
   ============================================================ */

const WebDev3DVisual = memo(function WebDev3DVisual({ active = true }: { active?: boolean }) {
  const reduce = useReducedMotion()
  return (
    <div className="relative h-36 xs:h-40 sm:h-48 w-full overflow-hidden rounded-[16px] sm:rounded-[20px] bg-gradient-to-b from-[#15202F]/[0.03] to-[#15202F]/[0.08] p-2.5 xs:p-3 sm:p-3.5 flex flex-col justify-between border border-black/[0.06] shadow-[0_2px_12px_-4px_rgba(21,32,47,0.06)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(21,32,47,0.18) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
      />

      <div className="relative z-10 flex items-center justify-between border-b border-black/[0.06] pb-1.5 sm:pb-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-400/80" />
          <span className="h-2 w-2 rounded-full bg-amber-400/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
        </div>
        <div className="flex items-center gap-1 rounded-full border border-black/[0.06] bg-white/80 px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[9.5px] font-mono text-[#536174]">
          <span className="text-[#15202F] font-semibold">https://</span>
          <span>hma.studio</span>
        </div>
        <span className="text-[9px] sm:text-[10px] text-[#6B7280]">60fps</span>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center py-1">
        <motion.div
          animate={reduce || !active ? undefined : { y: [2, -2, 2], rotateZ: [-1, 1, -1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-[82%] h-16 sm:h-20 rounded-xl bg-white/70 border border-black/[0.04] -bottom-1"
        />

        <motion.div
          animate={reduce || !active ? undefined : { y: [-3, 3, -3] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-[92%] sm:w-[90%] h-20 sm:h-24 rounded-xl bg-white border border-black/[0.09] shadow-[0_8px_20px_-8px_rgba(21,32,47,0.16)] p-2 sm:p-3 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="h-4.5 w-4.5 sm:h-5 sm:w-5 rounded-md bg-[#15202F] flex items-center justify-center text-[9px] sm:text-[10px] text-white font-mono font-bold">
                &lt;/&gt;
              </span>
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-tight text-[#15202F] leading-none">
                  AppRouter.tsx
                </span>
                <span className="text-[8.5px] sm:text-[9px] text-[#6B7280]">Next.js 16 · Turbopack</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 sm:px-2 py-0.5 text-[8.5px] sm:text-[9px] font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>

          <div className="grid grid-cols-12 gap-1.5 items-center">
            <div className="col-span-8 h-1.5 sm:h-2 rounded-full bg-[#15202F]/10 overflow-hidden relative">
              <motion.div
                animate={reduce || !active ? undefined : { x: ['-100%', '100%'] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#15202F]/30 to-transparent"
              />
            </div>
            <div className="col-span-4 h-1.5 sm:h-2 rounded-full bg-[#15202F]/20" />
          </div>

          <div className="flex items-center justify-between text-[8.5px] sm:text-[9.5px] text-[#536174] font-mono">
            <span>&lt;HeroAnimation /&gt;</span>
            <span className="text-[#15202F] font-semibold">100% Type-Safe</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        animate={reduce || !active ? undefined : { y: [-2, 2, -2], x: [1, -1, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-2 right-2.5 sm:right-3 z-20 rounded-full border border-black/[0.08] bg-[#15202F] text-white px-2 sm:px-2.5 py-0.5 text-[8.5px] sm:text-[9px] font-mono shadow-[0_4px_12px_rgba(21,32,47,0.2)]"
      >
        ✦ 0.04s TBT
      </motion.div>
    </div>
  )
})

const Commercials3DVisual = memo(function Commercials3DVisual({ active = true }: { active?: boolean }) {
  const reduce = useReducedMotion()
  return (
    <div className="relative h-36 xs:h-40 sm:h-48 w-full overflow-hidden rounded-[16px] sm:rounded-[20px] bg-gradient-to-b from-[#15202F]/[0.03] to-[#15202F]/[0.08] p-2.5 xs:p-3 sm:p-3.5 flex flex-col justify-between border border-black/[0.06] shadow-[0_2px_12px_-4px_rgba(21,32,47,0.06)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(21,32,47,0.18) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
      />

      <div className="relative z-10 flex items-center justify-between border-b border-black/[0.06] pb-1.5 sm:pb-2 text-[9px] sm:text-[9.5px] font-mono">
        <div className="flex items-center gap-1.5 text-rose-600 font-semibold">
          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          <span>REC</span>
          <span className="text-[#536174] font-normal">00:02:14:18</span>
        </div>
        <span className="rounded-full border border-black/[0.06] bg-white/80 px-2 py-0.5 text-[8.5px] sm:text-[9px] text-[#15202F] font-semibold">
          4K · ProRes
        </span>
        <span className="text-[#6B7280]">9:16 + 16:9</span>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center">
        <motion.div
          animate={reduce || !active ? undefined : { rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          className="absolute h-20 w-20 sm:h-24 sm:w-24 rounded-full border border-dashed border-[#15202F]/25"
        />

        <motion.div
          animate={reduce || !active ? undefined : { rotate: -360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          className="absolute h-16 w-16 sm:h-20 sm:w-20 rounded-full border border-[#15202F]/15 border-t-[#15202F]/60"
        />

        <motion.div
          animate={reduce || !active ? undefined : { scale: [0.97, 1.03, 0.97] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative h-11 w-11 sm:h-14 sm:w-14 rounded-full bg-gradient-to-tr from-[#15202F] to-[#536174] shadow-[0_8px_24px_-6px_rgba(21,32,47,0.35),0_0_0_2px_rgba(255,255,255,0.8)] flex items-center justify-center"
        >
          <div className="absolute top-1.5 left-1.5 sm:left-2 h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 rounded-full bg-white/40 blur-[1px]" />
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 sm:h-6 sm:w-6 text-white stroke-[1.75]" aria-hidden="true">
            <circle cx="12" cy="12" r="3" fill="currentColor" />
            <path d="M12 2v3m0 14v3M2 12h3m14 0h3M4.93 4.93l2.12 2.12m9.9 9.9l2.12 2.12M4.93 19.07l2.12-2.12m9.9-9.9l2.12-2.12" />
          </svg>
        </motion.div>
      </div>

      <div className="relative z-10 flex items-center justify-between text-[9px] sm:text-[9.5px] font-mono text-[#536174]">
        <span>f/1.8 · ISO 100</span>
        <span className="rounded-full bg-white/90 border border-black/[0.06] px-2 py-0.5 text-[#15202F] font-semibold">
          AI Generative CGI
        </span>
      </div>
    </div>
  )
})

const Automation3DVisual = memo(function Automation3DVisual({ active = true }: { active?: boolean }) {
  const reduce = useReducedMotion()
  return (
    <div className="relative h-36 xs:h-40 sm:h-48 w-full overflow-hidden rounded-[16px] sm:rounded-[20px] bg-gradient-to-b from-[#15202F]/[0.03] to-[#15202F]/[0.08] p-2.5 xs:p-3 sm:p-3.5 flex flex-col justify-between border border-black/[0.06] shadow-[0_2px_12px_-4px_rgba(21,32,47,0.06)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(21,32,47,0.18) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
      />

      <div className="relative z-10 flex items-center justify-between border-b border-black/[0.06] pb-1.5 sm:pb-2 text-[9px] sm:text-[9.5px] font-mono">
        <span className="flex items-center gap-1.5 text-[#15202F] font-semibold">
          <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
          PIPELINE v2.4
        </span>
        <span className="rounded-full border border-black/[0.06] bg-white/80 px-2 py-0.5 text-[#536174]">
          Automated
        </span>
        <span className="text-[#6B7280]">0ms Idle</span>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="absolute inset-x-8 h-px bg-gradient-to-r from-transparent via-[#15202F]/30 to-transparent" />

        <div className="relative w-full flex items-center justify-between px-2 sm:px-3">
          <motion.div
            animate={reduce || !active ? undefined : { y: [1, -1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1"
          >
            <div className="h-7.5 w-7.5 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-white border border-black/[0.08] shadow-sm flex items-center justify-center text-[10px] sm:text-[11px] font-mono font-bold text-[#536174]">
              IN
            </div>
            <span className="text-[8px] sm:text-[8.5px] font-mono text-[#6B7280]">Raw Input</span>
          </motion.div>

          <motion.div
            animate={reduce || !active ? undefined : { scale: [0.96, 1.04, 0.96], rotate: [0, 4, -4, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative flex flex-col items-center gap-1"
          >
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#15202F] to-[#253850] text-white flex items-center justify-center shadow-[0_8px_20px_-6px_rgba(21,32,47,0.35)] ring-2 ring-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 sm:h-6 sm:w-6 stroke-[1.8]" aria-hidden="true">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-[8px] sm:text-[8.5px] font-mono text-[#15202F] font-bold">AI Engine</span>
          </motion.div>

          <motion.div
            animate={reduce || !active ? undefined : { y: [-1, 1, -1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1"
          >
            <div className="h-7.5 w-7.5 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-white border border-black/[0.08] shadow-sm flex items-center justify-center text-[10px] sm:text-[11px] font-mono font-bold text-emerald-600">
              OUT
            </div>
            <span className="text-[8px] sm:text-[8.5px] font-mono text-[#6B7280]">Campaign</span>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between text-[9px] sm:text-[9.5px] font-mono text-[#536174]">
        <span>Latency: &lt;180ms</span>
        <span className="rounded-full bg-white/90 border border-black/[0.06] px-2 py-0.5 text-[#15202F] font-semibold">
          10x Velocity
        </span>
      </div>
    </div>
  )
})

const ServiceCard3D = memo(function ServiceCard3D({
  service,
  index,
}: {
  service: (typeof SERVICES)[number]
  index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const inView = useInView(cardRef, { once: false, amount: 0.15 })

  return (
    <motion.div
      ref={cardRef}
      initial="hidden"
      whileInView="visible"
      viewport={springViewport}
      variants={createCardSpringVariant(index)}
      className="h-full"
    >
      <TiltCard className="h-full">
        <article
          style={{ contain: 'paint layout' }}
          className="group relative flex h-full flex-col justify-between rounded-[20px] xs:rounded-[24px] sm:rounded-[30px] border border-black/[0.08] bg-white sm:bg-[#FBFBFC] p-4 xs:p-5 sm:p-7 lg:p-8 shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_20px_45px_-20px_rgba(21,32,47,0.12),0_0_0_1px_rgba(21,32,47,0.03)] transition-[background-color,border-color,box-shadow,color] duration-300 hover:border-black/[0.16] hover:bg-white hover:shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_32px_65px_-22px_rgba(21,32,47,0.2),0_0_40px_-10px_rgba(21,32,47,0.06)] overflow-hidden"
        >
          {/* Card top-border accent line draws left -> right on entry */}
          <motion.div
            variants={{
              hidden: { scaleX: 0, transition: springs.exit },
              visible: { scaleX: 1, transition: { ...springs.base, delay: 0.12 + index * 0.08 } },
            }}
            className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#15202F] via-[#536174] to-transparent origin-left rounded-t-[20px] sm:rounded-t-[30px]"
          />

          <div>
            <div className="flex items-center justify-between gap-2.5 mb-3.5 sm:mb-5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-black/[0.03] px-2.5 sm:px-3 py-1 text-[12px] sm:text-[12.5px] font-semibold tracking-[0.14em] uppercase text-[#15202F]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#15202F]" />
                {service.letter} · {service.n}
              </span>
              <span className="text-[12px] sm:text-[12.5px] font-medium tracking-[0.14em] uppercase text-[#536174]">
                {service.eyebrow}
              </span>
            </div>

            <div className="mb-4 sm:mb-6">
              {index === 0 && <WebDev3DVisual active={inView} />}
              {index === 1 && <Commercials3DVisual active={inView} />}
              {index === 2 && <Automation3DVisual active={inView} />}
            </div>

            <h3 className="text-[18px] xs:text-[20px] sm:text-[22px] lg:text-[23px] font-medium tracking-tight text-[#15202F] leading-[1.18] group-hover:text-[#0f1722] transition-colors">
              {service.title}
            </h3>
            <p className="mt-2 text-[13px] xs:text-[13.5px] sm:text-[14px] leading-[1.58] sm:leading-[1.62] text-[#536174]">
              {service.description}
            </p>

            {service.deliverables && (
              <p className="mt-2.5 text-[11.5px] xs:text-[12px] font-mono text-[#5B6475] tracking-tight">
                ✦ {service.deliverables}
              </p>
            )}

            {/* Tech tags stagger pop-in (scale 0.82 -> 1) with spring */}
            <motion.ul variants={tagContainerVariant} className="mt-3.5 sm:mt-5 flex flex-wrap gap-1.5">
              {service.tags.map((t) => (
                <motion.li
                  key={t}
                  variants={tagPopInVariant}
                  className="rounded-full border border-black/[0.08] bg-white px-2.5 sm:px-3 py-1 text-[12px] font-medium text-[#15202F] shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  {t}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <div className="mt-5 pt-3.5 sm:mt-7 sm:pt-5 border-t border-black/[0.06]">
            <a
              href={`${WHATSAPP_URL}?text=${encodeURIComponent(service.inquiryMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between text-[#15202F] group/link"
              aria-label={`${service.ctaLabel} via WhatsApp`}
            >
              <span className="relative text-[13px] sm:text-[14px] font-semibold tracking-tight">
                {service.ctaLabel}
                <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-[#15202F] transition-transform duration-300 group-hover/link:scale-x-100" />
              </span>
              <span className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full border border-black/[0.08] bg-black/[0.02] text-[#15202F] transition-all duration-300 group-hover/link:bg-[#15202F] group-hover/link:border-[#15202F] group-hover/link:text-white">
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </span>
            </a>
          </div>
        </article>
      </TiltCard>
    </motion.div>
  )
})

/* ============================================================
   PROCESS 3D VISUAL MODULES
   ============================================================ */

const Discover3DVisual = memo(function Discover3DVisual({ active = true }: { active?: boolean }) {
  const reduce = useReducedMotion()
  return (
    <div className="relative h-24 xs:h-28 sm:h-32 w-full overflow-hidden rounded-[14px] sm:rounded-[18px] bg-gradient-to-b from-[#15202F]/[0.02] to-[#15202F]/[0.06] border border-black/[0.05] p-2 sm:p-2.5 flex items-center justify-center">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(21,32,47,0.15) 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }}
      />
      <div className="absolute h-18 w-18 sm:h-24 sm:w-24 rounded-full border border-[#15202F]/10" />
      <div className="absolute h-12 w-12 sm:h-16 sm:w-16 rounded-full border border-[#15202F]/15" />
      <div className="absolute h-6 w-6 sm:h-8 sm:w-8 rounded-full border border-[#15202F]/20" />
      <div className="absolute inset-x-3 sm:inset-x-4 h-px bg-[#15202F]/10" />
      <div className="absolute inset-y-3 sm:inset-y-4 w-px bg-[#15202F]/10" />

      <motion.div
        animate={reduce ? undefined : active ? { rotate: 360 } : undefined}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute h-18 w-18 sm:h-24 sm:w-24 origin-center flex items-center justify-center"
      >
        <div className="w-1/2 h-px bg-gradient-to-r from-transparent to-[#15202F] origin-left" />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center">
        <span className="h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full bg-[#15202F] ring-3 sm:ring-4 ring-[#15202F]/15 flex items-center justify-center">
          <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-white" />
        </span>
      </div>

      <span className="absolute bottom-1.5 right-2 text-[8px] sm:text-[8.5px] font-mono text-[#6B7280]">
        ALIGN · 360°
      </span>
    </div>
  )
})

const Design3DVisual = memo(function Design3DVisual({ active = true }: { active?: boolean }) {
  const reduce = useReducedMotion()
  return (
    <div className="relative h-24 xs:h-28 sm:h-32 w-full overflow-hidden rounded-[14px] sm:rounded-[18px] bg-gradient-to-b from-[#15202F]/[0.02] to-[#15202F]/[0.06] border border-black/[0.05] p-2 sm:p-2.5 flex items-center justify-center">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(21,32,47,0.15) 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }}
      />

      <motion.div
        animate={reduce ? undefined : active ? { y: [-2, 2, -2] } : undefined}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-[90%] sm:w-[85%] h-16 sm:h-20 rounded-xl bg-white border border-black/[0.08] shadow-sm p-1.5 sm:p-2 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-[7.5px] sm:text-[8px] font-mono text-[#6B7280]">
          <span>W: 1320px</span>
          <span className="text-[#15202F] font-semibold">GRID · 12-COL</span>
        </div>

        <svg viewBox="0 0 100 30" className="w-full h-6 sm:h-8 overflow-visible">
          <motion.path
            d="M 5 25 C 30 5, 70 5, 95 25"
            fill="none"
            stroke="#15202F"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <circle cx="5" cy="25" r="2.5" fill="#15202F" />
          <circle cx="30" cy="5" r="2" fill="#536174" />
          <line x1="5" y1="25" x2="30" y2="5" stroke="#536174" strokeWidth="0.75" strokeDasharray="1,1" />
          <circle cx="95" cy="25" r="2.5" fill="#15202F" />
          <circle cx="70" cy="5" r="2" fill="#536174" />
          <line x1="95" y1="25" x2="70" y2="5" stroke="#536174" strokeWidth="0.75" strokeDasharray="1,1" />
        </svg>

        <div className="flex items-center justify-between text-[7.5px] sm:text-[8px] font-mono text-[#536174]">
          <span>FIGMA SYSTEM</span>
          <span className="text-[#15202F] font-semibold">4.8pt SPACING</span>
        </div>
      </motion.div>
    </div>
  )
})

const Build3DVisual = memo(function Build3DVisual({ active = true }: { active?: boolean }) {
  const reduce = useReducedMotion()
  return (
    <div className="relative h-24 xs:h-28 sm:h-32 w-full overflow-hidden rounded-[14px] sm:rounded-[18px] bg-gradient-to-b from-[#15202F]/[0.02] to-[#15202F]/[0.06] border border-black/[0.05] p-2 sm:p-2.5 flex items-center justify-center">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(21,32,47,0.15) 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }}
      />

      <motion.div
        animate={reduce ? undefined : active ? { y: [2, -2, 2] } : undefined}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative flex flex-col items-center"
      >
        <div className="flex items-center gap-1.5">
          <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-md sm:rounded-lg bg-white border border-black/[0.08] shadow-sm flex items-center justify-center text-[9px] sm:text-[10px] font-mono text-[#15202F] font-bold">
            TS
          </div>
          <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-md sm:rounded-lg bg-[#15202F] text-white shadow-md flex items-center justify-center text-[9px] sm:text-[10px] font-mono font-bold">
            ▲
          </div>
          <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-md sm:rounded-lg bg-white border border-black/[0.08] shadow-sm flex items-center justify-center text-[9px] sm:text-[10px] font-mono text-[#536174] font-bold">
            AI
          </div>
        </div>

        <div className="mt-1.5 flex items-center gap-1 rounded-full border border-black/[0.06] bg-white px-2 sm:px-2.5 py-0.5 text-[8px] sm:text-[8.5px] font-mono text-[#15202F] shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>PRODUCTION BUILD</span>
        </div>
      </motion.div>
    </div>
  )
})

const Launch3DVisual = memo(function Launch3DVisual({ active = true }: { active?: boolean }) {
  const reduce = useReducedMotion()
  return (
    <div className="relative h-24 xs:h-28 sm:h-32 w-full overflow-hidden rounded-[14px] sm:rounded-[18px] bg-gradient-to-b from-[#15202F]/[0.02] to-[#15202F]/[0.06] border border-black/[0.05] p-2 sm:p-2.5 flex items-center justify-center">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(21,32,47,0.15) 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }}
      />

      <motion.div
        animate={reduce ? undefined : active ? { scale: [0.8, 1.2, 0.8], opacity: [0.4, 0.9, 0.4] } : undefined}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute h-16 w-16 sm:h-20 sm:w-20 rounded-full border border-[#15202F]/20"
      />
      <motion.div
        animate={reduce ? undefined : active ? { scale: [0.6, 1.35, 0.6], opacity: [0.2, 0.7, 0.2] } : undefined}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute h-20 w-20 sm:h-24 sm:w-24 rounded-full border border-dashed border-[#15202F]/15"
      />

      <motion.div
        animate={reduce ? undefined : active ? { y: [-3, 3, -3] } : undefined}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-tr from-[#15202F] to-[#253850] text-white flex items-center justify-center shadow-lg ring-2 ring-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2]" aria-hidden="true">
            <path d="M5 12l5 5L20 7" />
          </svg>
        </div>
        <span className="mt-1 text-[8px] sm:text-[8.5px] font-mono text-[#15202F] font-bold">
          LIVE AT EDGE
        </span>
      </motion.div>
    </div>
  )
})

const ProcessCard3D = memo(function ProcessCard3D({
  step,
  index,
}: {
  step: (typeof STEPS)[number]
  index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const inView = useInView(cardRef, { once: false, amount: 0.15 })

  return (
    <motion.div
      ref={cardRef}
      initial="hidden"
      whileInView="visible"
      viewport={springViewport}
      variants={createCardSpringVariant(index)}
      className="h-full"
    >
      <TiltCard className="h-full">
        <article
          style={{ contain: 'paint layout' }}
          className="group relative flex h-full flex-col justify-between rounded-[18px] xs:rounded-[22px] sm:rounded-[28px] border border-black/[0.08] bg-white sm:bg-[#FBFBFC] p-3.5 xs:p-4 sm:p-6 shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_20px_40px_-20px_rgba(21,32,47,0.1),0_0_0_1px_rgba(21,32,47,0.03)] transition-[background-color,border-color,box-shadow,color] duration-300 hover:border-black/[0.16] hover:bg-white hover:shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_28px_56px_-20px_rgba(21,32,47,0.18)]"
        >
          <div>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              {/* Number rolling in with spring */}
              <span className="text-[22px] xs:text-[25px] sm:text-[30px] font-light leading-none tracking-tight tabular-nums text-[#15202F] overflow-hidden inline-block h-[32px]">
                <motion.span
                  variants={{
                    hidden: { y: '100%', opacity: 0, transition: springs.exit },
                    visible: { y: '0%', opacity: 1, transition: { ...springs.bouncy, delay: 0.12 + index * 0.08 } },
                  }}
                  className="block"
                >
                  {step.n}
                </motion.span>
              </span>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full border border-black/[0.08] bg-black/[0.03] px-2.5 py-0.5 text-[11.5px] font-mono font-semibold uppercase tracking-[0.14em] text-[#15202F]">
                  {step.phase}
                </span>
                {step.estimate && (
                  <span className="inline-flex items-center rounded-full border border-black/[0.06] bg-white px-2 py-0.5 text-[10.5px] font-mono text-[#536174]">
                    {step.estimate}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-3 sm:mb-4">
              {index === 0 && <Discover3DVisual active={inView} />}
              {index === 1 && <Design3DVisual active={inView} />}
              {index === 2 && <Build3DVisual active={inView} />}
              {index === 3 && <Launch3DVisual active={inView} />}
            </div>

            <h3 className="text-[17px] xs:text-[18px] sm:text-[19px] font-medium tracking-tight text-[#15202F]">
              {step.title}
            </h3>
            <p className="text-[12px] xs:text-[12.5px] sm:text-[13px] font-semibold uppercase tracking-[0.12em] text-[#536174] mt-0.5">
              {step.subtitle}
            </p>

            <p className="mt-2 text-[13px] xs:text-[13.5px] sm:text-[14px] leading-[1.58] sm:leading-[1.62] text-[#536174]">
              {step.description}
            </p>
          </div>

          <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-black/[0.06] flex flex-col gap-1 sm:gap-1.5">
            <span className="text-[12px] uppercase tracking-[0.14em] text-[#15202F] font-semibold">
              Deliverables
            </span>
            {/* Deliverable chips pop in with spring */}
            <motion.div variants={tagContainerVariant} className="flex flex-wrap gap-1.5">
              {step.deliverables.map((d) => (
                <motion.span
                  key={d}
                  variants={tagPopInVariant}
                  className="rounded-md border border-black/[0.08] bg-white px-2 sm:px-2.5 py-0.5 text-[12px] font-medium text-[#15202F] shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  {d}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </article>
      </TiltCard>
    </motion.div>
  )
})

/* ============================================================
   SIGNATURE FOOTER — "Hafiz Muhammad Aqeel" resolves into "HMA"
   ============================================================ */

const DEFAULT_WORD_EMS: Record<string, number> = {
  afiz: 1.65,
  uhammad: 3.8,
  qeel: 1.7,
}

function NameWord({ initial, rest, collapse }: { initial: string; rest: string; collapse: MotionValue<number> }) {
  const restRef = useRef<HTMLSpanElement>(null)
  const [naturalWidth, setNaturalWidth] = useState(0)

  useEffect(() => {
    const measure = () => {
      if (restRef.current && restRef.current.offsetWidth > 0) {
        setNaturalWidth(restRef.current.offsetWidth)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    if (typeof document !== 'undefined' && 'fonts' in document) {
      ;(document as Document & { fonts: FontFaceSet }).fonts.ready.then(measure)
    }
    return () => window.removeEventListener('resize', measure)
  }, [rest])

  const width = useTransform(collapse, (v) => {
    if (v >= 1) return '0px'
    if (naturalWidth > 0) return `${naturalWidth * (1 - v)}px`
    const fallbackEm = DEFAULT_WORD_EMS[rest] ?? 1.8
    return `${fallbackEm * (1 - v)}em`
  })
  const opacity = useTransform(collapse, [0, 0.45], [1, 0])
  const blur = useTransform(collapse, [0, 0.55], ['blur(0px)', 'blur(6px)'])
  const y = useTransform(collapse, [0, 1], ['0em', '0.12em'])

  return (
    <span className="inline-flex items-baseline">
      <span className="font-semibold text-neutral-950">{initial}</span>
      <motion.span style={{ width }} className="inline-block overflow-hidden whitespace-nowrap">
        <motion.span ref={restRef} style={{ opacity, filter: blur, y }} className="inline-block font-light text-neutral-400">
          {rest}
        </motion.span>
      </motion.span>
    </span>
  )
}

function SignatureFooter() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const p = useTransform(scrollYProgress, (v) => (reduce ? 1 : v))

  // Phase 1 — trailing letters collapse; initials slide together.
  const collapse = useTransform(p, [0.42, 0.78], [0, 1], { ease: easeInOut })
  // Phase 2 — the mark tightens and scales into the final HMA wordmark.
  const scale = useTransform(p, [0.6, 0.97], [1, 3.4], { ease: easeInOut })
  const fontSize = useTransform(scale, (s) => `calc(var(--sig-base) * ${s})`)
  const gap = useTransform(collapse, [0, 1], ['0.26em', '0.02em'])
  const tracking = useTransform(p, [0.6, 0.97], ['-0.03em', '-0.06em'])
  const line = useTransform(p, [0.25, 0.7], [0, 1])
  const caption = useTransform(p, [0.88, 1], [0, 1])

  const words = [
    { initial: 'H', rest: 'afiz' },
    { initial: 'M', rest: 'uhammad' },
    { initial: 'A', rest: 'qeel' },
  ]

  return (
    <footer id="footer" ref={ref} className="relative z-10 h-[170vh] border-t border-black/[0.06] bg-white/45">
      <div className="sticky top-0 flex h-[100svh] flex-col">
        <div className={`${CONTAINER} flex h-full flex-col pt-24 sm:pt-28 pb-5 sm:pb-6 justify-between`}>
          {/* Top row — Direct contact colophon + navigation, joined by a drawing hairline */}
          <div>
            <div className="flex flex-col gap-5 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <a
                href={`mailto:${EMAIL}`}
                className="group inline-flex items-center gap-3 text-[14px] font-medium text-neutral-800 transition-colors hover:text-neutral-950"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="tracking-tight">{EMAIL}</span>
                <span className="text-neutral-400 group-hover:translate-x-0.5 transition-transform" aria-hidden="true">↗</span>
              </a>

              <nav aria-label="Footer">
                <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.id}>
                      <a href={item.href} className="text-[13px] font-medium text-neutral-500 transition-colors hover:text-neutral-950">
                        {item.label}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href="#home" className="text-[13px] font-medium text-neutral-950 hover:opacity-75 transition-opacity">
                      Top ↑
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="relative h-px w-full bg-black/[0.06]">
              <motion.div style={{ scaleX: line }} className="absolute inset-0 origin-left bg-neutral-950" />
            </div>
          </div>

          {/* Signature Transformation Canvas */}
          <div
            className="flex flex-1 flex-col items-center justify-center overflow-hidden py-3 sm:py-6"
            style={{ ['--sig-base' as string]: 'clamp(18px, 5.2vw, 76px)' }}
          >
            <motion.p
              aria-label="Hafiz Muhammad Aqeel — HMA"
              style={{ fontSize, letterSpacing: tracking }}
              className="flex items-baseline justify-center whitespace-nowrap leading-[0.9] select-none"
            >
              {words.map((w, i) => (
                <span key={w.initial} className="inline-flex items-baseline" aria-hidden="true">
                  <NameWord initial={w.initial} rest={w.rest} collapse={collapse} />
                  {i < words.length - 1 && <motion.span style={{ width: gap }} className="inline-block" />}
                </span>
              ))}
            </motion.p>
            <motion.p
              style={{ opacity: caption }}
              className="mt-6 sm:mt-8 text-center text-[11px] font-medium uppercase tracking-[0.24em] text-neutral-500"
            >
              Hafiz Muhammad Aqeel — Creative Developer &amp; AI Builder
            </motion.p>
          </div>

          {/* Bottom row */}
          <div>
            <div className="relative h-px w-full bg-black/[0.06]">
              <motion.div style={{ scaleX: line }} className="absolute inset-0 origin-right bg-neutral-950" />
            </div>

            <div className="flex flex-col-reverse items-center gap-4 pt-5 sm:flex-row sm:justify-between">
              <p className="text-[12px] text-neutral-500">© 2026 HMA. All rights reserved.</p>
              <ul className="flex items-center gap-2">
                {SOCIALS.map((s) => {
                  const isLink = Boolean(s.url && s.url !== '#')
                  return (
                    <li key={s.name}>
                      <a
                        href={s.url || '#'}
                        target={isLink ? '_blank' : undefined}
                        rel={isLink ? 'noopener noreferrer' : undefined}
                        title={s.name}
                        aria-label={s.name}
                        className="grid h-10 w-10 place-items-center rounded-full border border-black/[0.08] text-neutral-700 transition-colors duration-300 hover:border-neutral-950 hover:bg-neutral-950 hover:text-white"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-[15px] w-[15px]" aria-hidden="true">
                          <path d={s.path} />
                        </svg>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ============================================================
   FAQ ACCORDION
   ============================================================ */

function FAQItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: (typeof FAQS)[number]
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  const reduce = useReducedMotion()

  return (
    <FadeIn delay={index * 0.04} className="border-b border-black/[0.08]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        id={`faq-question-${index}`}
        className="group flex w-full items-start justify-between gap-3 sm:gap-4 py-3.5 xs:py-4 sm:py-6 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15202F]/20 rounded-lg -mx-1 px-1 sm:-mx-2 sm:px-2"
      >
        <div className="flex items-start gap-3 sm:gap-5 pr-2">
          <span className="text-[10px] sm:text-[12px] font-mono text-[#6B7280] font-normal pt-1 sm:pt-1.5 tabular-nums select-none shrink-0">
            0{index + 1}
          </span>
          <h3 className="text-[14.5px] xs:text-[15.5px] sm:text-[18.5px] lg:text-[20px] font-medium leading-[1.3] tracking-[-0.025em] text-[#15202F] transition-colors duration-300 group-hover:text-[#0f1722]">
            {item.q}
          </h3>
        </div>

        <span
          className="relative flex h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border border-black/[0.08] bg-white/70 text-[#15202F] transition-all duration-300 group-hover:border-black/20 group-hover:bg-white mt-0.5 shadow-sm"
          aria-hidden="true"
        >
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: reduce ? 0 : 0.28, ease: EASE }}
            className="text-[14px] xs:text-[16px] sm:text-[17px] leading-none font-light select-none"
          >
            +
          </motion.span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${index}`}
            role="region"
            aria-labelledby={`faq-question-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
              transition: {
                height: { duration: reduce ? 0 : 0.35, ease: EASE },
                opacity: { duration: reduce ? 0 : 0.25, delay: reduce ? 0 : 0.08 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: reduce ? 0 : 0.28, ease: EASE },
                opacity: { duration: reduce ? 0 : 0.15 },
              },
            }}
            className="overflow-hidden"
          >
            <p className="pl-6 sm:pl-9 pb-3.5 sm:pb-6 text-[12.5px] sm:text-[15px] leading-[1.6] sm:leading-[1.65] text-[#536174] max-w-[620px]">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </FadeIn>
  )
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section id="faq" className={`${CONTAINER} ${SECTION_Y} border-t border-black/[0.06]`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 sm:gap-y-12 lg:gap-x-12">
        {/* Left Editorial Header Column */}
        <div className="lg:col-span-5 flex flex-col items-start lg:sticky lg:top-32 self-start">
          <FadeIn>
            <Eyebrow>FAQ</Eyebrow>
          </FadeIn>
          <h2 className="mt-3 sm:mt-6 text-[22px] xs:text-[26px] sm:text-[clamp(2.1rem,3.8vw,3.3rem)] font-medium leading-[1.08] sm:leading-[1.02] tracking-[-0.035em] sm:tracking-[-0.04em] text-[#15202F]">
            <MaskText
              lines={[
                'Questions,',
                <>
                  <Serif>answered.</Serif>
                </>,
              ]}
            />
          </h2>
          <FadeIn delay={0.12}>
            <p className="mt-2.5 sm:mt-5 max-w-[420px] text-[13.5px] sm:text-[16px] leading-[1.55] sm:leading-[1.6] text-[#536174]">
              Everything you need to know before starting a project.
            </p>
          </FadeIn>

          <FadeIn delay={0.2} className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-black/[0.06] w-full max-w-[420px]">
            <p className="text-[12.5px] sm:text-[13px] text-[#6B7280]">
              Have a question not listed here?{' '}
              <a
                href="#contact"
                className="font-medium text-[#15202F] underline decoration-black/20 underline-offset-4 hover:decoration-[#15202F] transition-colors"
              >
                Get in touch
              </a>
            </p>
          </FadeIn>
        </div>

        {/* Right Accordion Column */}
        <div className="lg:col-span-7 border-t border-black/[0.08]">
          {FAQS.map((item, index) => (
            <FAQItem
              key={item.q}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   TESTIMONIALS / CLIENT FEEDBACK — DIVERSE & ANIMATED
   ============================================================ */

const JamesCard = memo(function JamesCard() {
  const reduce = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)
  const inView = useInView(cardRef, { once: false, amount: 0.15 })

  return (
    <motion.div
      ref={cardRef}
      initial="hidden"
      whileInView="visible"
      viewport={springViewport}
      variants={createCardSpringVariant(0)}
      className="h-full order-2 md:order-2 md:col-span-1 lg:order-1 lg:col-span-1"
    >
      <TiltCard className="h-full">
        <article
          style={{ contain: 'paint layout' }}
          className="group relative flex h-full flex-col justify-between rounded-[20px] xs:rounded-[24px] sm:rounded-[26px] border border-black/[0.07] bg-white sm:bg-white/95 p-4 xs:p-5 sm:p-7 shadow-[0_1px_0_rgba(255,255,255,0.95)_inset,0_12px_28px_-16px_rgba(21,32,47,0.08)] ring-1 ring-black/[0.03] transition-[background-color,border-color,box-shadow,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#15202F] hover:border-[#15202F] hover:shadow-[0_24px_55px_-12px_rgba(21,32,47,0.35)]"
        >
          <div>
            {/* Header: AI Cinema & Audio Equalizer Bars */}
            <div className="flex items-center justify-between gap-2.5 pb-3.5 border-b border-black/[0.05] transition-colors duration-500 group-hover:border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[12px] font-mono font-semibold uppercase tracking-[0.14em] text-[#15202F] transition-colors duration-500 group-hover:text-white">
                  Project Feedback
                </span>
              </div>

              {/* Looping Equalizer waveform bars */}
              <div className="flex items-end gap-1 h-3.5 px-2 py-0.5 rounded-full bg-black/[0.03] border border-black/[0.05] transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/15">
                {[0.4, 0.9, 0.5, 1, 0.6].map((h, i) => (
                  <motion.span
                    key={i}
                    animate={
                      reduce
                        ? undefined
                        : inView
                        ? {
                            scaleY: [h, 0.3, 1, h],
                          }
                        : undefined
                    }
                    transition={{
                      duration: 1.4 + i * 0.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="w-0.5 bg-[#15202F] rounded-full origin-bottom transition-colors duration-500 group-hover:bg-white"
                    style={{ height: '10px' }}
                  />
                ))}
              </div>
            </div>

            {/* Scope Metadata */}
            <div className="mt-3.5 flex items-center gap-1.5 text-[11px] font-mono text-[#536174] transition-colors duration-500 group-hover:text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>AI Video Ads · Creative Editing</span>
            </div>

            {/* Quotation Icon */}
            <div className="mt-3 text-[#536174]/20 transition-colors duration-500 group-hover:text-white/20" aria-hidden="true">
              <svg width="18" height="14" viewBox="0 0 24 18" fill="currentColor">
                <path d="M0 18V10.2857C0 4.60714 3.42857 0.857143 8.57143 0L10.2857 2.57143C6.85714 3.42857 5.14286 5.57143 4.71429 8.57143H10.2857V18H0ZM13.7143 18V10.2857C13.7143 4.60714 17.1429 0.857143 22.2857 0L24 2.57143C20.5714 3.42857 18.8571 5.57143 18.4286 8.57143H24V18H13.7143Z" />
              </svg>
            </div>

            {/* Quote Body */}
            <blockquote className="mt-2 text-[13.5px] xs:text-[14px] sm:text-[14.5px] leading-[1.62] text-[#536174] font-normal transition-colors duration-500 group-hover:text-white/90">
              &ldquo;Honestly, the AI ads turned out way better than I expected. The videos looked real, the editing was clean, and the hooks actually made my products look interesting. Really happy with how they came out.&rdquo;
            </blockquote>

            {/* Highlights Tag with pop-in spring */}
            <motion.div variants={tagContainerVariant} className="mt-3.5 flex flex-wrap gap-1.5">
              {[
                '✦ AI Video Ads',
                'Creative Editing',
                'Product Marketing',
              ].map((tag) => (
                <motion.span
                  key={tag}
                  variants={tagPopInVariant}
                  className="rounded-md border border-black/[0.08] bg-white px-2.5 py-0.5 text-[12px] font-mono text-[#15202F] transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/15 group-hover:text-white/80"
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Client Footer */}
          <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-black/[0.06] flex items-center gap-3 transition-colors duration-500 group-hover:border-white/10">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-tr from-[#15202F] to-[#3b4d63] text-white flex items-center justify-center text-[11px] font-semibold tracking-wider shadow-sm ring-2 ring-white transition-all duration-500 group-hover:ring-white/25">
              J
            </div>
            <div className="flex flex-col">
              <p className="text-[13.5px] sm:text-[14px] font-semibold text-[#15202F] leading-tight transition-colors duration-500 group-hover:text-white">
                James
              </p>
              <p className="text-[12px] text-[#6B7280] transition-colors duration-500 group-hover:text-white/70">
                E-commerce Brand Owner
              </p>
            </div>
          </div>
        </article>
      </TiltCard>
    </motion.div>
  )
})

const WaqasFeaturedCard = memo(function WaqasFeaturedCard() {
  const reduce = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)
  const inView = useInView(cardRef, { once: false, amount: 0.15 })

  return (
    <motion.div
      ref={cardRef}
      initial="hidden"
      whileInView="visible"
      viewport={springViewport}
      variants={createCardSpringVariant(1)}
      className="h-full order-1 md:order-1 md:col-span-2 lg:order-2 lg:col-span-1"
    >
      <TiltCard className="h-full">
        <article
          style={{ contain: 'paint layout' }}
          className="group relative flex h-full flex-col justify-between rounded-[22px] xs:rounded-[26px] sm:rounded-[30px] border border-black/[0.11] bg-white p-4.5 xs:p-5 sm:p-8 lg:p-8 xl:p-9 shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_24px_50px_-18px_rgba(21,32,47,0.15),0_0_35px_-8px_rgba(21,32,47,0.06)] ring-1 ring-black/[0.04] transition-[background-color,border-color,box-shadow,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#15202F] hover:border-[#15202F] hover:shadow-[0_34px_70px_-18px_rgba(21,32,47,0.45)]"
        >
          {/* Subtle Animated Glass Specular Sweep */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[22px] xs:rounded-[26px] sm:rounded-[30px]">
            <motion.div
              animate={reduce ? undefined : inView ? { x: ['-100%', '200%'] } : undefined}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60 -skew-x-12"
            />
          </div>

          <div className="relative z-10">
            {/* Header: Featured Pill & Domain Badge */}
            <div className="flex items-center justify-between gap-2.5 pb-3.5 sm:pb-4 border-b border-black/[0.07] transition-colors duration-500 group-hover:border-white/10">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.09] bg-black/[0.03] px-3 py-1 text-[12px] font-semibold tracking-[0.12em] uppercase text-[#15202F] transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/20 group-hover:text-white">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Verified Collaboration
              </span>

              <span className="rounded-full border border-black/[0.08] bg-black/[0.03] px-2.5 py-0.5 text-[11.5px] font-mono font-medium text-[#15202F] transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/20 group-hover:text-white">
                waqasgfx.com
              </span>
            </div>

            {/* Scope Metadata */}
            <div className="mt-3.5 flex items-center gap-1.5 text-[11.5px] font-mono text-[#536174] transition-colors duration-500 group-hover:text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Website Design · UI/UX · Motion</span>
            </div>

            {/* Quotation Icon */}
            <div className="mt-3.5 text-[#15202F]/20 transition-colors duration-500 group-hover:text-white/20" aria-hidden="true">
              <svg width="22" height="18" viewBox="0 0 24 18" fill="currentColor">
                <path d="M0 18V10.2857C0 4.60714 3.42857 0.857143 8.57143 0L10.2857 2.57143C6.85714 3.42857 5.14286 5.57143 4.71429 8.57143H10.2857V18H0ZM13.7143 18V10.2857C13.7143 4.60714 17.1429 0.857143 22.2857 0L24 2.57143C20.5714 3.42857 18.8571 5.57143 18.4286 8.57143H24V18H13.7143Z" />
              </svg>
            </div>

            {/* Quote Body with Editorial Highlights */}
            <blockquote className="mt-2.5 text-[14px] xs:text-[15px] sm:text-[16px] lg:text-[16.5px] leading-[1.62] text-[#15202F] font-normal tracking-[-0.01em] transition-colors duration-500 group-hover:text-white">
              &ldquo;Hafiz Aqeel did a great job with my website. I wanted something clean but still different from other design portfolios, and he understood the vibe pretty quickly. The animations and overall look came out really nice. Small details <Serif>made a big difference</Serif>.&rdquo;
            </blockquote>

            {/* Technology Chips with spring pop-in */}
            <motion.div variants={tagContainerVariant} className="mt-4 flex flex-wrap gap-1.5">
              {['Website Design', 'UI/UX', 'Motion & Animation'].map((t) => (
                <motion.span
                  key={t}
                  variants={tagPopInVariant}
                  className="rounded-full border border-black/[0.08] bg-white px-2.5 sm:px-3 py-1 text-[12px] font-medium text-[#15202F] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/15 group-hover:text-white/80"
                >
                  {t}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Client Footer */}
          <div className="relative z-10 mt-5 sm:mt-7 pt-4 sm:pt-5 border-t border-black/[0.08] flex items-center justify-between transition-colors duration-500 group-hover:border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-[#15202F] text-white flex items-center justify-center text-[13px] sm:text-[15px] font-bold shadow-md ring-2 ring-white transition-all duration-500 group-hover:bg-white group-hover:text-[#15202F] group-hover:ring-white/40">
                W
              </div>
              <div className="flex flex-col">
                <p className="text-[14px] sm:text-[15.5px] font-semibold text-[#15202F] leading-tight transition-colors duration-500 group-hover:text-white">
                  Waqas
                </p>
                <p className="text-[12px] text-[#536174] transition-colors duration-500 group-hover:text-white/70">
                  Founder, WaqasGFX
                </p>
              </div>
            </div>

            <span className="hidden xs:inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[12px] font-medium text-emerald-800 transition-all duration-500 group-hover:bg-emerald-400/20 group-hover:border-emerald-400/30 group-hover:text-emerald-300">
              ✓ Verified
            </span>
          </div>
        </article>
      </TiltCard>
    </motion.div>
  )
})

const EmmaCard = memo(function EmmaCard() {
  const reduce = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)
  const inView = useInView(cardRef, { once: false, amount: 0.15 })

  return (
    <motion.div
      ref={cardRef}
      initial="hidden"
      whileInView="visible"
      viewport={springViewport}
      variants={createCardSpringVariant(2)}
      className="h-full order-3 md:order-3 md:col-span-1 lg:order-3 lg:col-span-1"
    >
      <TiltCard className="h-full">
        <article
          style={{ contain: 'paint layout' }}
          className="group relative flex h-full flex-col justify-between rounded-[20px] xs:rounded-[24px] sm:rounded-[26px] border border-black/[0.07] bg-white sm:bg-white/95 p-4 xs:p-5 sm:p-7 shadow-[0_1px_0_rgba(255,255,255,0.95)_inset,0_12px_28px_-16px_rgba(21,32,47,0.08)] ring-1 ring-black/[0.03] transition-[background-color,border-color,box-shadow,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#15202F] hover:border-[#15202F] hover:shadow-[0_24px_55px_-12px_rgba(21,32,47,0.35)]"
        >
          <div>
            {/* Header: AI Commercials & Format */}
            <div className="flex items-center justify-between gap-2.5 pb-3.5 border-b border-black/[0.05] transition-colors duration-500 group-hover:border-white/10">
              <span className="text-[12px] font-mono font-semibold uppercase tracking-[0.14em] text-[#15202F] transition-colors duration-500 group-hover:text-white">
                Project Feedback
              </span>
              <span className="rounded-full border border-black/[0.08] bg-white px-2.5 py-0.5 text-[12px] font-mono text-[#536174] transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/15 group-hover:text-white/80">
                Social Ads
              </span>
            </div>

            {/* Scope Metadata */}
            <div className="mt-3.5 flex items-center gap-1.5 text-[11px] font-mono text-[#536174] transition-colors duration-500 group-hover:text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>AI Ads · Product Videos</span>
            </div>

            {/* Quotation Icon */}
            <div className="mt-3 text-[#536174]/20 transition-colors duration-500 group-hover:text-white/20" aria-hidden="true">
              <svg width="18" height="14" viewBox="0 0 24 18" fill="currentColor">
                <path d="M0 18V10.2857C0 4.60714 3.42857 0.857143 8.57143 0L10.2857 2.57143C6.85714 3.42857 5.14286 5.57143 4.71429 8.57143H10.2857V18H0ZM13.7143 18V10.2857C13.7143 4.60714 17.1429 0.857143 22.2857 0L24 2.57143C20.5714 3.42857 18.8571 5.57143 18.4286 8.57143H24V18H13.7143Z" />
              </svg>
            </div>

            {/* Quote Body */}
            <blockquote className="mt-2 text-[13.5px] xs:text-[14px] sm:text-[14.5px] leading-[1.62] text-[#536174] font-normal transition-colors duration-500 group-hover:text-white/90">
              &ldquo;The AI video ads came out really good. The product shots looked natural and the editing kept everything interesting without making it feel overdone. Definitely a much better way to show my products on social media.&rdquo;
            </blockquote>

            {/* Highlights Tag with pop-in spring */}
            <motion.div variants={tagContainerVariant} className="mt-3.5 flex flex-wrap gap-1.5">
              {[
                '✦ AI Ads',
                'Product Videos',
                'Social Media',
              ].map((tag) => (
                <motion.span
                  key={tag}
                  variants={tagPopInVariant}
                  className="rounded-md border border-black/[0.08] bg-white px-2.5 py-0.5 text-[12px] font-mono text-[#15202F] transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/15 group-hover:text-white/80"
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Client Footer */}
          <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-black/[0.06] flex items-center gap-3 transition-colors duration-500 group-hover:border-white/10">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-tr from-[#15202F] to-[#3b4d63] text-white flex items-center justify-center text-[11px] font-semibold tracking-wider shadow-sm ring-2 ring-white transition-all duration-500 group-hover:ring-white/25">
              E
            </div>
            <div className="flex flex-col">
              <p className="text-[13.5px] sm:text-[14px] font-semibold text-[#15202F] leading-tight transition-colors duration-500 group-hover:text-white">
                Emma
              </p>
              <p className="text-[12px] text-[#6B7280] transition-colors duration-500 group-hover:text-white/70">
                Online Store Owner
              </p>
            </div>
          </div>
        </article>
      </TiltCard>
    </motion.div>
  )
})

function TestimonialsSection() {
  return (
    <section id="testimonials" className={`${CONTAINER} ${SECTION_Y} border-t border-black/[0.06] overflow-hidden`}>
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-6 sm:mb-12 lg:mb-16">
        <FadeIn>
          <Eyebrow>Client Feedback</Eyebrow>
        </FadeIn>
        <h2 className="mt-3 sm:mt-4 text-[22px] xs:text-[26px] sm:text-[clamp(1.9rem,3.4vw,2.9rem)] font-medium leading-[1.08] sm:leading-[1.04] tracking-[-0.035em] text-[#15202F]">
          <MaskText
            lines={[
              <>
                What clients <Serif>say.</Serif>
              </>,
            ]}
          />
        </h2>
        <FadeIn delay={0.1}>
          <p className="mt-2 sm:mt-3 max-w-[460px] text-[12.5px] xs:text-[13px] sm:text-[15.5px] leading-[1.5] sm:leading-[1.6] text-[#536174]">
            A few words from the people I&apos;ve worked with.
          </p>
        </FadeIn>
      </div>

      {/* 3 Distinct Animated Cards in Responsive Composition */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.24fr)_minmax(0,1fr)] items-center gap-4 sm:gap-5 lg:gap-6">
        <JamesCard />
        <WaqasFeaturedCard />
        <EmmaCard />
      </div>
    </section>
  )
}

/* ============================================================
   PAGE ROOT
   ============================================================ */

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-transparent text-[#15202F]">
      <Nav />
      <Hero />

      {/* TOOLKIT */}
      <section className="relative z-10 border-y border-black/[0.06] overflow-hidden max-w-[100vw]">
        <FadeIn className={`${CONTAINER} flex items-baseline justify-between pt-10`}>
          <Eyebrow>Toolkit</Eyebrow>
          <p className="hidden sm:block text-[13px] text-[#536174]">Tech stacks &amp; AI-native workflows</p>
        </FadeIn>
        {/* High contrast, crisp toolkit marquee with zero mobile overflow */}
        <FadeIn delay={0.08} className="w-full max-w-full overflow-hidden [&_img]:mix-blend-multiply [&_img]:opacity-95 [&_span]:text-[#0F172A] [&_span]:font-semibold">
          <SnakeMarquee tools={TOOLS} />
        </FadeIn>
      </section>

      {/* SELECTED WORK */}
      <SelectedWorkSection />

      {/* SERVICES */}
      <section id="services" data-gsap="section" className={`${CONTAINER} ${SECTION_Y} overflow-hidden`}>
        <SectionHeader
          index="02"
          label="Services"
          titleClassName="text-[24px] xs:text-[28px] sm:text-[clamp(1.85rem,3.5vw,3rem)]"
          title={[
            'Three disciplines,',
            <>
              one <Serif>focused</Serif> practice.
            </>,
          ]}
          intro="Design, engineering, and artificial intelligence working in concert to build distinctive digital products."
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
          {SERVICES.map((s, i) => (
            <ServiceCard3D key={s.n} service={s} index={i} />
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" data-gsap="section" className={`${CONTAINER} ${SECTION_Y} overflow-hidden`}>
        <SectionHeader
          index="03"
          label="Process"
          titleClassName="text-[24px] xs:text-[28px] sm:text-[clamp(1.85rem,3.5vw,3rem)]"
          title={[
            'From idea',
            <>
              to <Serif>execution</Serif>.
            </>,
          ]}
          intro="A structured four-stage framework designed to move deliberately from concept to launch. Timelines adapt to project scope and review cycles."
        />

        {/* Desktop Stepper Track */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={springViewport}
          className="hidden lg:grid grid-cols-4 gap-6 mb-7"
        >
          {STEPS.map((step, idx) => (
            <div key={step.n} className="relative flex items-center">
              <div className="absolute inset-x-0 h-px bg-black/[0.08]" />
              <motion.div
                variants={{
                  hidden: { scaleX: 0, transition: { duration: 0.25, ease: 'easeOut' } },
                  visible: { scaleX: 1, transition: { duration: 0.75, delay: idx * 0.1, ease: EASE } },
                }}
                className="absolute inset-0 origin-left h-px bg-gradient-to-r from-[#15202F] to-[#536174]"
              />
              <div className="relative z-10 flex items-center gap-2 bg-[#F6F7F8] pr-3">
                <span className="h-2 w-2 rounded-full bg-[#15202F]" />
                <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#536174]">
                  {step.phase}
                </span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* 4 3D Stage Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {STEPS.map((step, i) => (
            <ProcessCard3D key={step.n} step={step} index={i} />
          ))}
        </div>
      </section>

      {/* CLIENT FEEDBACK / TESTIMONIALS (Lower of Process section as requested) */}
      <TestimonialsSection />

      {/* FAQ */}
      <FAQSection />

      {/* ABOUT */}
      <section id="about" className="relative z-10 border-y border-black/[0.06] bg-white/45 overflow-hidden">
        <div className={`${CONTAINER} ${SECTION_Y}`}>
          <div className="grid grid-cols-1 gap-y-8 sm:gap-y-12 lg:grid-cols-12 lg:gap-x-12">
            <div className="lg:col-span-6">
              <FadeIn>
                <Eyebrow index="04">About</Eyebrow>
              </FadeIn>
              <h2 className="mt-4 sm:mt-10 text-[22px] xs:text-[25px] sm:text-[clamp(2.1rem,4.2vw,3.6rem)] font-medium leading-[1.06] sm:leading-[1.04] tracking-[-0.035em] text-[#15202F]">
                <MaskText
                  lines={[
                    'Building at the',
                    'intersection of',
                    <>
                      <Serif>design, engineering</Serif>
                    </>,
                    'and artificial intelligence.',
                  ]}
                />
              </h2>

              <FadeIn delay={0.2} className="mt-4 sm:mt-10 flex items-center gap-3 text-[10.5px] sm:text-[11px] tracking-[0.2em] uppercase text-[#536174] font-medium">
                <span className="h-px w-8 bg-neutral-300" />
                <span>Hafiz Muhammad Aqeel · Creative Studio</span>
              </FadeIn>
            </div>

            <div className="lg:col-span-5 lg:col-start-8 flex flex-col justify-end">
              <FadeIn className="flex flex-col gap-3 sm:gap-4">
                <p className="text-[13.5px] xs:text-[14.5px] sm:text-[16.5px] leading-[1.6] sm:leading-[1.65] text-[#15202F] font-normal">
                  HMA brings design, development, and AI-powered creativity together in one streamlined partnership. You work directly with the person building your project, with clear communication, deliberate execution, and attention to the details that make digital experiences stand out.
                </p>
                <p className="hidden sm:block text-[14px] sm:text-[15px] leading-[1.6] text-[#536174]">
                  Every build unites engineering rigor and visual restraint — ensuring your digital presence is technically resilient, fast, and crafted with uncompromising aesthetic quality.
                </p>
              </FadeIn>

              <FadeIn delay={0.1}>
                <dl className="mt-5 sm:mt-10 border-t border-black/[0.08] text-[11.5px] xs:text-[12px] sm:text-[14px]">
                  {[
                    { k: 'Role', v: 'Creative Developer & AI Builder' },
                    { k: 'Focus', v: 'AI Websites, Web Apps & Commercials' },
                    { k: 'Toolkit', v: 'Next.js · TypeScript · Figma · AI Workflows' },
                  ].map((row, rIdx) => (
                    <motion.div
                      key={row.k}
                      initial="hidden"
                      whileInView="visible"
                      viewport={springViewport}
                      variants={createFadeUpVariant(18, 0.06 * rIdx, springs.base)}
                      className="grid grid-cols-12 gap-2 sm:gap-3 border-b border-black/[0.08] py-2 xs:py-2.5 sm:py-3.5 px-1 -mx-1 rounded-lg transition-colors duration-300 hover:bg-[#15202F]/[0.02]"
                    >
                      <dt className="col-span-4 sm:col-span-3 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] sm:tracking-[0.18em] text-[#6B7280] pt-0.5">
                        {row.k}
                      </dt>
                      <dd className="col-span-8 sm:col-span-9 text-[#15202F] font-medium">{row.v}</dd>
                    </motion.div>
                  ))}
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={springViewport}
                    variants={createFadeUpVariant(18, 0.2, springs.base)}
                    className="grid grid-cols-12 gap-2 sm:gap-3 py-2 xs:py-2.5 sm:py-3.5 px-1 -mx-1"
                  >
                    <dt className="col-span-4 sm:col-span-3 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] sm:tracking-[0.18em] text-[#6B7280] pt-0.5">
                      Status
                    </dt>
                    <dd className="col-span-8 sm:col-span-9 flex items-center gap-2 text-[11.5px] sm:text-[12px] text-[#15202F] font-medium">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      Available for new projects
                    </dd>
                  </motion.div>
                </dl>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT — builds smoothly toward signature footer */}
      <section id="contact" className={`${CONTAINER} ${SECTION_Y} overflow-hidden`}>
        <FadeIn>
          <Eyebrow index="05">Contact</Eyebrow>
        </FadeIn>
        <h2 className="mt-4 sm:mt-10 text-[28px] xs:text-[34px] sm:text-[clamp(2.75rem,7vw,7rem)] font-medium leading-[0.98] sm:leading-[0.96] tracking-[-0.04em] sm:tracking-[-0.05em] text-[#15202F]">
          <MaskText
            lines={[
              'Have an idea?',
              <>
                <Serif>Let&apos;s build it.</Serif>
              </>,
            ]}
          />
        </h2>
        <div className="mt-6 sm:mt-14 grid grid-cols-1 items-start sm:items-end gap-5 sm:gap-10 border-t border-black/[0.08] pt-6 sm:pt-10 lg:grid-cols-12">
          <FadeIn className="lg:col-span-6">
            <p className="max-w-[440px] text-[13px] xs:text-[14px] sm:text-[17px] leading-[1.6] text-[#536174]">
              Open for select client projects, creative collaborations, and AI-native builds.
            </p>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-6 flex flex-col items-start gap-4 lg:items-end">
            <PrimaryCTA href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" size="lg">
              Start a Project
            </PrimaryCTA>
            <a
              href={`mailto:${EMAIL}`}
              className="group relative text-[13.5px] sm:text-[14px] font-medium text-[#15202F] transition-colors hover:text-[#0f1722]"
            >
              or email {EMAIL}
              <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-[#15202F] transition-transform duration-500 group-hover:scale-x-100" />
            </a>
          </FadeIn>
        </div>
      </section>

      {/* Signature Canvas (Active across Mobile and Desktop with Scroll-Driven HMA Morph) */}
      <SignatureFooter />
    </main>
  )
}
