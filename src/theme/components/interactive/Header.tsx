'use client'

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { Link, navigate, SearchField, StoreLogo, useCart, useLocation, useScrollProgress, useStorefront, useWishlist, type MenuItem } from '@dripfunnel/storefront-core/theme'
import { cx } from '../cx'
import { Icon } from '../Icons'
import styles from '../../styles/layout.module.css'

// The theme rules allow no URL encoding, so the characters that would break the query are dropped instead.
const searchFor = (words: string) => navigate(`/search/?q=${words.replace(/[&+%#]/g, ' ').trim()}`)

const same = (a: string, b: string) => a.replace(/\/+$/, '') === b.replace(/\/+$/, '')

/** One top-level link; with children, a dropdown on desktop and an accordion in the drawer. */
const NavEntry = ({ item, path }: { item: MenuItem; path: string }) => {
  const { t } = useStorefront()
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const leaving = useRef<ReturnType<typeof setTimeout>>(undefined)
  const active = item.href === '/' ? same(path, '/') : same(path, item.href) || item.children.some((c) => same(path, c.href))
  const show = (value: boolean) => {
    clearTimeout(leaving.current)
    setOpen(value)
  }
  const groupId = `nav-${item.id}`
  return (
    <li
      className={styles.navItem}
      onKeyDown={(e) => {
        if (e.key !== 'Escape' || !open) return
        e.stopPropagation()
        show(false)
        toggle.current?.focus()
      }}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse' && item.children.length) show(true)
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') leaving.current = setTimeout(() => setOpen(false), 120)
      }}
    >
      <Link href={item.href} className={cx(styles.navLink, active && styles.active)}>
        {item.label}
      </Link>
      {item.children.length ? (
        <>
          <button ref={toggle} type="button" className={cx(styles.subToggle, open && styles.subToggleOpen)} aria-expanded={open} aria-controls={groupId} aria-label={t('common.nav.submenu', { item: item.label })} onClick={() => show(!open)}>
            <Icon name="down" className={styles.ic} />
          </button>
          <ul id={groupId} className={cx(styles.subnav, open && styles.subnavOpen)}>
            {item.children.map((child) => (
              <li key={child.id}>
                <Link href={child.href} className={styles.subLink}>
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </li>
  )
}

/**
 * The sticky header: brand, the store's menu (a right-hand drawer up to 1024px), search, account and cart.
 * `extra` is what the drawer adds below the menu on small screens.
 */
export const Header = ({ items, extra }: { items: MenuItem[]; extra: ReactNode }) => {
  const { t } = useStorefront()
  const { count } = useCart()
  const wishlist = useWishlist()
  const { path } = useLocation()
  const progress = useScrollProgress()
  const [open, setOpen] = useState(false)
  const [searching, setSearching] = useState(false)
  const burger = useRef<HTMLButtonElement>(null)

  // A new page closes the drawer and the search bar.
  useEffect(() => {
    setOpen(false)
    setSearching(false)
  }, [path])

  const close = () => setOpen(false)
  const onKey = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'Escape') return
    if (open) {
      setOpen(false)
      burger.current?.focus()
    }
    if (searching) setSearching(false)
  }

  return (
    <header className={cx(styles.header, progress > 0 && styles.scrolled)} onKeyDown={onKey}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.brand}>
          <StoreLogo className={styles.logo} />
        </Link>

        <nav id="site-nav" className={cx(styles.nav, open && styles.navOpen)} aria-label={t('common.nav.label')}>
          <ul className={styles.navList}>
            {items.map((item) => (
              <NavEntry key={item.id} item={item} path={path} />
            ))}
          </ul>
          <div className={styles.drawerOnly}>{extra}</div>
        </nav>

        <div className={styles.actions}>
          <button type="button" className={cx(styles.action, styles.searchAction)} aria-expanded={searching} aria-controls="site-search" aria-label={t('common.tools.search')} onClick={() => setSearching(!searching)}>
            <Icon name={searching ? 'close' : 'search'} className={styles.ic} />
          </button>
          <Link href="/account/wishlist/" className={cx(styles.action, styles.wishlistAction)}>
            <Icon name="heart" className={styles.ic} />
            <span className={styles.hidden}>{wishlist.count > 0 ? t('common.tools.wishlistCount', { count: wishlist.count }) : t('common.tools.wishlist')}</span>
            {wishlist.count > 0 ? (
              <span className={styles.count} aria-hidden="true">
                {wishlist.count}
              </span>
            ) : null}
          </Link>
          <Link href="/account/" className={cx(styles.action, styles.accountAction)}>
            <Icon name="user" className={styles.ic} />
            <span className={styles.hidden}>{t('common.tools.account')}</span>
          </Link>
          <Link href="/cart/" className={styles.action}>
            <Icon name="bag" className={styles.ic} />
            <span className={styles.hidden}>{count > 0 ? t('common.tools.cartCount', { count }) : t('common.tools.cart')}</span>
            {count > 0 ? (
              <span className={styles.count} aria-hidden="true">
                {count}
              </span>
            ) : null}
          </Link>
          <button ref={burger} type="button" className={cx(styles.burger, open && styles.burgerOpen)} aria-expanded={open} aria-controls="site-nav" aria-label={open ? t('common.nav.close') : t('common.nav.menu')} onClick={() => setOpen(!open)}>
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
          </button>
        </div>
      </div>
      <div className={cx(styles.overlay, open && styles.overlayOpen)} onClick={close} aria-hidden="true" />
      {searching ? (
        <div id="site-search" className={styles.searchBar}>
          <div className={styles.searchBarInner}>
            <SearchField label={t('common.tools.search')} placeholder={t('common.tools.searchPrompt')} button={t('common.tools.search')} value="" onSearch={searchFor} suggest={4} className={styles.search} />
          </div>
        </div>
      ) : null}
    </header>
  )
}

/** The drawer's own search box, for phones where the header has no room for one. */
export const DrawerSearch = () => {
  const { t } = useStorefront()
  return <SearchField label={t('common.tools.search')} placeholder={t('common.tools.searchPrompt')} button={t('common.tools.search')} value="" onSearch={searchFor} suggest={4} className={styles.search} />
}
