import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Instrument_Serif } from 'next/font/google'
import './globals.css'
import IntroLoader from '@/src/components/ui/intro-loader'
import SmoothScroll from '@/src/components/ui/smooth-scroll'
import ScrollProgressBar from '@/src/components/ui/scroll-progress-bar'
import CustomCursor from '@/src/components/ui/custom-cursor'

// Typography system: Modern Clean Sans-Serif (Geist) + Elegant High-Contrast Italic Serif (Instrument Serif)
const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.hma.solutions'),
  title: 'HMA Solutions | AI Web Design & Automation',
  description:
    'HMA Solutions builds premium websites, AI web apps, automation systems, and AI-powered product commercials for ambitious brands.',
  keywords: [
    'HMA Solutions',
    'Hafiz Muhammad Aqeel',
    'AI Web Design',
    'AI Web Applications',
    'AI Agents',
    'Workflow Automation',
    'AI Commercials',
    'Creative Developer',
    'Next.js Developer',
  ],
  authors: [{ name: 'Hafiz Muhammad Aqeel', url: 'https://www.hma.solutions' }],
  creator: 'Hafiz Muhammad Aqeel',
  publisher: 'HMA Solutions',
  alternates: {
    canonical: 'https://www.hma.solutions/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'HMA Solutions | AI Web Design & Automation',
    description:
      'HMA Solutions builds premium websites, AI web apps, automation systems, and AI-powered product commercials for ambitious brands.',
    type: 'website',
    url: 'https://www.hma.solutions/',
    siteName: 'HMA Solutions',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'HMA Solutions — AI Web Design & Automation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HMA Solutions | AI Web Design & Automation',
    description:
      'HMA Solutions builds premium websites, AI web apps, automation systems, and AI-powered product commercials for ambitious brands.',
    creator: '@hmasolution',
    site: '@hmasolution',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.hma.solutions/#organization',
      name: 'HMA Solutions',
      url: 'https://www.hma.solutions/',
      email: 'hafiz.aqeel@hma.solutions',
      description:
        'HMA Solutions builds premium websites, AI web apps, automation systems, and AI-powered product commercials for ambitious brands.',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.hma.solutions/images/hma_logo_exact@2x.png',
        caption: 'HMA Solutions Logo',
      },
      image: 'https://www.hma.solutions/og-image.png',
      founder: {
        '@id': 'https://www.hma.solutions/#founder',
      },
      sameAs: [
        'https://www.instagram.com/hmasolution/',
        'https://x.com/hmasolution',
        'https://web.facebook.com/hmasolution',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'hafiz.aqeel@hma.solutions',
        telephone: '+923262851468',
        availableLanguage: ['English', 'Urdu'],
      },
    },
    {
      '@type': 'Person',
      '@id': 'https://www.hma.solutions/#founder',
      name: 'Hafiz Muhammad Aqeel',
      jobTitle: 'Founder',
      worksFor: {
        '@id': 'https://www.hma.solutions/#organization',
      },
      email: 'hafiz.aqeel@hma.solutions',
      image: 'https://www.hma.solutions/portrait.jpg',
      url: 'https://www.hma.solutions/',
      sameAs: [
        'https://www.instagram.com/hmasolution/',
        'https://x.com/hmasolution',
        'https://web.facebook.com/hmasolution',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.hma.solutions/#website',
      url: 'https://www.hma.solutions/',
      name: 'HMA Solutions',
      publisher: {
        '@id': 'https://www.hma.solutions/#organization',
      },
      description:
        'HMA Solutions builds premium websites, AI web apps, automation systems, and AI-powered product commercials for ambitious brands.',
      inLanguage: 'en-US',
    },
    {
      '@type': 'ProfessionalService',
      '@id': 'https://www.hma.solutions/#service',
      name: 'HMA Solutions',
      url: 'https://www.hma.solutions/',
      email: 'hafiz.aqeel@hma.solutions',
      parentOrganization: {
        '@id': 'https://www.hma.solutions/#organization',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'HMA Solutions Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Premium Website Design & Development',
              description:
                'Bespoke, high-performance interactive websites built with Next.js, React, and modern motion.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'AI-Powered Web Applications',
              description:
                'Intelligent full-stack web applications with generative AI capabilities and modern user interfaces.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'AI Agents & Business Automation',
              description:
                'Custom autonomous AI agents, workflow automations, and operational integrations.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'AI-Generated Commercials & Advertisements',
              description:
                'Cinematic AI-generated video campaigns, 3D product visuals, and vertical social reels.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Digital Branding & Creative Solutions',
              description:
                'Comprehensive digital identity design, visual hierarchy, and cohesive brand storytelling.',
            },
          },
        ],
      },
    },
  ],
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#F6F7F8',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${instrumentSerif.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <IntroLoader />
        <ScrollProgressBar />
        <CustomCursor />
        <SmoothScroll>
          {children}
        </SmoothScroll>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
