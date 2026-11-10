'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Image, useStorefront, type Photo } from '@dripfunnel/storefront-core/theme'
import { cx } from '../cx'
import { Icon } from '../Icons'
import styles from '../../styles/lightbox.module.css'

/** The dark full-screen picture view: Escape, the close button or a press outside the picture closes it. */
export const Lightbox = ({ photo, caption, onClose }: { photo: Photo; caption: string; onClose: () => void }) => {
  const { t } = useStorefront()
  const close = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    close.current?.focus()
  }, [])
  return (
    <div
      className={styles.lightbox}
      role="dialog"
      aria-modal="true"
      aria-label={caption}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose()
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <button ref={close} type="button" className={styles.close} aria-label={t('shop.lightbox.close')} onClick={onClose}>
        <Icon name="close" className={styles.icon} />
      </button>
      <figure className={styles.figure}>
        <Image image={photo} alt={photo.alt ?? caption} ratio={1} sizes="90vw" className={styles.image} />
        <figcaption className={styles.caption}>{caption}</figcaption>
      </figure>
    </div>
  )
}

/** A round button that opens the product's photo in the lightbox; `children` replaces the expand icon when given. */
export const QuickView = ({ photo, name, className, children }: { photo: Photo; name: string; className?: string; children?: ReactNode }) => {
  const { t } = useStorefront()
  const [open, setOpen] = useState(false)
  const opener = useRef<HTMLButtonElement>(null)
  return (
    <>
      <button ref={opener} type="button" className={cx(className)} aria-label={children ? undefined : t('shop.lightbox.open', { name })} onClick={() => setOpen(true)}>
        {children ?? <Icon name="expand" className={styles.icon} />}
      </button>
      {open ? (
        <Lightbox
          photo={photo}
          caption={name}
          onClose={() => {
            setOpen(false)
            opener.current?.focus()
          }}
        />
      ) : null}
    </>
  )
}
