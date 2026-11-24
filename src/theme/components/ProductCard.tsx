import { Image, Link, Price, useStorefront, type Badge, type ProductCard as Card } from '@dripfunnel/storefront-core/theme'
import { cx } from './cx'
import { Icon } from './Icons'
import { QuickView } from './interactive/Lightbox'
import { WishlistHeart } from './interactive/WishlistHeart'
import styles from '../styles/shop.module.css'

/** A pack size at the end of a product's name ("… 1 Kg", "… 250g"), shown as the card's weight pill. */
const packSize = /\s*[-–(]?\s*(\d+(?:\.\d+)?\s?(?:kg|kgs|g|gm|gms|grams?|ml|l|ltr))\)?\s*$/i

export const splitName = (name: string) => {
  const found = packSize.exec(name)
  if (!found?.[1] || found.index === 0) return { title: name, size: null }
  return { title: name.slice(0, found.index), size: found[1].replace(/\s+/g, ' ') }
}

/** The badge's colour from the engine's tone: gold for offers, navy for notes, forest otherwise. */
export const badgeTone = (badge: Badge) => {
  const tone = (badge.tone ?? '').toLowerCase()
  if (/gold|sale|offer|deal|warning|accent|highlight/.test(tone)) return styles.badgeGold
  if (/navy|info|dark|new|neutral/.test(tone)) return styles.badgeNavy
  return undefined
}

export const ProductCard =({ product }: { product: Card }) => {
  const { store, locale, t } = useStorefront()
  const { title, size } = splitName(product.name)
  const badge = product.badges[0]
  return (
    <article className={styles.card}>
      <div className={styles.cardMedia}>
        <Link href={product.href} className={styles.cardLink}>
          {product.photo ? <Image image={product.photo} alt={product.photo.alt ?? product.name} ratio={0.8} sizes="(min-width: 1024px) 25vw, (min-width: 720px) 33vw, 50vw" className={styles.cardImage} /> : <span className={styles.noPicture}>{t('shop.card.noPicture')}</span>}
        </Link>
        {badge ? <span className={cx(styles.badge, badgeTone(badge))}>{badge.label}</span> : null}
        {product.stock.inStock ? null : <span className={styles.soldOut}>{t('shop.card.soldOut')}</span>}
        <div className={styles.cardTools}>
          {product.photo ? <QuickView photo={product.photo} name={product.name} className={cx(styles.round, styles.zoom)} /> : null}
          <WishlistHeart productId={product.id} name={product.name} versionId={null} className={styles.round} onClass={styles.heartOn} />
        </div>
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardName}>
          <Link href={product.href}>{title}</Link>
        </h3>
        {/* Preview for the client: veg mark, a fixed 5-star rating and a delivery date 7 days out. Real data comes later. */}
        <span className={styles.vegMark} role="img" aria-label={t('shop.card.veg')} title={t('shop.card.veg')}>
          <span />
        </span>
        <span className={styles.stars} aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <svg key={i} viewBox="0 0 20 20" aria-hidden="true">
              <path d="M10 1.5l2.6 5.3 5.9.9-4.25 4.1 1 5.8L10 14.8l-5.25 2.8 1-5.8L1.5 7.7l5.9-.9z" />
            </svg>
          ))}
          <svg className={styles.starsCaret} viewBox="0 0 20 20" aria-hidden="true">
            <path d="M5 7.5l5 5 5-5" />
          </svg>
        </span>
        <div className={styles.cardMeta}>
          {product.price ? (
            <p className={styles.cardPrice}>
              {product.from ? <span className={styles.from}>{t('shop.card.from')}</span> : null}
              <Price money={product.price} compareAt={product.compareAt} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={styles.price} />
            </p>
          ) : null}
          {size ? <span className={styles.pill}>{size}</span> : null}
        </div>
        <p className={styles.delivery}>
          {t('shop.card.deliveryLead')} <strong>{t('shop.card.deliveryDate')}</strong>
        </p>
        <Link href={product.href} className={cx(styles.cardButton, !product.stock.inStock && styles.cardButtonOff)}>
          {product.stock.inStock ? <Icon name="cart" /> : null}
          {product.stock.inStock ? t('shop.card.shop') : t('shop.card.soldOut')}
        </Link>
      </div>
    </article>
  )
}

export const ProductGrid = ({ products, wide = false }: { products: readonly Card[]; wide?: boolean }) => (
  <ul className={wide ? styles.gridWide : styles.grid}>
    {products.map((p) => (
      <li key={p.id} className={styles.cell}>
        <ProductCard product={p} />
      </li>
    ))}
  </ul>
)

/** The grid's shape while its products load, so nothing moves when they arrive. */
export const GridPlaceholder = ({ label, count }: { label: string; count: number }) => (
  <ul className={styles.grid} aria-busy="true" aria-label={label}>
    {[...Array(count).keys()].map((i) => (
      <li key={i} className={styles.cell}>
        <div className={styles.skeletonCard}>
          <div className={styles.skeletonPicture} />
          <div className={styles.skeletonLine} />
          <div className={cx(styles.skeletonLine, styles.skeletonShort)} />
          <div className={styles.skeletonButton} />
        </div>
      </li>
    ))}
  </ul>
)
