import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import GoldDivider      from '../components/ui/GoldDivider'
import NewsletterSignup from '../components/sections/NewsletterSignup'
import BookingModal     from '../components/ui/BookingModal'
import PricingTable     from '../components/ui/PricingTable'
import { TabBanner as Banner } from '../components/ui/ServiceMenu'
import useServiceLists from '../hooks/useServiceLists'
import { lineList } from '../data/siteLists'
import { usePhoto } from '../lib/siteContent'

/* ──────────────────────────────────────────────────────────────
   MediSpa — one tab per treatment. The prices are the services table's
   medispa_* lists (the admin's Services page, with a "Series of 8"
   price); every other word is page text the admin can change. Lists of
   features are one item per line; a treatment option is "Name: what it
   does".
   ────────────────────────────────────────────────────────────── */

/* ── Tab banner images — Spa Rivier clinic photography ── */
const TAB_IMAGES = {
  0: { src: '/images/medispa/eminence-strawberry-rhubarb.jpg',      pos: 'center'     }, // facials
  1: { src: '/images/medispa/oxygeneo-treatment.jpg',               pos: 'center 62%' }, // oxygeneo
  2: { src: '/images/medispa/clinical-skincare-range.jpg',          pos: 'center'     }, // clinical facials
  3: { src: '/images/medispa/skin-rejuvenation-before-after.jpg',   pos: 'center 38%' }, // micro-needling
  4: { src: '/images/medispa/led-light-therapy.jpg',                pos: 'center 42%' }, // skin rejuvenation
  5: { src: '/images/medispa/trilipo-body-before-after.jpg',        pos: 'center'     }, // trilipo
  6: { src: '/branding/Body.svg',                                   pos: 'center'     }, // cryotherapy
  7: { src: '/images/medispa/laser-before-after.jpg',               pos: 'center 32%' }, // laser
}

const TabBanner = ({ tab, title, sub }) => <Banner image={TAB_IMAGES[tab].src} pos={TAB_IMAGES[tab].pos} title={title} sub={sub} />

function ConsultNote({ text }) {
  return (
    <div style={{ padding: 'var(--space-lg)', background: 'var(--color-cream)', borderRadius: 'var(--radius-lg)', marginTop: 'var(--space-xl)', borderLeft: '3px solid var(--color-pink)' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--color-blue)', lineHeight: 1.8, fontWeight: 300 }}>{text}</p>
    </div>
  )
}

/* ── Single-session + series-of-8 pricing table, from a services list ── */
function SeriesTable({ headers, list, french }) {
  if (!list?.items.length) return null
  return (
    <PricingTable
      headers={headers}
      rows={list.items.map((r, i) => [(french && list.fr[i]?.service) || r.service, r.price, r.series])}
    />
  )
}

/* ── Short points, one per line of their text ── */
function Points({ text, dark, mark = '✦', pad = '8px 0', size = 'var(--text-small)', rule }) {
  return lineList(text).map(item => (
    <div key={item} style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', padding: pad, borderBottom: dark ? '1px solid rgba(246,245,237,0.08)' : rule ? '1px solid var(--color-cream)' : 'none' }}>
      <span style={{ color: '#E9B0B9', fontWeight: 700, fontSize: dark ? '0.8rem' : undefined }}>{mark}</span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: size, color: dark ? 'rgba(246,245,237,0.82)' : '#2E3350', fontWeight: 300 }}>{item}</span>
    </div>
  ))
}

/* ── "Name: what it does" ── */
const option = line => {
  const at = line.indexOf(':')
  return at < 0 ? [line, ''] : [line.slice(0, at).trim(), line.slice(at + 1).trim()]
}

/* ── "Buy 6, get 2 free" badge shown above every series table ── */
function SeriesBadge({ text }) {
  return (
    <div style={{ display: 'inline-block', padding: '8px 16px', background: '#2E3350', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-lg)' }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#E9B0B9' }}>✦ {text}</span>
    </div>
  )
}

export default function MediSpa() {
  const { t, i18n } = useTranslation()
  const french = i18n.language.startsWith('fr')
  const photo = usePhoto()
  const lists = useServiceLists()
  const [tab, setTab] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  const tabs = [
    t('medispa.tabs.facials'),
    t('medispa.tabs.oxygeneo'),
    t('medispa.tabs.peels'),
    t('medispa.tabs.needling'),
    t('medispa.tabs.skinRejuv'),
    t('medispa.tabs.trilipo'),
    t('medispa.tabs.cryo'),
    t('medispa.tabs.laser'),
  ]

  const seriesHeaders = [t('medispa.series.col.treatment'), t('medispa.series.col.single'), t('medispa.series.col.series')]
  const seriesBadge = t('medispa.series.badge')
  const laserHeaders = [t('salon.laser.col.area'), t('medispa.series.col.single'), t('medispa.series.col.series')]
  const laserHeading = { fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-lg)' }

  return (
    <>
      {/* ── Page Hero ── */}
      <div style={{ position: 'relative', minHeight: 'max(70vh, 480px)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <img
          src={photo('/branding/Skincare.svg')}
          alt={t('medispa.hero.imageAlt')}
          loading="eager"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(46,51,80,0.65)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', padding: 'calc(72px + var(--space-xl)) var(--space-xl) var(--space-xl)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-md)' }}>
            ✦ {t('medispa.hero.eyebrow')}
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h1)', fontWeight: 200, color: '#F6F5ED', lineHeight: 1.1, marginBottom: 'var(--space-md)', textShadow: '0 2px 20px rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {t('medispa.hero.headline')}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '1.1rem', color: 'rgba(246,245,237,0.85)', lineHeight: 1.75, marginBottom: 'var(--space-xl)' }}>
            {t('medispa.hero.sub')}
          </p>
          <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('medispa.hero.cta')}</button>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div style={{ background: '#F6F5ED', borderBottom: '1px solid var(--color-cream)', position: 'sticky', top: '72px', zIndex: 100, overflowX: 'auto' }}>
        <div className="container medispa-tab-container" style={{ display: 'flex' }}>
          {tabs.map((label, i) => (
            <button className="medispa-tab" key={label} onClick={() => setTab(i)} style={{
              fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase', padding: '18px 18px',
              border: 'none', borderBottom: tab === i ? '2px solid #E9B0B9' : '2px solid transparent',
              background: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              color: tab === i ? '#2E3350' : 'rgba(46,51,80,0.50)',
              transition: 'color 0.2s',
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div style={{ background: '#F6F5ED', padding: 'var(--space-lg) var(--space-xl) var(--space-lg)', minHeight: '60vh' }}>
        <div className="container">

          {/* ── Tab 0: Facials ── */}
          {tab === 0 && (
            <>
              <TabBanner tab={0} title={t('medispa.facials.title')} sub={t('medispa.facials.sub')} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 'var(--space-2xl)', alignItems: 'start' }}>
                <div>
                  <SeriesBadge text={seriesBadge} />
                  <SeriesTable headers={seriesHeaders} list={lists?.medispa_facials} french={french} />
                  <ConsultNote text={t('medispa.facials.note')} />
                  <div className="cta-center" style={{ marginTop: 'var(--space-xl)' }}>
                    <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('medispa.hero.cta')}</button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  <img src={photo('/images/medispa/noon-aesthetics-collection.png')}
                    alt={t('medispa.facials.imageAlt')} loading="lazy"
                    style={{ width: '100%', height: '300px', objectFit: 'contain', background: '#F6F5ED', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
                  <div style={{ background: '#2E3350', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)' }}>
                    <Points text={t('medispa.facials.features')} dark />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Tab 1: OxyGeneo ── */}
          {tab === 1 && (
            <>
              <TabBanner tab={1} title={t('medispa.oxygeneo.title')} sub={t('medispa.oxygeneo.sub')} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 'var(--space-2xl)', alignItems: 'start' }}>
                <div>
                  <SeriesBadge text={seriesBadge} />
                  <SeriesTable headers={seriesHeaders} list={lists?.medispa_oxygeneo} french={french} />

                  <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-xl)', background: '#F4ECDF', borderRadius: 'var(--radius-xl)' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-md)' }}>
                      {t('medispa.oxygeneo.what')}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--color-blue)', lineHeight: 1.8, fontWeight: 300 }}>
                      {t('medispa.oxygeneo.explanation')}
                    </p>
                  </div>

                  <button className="btn-primary" style={{ display: 'flex', margin: 'var(--space-xl) auto 0' }} onClick={() => setModalOpen(true)}>
                    {t('medispa.oxygeneo.book')}
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  <img src={photo('/images/medispa/eminence-strawberry-rhubarb.jpg')}
                    alt={t('medispa.oxygeneo.imageAlt')} loading="lazy"
                    style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
                  <div style={{ background: '#2E3350', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)' }}>
                    <Points text={t('medispa.oxygeneo.features')} dark />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Tab 2: Clinical Facials ── */}
          {tab === 2 && (
            <>
              <TabBanner tab={2} title={t('medispa.peels.title')} sub={t('medispa.peels.sub')} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 'var(--space-2xl)', alignItems: 'start' }}>
                <div>
                  <SeriesBadge text={seriesBadge} />
                  <SeriesTable headers={seriesHeaders} list={lists?.medispa_clinical} french={french} />

                  <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-xl)', background: '#F4ECDF', borderRadius: 'var(--radius-xl)' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-md)' }}>
                      {t('medispa.peels.optionsLabel')}
                    </p>
                    {lineList(t('medispa.peels.options')).map(line => {
                      const [name, desc] = option(line)
                      return (
                      <div key={line} style={{ marginBottom: 'var(--space-md)', paddingBottom: 'var(--space-md)', borderBottom: '1px solid rgba(46,51,80,0.1)' }}>
                        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-small)', color: '#2E3350', marginBottom: '4px' }}>{name}</p>
                        {desc && <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(46,51,80,0.65)', lineHeight: 1.6, fontWeight: 300 }}>{desc}</p>}
                      </div>
                      )
                    })}
                  </div>

                  <ConsultNote text={t('medispa.peels.consult')} />
                  <div className="cta-center" style={{ marginTop: 'var(--space-xl)' }}>
                    <button className="btn-primary" onClick={() => setModalOpen(true)}>
                      {t('medispa.hero.cta')}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  <img src={photo('/images/medispa/noon-anti-aging-range.png')}
                    alt={t('medispa.peels.imageAlt')} loading="lazy"
                    style={{ width: '100%', height: '300px', objectFit: 'contain', background: '#F6F5ED', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
                  <img src={photo('/images/medispa/skin-rejuvenation-before-after.jpg')}
                    alt={t('medispa.peels.resultsAlt')} loading="lazy"
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
                </div>
              </div>
            </>
          )}

          {/* ── Tab 3: Micro-Needling ── */}
          {tab === 3 && (
            <>
              <TabBanner tab={3} title={t('medispa.needling.title')} sub={t('medispa.needling.sub')} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 'var(--space-2xl)', alignItems: 'start' }}>
                <div>
                  <SeriesBadge text={seriesBadge} />
                  <SeriesTable headers={seriesHeaders} list={lists?.medispa_needling} french={french} />

                  <ConsultNote text={t('medispa.needling.consult')} />
                  <div className="cta-center" style={{ marginTop: 'var(--space-xl)' }}>
                    <button className="btn-primary" onClick={() => setModalOpen(true)}>
                      {t('medispa.hero.cta')}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  <img src={photo('/images/medispa/micro-needling-before-after.jpg')}
                    alt={t('medispa.needling.imageAlt')} loading="lazy"
                    style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
                  <div style={{ background: '#F4ECDF', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-md)' }}>
                      {t('medispa.needling.treats')}
                    </p>
                    <Points text={t('medispa.needling.treated')} pad="6px 0" />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Tab 4: Skin Rejuvenation ── */}
          {tab === 4 && (
            <>
              <TabBanner tab={4} title={t('medispa.skinRejuv.title')} sub={t('medispa.skinRejuv.sub')} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 'var(--space-2xl)', alignItems: 'start' }}>
                <div>
                  <SeriesBadge text={seriesBadge} />
                  <SeriesTable headers={seriesHeaders} list={lists?.medispa_skin_rejuv} french={french} />

                  <ConsultNote text={t('medispa.skinRejuv.consult')} />
                  <div className="cta-center" style={{ marginTop: 'var(--space-xl)' }}>
                    <button className="btn-primary" onClick={() => setModalOpen(true)}>
                      {t('medispa.hero.cta')}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  <img src={photo('/images/medispa/skin-rejuvenation-before-after.jpg')}
                    alt={t('medispa.skinRejuv.imageAlt')} loading="lazy"
                    style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
                  <div style={{ background: '#F4ECDF', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-md)' }}>
                      {t('medispa.skinRejuv.treats')}
                    </p>
                    <Points text={t('medispa.skinRejuv.treated')} pad="6px 0" />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Tab 5: TriLipo ── */}
          {tab === 5 && (
            <>
              <TabBanner tab={5} title={t('medispa.trilipo.title')} sub={t('medispa.trilipo.sub')} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 'var(--space-2xl)', alignItems: 'start' }}>
                <div>
                  <SeriesBadge text={seriesBadge} />
                  <SeriesTable headers={seriesHeaders} list={lists?.medispa_trilipo} french={french} />

                  <ConsultNote text={t('medispa.trilipo.consult')} />
                  <div className="cta-center" style={{ marginTop: 'var(--space-xl)' }}>
                    <button className="btn-primary" onClick={() => setModalOpen(true)}>
                      {t('medispa.hero.cta')}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  <img src={photo('/images/medispa/trilipo-face-before-after.jpg')}
                    alt={t('medispa.trilipo.imageAlt')} loading="lazy"
                    style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
                  <div style={{ background: '#2E3350', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)' }}>
                    <Points text={t('medispa.trilipo.features')} dark />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Tab 6: Cryotherapy ── */}
          {tab === 6 && (
            <>
              <TabBanner tab={6} title={t('medispa.cryo.title')} sub={t('medispa.cryo.sub')} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 'var(--space-2xl)', alignItems: 'start' }}>
                <div>
                  <SeriesBadge text={seriesBadge} />
                  <SeriesTable headers={seriesHeaders} list={lists?.medispa_cryo} french={french} />

                  <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginTop: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
                    {t('medispa.cryo.treats')}
                  </h3>
                  <Points text={t('medispa.cryo.items')} pad="10px 0" size="var(--text-body)" rule />

                  <ConsultNote text={t('medispa.cryo.explanation')} />
                  <div className="cta-center" style={{ marginTop: 'var(--space-xl)' }}>
                    <button className="btn-primary" onClick={() => setModalOpen(true)}>
                      {t('medispa.hero.cta')}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  <img src={photo('https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=700&h=440&fit=crop&q=80')}
                    alt={t('medispa.cryo.imageAlt')} loading="lazy"
                    style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
                  <div style={{ background: '#F4ECDF', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-md)' }}>
                      {t('medispa.cryo.why')}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#2E3350', lineHeight: 1.8, fontWeight: 300 }}>
                      {t('medispa.cryo.whyText')}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Tab 7: Laser Treatments ── */}
          {tab === 7 && (
            <>
              <TabBanner tab={7} title={t('medispa.laser.title')} sub={t('medispa.laser.sub')} />

              {/* Skin Treatments */}
              <div style={{ marginBottom: 'var(--space-2xl)' }}>
                <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-lg)' }}>
                  {t('medispa.laser.skin')}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                  {lists?.medispa_laser_skin?.items.map((item, index) => (
                    <div key={item.service} style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', boxShadow: 'var(--shadow-card)', borderTop: '3px solid #E9B0B9' }}>
                      <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-small)', color: '#2E3350', marginBottom: 'var(--space-sm)' }}>{(french && lists.medispa_laser_skin.fr[index]?.service) || item.service}</h4>
                      <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1rem', color: '#2E3350' }}>{(french && lists.medispa_laser_skin.fr[index]?.price) || item.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hair Removal Tables */}
              <h3 style={laserHeading}>{t('medispa.laser.hair')}</h3>
              <SeriesBadge text={seriesBadge} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(440px, 100%), 1fr))', gap: 'var(--space-2xl)', marginBottom: 'var(--space-2xl)', alignItems: 'start' }}>
                <div>
                  <h3 style={laserHeading}>{t('medispa.laser.face')}</h3>
                  <SeriesTable headers={laserHeaders} list={lists?.medispa_laser_face} french={french} />
                  <h3 style={laserHeading}>{t('medispa.laser.legs')}</h3>
                  <SeriesTable headers={laserHeaders} list={lists?.medispa_laser_legs} french={french} />
                </div>
                <div>
                  <h3 style={laserHeading}>{t('medispa.laser.body')}</h3>
                  <SeriesTable headers={laserHeaders} list={lists?.medispa_laser_body} french={french} />
                  <div style={{ background: '#2E3350', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)' }}>
                    {[
                      t('salon.laser.feat1'),
                      t('salon.laser.feat2'),
                      t('salon.laser.feat3'),
                      t('salon.laser.feat4'),
                    ].map(f => (
                      <div key={f} style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(246,245,237,0.08)' }}>
                        <span style={{ color: '#E9B0B9', fontWeight: 700 }}>✓</span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(246,245,237,0.82)', fontWeight: 300 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <ConsultNote text={t('medispa.laser.consult')} />
              <div className="cta-center" style={{ marginTop: 'var(--space-xl)' }}>
                <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('salon.laser.bookBtn')}</button>
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
