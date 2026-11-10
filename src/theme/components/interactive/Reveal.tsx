'use client'

import { useRef, type ReactNode } from 'react'
import { useInView } from '@dripfunnel/storefront-core/theme'
import { cx } from '../cx'
import ui from '../../styles/ui.module.css'

/** Fades and lifts its content into place the first time it scrolls into view (instant under reduced motion, by CSS). */
export const Reveal = ({ children, className }: { children: ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { once: true })
  return (
    <div ref={ref} className={cx(ui.reveal, seen && ui.revealed, className)}>
      {children}
    </div>
  )
}
