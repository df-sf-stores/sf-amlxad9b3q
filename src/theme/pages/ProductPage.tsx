import { Breadcrumbs, LegalNotices, Link, Price, RichText, useProduct, useStorefront } from '@dripfunnel/storefront-core/theme'
import { Icon } from '../components/Icons'
import { BuyButtons } from '../components/interactive/BuyButtons'
import { Gallery } from '../components/interactive/Gallery'
import { Options } from '../components/interactive/Options'
import { Retry } from '../components/interactive/Retry'
import { WishlistHeart } from '../components/interactive/WishlistHeart'
import { Layout } from '../components/Layout'
import { Notice } from '../components/Notice'
import { ProductGrid, splitName } from '../components/ProductCard'
import shop from '../styles/shop.module.css'
import styles from '../styles/product.module.css'

export const ProductPage = () => {
  const { store, locale, t } = useStorefront()
  const page = useProduct()
  const product = page.product
  if (page.status === 'missing' || page.status === 'error' || !product) {
    return (
      <Layout>
        <section className={shop.page}>
          {page.status === 'missing' ? (
            <Notice main title={t('shop.product.missing')} lead={t('shop.product.missingLead')}>
              <Link href="/collections/all/" className={shop.primary}>
                {t('shop.collection.browse')}
              </Link>
            </Notice>
          ) : page.status === 'error' ? (
            <Notice main title={t('shop.product.failed')} lead={t('shop.listing.failedLead')}>
              <Retry label={t('shop.listing.retry')} onRetry={page.retry} />
            </Notice>
          ) : (
            <div className={styles.product} aria-busy="true">
              <div className={styles.noPicture} />
              <div className={styles.info}>
                <h1 className={styles.loadingTitle}>{t('shop.product.loading')}</h1>
              </div>
            </div>
          )}
        </section>
      </Layout>
    )
  }
  const firstMissing = page.missing[0]
  const specs = product.specs.filter((s) => s.versionId === null || s.versionId === page.version?.id)
  const { size } = splitName(product.name)
  return (
    <Layout>
      <section className={shop.page}>
        <Breadcrumbs crumbs={[{ label: t('shop.crumbs.home'), href: '/' }, { label: product.name, href: product.href }]} t={t} className={shop.crumbs} />
        <div className={styles.product}>
          <Gallery photos={page.photos} video={product.video} name={product.name} />
          <div className={styles.info}>
            {product.badges[0] ? <span className={styles.badge}>{product.badges[0].label}</span> : <p className={styles.eyebrow}>{t('shop.product.eyebrow')}</p>}
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{product.name}</h1>
              <WishlistHeart productId={product.id} name={product.name} versionId={page.version?.id ?? null} />
            </div>
            {page.price ? (
              <p className={styles.price}>
                {page.from ? <span className={styles.from}>{t('shop.card.from')}</span> : null}
                <Price money={page.price} compareAt={page.compareAt} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={styles.priceTag} />
              </p>
            ) : null}
            {size && !page.options.length ? (
              <div className={styles.pills}>
                <span className={styles.pill}>{t('shop.product.pack', { size })}</span>
              </div>
            ) : null}
            <Options page={page} />
            <p className={styles.stock} role="status">
              {firstMissing ? t('shop.product.choose', { option: firstMissing.name }) : page.stock?.inStock ? t('shop.product.inStock') : t('shop.product.outOfStock')}
            </p>
            <BuyButtons page={page} />
            {product.highlights.length ? (
              <ul className={styles.highlights}>
                {product.highlights.map((h) => (
                  <li key={h}>
                    <Icon name="check" className={styles.check} />
                    {h}
                  </li>
                ))}
              </ul>
            ) : null}
            <ul className={styles.trust}>
              <li>
                <span className={styles.trustIcon}>
                  <Icon name="leaf" />
                </span>
                {t('shop.product.trust.natural')}
              </li>
              <li>
                <span className={styles.trustIcon}>
                  <Icon name="shield" />
                </span>
                {t('shop.product.trust.secure')}
              </li>
              <li>
                <span className={styles.trustIcon}>
                  <Icon name="truck" />
                </span>
                {t('shop.product.trust.fresh')}
              </li>
            </ul>
            <LegalNotices notices={product.legal} t={t} className={styles.legal} />
            <div className={styles.sections}>
              {product.description ? (
                <section className={styles.section} aria-labelledby="product-description">
                  <h2 id="product-description" className={styles.sectionTitle}>
                    {t('shop.product.description')}
                  </h2>
                  <RichText html={product.description} className={styles.description} />
                </section>
              ) : null}
              {specs.length ? (
                <details className={styles.section} open>
                  <summary className={styles.summary}>
                    {t('shop.product.specs')}
                    <Icon name="plus" className={styles.summaryIcon} />
                  </summary>
                  <dl className={styles.specs}>
                    {specs.map((s) => (
                      <div key={`${s.name}-${s.versionId ?? ''}`} className={styles.spec}>
                        <dt>{s.name}</dt>
                        <dd>{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </details>
              ) : null}
              {product.returns || product.warranty ? (
                <details className={styles.section}>
                  <summary className={styles.summary}>
                    {t('shop.product.delivery')}
                    <Icon name="plus" className={styles.summaryIcon} />
                  </summary>
                  {product.returns ? <p className={styles.body}>{product.returns}</p> : null}
                  {product.warranty ? (
                    <p className={styles.body}>
                      <strong>{t('shop.product.warranty')}</strong> {product.warranty}
                    </p>
                  ) : null}
                </details>
              ) : null}
              {product.faqs.length ? (
                <details className={styles.section}>
                  <summary className={styles.summary}>
                    {t('shop.product.questions')}
                    <Icon name="plus" className={styles.summaryIcon} />
                  </summary>
                  <dl className={styles.faqs}>
                    {product.faqs.map((f) => (
                      <div key={f.question} className={styles.faq}>
                        <dt>{f.question}</dt>
                        <dd>{f.answer}</dd>
                      </div>
                    ))}
                  </dl>
                </details>
              ) : null}
            </div>
          </div>
        </div>
        {product.related.length ? (
          <section className={styles.related}>
            <h2 className={shop.heading}>{t('shop.product.related')}</h2>
            <ProductGrid products={product.related.slice(0, 4)} wide />
          </section>
        ) : null}
      </section>
    </Layout>
  )
}
