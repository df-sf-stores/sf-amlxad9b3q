import { Link, useCollections, useStorefront, type Listing } from '@dripfunnel/storefront-core/theme'
import { filterable, FilterPanel, ListingBar, LoadMore, priced } from './interactive/Filters'
import { Retry } from './interactive/Retry'
import { Notice } from './Notice'
import { GridPlaceholder, ProductGrid } from './ProductCard'
import styles from '../styles/shop.module.css'

/**
 * A collection's or a search's products: filters, sort, the grid and its states, and "Load more".
 * `here` is the collection page's address, which adds the category links to the filters; a search passes none.
 */
export const ListingResults = ({ listing, here = null }: { listing: Listing; here?: string | null }) => {
  const { t } = useStorefront()
  const { collections, status } = useCollections({ first: 20 })
  const categories = here !== null && status === 'ready' ? collections : []
  return (
    <div className={filterable(listing, categories) ? styles.listingFiltered : styles.listing}>
      <FilterPanel listing={listing} categories={categories} here={here} />
      <div className={styles.results}>
        <h2 className={styles.hiddenHeading}>{t('shop.listing.heading')}</h2>
        {listing.status === 'ready' ? (
          <ListingBar listing={listing} />
        ) : null}
        {listing.status === 'loading' ? <GridPlaceholder label={t('shop.listing.loading')} count={6} /> : null}
        {listing.status === 'error' ? (
          <Notice title={t('shop.listing.failed')} lead={t('shop.listing.failedLead')}>
            <Retry label={t('shop.listing.retry')} onRetry={listing.retry} />
          </Notice>
        ) : null}
        {listing.status === 'ready' && listing.items.length === 0 ? (
          listing.selected.length || priced(listing) ? (
            <Notice title={t('shop.listing.empty')} lead={t('shop.listing.emptyLead')}>
              <Retry label={t('shop.listing.clear')} onRetry={listing.clear} />
            </Notice>
          ) : (
            <Notice title={t('shop.collection.empty')} lead={t('shop.collection.emptyLead')}>
              <Link href="/" className={styles.secondary}>
                {t('shop.collection.home')}
              </Link>
            </Notice>
          )
        ) : null}
        {listing.status === 'ready' ? <ProductGrid products={listing.items} /> : null}
        <LoadMore listing={listing} />
      </div>
    </div>
  )
}
