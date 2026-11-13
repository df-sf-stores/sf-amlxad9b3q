import type { ReactNode } from 'react'
import { ConsentBanner, ConsentSettingsButton, Link, PoweredBy, PreviewBanner, StoreLogo, useCollections, useMenu, useStorefront, type MenuItem } from '@dripfunnel/storefront-core/theme'
import { DripFunnelLogo } from './DripFunnelLogo'
import { Icon } from './Icons'
import { DrawerSearch, Header } from './interactive/Header'
import { Floating } from './interactive/Floating'
import styles from '../styles/layout.module.css'

/** Digits and a leading +, the form a phone link takes. */
export const dialable = (phone: string) => phone.replace(/[^\d+]/g, '')

/** The store's address from Site settings, as one line. */
export const addressLine = (address: { street?: string | null; city?: string | null; region?: string | null; postal?: string | null } | null | undefined) =>
  [address?.street, address?.city, address?.region, address?.postal].filter(Boolean).join(', ')

export const Layout = ({ children }: { children: ReactNode }) => {
  const { store, t, mode, poweredBy } = useStorefront()
  const menu = useMenu()
  // `first: 20` matches the home page's request, so both share one answer.
  const { collections: fetched, status } = useCollections({ first: 20 })
  const collections = status === 'ready' ? fetched : []
  // The store's own menu when it has one; until then, the pages every store has, with its collections under Shop.
  const items: MenuItem[] = menu.items.length
    ? menu.items
    : [
        { id: 'home', label: t('common.nav.home'), href: '/', children: [] },
        { id: 'shop', label: t('common.nav.shopAll'), href: '/collections/all/', children: [] },
        ...collections.map((c) => ({ id: c.id, label: c.name, href: c.href, children: [] })),
        { id: 'about', label: t('common.nav.about'), href: '/about/', children: [] },
        { id: 'contact', label: t('common.nav.contact'), href: '/contact/', children: [] },
      ]
  const place = addressLine(store.address)
  const announcements = [t('common.announce.one'), t('common.announce.two'), t('common.announce.three'), t('common.announce.four')]
  return (
    <div className={styles.shell} id="top">
      {mode === 'live' ? null : <PreviewBanner t={t} className={styles.preview} />}
      <div className={styles.announce}>
        {[0, 1].map((copy) => (
          <ul key={copy} className={styles.announceTrack} aria-hidden={copy === 1 ? true : undefined}>
            {announcements.map((words) => (
              <li key={words} className={styles.announceItem}>
                {words}
              </li>
            ))}
          </ul>
        ))}
      </div>
      <Header
        items={items}
        extra={
          <div className={styles.drawerSection}>
            <DrawerSearch />
            <ul className={styles.drawerLinks}>
              <li>
                <Link href="/account/" className={styles.navLink}>
                  {t('common.tools.account')}
                </Link>
              </li>
              <li>
                <Link href="/account/wishlist/" className={styles.navLink}>
                  {t('common.tools.wishlist')}
                </Link>
              </li>
              <li>
                <Link href="/account/orders/" className={styles.navLink}>
                  {t('common.footer.orders')}
                </Link>
              </li>
            </ul>
          </div>
        }
      />
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <Link href="/" className={styles.brand}>
              <StoreLogo className={styles.footerLogo} />
            </Link>
            <p>{store.tagline || t('common.footer.note')}</p>
            <p className={styles.footerLine}>
              <Icon name="doc" className={styles.ic} />
              {t('common.footer.fssai')}
            </p>
            {store.social.length ? (
              <div className={styles.social}>
                {store.social.map((s) => (
                  <Link key={s.network} href={s.url} className={styles.socialLink}>
                    {s.network}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <nav className={styles.footerCol} aria-label={t('common.footer.quick')}>
            <h2 className={styles.footerHeading}>{t('common.footer.quick')}</h2>
            {menu.items.length ? (
              menu.items
                .flatMap((i) => [i, ...i.children])
                .slice(0, 8)
                .map((item) => (
                  <Link key={item.id} href={item.href} className={styles.footerLink}>
                    {item.label}
                  </Link>
                ))
            ) : (
              <>
                <Link href="/" className={styles.footerLink}>
                  {t('common.nav.home')}
                </Link>
                <Link href="/collections/all/" className={styles.footerLink}>
                  {t('common.nav.shopAll')}
                </Link>
                <Link href="/about/" className={styles.footerLink}>
                  {t('common.nav.about')}
                </Link>
                <Link href="/help/" className={styles.footerLink}>
                  {t('common.footer.faq')}
                </Link>
              </>
            )}
            <Link href="/policies/shipping/" className={styles.footerLink}>
              {t('common.footer.shipping')}
            </Link>
            <Link href="/policies/returns/" className={styles.footerLink}>
              {t('common.footer.returns')}
            </Link>
          </nav>
          <div className={styles.footerCol}>
            <h2 className={styles.footerHeading}>{t('common.footer.shop')}</h2>
            {collections.map((c) => (
              <Link key={c.id} href={c.href} className={styles.footerLink}>
                {c.name}
              </Link>
            ))}
            <Link href="/collections/all/" className={styles.footerLink}>
              {t('common.footer.all')}
            </Link>
            <Link href="/account/orders/" className={styles.footerLink}>
              {t('common.footer.orders')}
            </Link>
            <Link href="/policies/privacy/" className={styles.footerLink}>
              {t('common.footer.privacy')}
            </Link>
            <Link href="/policies/terms/" className={styles.footerLink}>
              {t('common.footer.terms')}
            </Link>
          </div>
          <div className={`${styles.footerCol} ${styles.footerContact}`}>
            <h2 className={styles.footerHeading}>{t('common.footer.touch')}</h2>
            {place ? (
              <p className={styles.footerLine}>
                <Icon name="pin" className={styles.ic} />
                {place}
              </p>
            ) : null}
            {store.contactPhone ? (
              <p className={styles.footerLine}>
                <Icon name="phone" className={styles.ic} />
                <Link href={t('common.links.tel', { phone: dialable(store.contactPhone) })}>{store.contactPhone}</Link>
              </p>
            ) : null}
            {store.contactEmail ? (
              <p className={styles.footerLine}>
                <Icon name="mail" className={styles.ic} />
                <Link href={t('common.links.mail', { email: store.contactEmail })}>{store.contactEmail}</Link>
              </p>
            ) : null}
          </div>
        </div>
        <div className={styles.paymentsRow}>
          <ul className={styles.payments} aria-label={t('common.footer.payments')}>
            <li className={styles.payment}>
              <Icon name="card" className={styles.ic} />
              {t('common.footer.payCards')}
            </li>
            <li className={styles.payment}>
              <Icon name="wallet" className={styles.ic} />
              {t('common.footer.payUpi')}
            </li>
            <li className={styles.payment}>
              <Icon name="bank" className={styles.ic} />
              {t('common.footer.payBank')}
            </li>
          </ul>
          <ConsentSettingsButton t={t} className={styles.cookies} />
        </div>
      </footer>
      <div className={styles.credits}>
        <div className={styles.creditsInner}>
          <p className={styles.copyright}>{t('common.footer.rights', { store: store.name })}</p>
          <div className={styles.byline}>
            {poweredBy ? <PoweredBy brand={poweredBy} t={t} className={styles.powered} /> : <span className={styles.poweredLabel}>{t('common.footer.poweredBy')}</span>}
            <Link href={t('common.footer.dripfunnelUrl')} className={styles.dripfunnel}>
              <DripFunnelLogo className={styles.dripfunnelLogo} />
              <span className={styles.hidden}>{t('common.footer.dripfunnel')}</span>
            </Link>
          </div>
        </div>
      </div>
      <Floating />
      <ConsentBanner t={t} className={styles.consent} />
    </div>
  )
}
