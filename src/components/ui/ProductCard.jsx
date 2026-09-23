import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { boutiqueProductTranslations } from '../../data/boutiqueTranslations'

export default function ProductCard({ product }) {
  const { t, i18n }             = useTranslation()
  const [hovered, setHovered]   = useState(false)

  const outOfStock = (product.stock ?? 99) === 0
  const frenchProduct = i18n.language.startsWith('fr') ? boutiqueProductTranslations[product.id] : null
  const displayName = frenchProduct?.name || product.name
  const displayDescription = frenchProduct?.description || product.description

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--lavelle-white)', borderRadius: 'var(--radius-lg)',
        boxShadow: hovered ? 'var(--shadow-hover)' : 'var(--shadow-card)',
        overflow: 'hidden',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column',
      }}>

      {/* Image */}
      <div style={{ aspectRatio: '4/5', overflow: 'hidden', background: 'var(--lavelle-cream)', position: 'relative' }}>
        {product.image
          ? <img src={product.image} alt={displayName} loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.04)' : 'scale(1)', transition: 'transform 0.5s ease' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '3rem', opacity: 0.2 }}>✦</span>
            </div>
        }
        {outOfStock && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-small)', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--lavelle-gray-mid)' }}>{t('product.soldOut')}</span>
          </div>
        )}
        {/* Stock indicator */}
        {!outOfStock && product.stock <= 3 && (
          <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(192,57,43,0.9)', color: 'white', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {t('product.onlyLeft', { count: product.stock })}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: 'var(--space-md)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-xs)', lineHeight: 1.3 }}>
          {displayName}
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', lineHeight: 1.5, flex: 1, marginBottom: 'var(--space-md)' }}>
          {displayDescription}
        </p>

        {/* Merch is sold in store only — no price or cart online */}
        <a href="tel:+12509928084" style={{
          display: 'block', textAlign: 'center', textDecoration: 'none',
          fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 600,
          letterSpacing: '0.12em', textTransform: 'uppercase', padding: '9px 12px',
          borderRadius: 'var(--radius-full)', border: '1px solid var(--lavelle-gold-champagne)',
          color: outOfStock ? 'var(--lavelle-gray-mid)' : 'var(--lavelle-plum-deep)',
        }}>
          {outOfStock ? t('product.soldOut') : t('product.inStore')}
          {!outOfStock && (
            <span style={{ display: 'block', fontWeight: 400, letterSpacing: '0.06em', marginTop: '2px' }}>250-992-8084</span>
          )}
        </a>
      </div>
    </div>
  )
}
