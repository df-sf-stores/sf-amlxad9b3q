'use client'

import { useState } from 'react'
import { Link, useListing, useProducts, useStorefront, type CollectionCard } from '@dripfunnel/storefront-core/theme'
import { cx } from '../cx'
import { Icon } from '../Icons'
import { GridPlaceholder, ProductGrid } from '../ProductCard'
import { slugOf } from '../slugOf'
import home from '../../styles/home.module.css'
import ui from '../../styles/ui.module.css'

/** "Our Products": pill tabs for All and each collection over a grid of up to eight cards. */
export const ProductTabs = ({ collections, eyebrow, title, em }: { collections: CollectionCard[]; eyebrow: string; title: string; em: string }) => {
  const { t } = useStorefront()
  const [chosen, setChosen] = useState<string | null>(null)
  const all = useProducts({ sort: 'newest', first: 8 })
  const listing = useListing({ collection: chosen }, chosen !== null)
  const status = chosen === null ? all.status : listing.status
  const items = (chosen === null ? all.products : listing.items).slice(0, 8)
  const retry = chosen === null ? all.retry : listing.retry
  const current = collections.find((c) => slugOf(c) === chosen)
  return (
    <>
      <div className={cx(ui.head, ui.headRow)}>
        <div>
          <p className={ui.eyebrow}>{eyebrow}</p>
          <h2 className={ui.title}>
            {title} <em>{em}</em>
          </h2>
        </div>
        {collections.length ? (
          <div className={home.filters} role="tablist" aria-label={t('home.products.filter')}>
            <button type="button" role="tab" aria-selected={chosen === null} className={cx(home.filter, chosen === null && home.filterOn)} onClick={() => setChosen(null)}>
              {t('home.products.all')}
            </button>
            {collections.map((c) => (
              <button key={c.id} type="button" role="tab" aria-selected={chosen === slugOf(c)} className={cx(home.filter, chosen === slugOf(c) && home.filterOn)} onClick={() => setChosen(slugOf(c))}>
                {c.name}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div role="tabpanel" aria-busy={status === 'loading' || status === 'idle'}>
        {status === 'error' ? (
          <div className={home.state}>
            <p>{t('home.products.failed')}</p>
            <button type="button" className={cx(ui.btn, ui.ghost)} onClick={retry}>
              {t('shop.listing.retry')}
            </button>
          </div>
        ) : status === 'ready' && !items.length ? (
          <div className={home.state}>
            <p>{t('home.products.empty')}</p>
          </div>
        ) : status === 'ready' ? (
          <ProductGrid products={items} />
        ) : (
          <GridPlaceholder label={t('shop.listing.loading')} count={8} />
        )}
      </div>
      <div className={home.more}>
        <Link href={current?.href ?? '/collections/all/'} className={cx(ui.btn, ui.ghost)}>
          {current ? t('home.products.viewCollection', { name: current.name }) : t('home.products.viewAll')}
          <Icon name="arrow" className={ui.btnIcon} />
        </Link>
      </div>
    </>
  )
}
