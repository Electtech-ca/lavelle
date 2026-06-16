import { useTranslation } from 'react-i18next'
import SectionHeader    from '../components/ui/SectionHeader'
import ProductCard      from '../components/ui/ProductCard'
import GoldDivider      from '../components/ui/GoldDivider'
import NewsletterSignup from '../components/sections/NewsletterSignup'
import { useProducts }  from '../context/ProductsContext'

export default function Boutique() {
  const { t } = useTranslation()
  const { products, loading } = useProducts()

  return (
    <>
      {/* Page hero */}
      <div style={{ position: 'relative', height: '68vh', minHeight: '480px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <img src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1920&h=1080&fit=crop&q=85"
          alt="Sparivier Fashion Boutique" loading="eager"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(25,12,4,0.78) 0%, rgba(25,12,4,0.5) 60%, rgba(25,12,4,0.72) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', padding: 'calc(72px + var(--space-xl)) var(--space-xl) var(--space-xl)' }}>
          <p className="slide-in-up-1" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)', marginBottom: 'var(--space-md)' }}>✦ {t('boutique.hero.eyebrow')}</p>
          <h1 className="slide-in-up-2" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h1)', fontWeight: 300, color: 'var(--lavelle-white)', lineHeight: 1.15, marginBottom: 'var(--space-md)', textShadow: '0 2px 24px rgba(0,0,0,0.4)' }}>{t('boutique.hero.headline')}</h1>
          <p className="slide-in-up-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '1.1rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.75, marginBottom: 'var(--space-xl)' }}>{t('boutique.hero.sub')}</p>
          <div className="slide-in-up-4" style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/gifts" className="btn-secondary">{t('boutique.hero.cta.gifts')}</a>
            <a href="/gift-certificates" className="btn-secondary">{t('boutique.hero.cta.certs')}</a>
          </div>
        </div>
      </div>

      {/* Fashion grid */}
      <div style={{ background: 'var(--lavelle-ivory)', padding: 'var(--space-3xl) var(--space-xl)', minHeight: '60vh' }}>
        <div className="container">
          <SectionHeader eyebrow={t('boutique.section.eyebrow')} headline={t('boutique.section.headline')} subtext={t('boutique.section.sub')} />
          {loading ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--lavelle-plum-soft)' }}>Loading collection…</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-xl)' }}>
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      <GoldDivider />
      <NewsletterSignup />
    </>
  )
}
