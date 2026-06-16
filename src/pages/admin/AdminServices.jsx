import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { supabase } from '../../lib/supabase'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

const CATEGORIES = ['spa', 'salon']

const SUBCATEGORIES = {
  spa:   ['package', 'massage', 'organic_facial', 'waxing', 'nails', 'lashes', 'makeup'],
  salon: ['cuts_styles', 'colour', 'nails', 'lashes', 'makeup', 'keratin'],
}

const SUBCATEGORY_LABELS = {
  package:        'Spa Packages',
  massage:        'Massage',
  organic_facial: 'Organic Facials',
  waxing:         'Waxing',
  cuts_styles:    'Cuts & Styles',
  colour:         'Colour Services',
  nails:          'Nails',
  lashes:         'Lashes & Brows',
  makeup:         'Makeup',
  keratin:        'Keratin / Treatments',
}

const EMPTY_FORM = {
  category:    'spa',
  subcategory: 'package',
  name:        '',
  price:       '',
  price_cents: '',
  description: '',
  duration:    '',
  active:      true,
  sort_order:  '0',
}

function validate(f) {
  const errs = {}
  if (!f.name.trim())  errs.name  = 'Service name is required'
  if (!f.price.trim()) errs.price = 'Display price is required (e.g. $90 or $90+)'
  if (f.price_cents !== '' && (isNaN(Number(f.price_cents)) || Number(f.price_cents) < 0))
    errs.price_cents = 'Must be a non-negative number (or leave blank for "from" price)'
  return errs
}

export default function AdminServices() {
  const [services,    setServices]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [catFilter,   setCatFilter]   = useState('all')
  const [search,      setSearch]      = useState('')
  const [modalOpen,   setModalOpen]   = useState(false)
  const [editTarget,  setEditTarget]  = useState(null)
  const [form,        setForm]        = useState(EMPTY_FORM)
  const [errors,      setErrors]      = useState({})
  const [saving,      setSaving]      = useState(false)
  const [saveError,   setSaveError]   = useState('')
  const [deleteId,    setDeleteId]    = useState(null)
  const [deleting,    setDeleting]    = useState(false)

  // ── Load ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase
      .from('services')
      .select('*')
      .order('category')
      .order('sort_order')
      .then(({ data, error }) => {
        if (error) console.error('[AdminServices]', error.message)
        setServices(data || [])
        setLoading(false)
      })
      .catch(err => { console.error('[AdminServices] fetch failed:', err); setLoading(false) })
  }, [])

  // ── Modal helpers ─────────────────────────────────────────────────────────
  function openAdd() {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setSaveError('')
    setModalOpen(true)
  }

  function openEdit(svc) {
    setEditTarget(svc)
    setForm({
      category:    svc.category,
      subcategory: svc.subcategory,
      name:        svc.name,
      price:       svc.price,
      price_cents: svc.price_cents != null ? String(svc.price_cents) : '',
      description: svc.description || '',
      duration:    svc.duration    || '',
      active:      svc.active,
      sort_order:  String(svc.sort_order ?? 0),
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
    // Reset subcategory when category changes
    if (name === 'category') {
      setForm(f => ({ ...f, category: value, subcategory: SUBCATEGORIES[value][0] }))
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    setSaveError('')

    const payload = {
      category:    form.category,
      subcategory: form.subcategory,
      name:        form.name.trim(),
      price:       form.price.trim(),
      price_cents: form.price_cents !== '' ? Number(form.price_cents) : null,
      description: form.description.trim(),
      duration:    form.duration.trim(),
      active:      form.active,
      sort_order:  Number(form.sort_order) || 0,
    }

    let result
    if (editTarget) {
      result = await supabase.from('services').update(payload).eq('id', editTarget.id).select().single()
      if (!result.error) {
        setServices(prev => prev.map(s => s.id === editTarget.id ? result.data : s))
      }
    } else {
      result = await supabase.from('services').insert([payload]).select().single()
      if (!result.error) {
        setServices(prev => [...prev, result.data])
      }
    }

    setSaving(false)
    if (result.error) {
      setSaveError(result.error.message)
    } else {
      closeModal()
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    const { error } = await supabase.from('services').delete().eq('id', deleteId)
    if (error) {
      alert('Delete failed: ' + error.message)
    } else {
      setServices(prev => prev.filter(s => s.id !== deleteId))
    }
    setDeleting(false)
    setDeleteId(null)
  }

  // ── Filtering ─────────────────────────────────────────────────────────────
  const filtered = services.filter(s => {
    if (catFilter !== 'all' && s.category !== catFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return s.name.toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q)
    }
    return true
  })

  // Group by category → subcategory
  const grouped = {}
  filtered.forEach(s => {
    const cat = s.category
    const sub = s.subcategory
    if (!grouped[cat]) grouped[cat] = {}
    if (!grouped[cat][sub]) grouped[cat][sub] = []
    grouped[cat][sub].push(s)
  })

  // ── Styles ────────────────────────────────────────────────────────────────
  const thStyle = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lavelle-gray-mid)', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid var(--lavelle-cream)', whiteSpace: 'nowrap' }
  const tdStyle = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', padding: '11px 14px', borderBottom: '1px solid var(--lavelle-cream)', verticalAlign: 'middle' }
  const inputStyle = (err) => ({ width: '100%', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', padding: '10px 14px', border: `1px solid ${err ? '#C0392B' : 'var(--lavelle-cream)'}`, borderRadius: 'var(--radius-md)', outline: 'none', background: 'var(--lavelle-ivory)', color: 'var(--lavelle-charcoal)', boxSizing: 'border-box' })
  const labelStyle = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--lavelle-plum-deep)', display: 'block', marginBottom: '6px' }
  const errStyle   = { fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: '#C0392B', marginTop: '4px' }

  return (
    <AdminLayout title="Services & Pricing">

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>

        {/* Category filter pills */}
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          {['all', 'spa', 'salon'].map(f => (
            <button key={f} onClick={() => setCatFilter(f)}
              style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 500, padding: '8px 18px', borderRadius: 'var(--radius-full)', border: '1px solid', borderColor: catFilter === f ? 'var(--lavelle-plum-deep)' : 'var(--lavelle-cream)', background: catFilter === f ? 'var(--lavelle-plum-deep)' : 'var(--lavelle-white)', color: catFilter === f ? 'var(--lavelle-white)' : 'var(--lavelle-gray-mid)', cursor: 'pointer', textTransform: 'capitalize' }}>
              {f === 'all' ? 'All Services' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Search */}
        <input type="search" placeholder="Search services…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle(false), flex: '1 1 200px', maxWidth: '300px' }} />

        {/* Stat */}
        <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-md) var(--space-lg)', boxShadow: 'var(--shadow-card)', display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 300, color: 'var(--lavelle-plum-deep)', lineHeight: 1 }}>{services.length}</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)' }}>Services</p>
        </div>

        {/* Add button */}
        <button onClick={openAdd} className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', marginLeft: 'auto' }}>
          <Plus size={15} /> Add Service
        </button>
      </div>

      {/* ── Tables grouped by category / subcategory ── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--lavelle-gray-mid)' }}>Loading services…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--lavelle-plum-soft)' }}>
            {search ? 'No services match your search.' : 'No services yet — click "Add Service" to begin.'}
          </p>
        </div>
      ) : (
        Object.entries(grouped).map(([cat, subs]) => (
          <div key={cat} style={{ marginBottom: 'var(--space-2xl)' }}>

            {/* Category header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)', textTransform: 'capitalize' }}>
                {cat === 'spa' ? '✦ Spa' : '✂ Salon'}
              </h2>
              <div style={{ flex: 1, height: '1px', background: 'var(--lavelle-cream)' }} />
            </div>

            {Object.entries(subs).map(([sub, items]) => (
              <div key={sub} style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)', overflow: 'hidden', marginBottom: 'var(--space-lg)' }}>

                {/* Subcategory header */}
                <div style={{ padding: 'var(--space-md) var(--space-xl)', borderBottom: '1px solid var(--lavelle-cream)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--lavelle-ivory)' }}>
                  <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lavelle-plum-mid)' }}>
                    {SUBCATEGORY_LABELS[sub] || sub}
                  </h3>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)' }}>{items.length} service{items.length !== 1 ? 's' : ''}</span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['Service Name', 'Price', 'Duration', 'Description', 'Status', 'Actions'].map(h => (
                          <th key={h} style={thStyle}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(svc => (
                        <tr key={svc.id}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--lavelle-ivory)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          style={{ transition: 'background 0.15s' }}>

                          <td style={{ ...tdStyle, fontWeight: 500, color: 'var(--lavelle-plum-deep)', minWidth: '180px' }}>{svc.name}</td>
                          <td style={{ ...tdStyle, fontWeight: 600, whiteSpace: 'nowrap' }}>{svc.price}</td>
                          <td style={{ ...tdStyle, color: 'var(--lavelle-gray-mid)', whiteSpace: 'nowrap' }}>{svc.duration || '—'}</td>
                          <td style={{ ...tdStyle, maxWidth: '280px' }}>
                            <span style={{ color: 'var(--lavelle-gray-mid)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {svc.description || '—'}
                            </span>
                          </td>
                          <td style={tdStyle}>
                            <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-micro)', fontWeight: 700, background: svc.active ? 'rgba(46,125,94,0.1)' : 'rgba(192,57,43,0.08)', color: svc.active ? '#2E7D5E' : '#C0392B' }}>
                              {svc.active ? 'Active' : 'Hidden'}
                            </span>
                          </td>
                          <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button onClick={() => openEdit(svc)}
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', padding: '5px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--lavelle-plum-soft)', background: 'none', color: 'var(--lavelle-plum-soft)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                                <Pencil size={12} /> Edit
                              </button>
                              <button onClick={() => setDeleteId(svc.id)}
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', padding: '5px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--lavelle-alert)', background: 'none', color: 'var(--lavelle-alert)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                                <Trash2 size={12} /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ))
      )}

      {/* ── Add / Edit Modal ── */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 800, background: 'rgba(25,12,4,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-xl)' }}
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-float)', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-xl)', borderBottom: '1px solid var(--lavelle-cream)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)' }}>
                {editTarget ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--lavelle-gray-mid)', display: 'flex' }}>
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

              {/* Category + Subcategory */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                <div>
                  <label style={labelStyle}>Category <span style={{ color: '#C0392B' }}>*</span></label>
                  <select name="category" value={form.category} onChange={handleChange} style={inputStyle(false)}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Subcategory <span style={{ color: '#C0392B' }}>*</span></label>
                  <select name="subcategory" value={form.subcategory} onChange={handleChange} style={inputStyle(false)}>
                    {(SUBCATEGORIES[form.category] || []).map(s => (
                      <option key={s} value={s}>{SUBCATEGORY_LABELS[s] || s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Service name */}
              <div>
                <label style={labelStyle}>Service Name <span style={{ color: '#C0392B' }}>*</span></label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Personalized Massage (60 min)" style={inputStyle(errors.name)} />
                {errors.name && <p style={errStyle}>{errors.name}</p>}
              </div>

              {/* Price row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                <div>
                  <label style={labelStyle}>Display Price <span style={{ color: '#C0392B' }}>*</span></label>
                  <input name="price" value={form.price} onChange={handleChange} placeholder="$90 or $90+" style={inputStyle(errors.price)} />
                  {errors.price && <p style={errStyle}>{errors.price}</p>}
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--lavelle-gray-mid)', marginTop: '4px' }}>Shown to customers on booking</p>
                </div>
                <div>
                  <label style={labelStyle}>Base Price in Cents</label>
                  <input name="price_cents" value={form.price_cents} onChange={handleChange} type="number" min="0" placeholder="9000 (optional)" style={inputStyle(errors.price_cents)} />
                  {errors.price_cents && <p style={errStyle}>{errors.price_cents}</p>}
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--lavelle-gray-mid)', marginTop: '4px' }}>Leave blank for "from" prices</p>
                </div>
              </div>

              {/* Duration */}
              <div style={{ maxWidth: '240px' }}>
                <label style={labelStyle}>Duration</label>
                <input name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 60 min" style={inputStyle(false)} />
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Brief description shown to customers…" style={{ ...inputStyle(false), resize: 'vertical', lineHeight: 1.6 }} />
              </div>

              {/* Sort order + Active toggle */}
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 'var(--space-lg)', alignItems: 'center' }}>
                <div>
                  <label style={labelStyle}>Sort Order</label>
                  <input name="sort_order" value={form.sort_order} onChange={handleChange} type="number" min="0" style={inputStyle(false)} />
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--lavelle-gray-mid)', marginTop: '4px' }}>Lower = appears first</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', paddingTop: '22px' }}>
                  <input type="checkbox" name="active" id="svc-active" checked={form.active} onChange={handleChange}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--lavelle-plum-deep)', cursor: 'pointer' }} />
                  <label htmlFor="svc-active" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', cursor: 'pointer' }}>
                    Active — visible to customers
                  </label>
                </div>
              </div>

              {saveError && (
                <div style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.25)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#C0392B' }}>{saveError}</p>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'flex-end', paddingTop: 'var(--space-sm)' }}>
                <button type="button" onClick={closeModal} className="btn-secondary" style={{ fontSize: '0.8rem' }}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving} style={{ fontSize: '0.8rem', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Saving…' : editTarget ? 'Save Changes' : 'Add Service'}
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
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-sm)' }}>Delete Service?</h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', marginBottom: 'var(--space-xl)', lineHeight: 1.6 }}>
              This will permanently remove the service. This action cannot be undone.
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
