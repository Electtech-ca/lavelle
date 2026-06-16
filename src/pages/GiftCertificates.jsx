import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SectionHeader    from '../components/ui/SectionHeader'
import GoldDivider      from '../components/ui/GoldDivider'
import NewsletterSignup from '../components/sections/NewsletterSignup'
import { supabase }     from '../lib/supabase'
import { giftCertificates } from '../data/giftsData'

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
              Sparivier {cert.label}
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
function PurchaseModal({ cert, onClose }) {
  const { t } = useTranslation()
  const [form, setForm] = useState({ recipientName: '', recipientEmail: '', senderName: '', message: '', delivery: 'email' })
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)

  if (!cert) return null

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setSaving(true)
    // Generate a unique certificate code
    const certCode = `LV-${cert.amount.toString().padStart(4, '0')}-${Math.floor(Math.random() * 9000 + 1000)}`
    if (supabase) {
      await supabase.from('gift_orders').insert([{
        type:            'certificate',
        cert_code:       certCode,
        cert_amount:     cert.amount * 100,     // store in cents
        cert_label:      cert.label,
        amount:          cert.amount * 100,
        sender_name:     form.senderName,
        sender_email:    form.senderName,       // filled at payment step; placeholder for now
        recipient_name:  form.recipientName,
        recipient_email: form.recipientEmail || '',
        message:         form.message,
        delivery:        form.delivery,
        status:          'pending',             // becomes 'active' once payment confirmed
      }]).catch(err => console.error('[GiftCertificates] insert failed:', err))
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
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, color: 'var(--lavelle-white)' }}>${cert.amount} · {cert.label}</p>
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
                { name: 'recipientEmail', label: t('giftCert.modal.recipientEmail'),  type: 'email', required: false },
                { name: 'senderName',     label: t('giftCert.modal.yourName'),        type: 'text',  required: true },
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

              <div style={{ marginBottom: 'var(--space-xl)' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lavelle-gray-mid)', marginBottom: '10px' }}>{t('giftCert.modal.delivery')}</p>
                {[
                  { val: 'email',    label: t('giftCert.modal.digital') },
                  { val: 'physical', label: t('giftCert.modal.physical') },
                ].map(d => (
                  <label key={d.val} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', cursor: 'pointer', marginBottom: '8px' }}>
                    <input type="radio" name="delivery" value={d.val} checked={form.delivery === d.val} onChange={handle} style={{ accentColor: 'var(--lavelle-plum-deep)' }} />
                    {d.label}
                  </label>
                ))}
              </div>

              {/* Payment note */}
              <div style={{ background: 'var(--lavelle-plum-whisper)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', marginBottom: 'var(--space-lg)', border: '1px solid rgba(49,58,77,0.1)' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)', lineHeight: 1.7 }}>
                  {t('giftCert.modal.note')}
                </p>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', opacity: saving ? 0.7 : 1 }} disabled={saving}>
                {saving ? '…' : t('giftCert.modal.cta')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function GiftCertificates() {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(null)

  return (
    <>
      {/* ── Page hero ── */}
      <div style={{ position: 'relative', height: '68vh', minHeight: '480px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <img
          src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1920&h=1080&fit=crop&q=85"
          alt="Sparivier Gift Certificates — elegant wrapped gifts with ribbon" loading="eager"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(15,20,35,0.82) 0%, rgba(49,58,77,0.6) 60%, rgba(15,20,35,0.78) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)' }} />

        {/* Animated decorative rings */}
        <div style={{ position: 'absolute', top: '15%', left: '8%', width: '120px', height: '120px', borderRadius: '50%', border: '1px solid rgba(228,62,45,0.15)', animation: 'float 7s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '12%', width: '80px', height: '80px', borderRadius: '50%', border: '1px solid rgba(228,62,45,0.2)', animation: 'float 5s ease-in-out infinite reverse' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '720px', padding: 'calc(72px + var(--space-xl)) var(--space-xl) var(--space-xl)' }}>
          <p className="slide-in-up-1" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)', marginBottom: 'var(--space-md)' }}>
            ✦ {t('giftCert.hero.eyebrow')}
          </p>
          <h1 className="slide-in-up-2" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h1)', fontWeight: 300, color: 'var(--lavelle-white)', lineHeight: 1.1, marginBottom: 'var(--space-md)', textShadow: '0 2px 30px rgba(0,0,0,0.5)', whiteSpace: 'pre-line' }}>
            {t('giftCert.hero.headline')}
          </h1>
          <p className="slide-in-up-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '1.15rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.8 }}>
            {t('giftCert.hero.sub')}
          </p>
        </div>
      </div>

      {/* ── How it works ── */}
      <div style={{ background: 'var(--lavelle-plum-deep)', padding: 'var(--space-2xl) var(--space-xl)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-xl)', textAlign: 'center' }}>
          {[
            { step: '01', label: t('giftCert.steps.step1'), icon: '💎' },
            { step: '02', label: t('giftCert.steps.step2'), icon: '✍️' },
            { step: '03', label: t('giftCert.steps.step3'), icon: '🛁' },
            { step: '04', label: t('giftCert.steps.step4'), icon: '✦' },
          ].map(s => (
            <div key={s.step} className="slide-in-up">
              <p style={{ fontSize: '1.6rem', marginBottom: 'var(--space-sm)' }}>{s.icon}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(228,62,45,0.6)', marginBottom: '6px' }}>{t('steps.label', { n: s.step })}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(255,255,255,0.8)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Certificate cards ── */}
      <section style={{ background: 'var(--lavelle-ivory)', padding: 'var(--space-3xl) var(--space-xl)' }}>
        <div className="container">
          <SectionHeader
            eyebrow={t('giftCert.section.eyebrow')}
            headline={t('giftCert.section.headline')}
            subtext={t('giftCert.section.sub')}
            align="center"
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-xl)', marginBottom: 'var(--space-2xl)' }}>
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
            padding: 'var(--space-2xl)', maxWidth: '680px',
            border: '1px solid rgba(228,62,45,0.2)',
            boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '160px', height: '160px', borderRadius: '50%', border: '1px solid rgba(228,62,45,0.1)' }} />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)', marginBottom: 'var(--space-sm)' }}>{t('giftCert.custom.heading')}</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 300, color: 'var(--lavelle-white)', marginBottom: 'var(--space-md)', lineHeight: 1.3 }}>{t('giftCert.custom.sub')}</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: 'var(--space-lg)' }}>
              {t('giftCert.custom.body')}
            </p>
            <a href="tel:+12509928084" className="btn-secondary" style={{ display: 'inline-block' }}>{t('giftCert.custom.cta')}</a>
          </div>
        </div>
      </section>

      <GoldDivider />
      <NewsletterSignup />

      {/* Purchase modal */}
      {selected && <PurchaseModal cert={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
