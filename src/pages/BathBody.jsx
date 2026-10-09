import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SectionHeader    from '../components/ui/SectionHeader'
import GoldDivider      from '../components/ui/GoldDivider'
import NewsletterSignup from '../components/sections/NewsletterSignup'
import { BrandTile, BrandModal } from '../components/ui/BrandShowcase'
import { bathBodyBrands, bathBodyAccessories } from '../data/bathBodyBrands'
import { bathBodyBrandsFrench } from '../data/bathBodyBrandsTranslations'

/* ──────────────────────────────────────────────────────────────
   Bath & Body — the body care brands we carry, one tile per brand like
   the Haircare and Skincare pages, with Bath & Body Accessories as a
   subsection beneath them. The hero is the client's Body heading.
   ────────────────────────────────────────────────────────────── */

export default function BathBody() {
  const { t, i18n } = useTranslation()
  const french = i18n.language.startsWith('fr') ? bathBodyBrandsFrench : null
  const [open, setOpen] = useState(null)          // { brand, opener } — opener gets focus back on close

  const copyFor = brand => ({
    name:    brand.name,
    tagline: french?.[brand.slug]?.tagline || brand.tagline,
    body:    french?.[brand.slug]?.body    || brand.body,
  })
  const closeModal = useCallback(() => { const opener = open?.opener; setOpen(null); opener?.focus() }, [open])

  // Rows of up to four, centred, so a short last row sits in the middle
  const tiles = brands => (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-xl)' }}>
      {brands.map(brand => (
        <div key={brand.slug} style={{ flex: '0 1 270px', display: 'flex' }}>
          <BrandTile brand={brand} copy={copyFor(brand)} prefix="bathbody"
            onOpen={(b, opener) => setOpen({ brand: b, opener })} />
        </div>
      ))}
    </div>
  )

  return (
    <>
      {/* Page hero */}
      <div style={{ position: 'relative', minHeight: 'max(68vh, 480px)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <img src="/branding/Body.svg"
          alt={t('bathbody.hero.imageAlt')} loading="eager"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(46,51,80,0.82) 0%, rgba(46,51,80,0.55) 60%, rgba(46,51,80,0.78) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', padding: 'calc(72px + var(--space-xl)) var(--space-xl) var(--space-xl)' }}>
          <p className="slide-in-up-1" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)', marginBottom: 'var(--space-md)' }}>✦ {t('bathbody.hero.eyebrow')}</p>
          <h1 className="slide-in-up-2" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h1)', fontWeight: 300, color: 'var(--lavelle-white)', lineHeight: 1.15, marginBottom: 'var(--space-md)', textShadow: '0 2px 24px rgba(0,0,0,0.4)' }}>{t('bathbody.hero.headline')}</h1>
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
          {tiles(bathBodyBrands)}

          <GoldDivider />
          <SectionHeader eyebrow={t('bathbody.accessories.eyebrow')} headline={t('bathbody.accessories.headline')} subtext={t('bathbody.accessories.sub')} />
          {tiles(bathBodyAccessories)}
        </div>
      </div>

      {open && <BrandModal brand={open.brand} copy={copyFor(open.brand)} prefix="bathbody" onClose={closeModal} />}

      <GoldDivider />
      <NewsletterSignup />
    </>
  )
}
