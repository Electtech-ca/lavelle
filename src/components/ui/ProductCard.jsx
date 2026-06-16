import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCart } from '../../context/CartContext'
import { formatMoney } from '../../lib/tax'
import QuantitySelector from './QuantitySelector'

export default function ProductCard({ product }) {
  const { t }                   = useTranslation()
  const [hovered, setHovered]   = useState(false)
  const [qty, setQty]           = useState(1)
  const [added, setAdded]       = useState(false)
  const { addItem }             = useCart()

  const outOfStock = (product.stock ?? 99) === 0
  const lineTotal  = product.priceInCents ? formatMoney(product.priceInCents * qty) : null

  function handleAdd() {
    if (outOfStock || !product.priceInCents) return
    addItem({
      id:       product.id,
      name:     product.name,
      price:    product.priceInCents,
      image:    product.image,
      category: 'boutique',
      qty,
      maxQty:   product.stock ?? 99,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

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
          ? <img src={product.image} alt={product.name} loading="lazy"
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
          {product.name}
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', lineHeight: 1.5, flex: 1, marginBottom: 'var(--space-md)' }}>
          {product.description}
        </p>

        {/* Price row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-md)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--lavelle-plum-mid)' }}>
            {product.priceInCents ? formatMoney(product.priceInCents) : product.price}
          </span>
          {qty > 1 && lineTotal && (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)' }}>
              {qty} × = {lineTotal}
            </span>
          )}
        </div>

        {/* Qty + Add */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          <QuantitySelector
            size="sm"
            value={qty}
            max={product.stock ?? 99}
            disabled={outOfStock}
            onChange={setQty}
          />
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            aria-label={`Add ${product.name} to cart`}
            aria-live="polite"
            style={{
              flex: 1, fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 600,
              letterSpacing: '0.12em', textTransform: 'uppercase', padding: '9px 12px',
              borderRadius: 'var(--radius-full)', cursor: outOfStock ? 'not-allowed' : 'pointer',
              border: added ? '1px solid #2E7D5E' : '1px solid var(--lavelle-gold-champagne)',
              background: added ? 'rgba(46,125,94,0.1)' : outOfStock ? 'var(--lavelle-cream)' : 'var(--lavelle-gold-champagne)',
              color: added ? '#2E7D5E' : outOfStock ? 'var(--lavelle-gray-mid)' : 'var(--lavelle-plum-deep)',
              transition: 'all 0.25s ease',
            }}>
            {outOfStock ? t('product.soldOut') : added ? t('product.added') : t('product.addToCart')}
          </button>
        </div>
      </div>
    </div>
  )
}
