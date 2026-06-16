import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'

export default function NewsletterSignup() {
  const { t, i18n } = useTranslation()
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    if (supabase) {
      await supabase.from('newsletter_subscribers').upsert([{ email, language: i18n.language }], { onConflict: 'email' })
    }
    setJoined(true)
  }

  return (
    <section style={{ background:'var(--lavelle-plum-mid)', padding:'var(--space-3xl) var(--space-xl)', textAlign:'center' }}>
      <div style={{ maxWidth:'520px', margin:'0 auto' }}>
        <p style={{ fontFamily:'var(--font-body)', fontSize:'var(--text-micro)', fontWeight:500, letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--lavelle-gold-champagne)', marginBottom:'var(--space-sm)' }}>{t('newsletter.eyebrow')}</p>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:'var(--text-h2)', fontWeight:300, color:'var(--lavelle-white)', marginBottom:'var(--space-md)', lineHeight:1.2 }}>{t('newsletter.headline')}</h2>
        <p style={{ fontFamily:'var(--font-body)', fontWeight:300, fontSize:'var(--text-body)', color:'rgba(255,255,255,0.7)', marginBottom:'var(--space-xl)', lineHeight:1.7 }}>{t('newsletter.sub')}</p>
        {joined ? (
          <p style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', fontStyle:'italic', color:'var(--lavelle-gold-champagne)' }}>{t('newsletter.joined')}</p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display:'flex', gap:'var(--space-sm)', flexWrap:'wrap', justifyContent:'center' }}>
            <input type="email" required placeholder={t('newsletter.placeholder')} value={email} onChange={e => setEmail(e.target.value)} aria-label="Email address"
              style={{ flex:'1 1 260px', maxWidth:'320px', padding:'14px 20px', border:'1px solid rgba(228,62,45,0.3)', borderRadius:'var(--radius-full)', background:'rgba(255,255,255,0.08)', color:'var(--lavelle-white)', fontFamily:'var(--font-body)', fontSize:'var(--text-small)', outline:'none' }} />
            <button type="submit" className="btn-primary">{t('cta.join')}</button>
          </form>
        )}
        <p style={{ fontFamily:'var(--font-body)', fontSize:'var(--text-micro)', color:'rgba(255,255,255,0.35)', marginTop:'var(--space-md)' }}>{t('newsletter.privacy')}</p>
      </div>
    </section>
  )
}
