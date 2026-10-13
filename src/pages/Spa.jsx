import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import FAQAccordion     from '../components/ui/FAQAccordion'
import Sentences        from '../components/ui/Sentences'
import GoldDivider      from '../components/ui/GoldDivider'
import NewsletterSignup from '../components/sections/NewsletterSignup'
import BookingModal     from '../components/ui/BookingModal'
import { TabBar, TabBanner, SidePanel, PriceList, MenuNote } from '../components/ui/ServiceMenu'
import useHashTab from '../hooks/useHashTab'
import { waxingServices, faqItems } from '../data/spaData'
import { lashBrow, nailBar } from '../data/salonData'
import {
  lashExtensionsTranslations, browsTranslations, enhancementsTranslations,
  nailExtensionsTranslations, nailHandTranslations, nailFootTranslations, waxingTranslations,
} from '../data/salonTranslations'

/* Each tab has an address (/spa#waxing, /spa#nails …), so a link can open it.
   Hair and Colour moved to the Salon page; their old addresses lead there.
   One unique banner and side photo per tab — Spa Rivier salon & spa photography. */
const TABS = [
  { id: 'waxing', label: 'spa.tabs.waxing',       banner: '/images/spa/bath-ritual.jpg',
    side: '/images/spa/aromatherapy-diffuser.jpg' },
  { id: 'lash',   label: 'spa.tabs.enhancements', banner: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1400&h=500&fit=crop&q=85',
    side: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=800&h=600&fit=crop&q=80' },
  { id: 'nails',  label: 'salon.tabs.nailBar',    banner: '/images/salon/nails-art.jpg',
    side: '/images/salon/nails-glitter.jpg' },
  { id: 'foot',   label: 'spa.tabs.foot',         banner: '/images/spa/bath-tray.jpg',
    side: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=600&fit=crop&q=80' },
  { id: 'faq',    label: 'spa.tabs.faq',          banner: '/images/spa/aromatherapy-diffuser.jpg' },
]
const SALON_TABS = ['#hair', '#colour']

export default function Spa() {
  const { t, i18n } = useTranslation()
  const activeLanguage = i18n.resolvedLanguage || i18n.language
  const isFrench = activeLanguage.startsWith('fr')
  const { hash } = useLocation()
  const [tab, chooseTab, tabBarRef] = useHashTab(TABS.map(x => x.id))
  const [modalOpen, setModalOpen] = useState(false)

  if (SALON_TABS.includes(hash)) return <Navigate to={`/salon${hash}`} replace />

  const TWO_COL = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 'var(--space-2xl)', alignItems: 'start' }
  const listHeaders = [t('spa.col.service'), t('spa.col.price')]
  const fr = table => (isFrench ? table : null)

  return (
    <>
      {/* Page hero */}
      <div style={{ position: 'relative', minHeight: 'max(70vh, 480px)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <img src="/branding/Spa%20page.svg"
          alt="Spa Rivier Spa — serene luxury treatment room" loading="eager"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,25,38,0.62)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '660px', padding: 'calc(72px + var(--space-xl)) var(--space-xl) var(--space-xl)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-md)' }}>✦ {t('spa.hero.eyebrow')}</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h1)', fontWeight: 300, color: '#F6F5ED', lineHeight: 1.1, marginBottom: 'var(--space-md)', textShadow: '0 2px 20px rgba(0,0,0,0.4)', textWrap: 'balance' }}><Sentences text={t('spa.hero.headline')} /></h1>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '1.1rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.75, marginBottom: 'var(--space-xl)' }}>{t('spa.hero.sub')}</p>
          <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('spa.hero.cta')}</button>
        </div>
      </div>

      <TabBar labels={TABS.map(x => t(x.label))} active={tab} onChoose={chooseTab} barRef={tabBarRef} />

      {/* Tab content */}
      <div style={{ background: '#F6F5ED', padding: 'var(--space-lg) var(--space-xl) var(--space-lg)', minHeight: '60vh' }}>
        <div className="container">

          {/* ── Waxing ── */}
          {tab === 0 && (
            <>
              <TabBanner image={TABS[0].banner} title={t('spa.waxing.title')} sub={t('spa.waxing.sub')} />
              <div style={TWO_COL}>
                <div>
                  <PriceList headers={listHeaders} title={t('spa.tabs.waxing')} items={waxingServices} translations={fr(waxingTranslations)} />
                  <MenuNote text={t('spa.waxing.note')} />
                  <div className="cta-center" style={{ marginTop: 'var(--space-xl)' }}>
                    <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('spa.waxing.bookBtn')}</button>
                  </div>
                </div>
                <SidePanel image={TABS[0].side} alt={t('spa.waxing.title')} text={t('spa.about.waxing')} />
              </div>
            </>
          )}

          {/* ── Enhancements: lashes, brows, piercing, makeup ── */}
          {tab === 1 && (
            <>
              <TabBanner image={TABS[1].banner} title={t('salon.lash.title')} sub={t('salon.lash.sub')} />
              <div style={TWO_COL}>
                <div>
                  <PriceList headers={listHeaders} title={t('salon.lash.lashTitle')} items={lashBrow.lashExtensions} translations={fr(lashExtensionsTranslations)} />
                  <PriceList headers={listHeaders} title={t('salon.lash.browTitle')} items={lashBrow.brows} translations={fr(browsTranslations)} />
                  <PriceList headers={listHeaders} title={t('salon.lash.enhanceTitle')} items={lashBrow.enhancements} translations={fr(enhancementsTranslations)} />
                  <div className="cta-center" style={{ marginTop: 'var(--space-xl)' }}>
                    <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('salon.lash.bookBtn')}</button>
                  </div>
                </div>
                <SidePanel image={TABS[1].side} alt={t('salon.lash.title')} text={t('spa.about.lash')} />
              </div>
            </>
          )}

          {/* ── Nail Department ── */}
          {tab === 2 && (
            <>
              <TabBanner image={TABS[2].banner} title={t('salon.nails.title')} sub={t('salon.nails.sub')} />
              <div style={TWO_COL}>
                <div>
                  <PriceList headers={listHeaders} title={t('salon.nails.maniTitle')} items={nailBar.hand} translations={fr(nailHandTranslations)} />
                  <PriceList headers={listHeaders} title={t('salon.nails.extensionsTitle')} items={nailBar.extensions} translations={fr(nailExtensionsTranslations)} />
                  <MenuNote text={t('salon.nails.artNote')} />
                  <div className="cta-center" style={{ marginTop: 'var(--space-xl)' }}>
                    <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('salon.nails.bookBtn')}</button>
                  </div>
                </div>
                <SidePanel image={TABS[2].side} alt={t('salon.nails.title')} text={t('spa.about.nails')} />
              </div>
            </>
          )}

          {/* ── Foot Department ── */}
          {tab === 3 && (
            <>
              <TabBanner image={TABS[3].banner} title={t('spa.foot.title')} sub={t('spa.foot.sub')} />
              <div style={TWO_COL}>
                <div>
                  <PriceList headers={listHeaders} title={t('spa.foot.listTitle')} items={nailBar.foot} translations={fr(nailFootTranslations)} />
                  <div className="cta-center" style={{ marginTop: 'var(--space-xl)' }}>
                    <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('spa.foot.bookBtn')}</button>
                  </div>
                </div>
                <SidePanel image={TABS[3].side} alt={t('spa.foot.title')} text={t('spa.about.foot')} />
              </div>
            </>
          )}

          {/* ── FAQ ── */}
          {tab === 4 && (
            <>
              <TabBanner image={TABS[4].banner} title={t('spa.faq.title')} sub={t('spa.faq.sub')} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 'var(--space-2xl)', alignItems: 'start' }}>
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
