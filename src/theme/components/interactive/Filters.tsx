'use client'

import { useState } from 'react'
import { Checkbox, Link, PriceRange, Select, useStorefront, type CollectionCard, type Listing, type SortKey } from '@dripfunnel/storefront-core/theme'
import { cx } from '../cx'
import styles from '../../styles/shop.module.css'

/** Whether a price range is chosen. */
export const priced = (listing: Listing) => listing.priceRange.min !== null || listing.priceRange.max !== null

/** Whether the panel has anything to show: the store's filter groups, categories, or a price range. */
export const filterable = (listing: Listing, categories: CollectionCard[]) => listing.facets.length > 0 || categories.length > 0 || listing.priceBounds !== null

/**
 * The filters: categories (on collection pages), the price range and the store's filter values.
 * A sidebar on wide screens and a panel the Filters button opens on narrow ones.
 */
export const FilterPanel = ({ listing, categories, here }: { listing: Listing; categories: CollectionCard[]; here: string | null }) => {
  const { t } = useStorefront()
  const [open, setOpen] = useState(false)
  if (!filterable(listing, categories)) return null
  return (
    <aside className={styles.filters}>
      <button type="button" className={styles.filterToggle} aria-expanded={open} aria-controls="listing-filters" onClick={() => setOpen(!open)}>
        {open ? t('shop.listing.filtersShown') : t('shop.listing.filters')}
        {listing.selected.length ? <span className={styles.count}>{listing.selected.length}</span> : null}
      </button>
      <div id="listing-filters" className={open ? styles.filterBodyOpen : styles.filterBody}>
        {categories.length ? (
          <nav aria-label={t('shop.listing.category')} className={styles.facet}>
            <p className={styles.facetName}>{t('shop.listing.category')}</p>
            <ul className={styles.categoryList}>
              {[{ id: 'all', name: t('shop.collection.all'), href: '/collections/all/' }, ...categories].map((c) => (
                <li key={c.id}>
                  <Link href={c.href} className={cx(styles.category, c.href === here && styles.categoryOn)} aria-current={c.href === here ? 'page' : undefined}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
        {listing.priceBounds ? (
          <div className={styles.facet}>
            <p className={styles.facetName}>{t('shop.listing.price')}</p>
            <PriceRange
              bounds={listing.priceBounds}
              value={listing.priceRange}
              onChange={listing.setPriceRange}
              label={t('shop.listing.price')}
              className={styles.price}
              parts={{ track: styles.priceTrack, rail: styles.priceRail, fill: styles.priceFill, thumb: styles.priceThumb, ends: styles.priceEnds, select: styles.priceSelect, to: styles.muted }}
            />
          </div>
        ) : null}
        {listing.facets.map((facet) => (
          <div key={facet.id} role="group" aria-label={facet.name} className={styles.facet}>
            <p className={styles.facetName}>{facet.name}</p>
            {facet.values.map((value) => (
              <Checkbox key={value.id} checked={value.selected} onChange={() => listing.toggle(value.id)} className={styles.check}>
                {value.name} <span className={styles.muted}>({value.count})</span>
              </Checkbox>
            ))}
          </div>
        ))}
      </div>
    </aside>
  )
}

/** How many products show, the sort, and the chosen filters as chips that each remove one. */
export const ListingBar = ({ listing }: { listing: Listing }) => {
  const { t } = useStorefront()
  const labels: Record<SortKey, string> = {
    featured: t('shop.listing.sorts.featured'),
    newest: t('shop.listing.sorts.newest'),
    'price-low': t('shop.listing.sorts.priceLow'),
    'price-high': t('shop.listing.sorts.priceHigh'),
    name: t('shop.listing.sorts.name'),
  }
  return (
    <div className={styles.toolbar}>
      <p className={styles.muted} role="status">
        {t('shop.listing.showing', { count: listing.items.length })}
      </p>
      <Select label={t('shop.listing.sort')} value={listing.sort} options={listing.sorts.map((s) => ({ value: s, label: labels[s] }))} onChange={listing.setSort} className={styles.sort} />
      <div className={styles.chips}>
        {listing.selected.map((s) => (
          <button key={s.id} type="button" className={styles.chip} aria-label={t('shop.listing.remove', { name: s.name })} onClick={() => listing.toggle(s.id)}>
            {s.name}
            <svg className={styles.chipIcon} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        ))}
        {listing.selected.length > 1 || priced(listing) ? (
          <button type="button" className={styles.clear} onClick={listing.clear}>
            {t('shop.listing.clear')}
          </button>
        ) : null}
      </div>
    </div>
  )
}

/** "Load more" through fetchMore, and the retry when the next page didn't load. */
export const LoadMore = ({ listing }: { listing: Listing }) => {
  const { t } = useStorefront()
  if (!listing.hasMore) return null
  return (
    <div className={styles.more}>
      {listing.moreFailed ? (
        <p className={styles.muted} role="alert">
          {t('shop.listing.moreFailed')}
        </p>
      ) : null}
      <button type="button" className={styles.secondary} disabled={listing.loadingMore} onClick={listing.fetchMore}>
        {t('shop.listing.more')}
      </button>
    </div>
  )
}
