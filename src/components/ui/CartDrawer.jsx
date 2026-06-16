import { useTranslation } from 'react-i18next'
import { useCart } from '../../context/CartContext'
import { formatMoney } from '../../lib/tax'
import QuantitySelector from './QuantitySelector'
import { X, ShoppingBag } from 'lucide-react'

export default function CartDrawer({ isOpen, onClose }) {
  const { t } = useTranslation()
  const { items, itemCount, subtotalCents, pst, gst, grandTotal, removeItem, updateQty } = useCart()

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,20,35,0.6)', zIndex: 800, backdropFilter: 'blur(4px)' }}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 900,
          width: '420px', maxWidth: '100vw',
          background: 'var(--lavelle-white)',
          boxShadow: '-20px 0 80px rgba(0,0,0,0.3)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.38s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex', flexDirection: 'column',
          overflowY: 'hidden',
        }}>

        {/* Header */}
        <div style={{ padding: 'var(--space-lg) var(--space-xl)', borderBottom: '1px solid var(--lavelle-cream)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--lavelle-plum-deep)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <ShoppingBag size={18} color="var(--lavelle-gold-champagne)" />
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 400, color: 'var(--lavelle-white)' }}>
              {t('drawer.heading')}
            </p>
            {itemCount > 0 && (
              <span style={{ background: 'var(--lavelle-gold-champagne)', color: 'var(--lavelle-plum-deep)', borderRadius: 'var(--radius-full)', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', fontFamily: 'var(--font-body)' }}>
                {itemCount}
              </span>
            )}
          </div>
          <button onClick={onClose} aria-label="Close cart" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--lavelle-white)', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-lg) var(--space-xl)' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 'var(--space-3xl)' }}>
              <ShoppingBag size={48} color="var(--lavelle-cream)" style={{ margin: '0 auto var(--space-lg)' }} />
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--lavelle-plum-soft)', marginBottom: 'var(--space-sm)' }}>
                {t('drawer.empty')}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)' }}>
                {t('cart.empty.sub')}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {items.map(item => (
                <div key={item.cartKey} style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start', padding: 'var(--space-md)', background: 'var(--lavelle-ivory)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--lavelle-cream)' }}>
                  {/* Image */}
                  <img src={item.image} alt={item.name} loading="lazy"
                    style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 600, color: 'var(--lavelle-plum-deep)', lineHeight: 1.3, marginBottom: '4px' }}>
                      {item.name}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {item.category}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <QuantitySelector
                        size="sm"
                        value={item.qty}
                        max={item.maxQty || 99}
                        onChange={qty => updateQty(item.cartKey, qty)}
                      />
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 700, color: 'var(--lavelle-plum-deep)' }}>
                        {formatMoney(item.price * item.qty)}
                      </p>
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--lavelle-gray-mid)', marginTop: '4px' }}>
                      {formatMoney(item.price)} {t('cart.each')}
                    </p>
                  </div>

                  {/* Remove */}
                  <button onClick={() => removeItem(item.cartKey)} aria-label={`Remove ${item.name}`}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--lavelle-gray-mid)', padding: '2px', flexShrink: 0, transition: 'color 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#c0392b' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--lavelle-gray-mid)' }}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer totals + CTA */}
        {items.length > 0 && (
          <div style={{ padding: 'var(--space-xl)', borderTop: '1px solid var(--lavelle-cream)', flexShrink: 0, background: 'var(--lavelle-white)' }}>
            {/* Tax breakdown */}
            <div style={{ marginBottom: 'var(--space-md)' }}>
              {[
                { label: t('drawer.subtotal'),        value: formatMoney(subtotalCents) },
                { label: t('tax.pst', { pct: (parseFloat(import.meta.env.VITE_PST_RATE ?? 0.07) * 100).toFixed(0) }), value: formatMoney(pst) },
                { label: t('tax.gst', { pct: (parseFloat(import.meta.env.VITE_GST_RATE ?? 0.05) * 100).toFixed(0) }), value: formatMoney(gst) },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--lavelle-cream)' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)' }}>{r.label}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-charcoal)', fontWeight: 500 }}>{r.value}</p>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)' }}>{t('cart.summary.total')}</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 300, color: 'var(--lavelle-gold-champagne)' }}>{formatMoney(grandTotal)}</p>
              </div>
            </div>

            <a href="/cart" onClick={onClose} className="btn-primary" style={{ display: 'flex', width: '100%', justifyContent: 'center', marginBottom: 'var(--space-sm)' }}>
              {t('drawer.viewCart')}
            </a>
            <button onClick={onClose} style={{ width: '100%', fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)', background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}>
              {t('cart.cta.continue')}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
