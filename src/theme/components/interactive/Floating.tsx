'use client'

import { Link, useScrollProgress, useStorefront } from '@dripfunnel/storefront-core/theme'
import { cx } from '../cx'
import { Icon, WhatsAppIcon } from '../Icons'
import styles from '../../styles/layout.module.css'

/**
 * The floating WhatsApp chat button, bottom right, with its pulse rings and tooltip, and "back to top" above it once
 * the page has scrolled. It opens the WhatsApp link from Site settings, or the chat link in the theme's content until
 * one is set there.
 */
export const Floating = () => {
  const { store, t } = useStorefront()
  const progress = useScrollProgress()
  const chat = store.social.find((s) => s.network === 'whatsapp')?.url ?? t('common.float.url')
  return (
    <>
      <Link href="#top" className={cx(styles.toTop, progress > 0.06 && styles.toTopOn)}>
        <Icon name="up" className={styles.ic} />
        <span className={styles.hidden}>{t('common.float.top')}</span>
      </Link>
      <Link href={chat} className={styles.waFloat}>
        <span className={styles.waTip} aria-hidden="true">
          {t('common.float.tip')}
        </span>
        <span className={styles.waButton}>
          <WhatsAppIcon className={styles.waIcon} />
        </span>
        <span className={styles.hidden}>{t('common.float.whatsapp')}</span>
      </Link>
    </>
  )
}
