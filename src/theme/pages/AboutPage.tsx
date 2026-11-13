import type { ReactNode } from 'react'
import { Link, StoreLogo, useStorefront } from '@dripfunnel/storefront-core/theme'
import { Layout } from '../components/Layout'
import { Ornament } from '../components/Ornament'
import styles from '../styles/about.module.css'

const Principle = ({ title, body, children }: { title: string; body: string; children: ReactNode }) => (
  <li className={styles.principle}>
    <span className={styles.principleIcon} aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        {children}
      </svg>
    </span>
    <div className={styles.principleCopy}>
      <h3 className={styles.principleTitle}>{title}</h3>
      <p className={styles.principleBody}>{body}</p>
    </div>
  </li>
)

export const AboutPage = () => {
  const { store, t } = useStorefront()
  const address = store.address ? [store.address.street, store.address.city, store.address.region, store.address.postal].filter(Boolean).join(', ') : ''
  const whatsapp = store.social.find((s) => s.network === 'whatsapp')
  const details = address || store.contactPhone || store.contactEmail || whatsapp
  return (
    <Layout>
      <section className={styles.hero}>
        <p className={styles.heroEyebrow}>{t('pages.about.eyebrow')}</p>
        <h1 className={styles.heroTitle}>{t('pages.about.title', { store: store.name })}</h1>
        <Ornament className={styles.heroOrnament} />
        <p className={styles.heroLead}>{t('pages.about.lead')}</p>
      </section>

      <section className={styles.story}>
        <div className={styles.logoCard}>
          <StoreLogo className={styles.logo} />
        </div>
        <div className={styles.storyCopy}>
          <p className={styles.eyebrow}>{t('pages.about.founder.eyebrow')}</p>
          <h2 className={styles.heading}>{t('pages.about.founder.name')}</h2>
          <p className={styles.role}>{t('pages.about.founder.role')}</p>
          <h3 className={styles.subheading}>{t('pages.about.founder.commitmentTitle')}</h3>
          <p className={styles.lead}>{t('pages.about.founder.commitment')}</p>
          <div className={styles.promiseNote}>
            <p className={styles.promiseNoteTitle}>{t('pages.about.founder.promiseTitle')}</p>
            <p className={styles.promiseNoteBody}>{t('pages.about.founder.promise')}</p>
          </div>
        </div>
      </section>

      <section className={styles.purpose}>
        <div className={styles.purposeCard}>
          <h2 className={styles.purposeTitle}>{t('pages.about.purpose.vision.title')}</h2>
          <p className={styles.body}>{t('pages.about.purpose.vision.body')}</p>
        </div>
        <div className={styles.purposeCard}>
          <h2 className={styles.purposeTitle}>{t('pages.about.purpose.mission.title')}</h2>
          <p className={styles.body}>{t('pages.about.purpose.mission.body')}</p>
        </div>
      </section>

      <section className={styles.promise}>
        <div className={styles.promiseHead}>
          <p className={styles.eyebrow}>{t('pages.about.principles.eyebrow')}</p>
          <h2 className={styles.heading}>{t('pages.about.principles.title')}</h2>
          <p className={styles.body}>{t('pages.about.principles.body')}</p>
        </div>
        <ol className={styles.principles}>
          <Principle title={t('pages.about.principles.quality.title')} body={t('pages.about.principles.quality.body')}>
            <path d="M6 9a6 6 0 1 0 12 0a6 6 0 1 0-12 0" />
            <path d="M8.5 13.9L7 22l5-3 5 3-1.5-8.1M12 6.5l.8 1.6 1.7.3-1.2 1.2.3 1.7-1.6-.8-1.6.8.3-1.7-1.2-1.2 1.7-.3z" />
          </Principle>
          <Principle title={t('pages.about.principles.customer.title')} body={t('pages.about.principles.customer.body')}>
            <path d="M5.5 8a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0-7 0" />
            <path d="M2.5 20a6.5 6.5 0 0113 0M16 4.5a3.5 3.5 0 010 7M18 14a6 6 0 013.5 6" />
          </Principle>
          <Principle title={t('pages.about.principles.honesty.title')} body={t('pages.about.principles.honesty.body')}>
            <path d="M12 3v18M7 21h10M4 7h16M6 7l-3 7a3 3 0 006 0zM18 7l-3 7a3 3 0 006 0z" />
          </Principle>
          <Principle title={t('pages.about.principles.longTerm.title')} body={t('pages.about.principles.longTerm.body')}>
            <path d="M12 22V11M12 11C12 6.5 8.5 3 4 3c0 4.5 3.5 8 8 8zM12 15c0-4 3-7 8-7 0 4-3 7-8 7z" />
          </Principle>
          <Principle title={t('pages.about.principles.innovation.title')} body={t('pages.about.principles.innovation.body')}>
            <path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z" />
          </Principle>
          <Principle title={t('pages.about.principles.teamwork.title')} body={t('pages.about.principles.teamwork.body')}>
            <path d="M9.5 6a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0" />
            <path d="M3 9a2 2 0 1 0 4 0a2 2 0 1 0-4 0" />
            <path d="M17 9a2 2 0 1 0 4 0a2 2 0 1 0-4 0" />
            <path d="M7.5 20v-3a4.5 4.5 0 019 0v3M1.5 18v-1.5A3.5 3.5 0 015 13M22.5 18v-1.5A3.5 3.5 0 0019 13" />
          </Principle>
          <Principle title={t('pages.about.principles.ownership.title')} body={t('pages.about.principles.ownership.body')}>
            <path d="M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z" />
            <path d="M8 12l3 3 5-6" />
          </Principle>
          <Principle title={t('pages.about.principles.trust.title')} body={t('pages.about.principles.trust.body')}>
            <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5" />
          </Principle>
          <Principle title={t('pages.about.principles.sustainable.title')} body={t('pages.about.principles.sustainable.body')}>
            <path d="M5 19C5 10 11 5 20 5c0 9-5 14-14 14M5 19l7-7M3 21l2-2" />
          </Principle>
          <Principle title={t('pages.about.principles.lead.title')} body={t('pages.about.principles.lead.body')}>
            <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
          </Principle>
        </ol>
      </section>

      <section className={styles.mantra}>
        <div className={styles.mantraCard}>
          <p className={styles.heroEyebrow}>{t('pages.about.mantra.eyebrow')}</p>
          <h2 className={styles.mantraTitle}>{t('pages.about.mantra.title')}</h2>
          <p className={styles.mantraQuote}>{t('pages.about.mantra.quote')}</p>
          <Ornament className={styles.heroOrnament} />
          <p className={styles.mantraLine}>{t('pages.about.mantra.line')}</p>
          <p className={styles.mantraSign}>
            <span className={styles.mantraName}>{t('pages.about.founder.name')}</span>
            {t('pages.about.founder.role')}
          </p>
        </div>
      </section>

      <section className={styles.visit}>
        <div className={details ? styles.visitCard : `${styles.visitCard} ${styles.visitCardSolo}`}>
          <div className={styles.visitPanel}>
            <h2 className={styles.visitTitle}>{t('pages.about.visit.title')}</h2>
            <p className={styles.visitLead}>{t('pages.about.visit.lead')}</p>
          </div>
          {details ? (
            <div className={styles.visitDetails}>
              <p className={styles.visitName}>{store.name}</p>
              {address ? <p className={styles.visitAddress}>{address}</p> : null}
              <ul className={styles.contacts}>
                {store.contactPhone ? <li className={styles.contact}>{store.contactPhone}</li> : null}
                {store.contactEmail ? <li className={styles.contact}>{store.contactEmail}</li> : null}
              </ul>
              {whatsapp ? (
                <Link href={whatsapp.url} className={styles.visitButton}>
                  {t('pages.about.visit.whatsapp')}
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      <section className={styles.closing}>
        <p className={styles.closingText}>{t('pages.about.closing')}</p>
      </section>
    </Layout>
  )
}
