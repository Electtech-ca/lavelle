import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext'
import { formatMoney, PST_RATE, GST_RATE } from '../lib/tax'
import QuantitySelector from '../components/ui/QuantitySelector'
import GoldDivider from '../components/ui/GoldDivider'
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react'

function EmptyCart() {
  const { t } = useTranslation()
  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-3xl) var(--space-xl)', textAlign: 'center' }}>
      <ShoppingBag size={64} color="var(--lavelle-cream)" style={{ marginBottom: 'var(--space-xl)' }} />
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-md)' }}>
        {t('cart.empty.heading')}
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', color: 'var(--lavelle-gray-mid)', maxWidth: '400px', lineHeight: 1.75, marginBottom: 'var(--space-2xl)' }}>
        {t('cart.empty.sub')}
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a href="/boutique" className="btn-primary">{t('cart.empty.cta1')}</a>
        <a href="/gifts" className="btn-secondary">{t('cart.empty.cta2')}</a>
      </div>
    </div>
  )
}

export default function Cart() {
  const { t } = useTranslation()
  const { items, itemCount, subtotalCents, pst, gst, taxTotal, grandTotal, removeItem, updateQty, clearCart } = useCart()

  if (items.length === 0) return <div style={{ paddingTop: '72px' }}><EmptyCart /></div>

  const pstPct = (PST_RATE * 100).toFixed(0)
  const gstPct = (GST_RATE * 100).toFixed(0)

  return (
    <div style={{ background: 'var(--lavelle-ivory)', minHeight: '100vh', paddingTop: '72px' }}>

      {/* Page header */}
      <div style={{ background: 'var(--lavelle-plum-deep)', padding: 'var(--space-2xl) var(--space-xl)' }}>
        <div className="container">
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)', marginBottom: 'var(--space-sm)' }}>✦ {t('cart.heading')}</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 300, color: 'var(--lavelle-white)' }}>
            {t('cart.heading')} — {itemCount} item{itemCount !== 1 ? 's' : ''}
          </h1>
        </div>
      </div>

      <div style={{ padding: 'var(--space-3xl) var(--space-xl)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 'var(--space-2xl)', alignItems: 'start' }}>

            {/* ── Left: Cart items ── */}
            <div>
              {/* Desktop invoice table */}
              <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', marginBottom: 'var(--space-lg)' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '540px' }}>
                    <thead>
                      <tr style={{ background: 'var(--lavelle-plum-deep)' }}>
                        {[t('cart.table.item'), t('cart.table.unitPrice'), t('cart.table.qty'), t('cart.table.lineTotal'), ''].map(h => (
                          <th key={h} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)', padding: '14px 16px', textAlign: h === 'Qty' ? 'center' : h === '' ? 'center' : 'left', whiteSpace: 'nowrap' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, i) => (
                        <tr key={item.cartKey}
                          style={{ borderBottom: i < items.length - 1 ? '1px solid var(--lavelle-cream)' : 'none', transition: 'background 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--lavelle-ivory)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = '' }}>

                          {/* Product */}
                          <td style={{ padding: '16px', verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                              <img src={item.image} alt={item.name} loading="lazy"
                                style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
                              <div>
                                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--lavelle-plum-deep)', fontSize: 'var(--text-small)', lineHeight: 1.3, marginBottom: '3px' }}>
                                  {item.name}
                                </p>
                                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)', textTransform: 'capitalize', letterSpacing: '0.06em' }}>
                                  {item.category}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Unit price */}
                          <td style={{ padding: '16px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                            {formatMoney(item.price)}
                          </td>

                          {/* Qty */}
                          <td style={{ padding: '16px', textAlign: 'center', verticalAlign: 'middle' }}>
                            <QuantitySelector
                              size="sm"
                              value={item.qty}
                              max={item.maxQty || 99}
                              onChange={qty => updateQty(item.cartKey, qty)}
                            />
                          </td>

                          {/* Line total */}
                          <td style={{ padding: '16px', fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--lavelle-plum-deep)', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                            {formatMoney(item.price * item.qty)}
                          </td>

                          {/* Remove */}
                          <td style={{ padding: '16px', textAlign: 'center', verticalAlign: 'middle' }}>
                            <button onClick={() => removeItem(item.cartKey)} aria-label={`Remove ${item.name}`}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--lavelle-gray-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s', padding: '4px' }}
                              onMouseEnter={e => { e.currentTarget.style.color = '#c0392b' }}
                              onMouseLeave={e => { e.currentTarget.style.color = 'var(--lavelle-gray-mid)' }}>
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Clear cart */}
              <button onClick={clearCart}
                style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c0392b', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 0', opacity: 0.75 }}>
                <Trash2 size={13} /> {t('cart.cta.clear')}
              </button>
            </div>

            {/* ── Right: Order summary ── */}
            <div style={{ position: 'sticky', top: 'calc(72px + var(--space-lg))' }}>
              <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                {/* Header */}
                <div style={{ background: 'var(--lavelle-plum-deep)', padding: 'var(--space-lg) var(--space-xl)' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, color: 'var(--lavelle-white)' }}>{t('cart.summary.heading')}</p>
                </div>

                <div style={{ padding: 'var(--space-xl)' }}>
                  {/* Line items summary */}
                  {items.map(item => (
                    <div key={item.cartKey} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--lavelle-cream)' }}>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', flex: 1, paddingRight: 'var(--space-md)', lineHeight: 1.4 }}>
                        {item.name}
                        <span style={{ color: 'var(--lavelle-gray-mid)', display: 'block', fontSize: 'var(--text-micro)' }}>
                          {formatMoney(item.price)} × {item.qty}
                        </span>
                      </p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 600, color: 'var(--lavelle-plum-deep)', whiteSpace: 'nowrap' }}>
                        {formatMoney(item.price * item.qty)}
                      </p>
                    </div>
                  ))}

                  {/* Tax breakdown */}
                  <div style={{ marginTop: 'var(--space-md)' }}>
                    {[
                      { label: t('cart.summary.subtotal'),                         value: formatMoney(subtotalCents), bold: false },
                      { label: t('tax.pst', { pct: pstPct }),                      value: formatMoney(pst),           bold: false },
                      { label: t('tax.gst', { pct: gstPct }),                      value: formatMoney(gst),           bold: false },
                    ].map(r => (
                      <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0' }}>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)' }}>{r.label}</p>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: r.bold ? 700 : 500, color: 'var(--lavelle-charcoal)' }}>{r.value}</p>
                      </div>
                    ))}

                    <div style={{ borderTop: '2px solid var(--lavelle-plum-deep)', marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)' }}>{t('cart.summary.total')}</p>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 300, color: 'var(--lavelle-gold-champagne)' }}>{formatMoney(grandTotal)}</p>
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)', marginTop: '6px', fontStyle: 'italic' }}>
                      {t('cart.summary.taxNote')}
                    </p>
                  </div>

                  {/* CTA */}
                  <a href="/checkout" className="btn-primary"
                    style={{ display: 'flex', width: '100%', justifyContent: 'center', gap: 'var(--space-sm)', marginTop: 'var(--space-xl)' }}>
                    {t('cart.cta.checkout')} <ArrowRight size={16} />
                  </a>
                  <a href="/boutique"
                    style={{ display: 'block', textAlign: 'center', marginTop: 'var(--space-md)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)', textDecoration: 'none' }}>
                    {t('cart.cta.continue')}
                  </a>

                  {/* Trust badges */}
                  <div style={{ marginTop: 'var(--space-xl)', paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--lavelle-cream)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                    {[
                      { icon: '🔒', text: t('cart.trust.ssl') },
                      { icon: '💳', text: t('cart.trust.cards') },
                      { icon: '🏪', text: t('cart.trust.instore') },
                    ].map(b => (
                      <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.9rem' }}>{b.icon}</span>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)' }}>{b.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
