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
  // Update this placeholder URL when you connect your custom domain:
  metadataBase: new URL('https://hma-portfolio.vercel.app'),
  title: 'HMA | AI-Powered Digital Experiences',
  description: 'Building fast, smart, scalable websites and web apps powered by AI.',
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
    title: 'HMA | AI-Powered Digital Experiences',
    description: 'Building fast, smart, scalable websites and web apps powered by AI.',
    type: 'website',
    url: 'https://hma-portfolio.vercel.app',
    siteName: 'HMA Studio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'HMA — Creative Developer & AI Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HMA | AI-Powered Digital Experiences',
    description: 'Building fast, smart, scalable websites and web apps powered by AI.',
    images: ['/og-image.png'],
  },
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
