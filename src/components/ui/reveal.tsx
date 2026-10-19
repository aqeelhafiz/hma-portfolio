'use client'

import React from 'react'
import { Reveal as MotionReveal, type RevealProps } from '@/lib/motion'

export default function Reveal(props: RevealProps) {
  return <MotionReveal {...props} />
}
