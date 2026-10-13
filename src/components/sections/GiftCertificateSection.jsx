/* ──────────────────────────────────────────────────────────────
   Gift certificates, as a section of the Giftware page.

   These used to live on their own /gift-certificates page. The
   certificates are part of the Giftware offering, so the page was
   folded in and this section carries the whole flow: the four
   explanatory steps, the amount cards (with "your amount" as one
   of them), and the purchase modal.
   ────────────────────────────────────────────────────────────── */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Gift } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'
import { formatAmount } from '../ui/CertificateSheet'
import { supabase }  from '../../lib/supabase'
import { certificatePaymentUrl, hasCertificatePaymentLink,
         customCertificatePaymentUrl, hasCustomCertificateLink } from '../../lib/stripe'
import { newCertificateCode, newViewToken, paymentReference } from '../../lib/certificates'
import { certificateAmounts } from '../../data/giftsData'

/* ── One amount, as a simple card: the amount is the focus (.cert-card in globals.css).
   The whole card is the button. ── */
function CertificateCard({ amount, tint, ink, onPurchase }) {
  const { t } = useTranslation()
  return (
    <button type="button" className="cert-card" onClick={() => onPurchase({ amount })}
      aria-label={`${t('giftCert.card.purchase')}: ${t('giftCert.card.label')} ${formatAmount(amount)}`}
      style={{ background: `linear-gradient(135deg, ${tint[0]} 0%, ${tint[1]} 100%)`, color: ink }}>
      <span className="cert-card__icon" aria-hidden="true"><Gift size={20} strokeWidth={1.6} /></span>
      <span className="cert-card__label">{t('giftCert.card.label')}</span>
      <span className="cert-card__amount">{formatAmount(amount)}</span>
      <span className="cert-card__terms"><span>{t('giftCert.card.services')}</span><span>{t('giftCert.card.valid')}</span></span>
      <span className="cert-card__buy">{t('giftCert.card.purchase')}</span>
    </button>
  )
}

/* ── "Your amount", the same size as the others: online once the Stripe link
   that lets the customer set the price is in place, by phone until then. ── */
function CustomAmountCard({ onPurchase }) {
  const { t } = useTranslation()
  const online = hasCustomCertificateLink()
  const inner = (
    <>
      <span className="cert-card__icon" aria-hidden="true"><Gift size={20} strokeWidth={1.6} /></span>
      <span className="cert-card__label">{t('giftCert.card.label')}</span>
      <span className="cert-card__amount">{t('giftCert.custom.amount')}</span>
      <span className="cert-card__terms">{t('giftCert.custom.card')}</span>
      <span className="cert-card__buy">{online ? t('giftCert.custom.ctaOnline') : t('giftCert.custom.cta')}</span>
    </>
  )
  return online
    ? <button type="button" className="cert-card cert-card--custom" onClick={() => onPurchase({ amount: 0, custom: true })}>{inner}</button>
    : <a href="tel:+12509928084" className="cert-card cert-card--custom">{inner}</a>
}

/* ── Purchase modal ── */
const PENDING_KEY = 'sparivier.pendingCertificate'

function PurchaseModal({ cert, onClose }) {
  const { t } = useTranslation()
  // The certificate is emailed to the recipient, with a copy to the buyer to print.
  const [form, setForm] = useState({
    recipientFirstName: '', recipientLastName: '', recipientEmail: '',
    senderFirstName: '',    senderLastName: '',    senderEmail: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const isCustom  = Boolean(cert?.custom)
  const label     = isCustom ? 'Custom' : 'Gift Certificate'   // no tier names any more
  const payOnline = isCustom ? hasCustomCertificateLink() : hasCertificatePaymentLink(cert?.amount)

  if (!cert) return null

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  // Asked in two parts so the last name is required; stored, emailed and
  // printed as one name.
  const recipientName = `${form.recipientFirstName.trim()} ${form.recipientLastName.trim()}`
  const senderName    = `${form.senderFirstName.trim()} ${form.senderLastName.trim()}`

  // 'saved', 'taken' (that code already exists), or 'failed'.
  // Note the builder is a thenable without .catch, hence try/await/error.
  const saveOrder = async (certCode, token) => {
    try {
      const { error } = await supabase.from('gift_orders').insert([{
        type:            'certificate',
        cert_code:       certCode,
        view_token:      token,                 // opens the emailed certificate link
        cert_amount:     cert.amount * 100,     // store in cents; the webhook sets what Stripe charged
        cert_label:      label,
        amount:          cert.amount * 100,
        sender_name:     senderName,
        sender_email:    form.senderEmail,      // a copy of the certificate is emailed here
        recipient_name:  recipientName,
        recipient_email: form.recipientEmail,   // the certificate is emailed here
        message:         form.message,
        delivery:        'email',
        status:          'pending',             // becomes 'active' once payment confirmed
      }])
      if (!error) return 'saved'
      console.error('[GiftCertificateSection] insert failed:', error)
      return error.code === '23505' ? 'taken' : 'failed'
    } catch (err) {
      console.error('[GiftCertificateSection] insert failed:', err)
      return 'failed'
    }
  }

  const submit = async e => {
    e.preventDefault()
    setSaving(true)
    // A failed insert must never block the payment: Stripe carries the code
    // and token, so staff can reconcile the order either way. The one failure
    // worth retrying is a code that is already taken — paying against someone
    // else's code would leave two certificates sharing it.
    let certCode, token
    for (let attempt = 0; attempt < 5; attempt++) {
      certCode = newCertificateCode(cert.amount)
      token    = newViewToken()
      if (!supabase || await saveOrder(certCode, token) !== 'taken') break
    }
    const reference = paymentReference(certCode, token)
    const payUrl = !payOnline ? null
      : isCustom ? customCertificatePaymentUrl({ reference, email: form.senderEmail })
      : certificatePaymentUrl(cert.amount, { reference, email: form.senderEmail })
    if (payUrl) {
      // Carried across the redirect so the return page can show the guest
      // the printable certificate, and look up a custom amount once paid.
      try {
        sessionStorage.setItem(PENDING_KEY, JSON.stringify({
          certCode, token, amount: cert.amount, label,
          recipientName, senderName, message: form.message,
        }))
      } catch { /* private browsing — the certificate is emailed as well */ }
      window.location.assign(payUrl)
      return
    }

    setSaving(false)
    setSubmitted(true)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,20,35,0.82)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-xl)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', maxWidth: '520px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 40px 120px rgba(0,0,0,0.5)' }}>
        {/* Modal header */}
        <div style={{ background: 'linear-gradient(135deg, var(--lavelle-plum-deep), var(--lavelle-plum-mid))', padding: 'var(--space-xl)', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: 'var(--space-md)', right: 'var(--space-md)', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)', marginBottom: 'var(--space-sm)' }}>{t('giftCert.modal.heading')}</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, color: 'var(--lavelle-white)' }}>
            {isCustom ? t('giftCert.custom.heading') : `${formatAmount(cert.amount)} · ${t('giftCert.card.label')}`}
          </p>
        </div>

        <div style={{ padding: 'var(--space-xl)' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-2xl) 0' }}>
              <p style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🎁</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 300, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-md)' }}>{t('giftCert.modal.success.heading')}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', lineHeight: 1.7, marginBottom: 'var(--space-xl)' }}>
                {t('giftCert.modal.success.sub')}
              </p>
              <button onClick={onClose} className="btn-primary">{t('modal.close')}</button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', marginBottom: 'var(--space-lg)', lineHeight: 1.6 }}>
                {t('giftCert.modal.sub')}
              </p>

              {[
                [{ name: 'recipientFirstName', label: t('giftCert.modal.recipientFirstName'), type: 'text',  required: true },
                 { name: 'recipientLastName',  label: t('giftCert.modal.recipientLastName'),  type: 'text',  required: true }],
                [{ name: 'recipientEmail',     label: t('giftCert.modal.recipientEmail'),     type: 'email', required: true }],
                [{ name: 'senderFirstName',    label: t('giftCert.modal.yourFirstName'),      type: 'text',  required: true },
                 { name: 'senderLastName',     label: t('giftCert.modal.yourLastName'),       type: 'text',  required: true }],
                [{ name: 'senderEmail',        label: t('giftCert.modal.yourEmail'),          type: 'email', required: true }],
              ].map(row => (
                // First and last name share a row, stacking when the modal is narrow.
                // Inputs align to the bottom in case one label wraps and the other doesn't.
                <div key={row[0].name} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-md)', alignItems: 'end', marginBottom: 'var(--space-md)' }}>
                  {row.map(f => (
                    <div key={f.name}>
                      <label style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lavelle-gray-mid)', display: 'block', marginBottom: '6px' }}>
                        {f.label} {f.required && '*'}
                      </label>
                      <input type={f.type} name={f.name} value={form[f.name]} onChange={handle} required={f.required}
                        style={{ width: '100%', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', padding: '10px 14px', border: '1px solid var(--lavelle-cream)', borderRadius: 'var(--radius-md)', background: 'var(--lavelle-ivory)', color: 'var(--lavelle-charcoal)', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  ))}
                </div>
              ))}

              <div style={{ marginBottom: 'var(--space-md)' }}>
                <label style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lavelle-gray-mid)', display: 'block', marginBottom: '6px' }}>
                  {t('giftCert.modal.message')}
                </label>
                <textarea name="message" value={form.message} onChange={handle} rows={3}
                  placeholder={t('giftCert.modal.messagePlaceholder')}
                  style={{ width: '100%', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', padding: '10px 14px', border: '1px solid var(--lavelle-cream)', borderRadius: 'var(--radius-md)', background: 'var(--lavelle-ivory)', color: 'var(--lavelle-charcoal)', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>

              {/* Delivery + payment note */}
              <div style={{ background: 'var(--lavelle-plum-whisper)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', marginBottom: 'var(--space-lg)', border: '1px solid rgba(49,58,77,0.1)' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)', lineHeight: 1.7, marginBottom: '6px' }}>
                  {t('giftCert.modal.delivery')}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)', lineHeight: 1.7 }}>
                  {payOnline ? t('giftCert.modal.note') : t('giftCert.modal.noteLink')}
                </p>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', opacity: saving ? 0.7 : 1 }} disabled={saving}>
                {saving ? '…' : payOnline ? t('giftCert.modal.ctaPay') : t('giftCert.modal.cta')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function GiftCertificateSection() {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(null)

  return (
    <>
      {/* ── How it works ── */}
      <div style={{ background: 'var(--lavelle-plum-deep)', padding: 'var(--space-2xl) var(--space-xl)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-xl)', textAlign: 'center' }}>
          {[
            { step: '1', label: t('giftCert.steps.step1'), icon: '💎' },
            { step: '2', label: t('giftCert.steps.step2'), icon: '✍️' },
            { step: '3', label: t('giftCert.steps.step3'), icon: '🛁' },
            { step: '4', label: t('giftCert.steps.step4'), icon: '✦' },
          ].map(s => (
            <div key={s.step} className="slide-in-up">
              <p style={{
                width: '46px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto var(--space-sm)',
                background: s.icon === '✦' ? 'var(--color-blue)' : 'transparent',
                color: s.icon === '✦' ? 'var(--color-pink)' : 'var(--color-blue)',
                fontSize: '1.35rem', lineHeight: 1, borderRadius: '0',
              }} aria-hidden="true">{s.icon}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(228,62,45,0.6)', marginBottom: '6px' }}>{t('steps.label', { n: s.step })}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(255,255,255,0.8)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Certificate cards ── */}
      <section id="certificates" style={{ background: 'var(--lavelle-ivory)', padding: 'var(--space-lg) var(--space-xl)', scrollMarginTop: '80px' }}>
        <div className="container">
          <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
            <span style={{ width: '56px', height: '56px', borderRadius: '50%', border: '1.5px solid var(--color-pink)', color: 'var(--color-blue)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Gift size={28} strokeWidth={1.6} />
            </span>
          </div>
          <SectionHeader
            eyebrow={t('giftCert.section.eyebrow')}
            headline={t('giftCert.section.headline')}
            subtext={t('giftCert.section.sub')}
            align="center"
          />

          {/* "Your amount" first, as an equal card, so a budget of their own is
              the first thing people see; then the amounts */}
          <div className="cert-grid">
            <CustomAmountCard onPurchase={setSelected} />
            {certificateAmounts.map(c => (
              <CertificateCard key={c.amount} {...c} onPurchase={setSelected} />
            ))}
          </div>
        </div>
      </section>

      {/* Purchase modal */}
      {selected && <PurchaseModal cert={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
