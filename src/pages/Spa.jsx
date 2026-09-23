import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import FAQAccordion     from '../components/ui/FAQAccordion'
import GoldDivider      from '../components/ui/GoldDivider'
import NewsletterSignup from '../components/sections/NewsletterSignup'
import BookingModal     from '../components/ui/BookingModal'
import PricingTable     from '../components/ui/PricingTable'
import { waxingServices, faqItems } from '../data/spaData'
import { cutsStyles, colourServices, permsAndTreatments, lashBrow, nailBar } from '../data/salonData'
import {
  cutsStylesTranslations, colourTranslations, permTranslations, treatmentTranslations,
  lashExtensionsTranslations, browsTranslations, enhancementsTranslations,
  nailExtensionsTranslations, nailHandTranslations, nailFootTranslations, waxingTranslations,
} from '../data/salonTranslations'

/* ── One unique image per tab — Spa Rivier salon & spa photography ── */
const TAB_IMAGES = {
  0: '/images/salon/moroccanoil-collection.jpg', // hair
  1: '/images/salon/colour-care-collection.jpg', // colour
  2: '/images/spa/bath-ritual.jpg', // waxing
  3: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1400&h=500&fit=crop&q=85', // enhancements
  4: '/images/salon/nails-art.jpg', // nails
  5: '/images/spa/bath-tray.jpg', // foot care
  6: '/images/spa/aromatherapy-diffuser.jpg', // faq
}

/* ── Tab banner ── */
function TabBanner({ tab, title, sub }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '340px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: 'var(--space-2xl)' }}>
      <img src={TAB_IMAGES[tab]} alt={title} loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(46,51,80,0.80) 0%, rgba(46,51,80,0.30) 60%, transparent 100%)' }} />
      <div style={{ position: 'absolute', top: '50%', left: 'var(--space-2xl)', transform: 'translateY(-50%)', maxWidth: '480px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 300, color: '#F6F5ED', lineHeight: 1.2, marginBottom: 'var(--space-sm)' }}>{title}</h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>{sub}</p>
      </div>
    </div>
  )
}

/* ── One category as a Service | Price list, MediSpa-style.
   `translations` is the matching French array/object, indexed like `items`. ── */
function PriceList({ title, items, translations, headers }) {
  return (
    <div>
      <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-lg)' }}>
        {title}
      </h3>
      <PricingTable
        headers={headers}
        rows={items.map((item, i) => [
          translations?.[i]?.service || item.service,
          translations?.[i]?.price || item.price,
        ])}
      />
    </div>
  )
}

/* ── Pricing disclaimer / menu note ── */
function MenuNote({ text }) {
  return (
    <div style={{ padding: 'var(--space-lg)', background: '#F4ECDF', borderRadius: 'var(--radius-lg)', borderLeft: '3px solid #E9B0B9', marginBottom: 'var(--space-xl)' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#2E3350', lineHeight: 1.8, fontWeight: 300 }}>{text}</p>
    </div>
  )
}

export default function Spa() {
  const { t, i18n } = useTranslation()
  const activeLanguage = i18n.resolvedLanguage || i18n.language
  const isFrench = activeLanguage.startsWith('fr')
  const [tab, setTab] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  const tabs = [
    t('salon.tabs.hair'), t('salon.tabs.colour'),
    t('spa.tabs.waxing'), t('spa.tabs.enhancements'),
    t('salon.tabs.nailBar'), t('spa.tabs.foot'),
    t('spa.tabs.faq'),
  ]

  const LIST_COLUMN = { maxWidth: '760px', margin: '0 auto var(--space-xl)' }
  const listHeaders = [t('spa.col.service'), t('spa.col.price')]
  const fr = table => (isFrench ? table : null)
  const CENTER_BUTTON_STYLE = { display: 'flex', margin: '0 auto' }

  return (
    <>
      {/* Page hero */}
      <div style={{ position: 'relative', height: '70vh', minHeight: '480px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <img src="/branding/Spa%20page.svg"
          alt="Spa Rivier Spa — serene luxury treatment room" loading="eager"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,25,38,0.62)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '660px', padding: 'calc(72px + var(--space-xl)) var(--space-xl) var(--space-xl)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-md)' }}>✦ {t('spa.hero.eyebrow')}</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h1)', fontWeight: 300, color: '#F6F5ED', lineHeight: 1.1, marginBottom: 'var(--space-md)', textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>{t('spa.hero.headline')}</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '1.1rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.75, marginBottom: 'var(--space-xl)' }}>{t('spa.hero.sub')}</p>
          <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('spa.hero.cta')}</button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background: '#F6F5ED', borderBottom: '1px solid #F4ECDF', position: 'sticky', top: '72px', zIndex: 100, overflowX: 'auto' }}>
        <div className="container balanced-tab-container" style={{ display: 'flex', justifyContent: 'center' }}>
          {tabs.map((label, i) => (
            <button className="balanced-tab" key={label} onClick={() => setTab(i)} style={{
              fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 500,
              letterSpacing: '0.08em', textTransform: 'uppercase', padding: '18px 24px',
              border: 'none', borderBottom: tab === i ? '2px solid #E9B0B9' : '2px solid transparent',
              background: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              color: tab === i ? '#2E3350' : 'rgba(46,51,80,0.50)',
              transition: 'color 0.2s',
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ background: '#F6F5ED', padding: 'var(--space-xl) var(--space-xl) var(--space-lg)', minHeight: '60vh' }}>
        <div className="container">

          {/* ── Hair Cuts & Styling ── */}
          {tab === 0 && (
            <>
              <TabBanner tab={0} title={t('salon.hair.title')} sub={t('salon.hair.sub')} />
              <div style={LIST_COLUMN}>
                <PriceList headers={listHeaders} title={t('salon.hair.listTitle')} items={cutsStyles} translations={fr(cutsStylesTranslations)} />
                <MenuNote text={t('salon.hair.note')} />
              </div>
              <button className="btn-primary" style={CENTER_BUTTON_STYLE} onClick={() => setModalOpen(true)}>{t('salon.hair.bookBtn')}</button>
            </>
          )}

          {/* ── Colour, Highlights, Perms & Treatments ── */}
          {tab === 1 && (
            <>
              <TabBanner tab={1} title={t('salon.colour.title')} sub={t('salon.colour.sub')} />
              <div style={LIST_COLUMN}>
                <PriceList headers={listHeaders} title={t('salon.colour.listTitle')} items={colourServices} translations={fr(colourTranslations)} />
                <PriceList headers={listHeaders} title={t('salon.perms.permsTitle')} items={permsAndTreatments.perms} translations={fr(permTranslations)} />
                <PriceList headers={listHeaders} title={t('salon.perms.treatTitle')} items={permsAndTreatments.treatments} translations={fr(treatmentTranslations)} />
                <MenuNote text={t('salon.hair.note')} />
              </div>
              <button className="btn-primary" style={CENTER_BUTTON_STYLE} onClick={() => setModalOpen(true)}>{t('salon.colour.bookBtn')}</button>
            </>
          )}

          {/* ── Waxing ── */}
          {tab === 2 && (
            <>
              <TabBanner tab={2} title={t('spa.waxing.title')} sub={t('spa.waxing.sub')} />
              <div style={LIST_COLUMN}>
                <PriceList headers={listHeaders} title={t('spa.tabs.waxing')} items={waxingServices} translations={fr(waxingTranslations)} />
                <MenuNote text={t('spa.waxing.note')} />
              </div>
              <button className="btn-primary" style={CENTER_BUTTON_STYLE} onClick={() => setModalOpen(true)}>{t('spa.waxing.bookBtn')}</button>
            </>
          )}

          {/* ── Enhancements: lashes, brows, piercing, makeup ── */}
          {tab === 3 && (
            <>
              <TabBanner tab={3} title={t('salon.lash.title')} sub={t('salon.lash.sub')} />
              <div style={LIST_COLUMN}>
                <PriceList headers={listHeaders} title={t('salon.lash.lashTitle')} items={lashBrow.lashExtensions} translations={fr(lashExtensionsTranslations)} />
                <PriceList headers={listHeaders} title={t('salon.lash.browTitle')} items={lashBrow.brows} translations={fr(browsTranslations)} />
                <PriceList headers={listHeaders} title={t('salon.lash.enhanceTitle')} items={lashBrow.enhancements} translations={fr(enhancementsTranslations)} />
              </div>
              <button className="btn-primary" style={CENTER_BUTTON_STYLE} onClick={() => setModalOpen(true)}>{t('salon.lash.bookBtn')}</button>
            </>
          )}

          {/* ── Nail Department ── */}
          {tab === 4 && (
            <>
              <TabBanner tab={4} title={t('salon.nails.title')} sub={t('salon.nails.sub')} />
              <div style={LIST_COLUMN}>
                <PriceList headers={listHeaders} title={t('salon.nails.maniTitle')} items={nailBar.hand} translations={fr(nailHandTranslations)} />
                <PriceList headers={listHeaders} title={t('salon.nails.extensionsTitle')} items={nailBar.extensions} translations={fr(nailExtensionsTranslations)} />
                <MenuNote text={t('salon.nails.artNote')} />
              </div>
              <button className="btn-primary" style={CENTER_BUTTON_STYLE} onClick={() => setModalOpen(true)}>{t('salon.nails.bookBtn')}</button>
            </>
          )}

          {/* ── Foot Department ── */}
          {tab === 5 && (
            <>
              <TabBanner tab={5} title={t('spa.foot.title')} sub={t('spa.foot.sub')} />
              <div style={LIST_COLUMN}>
                <PriceList headers={listHeaders} title={t('spa.foot.listTitle')} items={nailBar.foot} translations={fr(nailFootTranslations)} />
                <MenuNote text={t('spa.foot.note')} />
              </div>
              <button className="btn-primary" style={CENTER_BUTTON_STYLE} onClick={() => setModalOpen(true)}>{t('spa.foot.bookBtn')}</button>
            </>
          )}

          {/* ── FAQ ── */}
          {tab === 6 && (
            <>
              <TabBanner tab={6} title={t('spa.faq.title')} sub={t('spa.faq.sub')} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-2xl)', alignItems: 'start' }}>
                <div style={{ maxWidth: '720px' }}>
                  <FAQAccordion items={faqItems} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=360&fit=crop&q=80"
                    alt="Spa Rivier Spa sanctuary" loading="lazy"
                    style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
                  <div style={{ background: '#2E3350', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)' }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontStyle: 'italic', color: '#E9B0B9', marginBottom: 'var(--space-md)' }}>{t('spa.faq.readyTitle')}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(246,245,237,0.75)', lineHeight: 1.7, marginBottom: 'var(--space-lg)' }}>{t('spa.faq.readySub1')} <a href="tel:+12509928084" style={{ color: '#E9B0B9' }}>250-992-8084</a> {t('spa.faq.readySub2')}</p>
                    <div className="cta-center">
                      <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('spa.faq.bookBtn')}</button>
                    </div>
                  </div>
                </div>
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
