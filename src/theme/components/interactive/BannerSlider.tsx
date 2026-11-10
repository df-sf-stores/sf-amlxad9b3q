'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion, useStorefront } from '@dripfunnel/storefront-core/theme'
import { cx } from '../cx'
import { Icon } from '../Icons'
import styles from '../../styles/home.module.css'

const autoplayMs = 5000
const swipePx = 40

/** The navy banner slider: round arrows, a gold dot that widens for the current slide, swipe, and autoplay that pauses on hover or focus. */
export const BannerSlider = ({ slides, label }: { slides: { key: string; label: string; node: ReactNode }[]; label: string }) => {
  const { t } = useStorefront()
  const [selected, setSelected] = useState(0)
  const [held, setHeld] = useState(false)
  const reduced = useReducedMotion()
  const swipeFrom = useRef<number | null>(null)
  const count = slides.length
  const go = (index: number) => setSelected((index + count) % count)
  const autoplay = count > 1 && !reduced && !held

  useEffect(() => {
    if (!autoplay) return
    const id = setTimeout(() => setSelected((i) => (i + 1) % count), autoplayMs)
    return () => clearTimeout(id)
  }, [autoplay, selected, count])

  return (
    <div
      className={styles.slider}
      role="region"
      aria-roledescription={t('home.slider.role')}
      aria-label={label}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') setHeld(true)
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') setHeld(false)
      }}
      onPointerDown={(e) => {
        swipeFrom.current = e.clientX
      }}
      onPointerUp={(e) => {
        if (swipeFrom.current === null) return
        const dx = e.clientX - swipeFrom.current
        swipeFrom.current = null
        if (Math.abs(dx) > swipePx) go(selected + (dx < 0 ? 1 : -1))
      }}
    >
      <div className={styles.sliderViewport}>
        {slides.map((slide, index) => (
          <div key={slide.key} className={cx(styles.slide, index === selected ? styles.slideOn : index < selected ? styles.slideBefore : styles.slideAfter, reduced && styles.slideStill)} aria-hidden={index === selected ? undefined : true} hidden={Math.abs(index - selected) > 1 ? true : undefined}>
            {slide.node}
          </div>
        ))}
      </div>
      {count > 1 ? (
        <>
          <button type="button" className={cx(styles.sliderBtn, styles.sliderPrev)} aria-label={t('home.slider.previous')} onClick={() => go(selected - 1)}>
            <Icon name="left" className={styles.sliderIcon} />
          </button>
          <button type="button" className={cx(styles.sliderBtn, styles.sliderNext)} aria-label={t('home.slider.next')} onClick={() => go(selected + 1)}>
            <Icon name="right" className={styles.sliderIcon} />
          </button>
          <div className={styles.dots}>
            {slides.map((slide, index) => (
              <button key={slide.key} type="button" className={cx(styles.dot, index === selected && styles.dotOn)} aria-label={t('home.slider.goTo', { name: slide.label })} aria-current={index === selected} onClick={() => go(index)} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
