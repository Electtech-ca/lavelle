import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext'
import { formatMoney, PST_RATE, GST_RATE } from '../lib/tax'
import { supabase } from '../lib/supabase'
import QuantitySelector from '../components/ui/QuantitySelector'
import { Lock, CreditCard, Store, FileText, ChevronRight } from 'lucide-react'

/* ── Stripe stub — replace with real loadStripe() once keys are added ── */
const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
const stripeReady = STRIPE_KEY && !STRIPE_KEY.includes('your-key')

/* ── Step indicator ── */
function Steps({ current, labels }) {
  const steps = labels
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginTop: 'var(--space-xl)' }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0, transition: 'all 0.3s', background: current > i ? 'var(--lavelle-gold-champagne)' : current === i ? 'var(--lavelle-gold-champagne)' : 'rgba(255,255,255,0.15)', color: current >= i ? 'var(--lavelle-plum-deep)' : 'rgba(255,255,255,0.4)' }}>
              {current > i ? '✓' : i + 1}
            </div>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: current === i ? 'var(--lavelle-gold-champagne)' : 'rgba(255,255,255,0.45)', transition: 'color 0.3s' }}>{s}</span>
          </div>
          {i < 2 && <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.15)', margin: '0 8px' }} />}
        </div>
      ))}
    </div>
  )
}

/* ── Inline invoice table ── */
function InvoiceTable({ items, subtotal, pst, gst, grandTotal, compact = false, labels = {} }) {
  const pstPct = (PST_RATE * 100).toFixed(0)
  const gstPct = (GST_RATE * 100).toFixed(0)
  return (
    <div>
      <div style={{ overflowX: 'auto', marginBottom: 'var(--space-lg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: compact ? '320px' : '480px' }}>
          <thead>
            <tr style={{ background: 'var(--lavelle-plum-deep)' }}>
              {[labels.item || 'Item Description', labels.unit || 'Unit', labels.qty || 'Qty', labels.total || 'Total'].map((h, i) => (
                <th key={h} style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)', padding: compact ? '8px 12px' : '12px 16px', textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.cartKey || i} style={{ borderBottom: '1px solid var(--lavelle-cream)' }}>
                <td style={{ padding: compact ? '10px 12px' : '13px 16px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', lineHeight: 1.3 }}>
                  {item.name}
                  {!compact && <span style={{ display: 'block', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)', textTransform: 'capitalize' }}>{item.category}</span>}
                </td>
                <td style={{ padding: compact ? '10px 12px' : '13px 16px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', textAlign: 'right', whiteSpace: 'nowrap' }}>{formatMoney(item.price)}</td>
                <td style={{ padding: compact ? '10px 12px' : '13px 16px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', textAlign: 'right', fontWeight: 600 }}>{item.qty}</td>
                <td style={{ padding: compact ? '10px 12px' : '13px 16px', fontFamily: 'var(--font-display)', fontSize: compact ? 'var(--text-small)' : '1rem', fontWeight: 600, color: 'var(--lavelle-plum-deep)', textAlign: 'right', whiteSpace: 'nowrap' }}>{formatMoney(item.price * item.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Tax totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ minWidth: '240px' }}>
          {[
            [labels.subtotal || 'Pre-Tax Subtotal', formatMoney(subtotal), false],
            [labels.pst ? labels.pst.replace('{{pct}}', pstPct) : `PST (${pstPct}%)`, formatMoney(pst), false],
            [labels.gst ? labels.gst.replace('{{pct}}', gstPct) : `GST (${gstPct}%)`, formatMoney(gst), false],
          ].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--lavelle-cream)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)' }}>{l}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', fontWeight: 500 }}>{v}</p>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', borderTop: '2px solid var(--lavelle-plum-deep)', marginTop: '4px' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--lavelle-plum-deep)' }}>{labels.totalLabel || 'TOTAL (CAD)'}</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 300, color: 'var(--lavelle-gold-champagne)' }}>{formatMoney(grandTotal)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const inputStyle = { width: '100%', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', padding: '11px 14px', border: '1px solid var(--lavelle-cream)', borderRadius: 'var(--radius-md)', background: 'var(--lavelle-ivory)', color: 'var(--lavelle-charcoal)', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }
function Field({ label, required, children }) {
  return (
    <div>
      <label style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lavelle-gray-mid)', display: 'block', marginBottom: '6px' }}>
        {label} {required && <span style={{ color: '#c0392b' }}>*</span>}
      </label>
      {children}
    </div>
  )
}

export default function Checkout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { items, itemCount, subtotalCents, pst, gst, grandTotal, clearCart } = useCart()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    paymentMethod: 'card',
    notes: '',
  })

  const invoiceLabels = {
    item:       t('checkout.table.item'),
    unit:       t('checkout.table.unit'),
    qty:        t('checkout.table.qty'),
    total:      t('checkout.table.total'),
    subtotal:   t('checkout.subtotal'),
    pst:        t('tax.pst'),
    gst:        t('tax.gst'),
    totalLabel: t('checkout.totalLabel'),
  }

  const stepLabels = [t('checkout.step.details'), t('checkout.step.payment'), t('checkout.step.review')]

  /* Redirect if cart is empty */
  if (itemCount === 0) return (
    <div style={{ minHeight: '100vh', paddingTop: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-3xl)' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-lg)' }}>{t('cart.empty.heading')}</p>
        <a href="/boutique" className="btn-primary">{t('cart.empty.cta1')}</a>
      </div>
    </div>
  )

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const handle = e => set(e.target.name, e.target.value)
  const focusIn  = e => { e.target.style.borderColor = 'var(--lavelle-plum-soft)' }
  const focusOut = e => { e.target.style.borderColor = 'var(--lavelle-cream)' }

  const step1Valid = form.firstName && form.lastName && form.email && form.phone
  const step2Valid = form.paymentMethod !== ''

  async function placeOrder() {
    setLoading(true)
    setError('')
    const ref = `LV-${Date.now().toString(36).toUpperCase()}`

    try {
      if (supabase) {
        await supabase.from('payments').insert({
          reference:      ref,
          customer_email: form.email,
          customer_name:  `${form.firstName} ${form.lastName}`,
          phone:          form.phone,
          type:           'cart-order',
          description:    items.map(i => `${i.qty}× ${i.name}`).join(', '),
          amount:         grandTotal,    // cents
          payment_method: form.paymentMethod,
          status:         form.paymentMethod === 'in_store' ? 'pending' : 'pending',
          notes:          form.notes,
          created_at:     new Date().toISOString(),
          line_items:     JSON.stringify(items),
        })
      }

      clearCart()
      navigate('/order-confirmation', {
        state: {
          order: {
            reference:     ref,
            firstName:     form.firstName,
            lastName:      form.lastName,
            email:         form.email,
            phone:         form.phone,
            paymentMethod: form.paymentMethod,
            items,
            subtotal:      subtotalCents,
            pst,
            gst,
            grandTotal,
            createdAt:     new Date().toISOString(),
          },
        },
      })
    } catch (err) {
      setError(t('checkout.error.generic'))
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'var(--lavelle-ivory)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #2E3350 0%, #1a1f3a 100%)', padding: 'calc(72px + var(--space-xl)) var(--space-xl) var(--space-2xl)', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)', marginBottom: 'var(--space-sm)' }}>
          <Lock size={11} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
          {t('checkout.title')}
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 300, color: 'var(--lavelle-white)', lineHeight: 1.2 }}>
          {t('checkout.sub')}
        </h1>
        <Steps current={step - 1} labels={stepLabels} />
      </div>

      <div style={{ padding: 'var(--space-3xl) var(--space-xl)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 'var(--space-2xl)', alignItems: 'start', maxWidth: '1100px' }}>

          {/* ── Main form ── */}
          <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2xl)', boxShadow: 'var(--shadow-card)' }}>

            {/* STEP 1 — Customer details */}
            {step === 1 && (
              <>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 300, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-xl)' }}>{t('checkout.form.heading')}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
                  <Field label={t('checkout.form.firstName')} required><input type="text" name="firstName" value={form.firstName} onChange={handle} required style={inputStyle} onFocus={focusIn} onBlur={focusOut} /></Field>
                  <Field label={t('checkout.form.lastName')} required><input type="text" name="lastName" value={form.lastName} onChange={handle} required style={inputStyle} onFocus={focusIn} onBlur={focusOut} /></Field>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
                  <Field label={t('checkout.form.email')} required><input type="email" name="email" value={form.email} onChange={handle} required style={inputStyle} onFocus={focusIn} onBlur={focusOut} /></Field>
                  <Field label={t('checkout.form.phone')} required><input type="tel" name="phone" value={form.phone} onChange={handle} required style={inputStyle} onFocus={focusIn} onBlur={focusOut} /></Field>
                </div>
                <button className="btn-primary" onClick={() => step1Valid && setStep(2)} disabled={!step1Valid} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: step1Valid ? 1 : 0.5 }}>
                  {t('checkout.form.cta')} <ChevronRight size={16} />
                </button>
              </>
            )}

            {/* STEP 2 — Payment method */}
            {step === 2 && (
              <>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 300, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-xl)' }}>{t('checkout.payment.heading')}</h2>

                {/* Method cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                  {[
                    { val: 'card',     Icon: CreditCard, label: t('checkout.payment.card'),    sub: t('checkout.payment.cardSub') },
                    { val: 'in_store', Icon: Store,       label: t('checkout.payment.instore'), sub: t('checkout.payment.instoreSub') },
                    { val: 'invoice',  Icon: FileText,    label: t('checkout.payment.invoice'), sub: t('checkout.payment.invoiceSub') },
                  ].map(({ val, Icon, label, sub }) => (
                    <button key={val} onClick={() => set('paymentMethod', val)}
                      style={{ padding: 'var(--space-lg)', border: form.paymentMethod === val ? '2px solid var(--lavelle-plum-deep)' : '1px solid var(--lavelle-cream)', borderRadius: 'var(--radius-lg)', background: form.paymentMethod === val ? 'var(--lavelle-plum-whisper)' : 'var(--lavelle-ivory)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', color: form.paymentMethod === val ? 'var(--lavelle-plum-deep)' : 'var(--lavelle-gray-mid)' }}>
                      <Icon size={22} style={{ margin: '0 auto var(--space-sm)' }} />
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 600, marginBottom: '3px' }}>{label}</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', opacity: 0.7 }}>{sub}</p>
                    </button>
                  ))}
                </div>

                {/* Stripe card area */}
                {form.paymentMethod === 'card' && (
                  <div style={{ background: 'var(--lavelle-ivory)', border: '1px solid var(--lavelle-cream)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
                    {stripeReady ? (
                      <div style={{ minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--lavelle-cream)', borderRadius: 'var(--radius-md)', padding: 'var(--space-lg)', color: 'var(--lavelle-gray-mid)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', flexDirection: 'column', gap: '8px' }}>
                        <Lock size={16} color="var(--lavelle-plum-soft)" />
                        {/* Mount Stripe Element here once backend PaymentIntent is ready */}
                        <p style={{ fontStyle: 'italic' }}>{t('checkout.stripe.placeholder')}</p>
                      </div>
                    ) : (
                      <div style={{ background: 'rgba(228,62,45,0.08)', border: '1px solid rgba(228,62,45,0.3)', borderRadius: 'var(--radius-md)', padding: 'var(--space-lg)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#b83020' }} />
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b83020' }}>{t('checkout.stripe.badge')}</p>
                        </div>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', lineHeight: 1.7 }}>
                          {t('checkout.stripe.note')}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {form.paymentMethod === 'in_store' && (
                  <div style={{ background: 'var(--lavelle-plum-whisper)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)', border: '1px solid rgba(49,58,77,0.1)' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', lineHeight: 1.75 }}>
                      <strong style={{ color: 'var(--lavelle-plum-deep)' }}>{t('checkout.instore.label')}</strong> {t('checkout.instore.note')}
                    </p>
                  </div>
                )}

                {form.paymentMethod === 'invoice' && (
                  <div style={{ background: 'var(--lavelle-plum-whisper)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)', border: '1px solid rgba(49,58,77,0.1)' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', lineHeight: 1.75 }}>
                      <strong style={{ color: 'var(--lavelle-plum-deep)' }}>{t('checkout.invoice.label')}</strong> {t('checkout.invoice.note')} <a href="tel:+12509928084" style={{ color: 'var(--lavelle-plum-soft)' }}>250-992-8084</a>.
                    </p>
                  </div>
                )}

                <Field label={t('checkout.form.notes')}>
                  <textarea name="notes" value={form.notes} onChange={handle} rows={2} placeholder={t('checkout.form.notesPlaceholder')} style={{ ...inputStyle, resize: 'vertical' }} onFocus={focusIn} onBlur={focusOut} />
                </Field>

                <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-xl)' }}>
                  <button onClick={() => setStep(1)} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', padding: '12px 20px', border: '1px solid var(--lavelle-cream)', borderRadius: 'var(--radius-full)', background: 'none', cursor: 'pointer', color: 'var(--lavelle-gray-mid)' }}>
                    {t('checkout.payment.back')}
                  </button>
                  <button className="btn-primary" onClick={() => setStep(3)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {t('checkout.payment.cta')} <ChevronRight size={16} />
                  </button>
                </div>
              </>
            )}

            {/* STEP 3 — Review & confirm */}
            {step === 3 && (
              <>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 300, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-xl)' }}>{t('checkout.review.heading')}</h2>

                <InvoiceTable items={items} subtotal={subtotalCents} pst={pst} gst={gst} grandTotal={grandTotal} labels={invoiceLabels} />

                <div style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-xl)', background: 'var(--lavelle-ivory)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--lavelle-cream)' }}>
                  {[
                    [t('checkout.review.customer'), `${form.firstName} ${form.lastName}`],
                    [t('checkout.review.email'),     form.email],
                    [t('checkout.review.phone'),     form.phone],
                    [t('checkout.review.payment'),   form.paymentMethod === 'card' ? t('checkout.payment.card') : form.paymentMethod === 'in_store' ? t('checkout.payment.instore') : t('checkout.payment.invoice')],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--lavelle-cream)' }}>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lavelle-gray-mid)' }}>{k}</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', textAlign: 'right' }}>{v}</p>
                    </div>
                  ))}
                </div>

                {error && (
                  <div style={{ marginTop: 'var(--space-lg)', background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.25)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#c0392b' }}>{error}</p>
                  </div>
                )}

                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)', lineHeight: 1.7, marginTop: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
                  {t('checkout.review.consent')}
                </p>

                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                  <button onClick={() => setStep(2)} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', padding: '12px 20px', border: '1px solid var(--lavelle-cream)', borderRadius: 'var(--radius-full)', background: 'none', cursor: 'pointer', color: 'var(--lavelle-gray-mid)' }}>
                    {t('checkout.payment.back')}
                  </button>
                  <button className="btn-primary" onClick={placeOrder} disabled={loading} style={{ flex: 1 }}>
                    {loading ? '…' : `${t('checkout.review.cta')} — ${formatMoney(grandTotal)}`}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ── Order summary sidebar ── */}
          <div style={{ position: 'sticky', top: 'calc(72px + var(--space-lg))' }}>
            <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ background: 'var(--lavelle-plum-deep)', padding: 'var(--space-lg) var(--space-xl)' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 400, color: 'var(--lavelle-white)' }}>{t('checkout.summary.heading')}</p>
              </div>
              <div style={{ padding: 'var(--space-xl)' }}>
                {items.map(item => (
                  <div key={item.cartKey} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: '8px 0', borderBottom: '1px solid var(--lavelle-cream)' }}>
                    <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--lavelle-plum-deep)', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--lavelle-gray-mid)' }}>{formatMoney(item.price)} × {item.qty}</p>
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--lavelle-plum-deep)', whiteSpace: 'nowrap', flexShrink: 0 }}>{formatMoney(item.price * item.qty)}</p>
                  </div>
                ))}

                <div style={{ marginTop: 'var(--space-md)' }}>
                  {[[t('checkout.summary.subtotal'), formatMoney(subtotalCents)], [t('tax.pst', { pct: (PST_RATE*100).toFixed(0) }), formatMoney(pst)], [t('tax.gst', { pct: (GST_RATE*100).toFixed(0) }), formatMoney(gst)]].map(([l, v]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)' }}>{l}</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-charcoal)', fontWeight: 500 }}>{v}</p>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '2px solid var(--lavelle-plum-deep)', marginTop: '6px' }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--lavelle-plum-deep)' }}>{t('checkout.sidebar.total')}</p>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 300, color: 'var(--lavelle-gold-champagne)' }}>{formatMoney(grandTotal)}</p>
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
