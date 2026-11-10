import { Image, Link, MerchantImage, Price, StoreLogo, useCollections, useListing, useProductCards, useProducts, useStorefront, type CollectionCard, type ProductCard as Card } from '@dripfunnel/storefront-core/theme'
import { cx } from '../components/cx'
import { Icon, WhatsAppIcon, type IconName } from '../components/Icons'
import { BannerSlider } from '../components/interactive/BannerSlider'
import { QuickView } from '../components/interactive/Lightbox'
import { ProductTabs } from '../components/interactive/ProductTabs'
import { Reveal } from '../components/interactive/Reveal'
import { addressLine, dialable, Layout } from '../components/Layout'
import { splitName } from '../components/ProductCard'
import { slugOf } from '../components/slugOf'
import styles from '../styles/home.module.css'
import ui from '../styles/ui.module.css'

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')

/** The product whose address ends in this slug, from a set of cards. */
const bySlug = (cards: Card[], slug: string) => cards.find((c) => c.href.replace(/\/+$/, '').endsWith(`/${slug}`))

const Check = () => <Icon name="check" className={styles.checkIcon} />

/** A collection as a large picture card: its own picture, else its first product's, with its product count. */
const CategoryCard = ({ collection, navy }: { collection: CollectionCard; navy: boolean }) => {
  const { t } = useStorefront()
  const { items } = useListing({ collection: slugOf(collection) })
  const picture = collection.image ?? items.find((p) => p.photo)?.photo ?? null
  const names = items
    .slice(0, 4)
    .map((p) => splitName(p.name).title)
    .join(' · ')
  return (
    <Reveal>
      <Link href={collection.href} className={cx(styles.cat, navy && styles.catNavy)}>
        <span className={styles.catMedia}>
          {picture ? <Image image={picture} alt={picture.alt ?? collection.name} ratio={1} sizes="(min-width: 960px) 33vw, (min-width: 640px) 50vw, 100vw" className={styles.catImage} /> : <span className={cx(styles.catImage, ui.shimmer)} />}
        </span>
        <span className={styles.catBody}>
          <span className={styles.catTitle}>{collection.name}</span>
          {collection.description || names ? <span className={styles.catText}>{collection.description || names}</span> : null}
          <span className={styles.catLink}>
            {t('home.categories.explore', { name: collection.name })}
            <span className={styles.catArrow}>
              <Icon name="arrow" />
            </span>
          </span>
        </span>
      </Link>
    </Reveal>
  )
}

/** One banner of the slider: a product's photo on navy beside its name, price and a way to it. */
const ProductSlide = ({ product }: { product: Card }) => {
  const { store, locale, t } = useStorefront()
  const { title, size } = splitName(product.name)
  return (
    <div className={styles.slideInner}>
      <div className={styles.slideCopy}>
        <p className={styles.slideEyebrow}>{t('home.slider.eyebrow')}</p>
        <p className={styles.slideTitle}>{title}</p>
        <p className={styles.slideMeta}>
          {size ? <span className={styles.slidePill}>{size}</span> : null}
          {product.price ? <Price money={product.price} compareAt={product.compareAt} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={styles.slidePrice} /> : null}
        </p>
        <Link href={product.href} className={cx(ui.btn, styles.slideButton)}>
          {t('home.slider.shop')}
          <Icon name="arrow" className={ui.btnIcon} />
        </Link>
      </div>
      <div className={styles.slidePhoto}>{product.photo ? <Image image={product.photo} alt={product.photo.alt ?? product.name} ratio={1} sizes="(min-width: 720px) 40vw, 50vw" className={styles.slideImage} /> : null}</div>
    </div>
  )
}

export const HomePage = () => {
  const { store, locale, t } = useStorefront()
  const { collections, status: collectionsStatus } = useCollections({ first: 20 })
  const featured = useProducts({ sort: 'newest', first: 5 })
  const spotlightSlug = t('home.spotlight.product')
  const storySlug = t('home.story.product')
  const reelSlugs = [t('home.reels.one.product'), t('home.reels.two.product'), t('home.reels.three.product')]
  const picked = useProductCards([spotlightSlug, storySlug, ...reelSlugs])
  const spotlight = bySlug(picked.cards, spotlightSlug)
  const story = bySlug(picked.cards, storySlug)
  const whatsapp = store.social.find((s) => s.network === 'whatsapp')
  const place = addressLine(store.address)
  const spot = spotlight ? splitName(spotlight.name) : null

  const trust: { icon: IconName; title: string; body: string }[] = [
    { icon: 'leaf', title: t('home.trust.one.title'), body: t('home.trust.one.body') },
    { icon: 'flask', title: t('home.trust.two.title'), body: t('home.trust.two.body') },
    { icon: 'shield', title: t('home.trust.three.title'), body: t('home.trust.three.body') },
    { icon: 'award', title: t('home.trust.four.title'), body: t('home.trust.four.body') },
    { icon: 'hand', title: t('home.trust.five.title'), body: t('home.trust.five.body') },
  ]
  const reels = [
    { slug: reelSlugs[0] ?? '', title: t('home.reels.one.title'), body: t('home.reels.one.body') },
    { slug: reelSlugs[1] ?? '', title: t('home.reels.two.title'), body: t('home.reels.two.body') },
    { slug: reelSlugs[2] ?? '', title: t('home.reels.three.title'), body: t('home.reels.three.body') },
  ]
  const steps = [
    { title: t('home.steps.one.title'), body: t('home.steps.one.body') },
    { title: t('home.steps.two.title'), body: t('home.steps.two.body') },
    { title: t('home.steps.three.title'), body: t('home.steps.three.body') },
  ]
  const reviews = [
    { name: t('home.reviews.one.name'), place: t('home.reviews.one.place'), product: t('home.reviews.one.product'), text: t('home.reviews.one.text') },
    { name: t('home.reviews.two.name'), place: t('home.reviews.two.place'), product: t('home.reviews.two.product'), text: t('home.reviews.two.text') },
    { name: t('home.reviews.three.name'), place: t('home.reviews.three.place'), product: t('home.reviews.three.product'), text: t('home.reviews.three.text') },
    { name: t('home.reviews.four.name'), place: t('home.reviews.four.place'), product: t('home.reviews.four.product'), text: t('home.reviews.four.text') },
    { name: t('home.reviews.five.name'), place: t('home.reviews.five.place'), product: t('home.reviews.five.product'), text: t('home.reviews.five.text') },
    { name: t('home.reviews.six.name'), place: t('home.reviews.six.place'), product: t('home.reviews.six.product'), text: t('home.reviews.six.text') },
    { name: t('home.reviews.seven.name'), place: t('home.reviews.seven.place'), product: t('home.reviews.seven.product'), text: t('home.reviews.seven.text') },
    { name: t('home.reviews.eight.name'), place: t('home.reviews.eight.place'), product: t('home.reviews.eight.product'), text: t('home.reviews.eight.text') },
  ]
  const faqs = [
    { q: t('home.faq.one.q'), a: t('home.faq.one.a') },
    { q: t('home.faq.two.q'), a: t('home.faq.two.a') },
    { q: t('home.faq.three.q'), a: t('home.faq.three.a') },
    { q: t('home.faq.four.q'), a: t('home.faq.four.a') },
    { q: t('home.faq.five.q'), a: t('home.faq.five.a') },
    { q: t('home.faq.six.q'), a: t('home.faq.six.a') },
  ]
  const benefits = [t('home.spotlight.benefits.one'), t('home.spotlight.benefits.two'), t('home.spotlight.benefits.three'), t('home.spotlight.benefits.four')]
  const nutrition = [
    { name: t('home.spotlight.nutrition.energy'), value: t('home.spotlight.nutrition.energyValue') },
    { name: t('home.spotlight.nutrition.protein'), value: t('home.spotlight.nutrition.proteinValue') },
    { name: t('home.spotlight.nutrition.carbs'), value: t('home.spotlight.nutrition.carbsValue') },
    { name: t('home.spotlight.nutrition.fat'), value: t('home.spotlight.nutrition.fatValue') },
    { name: t('home.spotlight.nutrition.fiber'), value: t('home.spotlight.nutrition.fiberValue') },
  ]
  const stats = [
    { value: t('home.story.stats.one.value'), label: t('home.story.stats.one.label') },
    { value: t('home.story.stats.two.value'), label: t('home.story.stats.two.label') },
    { value: t('home.story.stats.three.value'), label: t('home.story.stats.three.label') },
  ]

  return (
    <Layout>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={cx(ui.container, styles.heroGrid)}>
          <div className={styles.heroCopy}>
            <Reveal>
              <p className={ui.eyebrow}>
                <Icon name="leaf" className={ui.eyebrowIcon} />
                {t('home.hero.eyebrow')}
              </p>
            </Reveal>
            <Reveal>
              <h1 className={styles.heroTitle}>
                {t('home.hero.titleStart')} <em>{t('home.hero.titleEm')}</em> {t('home.hero.titleEnd')}
              </h1>
            </Reveal>
            <Reveal>
              <p className={styles.heroLead}>{t('home.hero.lead')}</p>
            </Reveal>
            <Reveal>
              <p className={cx(ui.hindi, styles.heroHindi)} lang="hi">
                {t('home.hero.hindi')}
              </p>
            </Reveal>
            <Reveal className={styles.heroCtas}>
              <Link href="/collections/all/" className={cx(ui.btn, ui.primary, ui.lg)}>
                {t('home.hero.shop')}
                <Icon name="arrow" className={ui.btnIcon} />
              </Link>
              <Link href="/cart/" className={cx(ui.btn, ui.ghost, ui.lg)}>
                <Icon name="bag" className={ui.btnIcon} />
                {t('home.hero.cart')}
              </Link>
            </Reveal>
            <Reveal>
              <ul className={styles.heroPoints}>
                <li>
                  <Check />
                  {t('home.hero.points.one')}
                </li>
                <li>
                  <Check />
                  {t('home.hero.points.two')}
                </li>
                <li>
                  <Check />
                  {t('home.hero.points.three')}
                </li>
              </ul>
            </Reveal>
          </div>
          <Reveal className={styles.heroVisual}>
            <div className={styles.heroBlob} aria-hidden="true" />
            <div className={styles.heroFrame}>
              {spotlight?.photo ? <Image image={spotlight.photo} alt={spotlight.photo.alt ?? spotlight.name} ratio={2 / 3} sizes="(min-width: 900px) 380px, 78vw" className={styles.heroImage} /> : <span className={cx(styles.heroImage, ui.shimmer)} />}
              {/* The merchant's hero picture from Storefront › Assets covers the product photo once its id is known. */}
              <MerchantImage asset={t('home.hero.image')} alt={t('home.hero.imageAlt')} ratio={2 / 3} sizes="(min-width: 900px) 380px, 78vw" className={styles.heroAsset} />
            </div>
            <div className={cx(styles.floatCard, styles.floatA)}>
              <span className={styles.floatIcon}>
                <Icon name="leaf" />
              </span>
              <span>
                <strong>{t('home.hero.cardTitle')}</strong>
                <small>{t('home.hero.cardBody')}</small>
              </span>
            </div>
            {spotlight ? (
              <Link href={spotlight.href} className={cx(styles.floatCard, styles.floatB)}>
                {spotlight.photo ? <Image image={spotlight.photo} alt="" ratio={0.8} sizes="44px" className={styles.floatThumb} /> : null}
                <span>
                  <strong>{spot?.title}</strong>
                  <small className={styles.floatMeta}>
                    {spot?.size ? <span>{spot.size}</span> : null}
                    {spotlight.price ? <Price money={spotlight.price} compareAt={null} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={styles.floatPrice} /> : null}
                  </small>
                </span>
              </Link>
            ) : null}
          </Reveal>
        </div>
      </section>

      {/* Trust strip */}
      <section className={styles.trust} aria-label={t('home.trust.label')}>
        <ul className={cx(ui.container, styles.trustGrid)}>
          {trust.map((item) => (
            <li key={item.title} className={styles.trustItem}>
              <span className={styles.trustIcon}>
                <Icon name={item.icon} />
              </span>
              <span>
                <strong>{item.title}</strong>
                <small>{item.body}</small>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Products */}
      <section className={ui.section} id="products">
        <div className={ui.container}>
          <ProductTabs collections={collectionsStatus === 'ready' ? collections : []} eyebrow={t('home.products.eyebrow')} title={t('home.products.title')} em={t('home.products.titleEm')} />
        </div>
      </section>

      {/* Shop by category */}
      {collectionsStatus === 'loading' || collectionsStatus === 'idle' || collections.length ? (
        <section className={ui.section}>
          <div className={ui.container}>
            <Reveal className={ui.head}>
              <p className={ui.eyebrow}>{t('home.categories.eyebrow')}</p>
              <h2 className={ui.title}>
                {t('home.categories.title')} <em>{t('home.categories.titleEm')}</em>
              </h2>
            </Reveal>
            <div className={styles.cats} aria-busy={collectionsStatus !== 'ready'}>
              {collectionsStatus === 'ready' ? collections.map((c, i) => <CategoryCard key={c.id} collection={c} navy={i % 2 === 1} />) : [0, 1, 2].map((i) => <span key={i} className={cx(styles.cat, ui.shimmer)} />)}
            </div>
          </div>
        </section>
      ) : null}

      {/* Banner slider */}
      {featured.status === 'ready' && featured.products.length ? (
        <section className={ui.tight} aria-label={t('home.slider.label')}>
          <div className={ui.container}>
            <Reveal>
              <BannerSlider label={t('home.slider.label')} slides={featured.products.map((p) => ({ key: p.id, label: p.name, node: <ProductSlide product={p} /> }))} />
            </Reveal>
          </div>
        </section>
      ) : featured.status === 'loading' || featured.status === 'idle' ? (
        <section className={ui.tight}>
          <div className={ui.container}>
            <div className={cx(styles.slider, styles.sliderLoading)} aria-busy="true" />
          </div>
        </section>
      ) : null}

      {/* Product spotlight */}
      {spotlight ? (
        <section className={cx(ui.section, styles.spotlight)} id="spotlight">
          <div className={cx(ui.container, styles.spotlightGrid)}>
            <Reveal className={styles.spotlightMedia}>
              {spotlight.photo ? <Image image={spotlight.photo} alt={spotlight.photo.alt ?? spotlight.name} ratio={480 / 368} sizes="(min-width: 900px) 50vw, 100vw" className={styles.spotlightImage} /> : null}
              {spotlight.photo ? (
                <QuickView photo={spotlight.photo} name={spotlight.name} className={styles.spotlight360}>
                  <Icon name="expand" className={ui.btnIcon} />
                  {t('home.spotlight.view')}
                </QuickView>
              ) : null}
            </Reveal>
            <Reveal className={styles.spotlightCopy}>
              <p className={cx(ui.eyebrow, ui.eyebrowGold)}>{t('home.spotlight.eyebrow')}</p>
              <h2 className={ui.title}>
                {spot?.title} — <em>{t('home.spotlight.titleEm')}</em>
              </h2>
              <p className={styles.spotlightBody}>{t('home.spotlight.body')}</p>
              <ul className={styles.benefits}>
                {benefits.map((b) => (
                  <li key={b}>
                    <Icon name="check" className={styles.benefitIcon} />
                    {b}
                  </li>
                ))}
              </ul>
              <div className={styles.nutri}>
                <p className={styles.nutriHead}>
                  {t('home.spotlight.nutrition.title')} <small>{t('home.spotlight.nutrition.per')}</small>
                </p>
                <dl className={styles.nutriGrid}>
                  {nutrition.map((n) => (
                    <div key={n.name}>
                      <dt>{n.name}</dt>
                      <dd>{n.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className={styles.spotlightBuy}>
                <div>
                  {spotlight.price ? <Price money={spotlight.price} compareAt={spotlight.compareAt} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={styles.spotlightPrice} /> : null}
                  {spot?.size ? <small className={styles.spotlightNote}>{t('home.spotlight.pack', { size: spot.size })}</small> : null}
                </div>
                <Link href={spotlight.href} className={cx(ui.btn, ui.primary, ui.lg)}>
                  <Icon name="cart" className={ui.btnIcon} />
                  {spotlight.stock.inStock ? t('home.spotlight.buy') : t('shop.card.soldOut')}
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Reels */}
      {picked.status !== 'error' ? (
        <section className={cx(ui.section, styles.reelsSec)}>
          <div className={cx(ui.container, styles.reelsInner)}>
            <Reveal className={cx(ui.head, ui.headCenter)}>
              <p className={cx(ui.eyebrow, ui.eyebrowLight)}>{t('home.reels.eyebrow')}</p>
              <h2 className={cx(ui.title, styles.onDark)}>{t('home.reels.title')}</h2>
              <p className={cx(ui.lead, styles.onDarkMuted)}>{t('home.reels.lead')}</p>
            </Reveal>
            <div className={styles.reels}>
              {reels.map((reel) => {
                const product = bySlug(picked.cards, reel.slug)
                return (
                  <Reveal key={reel.title} className={styles.reelCell}>
                    <figure className={styles.reel}>
                      {product?.photo ? <Image image={product.photo} alt={product.photo.alt ?? product.name} ratio={2 / 3} sizes="(min-width: 900px) 320px, 70vw" className={styles.reelImage} /> : <span className={cx(styles.reelImage, styles.reelEmpty)} />}
                      <figcaption className={styles.reelCaption}>
                        <strong>{reel.title}</strong>
                        <span>{reel.body}</span>
                        {product ? (
                          <Link href={product.href} className={styles.reelLink}>
                            {t('home.reels.shop')}
                            <Icon name="arrow" className={ui.btnIcon} />
                          </Link>
                        ) : null}
                      </figcaption>
                    </figure>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* Our story */}
      <section className={ui.section} id="about">
        <div className={cx(ui.container, styles.aboutGrid)}>
          <Reveal className={styles.aboutMedia}>
            {story?.photo ? <Image image={story.photo} alt={story.photo.alt ?? story.name} ratio={1} sizes="(min-width: 900px) 40vw, 86vw" className={styles.aboutPhoto} /> : <span className={cx(styles.aboutPhoto, ui.shimmer)} />}
            <span className={styles.aboutLogo}>
              <StoreLogo className={styles.aboutLogoImage} />
            </span>
          </Reveal>
          <Reveal className={styles.aboutCopy}>
            <p className={ui.eyebrow}>{t('home.story.eyebrow')}</p>
            <h2 className={ui.title}>
              {t('home.story.title')} <em>{t('home.story.titleEm')}</em>
            </h2>
            <p className={cx(ui.hindi, styles.aboutHindi)} lang="hi">
              {t('home.story.hindi')}
            </p>
            <p className={styles.aboutText}>{t('home.story.one')}</p>
            <p className={styles.aboutText}>{t('home.story.two')}</p>
            <div className={styles.stats}>
              {stats.map((s) => (
                <div key={s.label}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
            <p className={styles.aboutBy}>
              {t('home.story.by')} <strong>{t('home.story.maker')}</strong>
            </p>
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className={cx(ui.section, ui.soft)}>
        <div className={ui.container}>
          <Reveal className={cx(ui.head, ui.headCenter)}>
            <p className={ui.eyebrow}>{t('home.steps.eyebrow')}</p>
            <h2 className={ui.title}>{t('home.steps.title')}</h2>
          </Reveal>
          <ol className={styles.steps}>
            {steps.map((step) => (
              <li key={step.title}>
                <Reveal className={styles.step}>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Reviews */}
      <section className={ui.section} id="reviews">
        <div className={ui.container}>
          <Reveal className={cx(ui.head, ui.headCenter)}>
            <p className={ui.eyebrow}>{t('home.reviews.eyebrow')}</p>
            <h2 className={ui.title}>{t('home.reviews.title')}</h2>
            <p className={ui.lead}>{t('home.reviews.lead')}</p>
          </Reveal>
          <div className={styles.reviews}>
            {reviews.map((r) => (
              <figure key={r.name} className={styles.review}>
                <Icon name="quote" className={styles.reviewQuote} />
                <blockquote className={styles.reviewText}>{r.text}</blockquote>
                <span className={styles.reviewProduct}>{r.product}</span>
                <figcaption className={styles.reviewBy}>
                  <span className={styles.avatar} aria-hidden="true">
                    {initials(r.name)}
                  </span>
                  <span>
                    <strong>{r.name}</strong>
                    <small>{r.place}</small>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={ui.section} id="faq">
        <div className={cx(ui.container, styles.faqGrid)}>
          <Reveal className={cx(ui.head, styles.faqHead)}>
            <p className={ui.eyebrow}>{t('home.faq.eyebrow')}</p>
            <h2 className={ui.title}>{t('home.faq.title')}</h2>
            <p className={ui.lead}>{t('home.faq.lead')}</p>
            {whatsapp ? (
              <Link href={whatsapp.url} className={cx(ui.btn, ui.ghost, styles.faqButton)}>
                <WhatsAppIcon className={ui.btnIcon} />
                {t('home.faq.ask')}
              </Link>
            ) : (
              <Link href="/contact/" className={cx(ui.btn, ui.ghost, styles.faqButton)}>
                {t('home.faq.contact')}
              </Link>
            )}
          </Reveal>
          <Reveal className={styles.faq}>
            {faqs.map((f, i) => (
              <details key={f.q} className={styles.faqItem} open={i === 0}>
                <summary className={styles.faqSummary}>
                  {f.q}
                  <Icon name="plus" className={styles.faqIcon} />
                </summary>
                <p className={styles.faqAnswer}>{f.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Contact */}
      <section className={cx(ui.section, styles.contact)} id="contact">
        <div className={cx(ui.container, styles.contactGrid)}>
          <Reveal>
            <p className={cx(ui.eyebrow, ui.eyebrowLight)}>{t('home.contact.eyebrow')}</p>
            <h2 className={cx(ui.title, styles.onDark)}>{t('home.contact.title')}</h2>
            <p className={cx(ui.lead, styles.onDarkMuted)}>{t('home.contact.lead')}</p>
            <ul className={styles.contactList}>
              {store.contactPhone ? (
                <li>
                  <span className={styles.contactIcon}>
                    <Icon name="phone" />
                  </span>
                  <span>
                    <small>{t('home.contact.phone')}</small>
                    <Link href={t('common.links.tel', { phone: dialable(store.contactPhone) })}>{store.contactPhone}</Link>
                  </span>
                </li>
              ) : null}
              {store.contactEmail ? (
                <li>
                  <span className={styles.contactIcon}>
                    <Icon name="mail" />
                  </span>
                  <span>
                    <small>{t('home.contact.email')}</small>
                    <Link href={t('common.links.mail', { email: store.contactEmail })}>{store.contactEmail}</Link>
                  </span>
                </li>
              ) : null}
              {place ? (
                <li>
                  <span className={styles.contactIcon}>
                    <Icon name="pin" />
                  </span>
                  <span>
                    <small>{t('home.contact.address')}</small>
                    {place}
                  </span>
                </li>
              ) : null}
              <li>
                <span className={styles.contactIcon}>
                  <Icon name="doc" />
                </span>
                <span>
                  <small>{t('home.contact.fssai')}</small>
                  {t('home.contact.fssaiNumber')}
                </span>
              </li>
            </ul>
          </Reveal>
          <Reveal className={styles.contactCard}>
            <h3>{t('home.contact.cardTitle')}</h3>
            <p className={styles.contactNote}>{t('home.contact.cardNote')}</p>
            <div className={styles.contactActions}>
              <Link href="/collections/all/" className={cx(ui.btn, ui.primary, ui.lg, ui.block)}>
                <Icon name="bag" className={ui.btnIcon} />
                {t('home.contact.shop')}
              </Link>
              {whatsapp ? (
                <Link href={whatsapp.url} className={cx(ui.btn, ui.wa, ui.lg, ui.block)}>
                  <WhatsAppIcon className={ui.btnIcon} />
                  {t('home.contact.whatsapp')}
                </Link>
              ) : null}
              {store.contactEmail ? (
                <Link href={t('common.links.mail', { email: store.contactEmail })} className={cx(ui.btn, ui.ghost, ui.lg, ui.block)}>
                  <Icon name="mail" className={ui.btnIcon} />
                  {t('home.contact.write')}
                </Link>
              ) : null}
              <Link href="/contact/" className={cx(ui.btn, ui.ghost, ui.lg, ui.block)}>
                {t('home.contact.page')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  )
}
