import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Sentences        from '../components/ui/Sentences'
import GoldDivider      from '../components/ui/GoldDivider'
import NewsletterSignup from '../components/sections/NewsletterSignup'
import BookingModal     from '../components/ui/BookingModal'
import { TabBar, TabBanner, SidePanel, PriceList, MenuNote } from '../components/ui/ServiceMenu'
import useHashTab from '../hooks/useHashTab'
import useServiceLists from '../hooks/useServiceLists'
import { yearsInBusiness } from '../data/business'
import { usePhoto } from '../lib/siteContent'

/* ──────────────────────────────────────────────────────────────
   Salon — cuts, styling, colour, perms and treatments, with their
   prices. These were the Spa page's first two tabs; they have their
   own page so Salon and Spa in the menu lead to different places.
   The hero carries the client's Salon banner tagline over the shop's
   stylist and the hair brands we carry (public/images/salon/salon-hero.jpg).
   ────────────────────────────────────────────────────────────── */

const TABS = [
  { id: 'hair',   label: 'salon.tabs.hair',   banner: '/images/salon/moroccanoil-collection.jpg', side: '/images/salon/maria-nila-heal.jpg' },
  { id: 'colour', label: 'salon.tabs.colour', banner: '/images/salon/colour-care-collection.jpg', side: '/images/salon/joico-youthlock.jpg' },
]

export default function Salon() {
  const { t, i18n } = useTranslation()
  const photo = usePhoto()
  const isFrench = (i18n.resolvedLanguage || i18n.language).startsWith('fr')
  const [tab, chooseTab, tabBarRef] = useHashTab(TABS.map(x => x.id))
  const [modalOpen, setModalOpen] = useState(false)
  const lists = useServiceLists()

  const TWO_COL = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 'var(--space-2xl)', alignItems: 'start' }
  const listHeaders = [t('spa.col.service'), t('spa.col.price')]
  const fr = table => (isFrench ? table : null)
  // A price list from the services table (the admin's Services page);
  // nothing while it loads, or when the list is empty.
  const priceList = (key, title) => lists?.[key]?.items.length > 0 &&
    <PriceList headers={listHeaders} title={title} items={lists[key].items} translations={fr(lists[key].fr)} />

  return (
    <>
      {/* Page hero */}
      <div style={{ position: 'relative', minHeight: 'max(70vh, 480px)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <img src={photo('/images/salon/salon-hero.jpg')}
          alt={t('salon.hero.imageAlt')} loading="eager"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,25,38,0.62)' }} />
        {/* Wider than other heroes so "Thoughtfully Styled." fits on one line; the paragraph keeps the usual measure */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '820px', padding: 'calc(72px + var(--space-xl)) var(--space-xl) var(--space-xl)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-md)' }}>✦ {t('salon.hero.eyebrow')}</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h1)', fontWeight: 300, color: '#F6F5ED', lineHeight: 1.1, marginBottom: 'var(--space-md)', textShadow: '0 2px 20px rgba(0,0,0,0.4)', textWrap: 'balance' }}><Sentences text={t('salon.hero.headline')} /></h1>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '1.1rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.75, maxWidth: '600px', margin: '0 auto var(--space-xl)' }}>{t('salon.hero.sub')}</p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('salon.hero.cta')}</button>
            <Link to="/haircare" className="btn-secondary">{t('salon.hero.cta2')}</Link>
          </div>
        </div>
      </div>

      <TabBar labels={TABS.map(x => t(x.label))} active={tab} onChoose={chooseTab} barRef={tabBarRef} />

      {/* Tab content */}
      <div style={{ background: '#F6F5ED', padding: 'var(--space-lg) var(--space-xl) var(--space-lg)', minHeight: '60vh' }}>
        <div className="container">

          {/* ── Hair Cuts & Styling ── */}
          {tab === 0 && (
            <>
              <TabBanner image={TABS[0].banner} title={t('salon.hair.title')} sub={t('salon.hair.sub')} />
              <div style={TWO_COL}>
                <div>
                  {priceList('cuts_styles', t('salon.hair.listTitle'))}
                  <MenuNote text={t('salon.hair.note')} />
                  <div className="cta-center" style={{ marginTop: 'var(--space-xl)' }}>
                    <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('salon.hair.bookBtn')}</button>
                  </div>
                  <p style={{ textAlign: 'center', marginTop: 'var(--space-md)' }}>
                    <Link to="/haircare" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 600, color: '#2E3350' }}>{t('spa.hair.brandsLink')} →</Link>
                  </p>
                </div>
                <SidePanel image={TABS[0].side} alt={t('salon.hair.title')} text={t('spa.about.hair', { years: yearsInBusiness() })} />
              </div>
            </>
          )}

          {/* ── Colour, Highlights, Perms & Treatments ── */}
          {tab === 1 && (
            <>
              <TabBanner image={TABS[1].banner} title={t('salon.colour.title')} sub={t('salon.colour.sub')} />
              <div style={TWO_COL}>
                <div>
                  {priceList('colour', t('salon.colour.listTitle'))}
                  {priceList('perms', t('salon.perms.permsTitle'))}
                  {priceList('treatments', t('salon.perms.treatTitle'))}
                  <MenuNote text={t('salon.hair.note')} />
                  <div className="cta-center" style={{ marginTop: 'var(--space-xl)' }}>
                    <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('salon.colour.bookBtn')}</button>
                  </div>
                </div>
                <SidePanel image={TABS[1].side} alt={t('salon.colour.title')} text={t('spa.about.colour')} />
              </div>
            </>
          )}

        </div>
      </div>

      <GoldDivider />
      <NewsletterSignup />
      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
