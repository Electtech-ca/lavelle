import { useEffect, useRef } from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { formatMoney, PST_RATE, GST_RATE } from '../lib/tax'
import { Printer, Mail, Home } from 'lucide-react'

export default function OrderConfirmation() {
  const { t } = useTranslation()
  const { state } = useLocation()
  const invoiceRef = useRef(null)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  /* If arrived without order data, redirect to home */
  if (!state?.order) return <Navigate to="/" replace />

  const { order } = state
  const pstPct = (PST_RATE * 100).toFixed(0)
  const gstPct = (GST_RATE * 100).toFixed(0)
  const orderDate = new Date(order.createdAt || Date.now())

  function handlePrint() {
    window.print()
  }

  return (
    <>
      {/* ── Screen layout ── */}
      <div className="no-print" style={{ background: 'linear-gradient(135deg, #2E3350 0%, #1a1f3a 100%)', padding: 'calc(72px + var(--space-xl)) var(--space-xl) var(--space-2xl)', textAlign: 'center' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(46,125,94,0.2)', border: '2px solid #2E7D5E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-lg)', fontSize: '1.5rem' }}>✓</div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2E7D5E', marginBottom: 'var(--space-sm)' }}>{t('confirm.status')}</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 300, color: 'var(--lavelle-white)', marginBottom: 'var(--space-md)', lineHeight: 1.2 }}>
          {t('confirm.heading')}, {order.firstName}!
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(255,255,255,0.7)', marginBottom: 'var(--space-xl)' }}>
          {t('confirm.order')} <strong style={{ color: 'var(--lavelle-gold-champagne)', fontFamily: 'monospace' }}>{order.reference}</strong> {t('confirm.sub')} {order.email}.
        </p>
        <div className="no-print" style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={handlePrint} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={16} /> {t('confirm.print')}
          </button>
          <a href={`mailto:${order.email}?subject=Your Sparivier Order ${order.reference}`} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={16} /> {t('confirm.emailCopy')}
          </a>
          <a href="/" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Home size={16} /> {t('confirm.returnHome')}
          </a>
        </div>
      </div>

      {/* ── Printable Invoice ── */}
      <div id="lavelle-invoice" ref={invoiceRef}
        style={{ background: 'var(--lavelle-white)', maxWidth: '800px', margin: '0 auto', padding: 'var(--space-3xl) var(--space-2xl)' }}>

        {/* Invoice header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2xl)', paddingBottom: 'var(--space-xl)', borderBottom: '2px solid var(--lavelle-plum-deep)' }}>
          <div>
            <div style={{ marginBottom: 'var(--space-sm)' }}>
              <img
                src="/logo.png"
                alt="Sparivier"
                style={{ height: '72px', width: 'auto', display: 'block' }}
              />
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', lineHeight: 1.8 }}>
              353 Reid Street<br />
              Quesnel, BC V2J 2M4<br />
              Tel: 250-992-8084<br />
              hello@sparivier.ca
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)', marginBottom: 'var(--space-sm)' }}>
              {t('confirm.invoice')}
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 300, color: 'var(--lavelle-plum-deep)', marginBottom: '4px' }}>{order.reference}</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)' }}>
              {orderDate.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            {order.paymentMethod === 'card' && order.cardLast4 && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', marginTop: '4px' }}>
                {order.cardBrand || 'Card'} ****{order.cardLast4}
              </p>
            )}
          </div>
        </div>

        {/* Bill to */}
        <div style={{ marginBottom: 'var(--space-2xl)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--lavelle-gray-mid)', marginBottom: 'var(--space-sm)' }}>
            {t('confirm.billTo')}
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', color: 'var(--lavelle-charcoal)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--lavelle-plum-deep)' }}>{order.firstName} {order.lastName}</strong><br />
            {order.email}<br />
            {order.phone}
          </p>
        </div>

        {/* Line items table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 'var(--space-xl)' }}>
          <thead>
            <tr style={{ background: 'var(--lavelle-plum-deep)' }}>
              {[t('confirm.table.item'), t('confirm.table.unitPrice'), t('confirm.table.qty'), t('confirm.table.total')].map((h, i) => (
                <th key={h} style={{
                  fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600,
                  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)',
                  padding: '12px 16px', textAlign: i === 0 ? 'left' : 'right',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={item.cartKey || i} style={{ borderBottom: '1px solid var(--lavelle-cream)' }}>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', lineHeight: 1.4 }}>
                  <strong>{item.name}</strong>
                  <span style={{ display: 'block', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)', textTransform: 'capitalize' }}>{item.category}</span>
                </td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  {formatMoney(item.price)}
                </td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', textAlign: 'right' }}>
                  {item.qty}
                </td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--lavelle-plum-deep)', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  {formatMoney(item.price * item.qty)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals block */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ minWidth: '280px', background: 'var(--lavelle-ivory)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)', border: '1px solid var(--lavelle-cream)' }}>
            {[
              { label: t('confirm.subtotal'),                   value: formatMoney(order.subtotal) },
              { label: t('tax.pst', { pct: pstPct }),           value: formatMoney(order.pst) },
              { label: t('tax.gst', { pct: gstPct }),           value: formatMoney(order.gst) },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--lavelle-cream)' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)' }}>{r.label}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 500, color: 'var(--lavelle-charcoal)' }}>{r.value}</p>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', borderTop: '2px solid var(--lavelle-plum-deep)', marginTop: '4px' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)' }}>{t('confirm.totalPaid')}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 300, color: 'var(--lavelle-gold-champagne)' }}>{formatMoney(order.grandTotal)}</p>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)', marginTop: 'var(--space-sm)', fontStyle: 'italic' }}>
              {t('confirm.currency')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 'var(--space-3xl)', paddingTop: 'var(--space-xl)', borderTop: '1px solid var(--lavelle-cream)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-lg)' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--lavelle-plum-deep)', marginBottom: '6px' }}>
              {t('confirm.footer.thanks')}
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)', lineHeight: 1.7 }}>
              {t('confirm.footer.returns')}<br />
              {t('confirm.footer.questions')}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--lavelle-plum-soft)' }}>
              {t('confirm.footer.quote')}
            </p>
          </div>
        </div>
      </div>

      {/* Print CSS */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          #lavelle-invoice {
            max-width: 100% !important;
            padding: 20mm !important;
            box-shadow: none !important;
          }
          nav, footer, header { display: none !important; }
          @page { size: A4; margin: 15mm; }
        }
      `}</style>
    </>
  )
}
