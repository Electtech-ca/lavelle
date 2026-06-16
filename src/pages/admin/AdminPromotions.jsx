import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { supabase } from '../../lib/supabase'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

const EMPTY_FORM = {
  title:       '',
  description: '',
  value:       '',
  expiry:      '',
  active:      true,
  sort_order:  '0',
}

function validate(f) {
  const errs = {}
  if (!f.title.trim())       errs.title       = 'Title is required'
  if (!f.description.trim()) errs.description = 'Description is required'
  if (!f.value.trim())       errs.value       = 'Value is required (e.g. 20% off)'
  if (!f.expiry.trim())      errs.expiry      = 'Expiry is required (e.g. Ongoing, Weekly)'
  return errs
}

export default function AdminPromotions() {
  const [promos,     setPromos]     = useState([])
  const [loading,    setLoading]    = useState(true)
  const [modalOpen,  setModalOpen]  = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form,       setForm]       = useState(EMPTY_FORM)
  const [errors,     setErrors]     = useState({})
  const [saving,     setSaving]     = useState(false)
  const [saveError,  setSaveError]  = useState('')
  const [deleteId,   setDeleteId]   = useState(null)
  const [deleting,   setDeleting]   = useState(false)

  // ── Load ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.from('promotions').select('*').order('sort_order')
      .then(({ data, error }) => {
        if (error) console.error('[AdminPromotions]', error.message)
        setPromos(data || [])
        setLoading(false)
      })
      .catch(err => { console.error('[AdminPromotions] fetch failed:', err); setLoading(false) })
  }, [])

  // ── Modal helpers ─────────────────────────────────────────────────────────
  function openAdd() {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setSaveError('')
    setModalOpen(true)
  }

  function openEdit(p) {
    setEditTarget(p)
    setForm({
      title:       p.title,
      description: p.description,
      value:       p.value,
      expiry:      p.expiry,
      active:      p.active,
      sort_order:  String(p.sort_order ?? 0),
    })
    setErrors({})
    setSaveError('')
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setSaveError('')
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    setErrors(err => ({ ...err, [name]: undefined }))
  }

  async function handleSave(e) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    setSaveError('')

    const payload = {
      title:       form.title.trim(),
      description: form.description.trim(),
      value:       form.value.trim(),
      expiry:      form.expiry.trim(),
      active:      form.active,
      sort_order:  Number(form.sort_order) || 0,
    }

    let result
    if (editTarget) {
      result = await supabase.from('promotions').update(payload).eq('id', editTarget.id).select().single()
      if (!result.error) setPromos(prev => prev.map(p => p.id === editTarget.id ? result.data : p))
    } else {
      result = await supabase.from('promotions').insert([payload]).select().single()
      if (!result.error) setPromos(prev => [...prev, result.data])
    }

    setSaving(false)
    if (result.error) { setSaveError(result.error.message) } else { closeModal() }
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    const { error } = await supabase.from('promotions').delete().eq('id', deleteId)
    if (error) { alert('Delete failed: ' + error.message) } else {
      setPromos(prev => prev.filter(p => p.id !== deleteId))
    }
    setDeleting(false)
    setDeleteId(null)
  }

  const inputStyle = (err) => ({ width: '100%', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', padding: '10px 14px', border: `1px solid ${err ? '#C0392B' : 'var(--lavelle-cream)'}`, borderRadius: 'var(--radius-md)', outline: 'none', background: 'var(--lavelle-ivory)', color: 'var(--lavelle-charcoal)', boxSizing: 'border-box' })
  const labelStyle = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--lavelle-plum-deep)', display: 'block', marginBottom: '6px' }
  const errStyle   = { fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: '#C0392B', marginTop: '4px' }

  return (
    <AdminLayout title="Promotions">

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
        <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-md) var(--space-lg)', boxShadow: 'var(--shadow-card)', display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 300, color: 'var(--lavelle-plum-deep)', lineHeight: 1 }}>{promos.length}</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)' }}>Promotions</p>
        </div>
        <button onClick={openAdd} className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', marginLeft: 'auto' }}>
          <Plus size={15} /> Add Promotion
        </button>
      </div>

      {/* Promo cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--lavelle-gray-mid)' }}>Loading promotions…</p>
        </div>
      ) : promos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--lavelle-plum-soft)' }}>No promotions yet — click "Add Promotion" to create one.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-xl)' }}>
          {promos.map(promo => (
            <div key={promo.id} style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)', boxShadow: 'var(--shadow-card)', borderTop: `4px solid ${promo.active ? 'var(--lavelle-gold-champagne)' : 'var(--lavelle-cream)'}`, display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-sm)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)', flex: 1 }}>{promo.title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 700, background: 'var(--lavelle-gold-shimmer)', color: 'var(--lavelle-gold-deep)', padding: '3px 10px', borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}>{promo.value}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: promo.active ? 'rgba(46,125,94,0.1)' : 'rgba(192,57,43,0.08)', color: promo.active ? '#2E7D5E' : '#C0392B' }}>
                    {promo.active ? 'Active' : 'Hidden'}
                  </span>
                </div>
              </div>

              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', lineHeight: 1.7, flex: 1 }}>{promo.description}</p>

              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)' }}>
                Valid: {promo.expiry}
              </p>

              <div style={{ display: 'flex', gap: '6px', paddingTop: 'var(--space-sm)', borderTop: '1px solid var(--lavelle-cream)' }}>
                <button onClick={() => openEdit(promo)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '0.72rem', padding: '7px', borderRadius: 'var(--radius-md)', border: '1px solid var(--lavelle-plum-soft)', background: 'none', color: 'var(--lavelle-plum-soft)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => setDeleteId(promo.id)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '0.72rem', padding: '7px', borderRadius: 'var(--radius-md)', border: '1px solid var(--lavelle-alert)', background: 'none', color: 'var(--lavelle-alert)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 800, background: 'rgba(25,12,4,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-xl)' }}
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-float)', width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-xl)', borderBottom: '1px solid var(--lavelle-cream)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)' }}>
                {editTarget ? 'Edit Promotion' : 'Add New Promotion'}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--lavelle-gray-mid)', display: 'flex' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSave} style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

              <div>
                <label style={labelStyle}>Title <span style={{ color: '#C0392B' }}>*</span></label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. The Birthday Ritual" style={inputStyle(errors.title)} />
                {errors.title && <p style={errStyle}>{errors.title}</p>}
              </div>

              <div>
                <label style={labelStyle}>Description <span style={{ color: '#C0392B' }}>*</span></label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="What the promotion offers and any conditions…" style={{ ...inputStyle(errors.description), resize: 'vertical', lineHeight: 1.6 }} />
                {errors.description && <p style={errStyle}>{errors.description}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                <div>
                  <label style={labelStyle}>Value <span style={{ color: '#C0392B' }}>*</span></label>
                  <input name="value" value={form.value} onChange={handleChange} placeholder="20% off" style={inputStyle(errors.value)} />
                  {errors.value && <p style={errStyle}>{errors.value}</p>}
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--lavelle-gray-mid)', marginTop: '4px' }}>Shown as the badge on the card</p>
                </div>
                <div>
                  <label style={labelStyle}>Valid / Expiry <span style={{ color: '#C0392B' }}>*</span></label>
                  <input name="expiry" value={form.expiry} onChange={handleChange} placeholder="Ongoing, Weekly, Birthday month…" style={inputStyle(errors.expiry)} />
                  {errors.expiry && <p style={errStyle}>{errors.expiry}</p>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 'var(--space-lg)', alignItems: 'center' }}>
                <div>
                  <label style={labelStyle}>Sort Order</label>
                  <input name="sort_order" value={form.sort_order} onChange={handleChange} type="number" min="0" style={inputStyle(false)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', paddingTop: '22px' }}>
                  <input type="checkbox" name="active" id="promo-active" checked={form.active} onChange={handleChange}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--lavelle-plum-deep)', cursor: 'pointer' }} />
                  <label htmlFor="promo-active" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', cursor: 'pointer' }}>
                    Active — visible on the website
                  </label>
                </div>
              </div>

              {saveError && (
                <div style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.25)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#C0392B' }}>{saveError}</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'flex-end', paddingTop: 'var(--space-sm)' }}>
                <button type="button" onClick={closeModal} className="btn-secondary" style={{ fontSize: '0.8rem' }}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving} style={{ fontSize: '0.8rem', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Saving…' : editTarget ? 'Save Changes' : 'Add Promotion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete confirmation ── */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 900, background: 'rgba(25,12,4,0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-xl)' }}>
          <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-float)', padding: 'var(--space-2xl)', maxWidth: '420px', width: '100%', textAlign: 'center' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(192,57,43,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-lg)' }}>
              <Trash2 size={22} color="#C0392B" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-sm)' }}>Delete Promotion?</h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', marginBottom: 'var(--space-xl)', lineHeight: 1.6 }}>
              This will permanently remove this promotion from the website.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
              <button onClick={() => setDeleteId(null)} className="btn-secondary" style={{ fontSize: '0.8rem' }} disabled={deleting}>Cancel</button>
              <button onClick={handleDelete} disabled={deleting}
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 600, padding: '10px 24px', borderRadius: 'var(--radius-full)', border: 'none', background: '#C0392B', color: 'white', cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.7 : 1 }}>
                {deleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
