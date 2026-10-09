import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SectionHeader    from '../components/ui/SectionHeader'
import GoldDivider      from '../components/ui/GoldDivider'
import NewsletterSignup from '../components/sections/NewsletterSignup'
import { BrandTile, BrandModal } from '../components/ui/BrandShowcase'
import { haircareBrands } from '../data/haircareBrands'
import { haircareBrandsFrench } from '../data/haircareBrandsTranslations'

/* ──────────────────────────────────────────────────────────────
   Haircare — the professional hair brands we carry, one tile per
   category, laid out like the Boutique page. Merchandise is sold in
   store only, so there are no prices or cart: each tile opens the
   category's write-up and photos, with the address and phone number
   (BrandShowcase, shared with the Skincare page).
   ────────────────────────────────────────────────────────────── */

export default function Haircare() {
  const { t, i18n } = useTranslation()
  const french = i18n.language.startsWith('fr') ? haircareBrandsFrench : null
  const [open, setOpen] = useState(null)          // { brand, opener } — opener gets focus back on close

  const copyFor = brand => ({
    name:    french?.[brand.slug]?.name    || brand.name,
    tagline: french?.[brand.slug]?.tagline || brand.tagline,
    body:    french?.[brand.slug]?.body    || brand.body,
    lines:   french?.[brand.slug]?.lines   || brand.lines?.map(line => line.focus),
  })
  const closeModal = useCallback(() => { const opener = open?.opener; setOpen(null); opener?.focus() }, [open])

  return (
    <>
      {/* Page hero */}
      <div style={{ position: 'relative', minHeight: 'max(68vh, 480px)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <img src="/branding/Haircare.svg"
          alt={t('haircare.hero.imageAlt')} loading="eager"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(46,51,80,0.82) 0%, rgba(46,51,80,0.55) 60%, rgba(46,51,80,0.78) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', padding: 'calc(72px + var(--space-xl)) var(--space-xl) var(--space-xl)' }}>
          <p className="slide-in-up-1" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)', marginBottom: 'var(--space-md)' }}>✦ {t('haircare.hero.eyebrow')}</p>
          <h1 className="slide-in-up-2" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h1)', fontWeight: 300, color: 'var(--lavelle-white)', lineHeight: 1.15, marginBottom: 'var(--space-md)', textShadow: '0 2px 24px rgba(0,0,0,0.4)' }}>{t('haircare.hero.headline')}</h1>
          <p className="slide-in-up-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '1.1rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.75, marginBottom: 'var(--space-xl)' }}>{t('haircare.hero.sub')}</p>
          <div className="slide-in-up-4" style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/spa" className="btn-secondary">{t('haircare.hero.cta')}</a>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={{ background: 'var(--lavelle-ivory)', padding: 'var(--space-lg) var(--space-xl) var(--space-2xl)', minHeight: '60vh' }}>
        <div className="container">
          <SectionHeader eyebrow={t('haircare.section.eyebrow')} headline={t('haircare.section.headline')} subtext={t('haircare.section.sub')} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(250px, 100%), 1fr))', gap: 'var(--space-xl)' }}>
            {haircareBrands.map(brand => (
              <BrandTile key={brand.slug} brand={brand} copy={copyFor(brand)} prefix="haircare"
                onOpen={(b, opener) => setOpen({ brand: b, opener })} />
            ))}
          </div>
        </div>
      </div>

      {open && <BrandModal brand={open.brand} copy={copyFor(open.brand)} prefix="haircare" onClose={closeModal} />}

      <GoldDivider />
      <NewsletterSignup />
    </>
  )
}
