import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SectionHeader    from '../components/ui/SectionHeader'
import Sentences        from '../components/ui/Sentences'
import GoldDivider      from '../components/ui/GoldDivider'
import NewsletterSignup from '../components/sections/NewsletterSignup'
import { BrandTile, BrandModal } from '../components/ui/BrandShowcase'
import useBrandList from '../hooks/useBrandList'
import { usePhoto } from '../lib/siteContent'

/* ──────────────────────────────────────────────────────────────
   Bath & Body — the body care brands we carry, one tile per brand like
   the Haircare and Skincare pages, with Bath & Body Accessories as a
   subsection beneath them. The hero is the client's "Beautiful to use.
   Beautiful to give." banner, rebuilt in markup on their Body heading so
   it stacks on phones and translates.
   ────────────────────────────────────────────────────────────── */

export default function BathBody() {
  const { t } = useTranslation()
  const photo = usePhoto()
  const brands = useBrandList('bathbody')
  const accessories = useBrandList('bathbody_accessories')
  const [open, setOpen] = useState(null)          // { item, opener } — opener gets focus back on close
  const closeModal = useCallback(() => { const opener = open?.opener; setOpen(null); opener?.focus() }, [open])

  // Rows of up to four, centred, so a short last row sits in the middle
  const tiles = items => (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-xl)' }}>
      {items?.map(item => (
        <div key={item.brand.slug} style={{ flex: '0 1 270px', display: 'flex' }}>
          <BrandTile brand={item.brand} copy={item.copy} prefix="bathbody"
            onOpen={(b, opener) => setOpen({ item, opener })} />
        </div>
      ))}
    </div>
  )

  return (
    <>
      {/* Page hero */}
      <div style={{ position: 'relative', minHeight: 'max(68vh, 480px)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <img src={photo('/branding/Body.svg')}
          alt={t('bathbody.hero.imageAlt')} loading="eager"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(46,51,80,0.82) 0%, rgba(46,51,80,0.55) 60%, rgba(46,51,80,0.78) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', padding: 'calc(72px + var(--space-xl)) var(--space-xl) var(--space-xl)' }}>
          <p className="slide-in-up-1" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)', marginBottom: 'var(--space-md)' }}>✦ {t('bathbody.hero.eyebrow')}</p>
          <h1 className="slide-in-up-2" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h1)', fontWeight: 300, color: 'var(--lavelle-white)', lineHeight: 1.15, marginBottom: 'var(--space-md)', textShadow: '0 2px 24px rgba(0,0,0,0.4)', textWrap: 'balance' }}><Sentences text={t('bathbody.hero.headline')} /></h1>
          <p className="slide-in-up-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '1.1rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.75, marginBottom: 'var(--space-xl)' }}>{t('bathbody.hero.sub')}</p>
          <div className="slide-in-up-4" style={{ display: 'flex', justifyContent: 'center' }}>
            <a href="#brands" className="btn-secondary">{t('bathbody.hero.cta')}</a>
          </div>
        </div>
      </div>

      {/* Brands, then the accessories beneath them */}
      <div id="brands" style={{ background: 'var(--lavelle-ivory)', padding: 'var(--space-lg) var(--space-xl) var(--space-2xl)', minHeight: '60vh', scrollMarginTop: '72px' }}>
        <div className="container">
          <SectionHeader eyebrow={t('bathbody.section.eyebrow')} headline={t('bathbody.section.headline')} subtext={t('bathbody.section.sub')} />
          {tiles(brands)}

          {accessories?.length > 0 && <>
            <GoldDivider />
            <SectionHeader eyebrow={t('bathbody.accessories.eyebrow')} headline={t('bathbody.accessories.headline')} subtext={t('bathbody.accessories.sub')} />
            {tiles(accessories)}
          </>}
        </div>
      </div>

      {open && <BrandModal brand={open.item.brand} copy={open.item.copy} prefix="bathbody" onClose={closeModal} />}

      <GoldDivider />
      <NewsletterSignup />
    </>
  )
}
