import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Printer, Home } from 'lucide-react'
import CertificateSheet from '../components/ui/CertificateSheet'
import { certificateTier } from '../data/giftsData'
import { fetchCertificate } from '../lib/certificates'

/* ──────────────────────────────────────────────────────────────
   Where Stripe returns a guest after paying for a certificate.

   Stripe substitutes the real session id into the {CHECKOUT_SESSION_ID}
   placeholder on the Payment Link's success URL, so it arrives here as
   ?session_id=cs_… We keep that token but never show it: it is long,
   meaningless to the guest, and the certificate code is what the spa
   actually redeems. Staff match a payment to an order in Stripe by the
   certificate code, which rides along in client_reference_id.

   This page deliberately writes NOTHING to the database. The session id
   arrives in a URL the guest controls, so trusting it far enough to
   store it would mean opening an anonymous UPDATE on gift_orders that
   anyone could post a forged token to. It only reads, through the same
   code + token lookup as the emailed certificate link.

   The certificate below is the printable artefact: it renders in the
   tier's own colours and is the only thing @media print keeps.
   ────────────────────────────────────────────────────────────── */

const PENDING_KEY = 'sparivier.pendingCertificate'

export default function CertificateConfirmed() {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const [pending, setPending] = useState(null)
  const [paidCents, setPaidCents] = useState(null)

  const paid = Boolean(params.get('session_id'))

  useEffect(() => {
    window.scrollTo(0, 0)
    // Stashed by the purchase modal just before the redirect to Stripe.
    try {
      const raw = sessionStorage.getItem(PENDING_KEY)
      if (raw) {
        setPending(JSON.parse(raw))
        sessionStorage.removeItem(PENDING_KEY)
      }
    } catch {
      /* private browsing, or cleared storage — the certificate is emailed too */
    }
  }, [])

  // A custom amount is typed on Stripe's page, so it is only known here once
  // the webhook has recorded the payment, usually within seconds. Ask a few
  // times; until then the certificate reads "As paid".
  useEffect(() => {
    if (!pending?.token || Number(pending.amount) > 0) return
    let timer, left = 8
    const ask = async () => {
      try {
        const c = await fetchCertificate(pending.certCode, pending.token)
        if (c?.status === 'active' && c.face_cents > 0) return setPaidCents(c.face_cents)
      } catch { /* a network hiccup: ask again */ }
      if (--left > 0) timer = setTimeout(ask, 2500)
    }
    ask()
    return () => { left = 0; clearTimeout(timer) }
  }, [pending])

  const amount = Number(pending?.amount) > 0 ? Number(pending.amount)
    : paidCents ? paidCents / 100
    : null

  return (
    <>
      <div className="no-print" style={{ background: 'linear-gradient(135deg, #2E3350 0%, #1a1f3a 100%)', padding: 'calc(72px + var(--space-xl)) var(--space-xl) var(--space-2xl)', textAlign: 'center' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(46,125,94,0.2)', border: '2px solid #2E7D5E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-lg)', fontSize: '1.5rem', color: '#2E7D5E' }}>✓</div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2E7D5E', marginBottom: 'var(--space-sm)' }}>
          {t('certConfirm.status')}
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 300, color: 'var(--lavelle-white)', marginBottom: 'var(--space-md)', lineHeight: 1.2 }}>
          {t('certConfirm.heading')}
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(255,255,255,0.72)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.75 }}>
          {t('certConfirm.sub')}
        </p>
      </div>

      <section style={{ background: 'var(--lavelle-white)', padding: 'var(--space-2xl) var(--space-xl)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>

          {pending ? (
            <CertificateSheet
              cert={certificateTier(amount ?? 0)}
              amount={amount}
              code={pending.certCode}
              recipientName={pending.recipientName}
              senderName={pending.senderName}
              message={pending.message}
            />
          ) : (
            <div style={{ border: '1px solid var(--lavelle-cream)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)', boxShadow: 'var(--shadow-card)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', lineHeight: 1.75 }}>
                {paid ? t('certConfirm.noDetails') : t('certConfirm.noRef')}
              </p>
            </div>
          )}

          <div className="no-print" style={{ background: 'var(--lavelle-plum-whisper)', borderRadius: 'var(--radius-md)', padding: 'var(--space-lg)', border: '1px solid rgba(49,58,77,0.1)', marginTop: 'var(--space-xl)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', lineHeight: 1.75 }}>
              <strong style={{ color: 'var(--lavelle-plum-deep)' }}>{t('certConfirm.redeem.label')}</strong>{' '}
              {t('certConfirm.redeem.note')}{' '}
              <a href="tel:+12509928084" style={{ color: 'var(--lavelle-plum-soft)' }}>250-992-8084</a>.
            </p>
          </div>

          <div className="no-print" style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap', marginTop: 'var(--space-xl)' }}>
            <button onClick={() => window.print()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Printer size={16} /> {t('certConfirm.print')}
            </button>
            <Link to="/giftware" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <Home size={16} /> {t('certConfirm.back')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
