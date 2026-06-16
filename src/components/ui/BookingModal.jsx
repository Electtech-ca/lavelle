import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const timeSlots = ['10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM']
const allServices = [
  'Berries With a Twist','Uplift & Refresh','Time Out','Refresh & Delight','Me TIME','Rebalance & Rejuvenate',
  'Personalized Massage (30 min)','Personalized Massage (60 min)','Personalized Massage (90 min)',
  'Personalized Eminence Organic Facial','Anti-Aging Custom Facial',
  "Women's Haircut & Style","Precision Cut & Blowout","Balayage & Highlights","Keratin Smoothing",
  'Full Lash Set','Brow Lamination','Signature Manicure','Spa Pedicure',
  'Day Makeup','Event Makeup',
]

export default function BookingModal({ isOpen, onClose, defaultService = '' }) {
  const { t } = useTranslation()
  const [form, setForm] = useState({ firstName:'', lastName:'', service: defaultService, date:'', time:'', phone:'', email:'', notes:'', payment:'in_store' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const firstRef = useRef(null)

  useEffect(() => {
    if (isOpen) { setSubmitted(false); setForm(f => ({ ...f, service: defaultService })); setTimeout(() => firstRef.current?.focus(), 50) }
  }, [isOpen, defaultService])

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  useEffect(() => { document.body.style.overflow = isOpen ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [isOpen])

  function change(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    if (supabase) {
      await supabase.from('bookings').insert([{ first_name: form.firstName, last_name: form.lastName, email: form.email, phone: form.phone, service: form.service, booking_date: form.date, booking_time: form.time, notes: form.notes, payment_method: form.payment }])
    }
    setLoading(false)
    setSubmitted(true)
  }

  if (!isOpen) return null

  const inp = { width:'100%', padding:'12px 16px', border:'1px solid var(--lavelle-cream)', borderRadius:'var(--radius-md)', fontFamily:'var(--font-body)', fontSize:'var(--text-small)', color:'var(--lavelle-charcoal)', background:'var(--lavelle-blush)', outline:'none' }
  const lbl = { display:'block', fontFamily:'var(--font-body)', fontSize:'var(--text-micro)', fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--lavelle-gray-mid)', marginBottom:'6px' }

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(49,58,77,0.75)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'var(--space-md)', backdropFilter:'blur(4px)' }}>
      <div onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Book an appointment"
        style={{ background:'var(--lavelle-white)', borderRadius:'var(--radius-xl)', boxShadow:'var(--shadow-modal)', width:'100%', maxWidth:'560px', maxHeight:'90vh', overflowY:'auto', padding:'var(--space-2xl)', position:'relative' }}>
        <button onClick={onClose} aria-label="Close" style={{ position:'absolute', top:'var(--space-lg)', right:'var(--space-lg)', background:'var(--lavelle-plum-whisper)', border:'none', borderRadius:'50%', width:'36px', height:'36px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--lavelle-plum-mid)' }}>
          <X size={16} />
        </button>
        <p style={{ fontFamily:'var(--font-body)', fontSize:'var(--text-micro)', fontWeight:500, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--lavelle-gold-champagne)', marginBottom:'var(--space-xs)' }}>{t('booking.header')}</p>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:'var(--text-h2)', fontWeight:300, color:'var(--lavelle-plum-deep)', marginBottom:'var(--space-xl)' }}>{t('booking.heading')}</h2>

        {submitted ? (
          <div style={{ textAlign:'center', padding:'var(--space-2xl) 0' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:'var(--space-md)' }}>✦</div>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', fontWeight:300, color:'var(--lavelle-plum-deep)', marginBottom:'var(--space-md)' }}>{t('booking.success.title', { name: form.firstName })}</h3>
            <p style={{ fontFamily:'var(--font-body)', color:'var(--lavelle-gray-mid)', lineHeight:1.7 }}>{t('booking.success.sub1')}</p>
            <p style={{ fontFamily:'var(--font-body)', color:'var(--lavelle-gray-mid)', lineHeight:1.7, marginTop:'var(--space-sm)' }}>{t('booking.success.sub2')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-md)', marginBottom:'var(--space-md)' }}>
              <div><label style={lbl} htmlFor="bm-fn">{t('booking.form.firstName')}</label><input ref={firstRef} id="bm-fn" name="firstName" required style={inp} value={form.firstName} onChange={change} /></div>
              <div><label style={lbl} htmlFor="bm-ln">{t('booking.form.lastName')}</label><input id="bm-ln" name="lastName" required style={inp} value={form.lastName} onChange={change} /></div>
            </div>
            <div style={{ marginBottom:'var(--space-md)' }}>
              <label style={lbl} htmlFor="bm-svc">{t('booking.form.service')}</label>
              <select id="bm-svc" name="service" required style={{ ...inp, cursor:'pointer' }} value={form.service} onChange={change}>
                <option value="">{t('booking.form.selectService')}</option>
                {allServices.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-md)', marginBottom:'var(--space-md)' }}>
              <div><label style={lbl} htmlFor="bm-dt">{t('booking.form.date')}</label><input id="bm-dt" name="date" type="date" required style={inp} value={form.date} onChange={change} min={new Date().toISOString().split('T')[0]} /></div>
              <div><label style={lbl} htmlFor="bm-tm">{t('booking.form.time')}</label>
                <select id="bm-tm" name="time" required style={{ ...inp, cursor:'pointer' }} value={form.time} onChange={change}>
                  <option value="">{t('booking.form.selectTime')}</option>
                  {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-md)', marginBottom:'var(--space-md)' }}>
              <div><label style={lbl} htmlFor="bm-ph">{t('booking.form.phone')}</label><input id="bm-ph" name="phone" type="tel" required style={inp} value={form.phone} onChange={change} /></div>
              <div><label style={lbl} htmlFor="bm-em">{t('booking.form.email')}</label><input id="bm-em" name="email" type="email" required style={inp} value={form.email} onChange={change} /></div>
            </div>
            <div style={{ marginBottom:'var(--space-md)' }}>
              <label style={lbl}>{t('booking.payment.title')}</label>
              <div style={{ display:'flex', gap:'var(--space-md)' }}>
                {[['in_store', t('booking.payment.inStore')], ['online', t('booking.payment.online')]].map(([val, label]) => (
                  <label key={val} style={{ display:'flex', alignItems:'center', gap:'var(--space-sm)', fontFamily:'var(--font-body)', fontSize:'var(--text-small)', cursor:'pointer' }}>
                    <input type="radio" name="payment" value={val} checked={form.payment === val} onChange={change} />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ marginBottom:'var(--space-xl)' }}>
              <label style={lbl} htmlFor="bm-nt">{t('booking.form.notes')}</label>
              <textarea id="bm-nt" name="notes" rows={3} style={{ ...inp, resize:'vertical', minHeight:'80px' }} value={form.notes} onChange={change} placeholder={t('booking.form.notesPlaceholder')} />
            </div>
            <button type="submit" className="btn-primary" style={{ width:'100%', justifyContent:'center', padding:'16px' }} disabled={loading}>
              {loading ? t('booking.cta.submitting') : t('booking.cta.submit')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
