import { useState } from 'react'
import { Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCart } from '../../context/CartContext'
import { formatMoney } from '../../lib/tax'
import QuantitySelector from './QuantitySelector'

export default function GiftCard({ gift }) {
  const { t } = useTranslation()
  const [hovered,    setHovered]    = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [qty,        setQty]        = useState(1)
  const [added,      setAdded]      = useState(false)
  const { addItem } = useCart()

  const outOfStock = (gift.stock ?? 99) === 0
  const lineTotal  = gift.priceInCents ? formatMoney(gift.priceInCents * qty) : null

  function handleAdd() {
    if (outOfStock || !gift.priceInCents) return
    addItem({
      id:       gift.id,
      name:     gift.name,
      price:    gift.priceInCents,
      image:    gift.image,
      category: 'gifts',
      qty,
      maxQty:   gift.stock ?? 99,
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
      <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden' }}>
        <img src={gift.image} alt={gift.name} loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.5s ease' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(228,62,45,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s ease' }}>
          <span style={{ color: 'white', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 'var(--text-small)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{t('product.quickView')}</span>
        </div>
        {/* Wishlist */}
        <button aria-label="Add to wishlist" onClick={() => setWishlisted(w => !w)}
          style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Heart size={15} fill={wishlisted ? '#C0392B' : 'none'} color={wishlisted ? '#C0392B' : '#7A7A8A'} />
        </button>
        {/* Stock warning */}
        {!outOfStock && gift.stock <= 3 && (
          <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(192,57,43,0.88)', color: 'white', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {t('product.onlyLeft', { count: gift.stock })}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: 'var(--space-md)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-xs)', lineHeight: 1.3 }}>
          {gift.name}
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', lineHeight: 1.5, flex: 1, marginBottom: 'var(--space-md)' }}>
          {gift.description}
        </p>

        {/* Price */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-md)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--lavelle-plum-mid)' }}>
            {gift.priceInCents ? formatMoney(gift.priceInCents) : gift.price}
          </span>
          {qty > 1 && lineTotal && (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)' }}>
              {qty} × = {lineTotal}
            </span>
          )}
        </div>

        {/* Qty + Add */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          <QuantitySelector size="sm" value={qty} max={gift.stock ?? 99} disabled={outOfStock} onChange={setQty} />
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            aria-live="polite"
            style={{
              flex: 1, fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 600,
              letterSpacing: '0.12em', textTransform: 'uppercase', padding: '9px 12px',
              borderRadius: 'var(--radius-full)', cursor: outOfStock ? 'not-allowed' : 'pointer',
              border: added ? '1px solid #2E7D5E' : '1px solid var(--lavelle-plum-deep)',
              background: added ? 'rgba(46,125,94,0.1)' : outOfStock ? 'var(--lavelle-cream)' : 'var(--lavelle-plum-deep)',
              color: added ? '#2E7D5E' : outOfStock ? 'var(--lavelle-gray-mid)' : 'var(--lavelle-white)',
              transition: 'all 0.25s ease',
            }}>
            {outOfStock ? t('product.soldOut') : added ? t('product.added') : t('product.addToCart')}
          </button>
        </div>
      </div>
    </div>
  )
}
