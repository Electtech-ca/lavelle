/* ──────────────────────────────────────────────────────────────
   Gift certificates, as a section of the Giftware page.

   These used to live on their own /gift-certificates page. The
   certificates are part of the Giftware offering, so the page was
   folded in and this section carries the whole flow: the four
   explanatory steps, the tier cards, the custom-amount block, and
   the purchase modal.
   ────────────────────────────────────────────────────────────── */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SectionHeader from '../ui/SectionHeader'
import { supabase }  from '../../lib/supabase'
import { certificatePaymentUrl, hasCertificatePaymentLink,
         customCertificatePaymentUrl, hasCustomCertificateLink } from '../../lib/stripe'
import { giftCertificates } from '../../data/giftsData'

/* ── Certificate voucher component ── */
function CertificateCard({ cert, onPurchase }) {
  const { t } = useTranslation()
  const [hovered, setHovered] = useState(false)
  const certNum = `LV-${cert.amount.toString().padStart(4, '0')}-${Math.floor(Math.random() * 9000 + 1000)}`

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onPurchase(cert)}
      style={{
        position: 'relative',
        background: cert.gradient,
        borderRadius: '16px',
        padding: '0',
        cursor: 'pointer',
        border: `1px solid ${cert.borderColor}`,
        boxShadow: hovered
          ? `0 28px 80px rgba(0,0,0,0.35), 0 0 0 1px ${cert.borderColor}, 0 0 60px ${cert.shimmer}`
          : cert.prestige
            ? `0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px ${cert.borderColor}`
            : `0 8px 30px rgba(0,0,0,0.12), 0 0 0 1px ${cert.borderColor}`,
        transform: hovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        overflow: 'hidden',
        minHeight: cert.prestige ? '340px' : '300px',
        display: 'flex',
        flexDirection: 'column',
      }}>

      {/* Shimmer sweep on hover */}
      <div style={{
        position: 'absolute', top: 0, left: hovered ? '200%' : '-100%', width: '60%', height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
        transform: 'skewX(-20deg)',
        transition: 'left 0.6s ease',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Corner filigree ornaments */}
      <div style={{ position: 'absolute', top: '12px', left: '12px', width: '40px', height: '40px', borderTop: `1px solid ${cert.borderColor}`, borderLeft: `1px solid ${cert.borderColor}`, borderRadius: '4px 0 0 0', opacity: 0.8 }} />
      <div style={{ position: 'absolute', top: '12px', right: '12px', width: '40px', height: '40px', borderTop: `1px solid ${cert.borderColor}`, borderRight: `1px solid ${cert.borderColor}`, borderRadius: '0 4px 0 0', opacity: 0.8 }} />
      <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '40px', height: '40px', borderBottom: `1px solid ${cert.borderColor}`, borderLeft: `1px solid ${cert.borderColor}`, borderRadius: '0 0 0 4px', opacity: 0.8 }} />
      <div style={{ position: 'absolute', bottom: '12px', right: '12px', width: '40px', height: '40px', borderBottom: `1px solid ${cert.borderColor}`, borderRight: `1px solid ${cert.borderColor}`, borderRadius: '0 0 4px 0', opacity: 0.8 }} />

      {/* Inner card content */}
      <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', flex: 1, position: 'relative', zIndex: 2 }}>

        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'auto' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: cert.accentColor, marginBottom: '4px', opacity: 0.8 }}>
              {t('giftCert.card.label')}
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 400, color: cert.textColor, lineHeight: 1.2, fontStyle: 'italic' }}>
              {cert.label.startsWith('Spa Rivier') ? cert.label : `Spa Rivier ${cert.label}`}
            </p>
          </div>
          {/* Wax seal simulation */}
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%',
            background: cert.dark
              ? `radial-gradient(circle, ${cert.goldColor} 0%, ${cert.accentColor} 100%)`
              : `radial-gradient(circle, #e43e2d 0%, #b83020 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            flexShrink: 0,
          }}>
            <span style={{ color: cert.dark ? '#0f1a26' : '#313a4d', fontSize: '0.9rem' }}>✦</span>
          </div>
        </div>

        {/* Decorative divider */}
        <div style={{ margin: 'var(--space-lg) 0', height: '1px', background: `linear-gradient(to right, transparent, ${cert.borderColor}, transparent)` }} />

        {/* Amount — centrepiece */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: cert.prestige ? '3.8rem' : '3.2rem',
            fontWeight: 300,
            lineHeight: 1,
            color: cert.accentColor,
            textShadow: cert.dark
              ? `0 0 40px ${cert.shimmer}, 0 2px 8px rgba(0,0,0,0.5)`
              : `0 2px 8px rgba(0,0,0,0.08)`,
            letterSpacing: '-0.02em',
          }}>
            ${cert.amount}
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontStyle: 'italic', color: cert.dark ? 'rgba(255,255,255,0.5)' : cert.accentColor, marginTop: '6px', opacity: 0.8 }}>
            {cert.subtitle}
          </p>
        </div>

        {/* Barcode decoration */}
        <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', marginBottom: 'var(--space-md)', opacity: 0.35 }}>
          {Array.from({ length: 28 }, (_, i) => (
            <div key={i} style={{
              width: i % 5 === 0 ? '3px' : i % 3 === 0 ? '1.5px' : '1px',
              height: '20px',
              background: cert.dark ? cert.accentColor : cert.textColor,
              borderRadius: '1px',
            }} />
          ))}
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', letterSpacing: '0.18em', textAlign: 'center', color: cert.dark ? 'rgba(255,255,255,0.3)' : cert.accentColor, opacity: 0.6, marginBottom: 'var(--space-lg)' }}>
          {certNum}
        </p>

        {/* Divider */}
        <div style={{ height: '1px', background: `linear-gradient(to right, transparent, ${cert.borderColor}, transparent)`, marginBottom: 'var(--space-md)' }} />

        {/* Footer row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: cert.dark ? 'rgba(255,255,255,0.4)' : cert.accentColor, opacity: 0.7 }}>
              {t('giftCert.card.valid')}
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: cert.dark ? 'rgba(255,255,255,0.3)' : cert.accentColor, opacity: 0.5, marginTop: '2px' }}>
              {t('giftCert.card.services')}
            </p>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onPurchase(cert) }}
            style={{
              fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              padding: '8px 16px', borderRadius: 'var(--radius-full)',
              border: `1px solid ${cert.borderColor}`,
              background: cert.dark
                ? `rgba(255,255,255,0.08)`
                : `rgba(255,255,255,0.5)`,
              color: cert.accentColor,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              backdropFilter: 'blur(4px)',
            }}>
            {t('giftCert.card.purchase')}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Purchase modal ── */
const PENDING_KEY = 'sparivier.pendingCertificate'

function PurchaseModal({ cert, onClose }) {
  const { t } = useTranslation()
  // The code is emailed to the recipient; the buyer gets the printable certificate.
  const [form, setForm] = useState({ recipientName: '', recipientEmail: '', senderName: '', senderEmail: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const isCustom  = Boolean(cert?.custom)
  const payOnline = isCustom ? hasCustomCertificateLink() : hasCertificatePaymentLink(cert?.amount)

  if (!cert) return null

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setSaving(true)
    // Generate a unique certificate code
    const certCode = `LV-${cert.amount.toString().padStart(4, '0')}-${Math.floor(Math.random() * 9000 + 1000)}`
    const payUrl = !payOnline ? null
      : isCustom ? customCertificatePaymentUrl({ certCode, email: form.senderEmail })
      : certificatePaymentUrl(cert.amount, { certCode, email: form.senderEmail })
    if (supabase) {
      // A failed insert must never block the payment — Stripe carries certCode
      // as client_reference_id, so staff can reconcile the order either way.
      // Note the builder is a thenable without .catch, hence try/await/error.
      try {
        const { error } = await supabase.from('gift_orders').insert([{
          type:            'certificate',
          cert_code:       certCode,
          cert_amount:     cert.amount * 100,     // store in cents
          cert_label:      cert.label,
          amount:          cert.amount * 100,
          sender_name:     form.senderName,
          sender_email:    form.senderEmail,      // the certificate is emailed here
          recipient_name:  form.recipientName,
          recipient_email: form.recipientEmail,   // the code is emailed here
          message:         form.message,
          delivery:        'email',
          status:          'pending',             // becomes 'active' once payment confirmed
        }])
        if (error) console.error('[GiftCertificateSection] insert failed:', error)
      } catch (err) {
        console.error('[GiftCertificateSection] insert failed:', err)
      }
    }
    if (payUrl) {
      // Carried across the redirect so the return page can show the guest
      // a printable certificate next to the Stripe token.
      try {
        sessionStorage.setItem(PENDING_KEY, JSON.stringify({
          certCode, amount: cert.amount, label: cert.label,
          recipientName: form.recipientName, senderName: form.senderName, message: form.message,
        }))
      } catch { /* private browsing — the Stripe token alone still works */ }
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
            {isCustom ? t('giftCert.custom.heading') : `$${cert.amount} · ${cert.label}`}
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
                { name: 'recipientName',  label: t('giftCert.modal.recipient'),      type: 'text',  required: true },
                { name: 'recipientEmail', label: t('giftCert.modal.recipientEmail'), type: 'email', required: true },
                { name: 'senderName',     label: t('giftCert.modal.yourName'),       type: 'text',  required: true },
                { name: 'senderEmail',    label: t('giftCert.modal.yourEmail'),      type: 'email', required: true },
              ].map(f => (
                <div key={f.name} style={{ marginBottom: 'var(--space-md)' }}>
                  <label style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lavelle-gray-mid)', display: 'block', marginBottom: '6px' }}>
                    {f.label} {f.required && '*'}
                  </label>
                  <input type={f.type} name={f.name} value={form[f.name]} onChange={handle} required={f.required}
                    style={{ width: '100%', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', padding: '10px 14px', border: '1px solid var(--lavelle-cream)', borderRadius: 'var(--radius-md)', background: 'var(--lavelle-ivory)', color: 'var(--lavelle-charcoal)', outline: 'none', boxSizing: 'border-box' }} />
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
          <SectionHeader
            eyebrow={t('giftCert.section.eyebrow')}
            headline={t('giftCert.section.headline')}
            subtext={t('giftCert.section.sub')}
            align="center"
          />

          <div className="gift-certificate-grid" style={{ gap: 'var(--space-xl)', marginBottom: 'var(--space-2xl)' }}>
            {giftCertificates.map((cert, i) => (
              <div key={cert.amount} className={`slide-in-up-${Math.min(i + 1, 6)}`}>
                <CertificateCard cert={cert} onPurchase={setSelected} />
              </div>
            ))}
          </div>

          {/* Custom amount block */}
          <div style={{
            position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden',
            background: 'linear-gradient(135deg, var(--lavelle-plum-deep) 0%, #1a0530 100%)',
            padding: 'var(--space-2xl)', maxWidth: '680px', width: '100%', margin: '0 auto', boxSizing: 'border-box',
            border: '1px solid rgba(228,62,45,0.2)',
            boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '160px', height: '160px', borderRadius: '50%', border: '1px solid rgba(228,62,45,0.1)' }} />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)', marginBottom: 'var(--space-sm)' }}>{t('giftCert.custom.heading')}</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 300, color: 'var(--lavelle-white)', marginBottom: 'var(--space-md)', lineHeight: 1.3 }}>{t('giftCert.custom.sub')}</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: 'var(--space-lg)' }}>
              {t('giftCert.custom.body')}
            </p>
            <div className="cta-center">
              {/* Buy online once the "customer chooses the amount" link is set;
                  until then the block still works, by phone. */}
              {hasCustomCertificateLink() ? (
                <button className="btn-secondary"
                  onClick={() => setSelected({ amount: 0, label: 'Custom', custom: true })}>
                  {t('giftCert.custom.ctaOnline')}
                </button>
              ) : (
                <a href="tel:+12509928084" className="btn-secondary">{t('giftCert.custom.cta')}</a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Purchase modal */}
      {selected && <PurchaseModal cert={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
