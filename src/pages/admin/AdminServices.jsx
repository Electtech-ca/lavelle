import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { supabase } from '../../lib/supabase'
import { forgetSiteRows } from '../../hooks/useSiteRows'
import { serviceSections } from '../../data/serviceSections'
import { Plus, Pencil, Trash2, X, ArrowUp, ArrowDown } from 'lucide-react'

/* ──────────────────────────────────────────────────────────────
   Admin ▸ Services & Pricing — the price lists on the Salon and Spa
   pages. Each row of the services table is one line of one list
   (`subcategory` = the list's key in data/serviceSections.js), and
   the pages show them in `sort_order`.
   ────────────────────────────────────────────────────────────── */

const PAGES = [{ id: 'salon', label: 'Salon' }, { id: 'spa', label: 'Spa' }]
const SECTION = Object.fromEntries(serviceSections.map(s => [s.key, s]))
const sectionName = s => (s.tab === s.label ? s.label : `${s.tab} — ${s.label}`)

const EMPTY_FORM = {
  subcategory: serviceSections[0].key,
  name:        '',
  name_fr:     '',
  price:       '',
  price_fr:    '',
  active:      true,
}

function validate(f) {
  const errs = {}
  if (!SECTION[f.subcategory]) errs.subcategory = 'Choose the price list'
  if (!f.name.trim())  errs.name  = 'Service name is required'
  if (!f.price.trim()) errs.price = 'Price is required (e.g. $59)'
  return errs
}

const bySortOrder = (a, b) => a.sort_order - b.sort_order || String(a.created_at).localeCompare(String(b.created_at))

export default function AdminServices() {
  const [services,   setServices]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [notice,     setNotice]     = useState('')
  const [pageFilter, setPageFilter] = useState('all')
  const [search,     setSearch]     = useState('')
  const [modalOpen,  setModalOpen]  = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form,       setForm]       = useState(EMPTY_FORM)
  const [errors,     setErrors]     = useState({})
  const [saving,     setSaving]     = useState(false)
  const [saveError,  setSaveError]  = useState('')
  const [deleteId,   setDeleteId]   = useState(null)
  const [deleting,   setDeleting]   = useState(false)
  const [moving,     setMoving]     = useState(false)

  // ── Load ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.from('services').select('*').order('sort_order').order('created_at')
      .then(({ data, error }) => {
        if (error) { console.error('[AdminServices]', error.message); setNotice('Services could not be loaded: ' + error.message) }
        setServices(data || [])
        setLoading(false)
      })
      .catch(err => { console.error('[AdminServices] fetch failed:', err); setNotice('Services could not be loaded.'); setLoading(false) })
  }, [])

  const inSection = key => services.filter(s => s.subcategory === key).sort(bySortOrder)

  // ── Modal helpers ─────────────────────────────────────────────────────────
  function openAdd(key = EMPTY_FORM.subcategory) {
    setEditTarget(null)
    setForm({ ...EMPTY_FORM, subcategory: key })
    setErrors({})
    setSaveError('')
    setModalOpen(true)
  }

  function openEdit(svc) {
    setEditTarget(svc)
    setForm({
      subcategory: SECTION[svc.subcategory] ? svc.subcategory : '',
      name:        svc.name,
      name_fr:     svc.name_fr  || '',
      price:       svc.price,
      price_fr:    svc.price_fr || '',
      active:      svc.active,
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

    if (!supabase) {
      setSaveError('Database connection is not configured. Please contact the site administrator.')
      return
    }

    setSaving(true)
    setSaveError('')

    const section = SECTION[form.subcategory]
    const payload = {
      category:    section.page,
      subcategory: section.key,
      name:        form.name.trim(),
      name_fr:     form.name_fr.trim(),
      price:       form.price.trim(),
      price_fr:    form.price_fr.trim(),
      active:      form.active,
    }
    // A new service, or one moved to another list, goes to the end of its list.
    if (editTarget?.subcategory !== section.key) {
      payload.sort_order = Math.max(-1, ...inSection(section.key).map(s => s.sort_order)) + 1
    }

    const query = editTarget
      ? supabase.from('services').update(payload).eq('id', editTarget.id)
      : supabase.from('services').insert([payload])
    const { data, error } = await query.select().single()

    setSaving(false)
    if (error) { setSaveError(error.message); return }
    setServices(prev => editTarget ? prev.map(s => s.id === data.id ? data : s) : [...prev, data])
    forgetSiteRows('services')
    closeModal()
  }

  // Swaps a service with its neighbour, numbering the list 0, 1, 2 … in its
  // new order; only the rows whose number changed are saved.
  async function move(svc, step) {
    const list = inSection(svc.subcategory)
    const from = list.findIndex(s => s.id === svc.id)
    const to = from + step
    if (!supabase || to < 0 || to >= list.length) return
    list.splice(to, 0, list.splice(from, 1)[0])
    const changes = list.map((s, i) => ({ id: s.id, sort_order: i })).filter((c, i) => list[i].sort_order !== c.sort_order)

    setMoving(true)
    setNotice('')
    const results = await Promise.all(changes.map(c => supabase.from('services').update({ sort_order: c.sort_order }).eq('id', c.id)))
    setMoving(false)

    const saved = {}
    results.forEach((r, i) => { if (!r.error) saved[changes[i].id] = changes[i].sort_order })
    setServices(prev => prev.map(s => s.id in saved ? { ...s, sort_order: saved[s.id] } : s))
    forgetSiteRows('services')
    const failed = results.find(r => r.error)
    if (failed) setNotice('Reordering failed: ' + failed.error.message)
  }

  async function handleDelete() {
    if (!deleteId) return
    if (!supabase) {
      setNotice('Delete failed: Database connection is not configured. Please contact the site administrator.')
      setDeleteId(null)
      return
    }
    setDeleting(true)
    const { error } = await supabase.from('services').delete().eq('id', deleteId)
    if (error) {
      setNotice('Delete failed: ' + error.message)
    } else {
      setServices(prev => prev.filter(s => s.id !== deleteId))
      forgetSiteRows('services')
    }
    setDeleting(false)
    setDeleteId(null)
  }

  // ── Filtering ─────────────────────────────────────────────────────────────
  const q = search.trim().toLowerCase()
  const matches = s => !q || [s.name, s.name_fr, s.price].some(v => (v || '').toLowerCase().includes(q))
  const strays = services.filter(s => !SECTION[s.subcategory]).filter(matches)
  const groups = [
    ...serviceSections
      .filter(s => pageFilter === 'all' || s.page === pageFilter)
      .map(s => ({ section: s, items: inSection(s.key).filter(matches) }))
      .filter(g => !q || g.items.length),
    ...(strays.length ? [{ section: null, items: strays }] : []),
  ]

  // ── Styles ────────────────────────────────────────────────────────────────
  const thStyle = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lavelle-gray-mid)', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid var(--lavelle-cream)', whiteSpace: 'nowrap' }
  const tdStyle = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', padding: '11px 14px', borderBottom: '1px solid var(--lavelle-cream)', verticalAlign: 'middle' }
  const inputStyle = (err) => ({ width: '100%', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', padding: '10px 14px', border: `1px solid ${err ? '#C0392B' : 'var(--lavelle-cream)'}`, borderRadius: 'var(--radius-md)', outline: 'none', background: 'var(--lavelle-ivory)', color: 'var(--lavelle-charcoal)', boxSizing: 'border-box' })
  const labelStyle = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--lavelle-plum-deep)', display: 'block', marginBottom: '6px' }
  const errStyle   = { fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: '#C0392B', marginTop: '4px' }
  const hintStyle  = { fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--lavelle-gray-mid)', marginTop: '4px' }
  const iconBtn = (enabled) => ({ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: 'var(--radius-full)', border: '1px solid var(--lavelle-cream)', background: 'none', color: 'var(--lavelle-gray-mid)', cursor: enabled ? 'pointer' : 'default', opacity: enabled ? 1 : 0.35 })

  return (
    <AdminLayout title="Services & Pricing">

      {/* Dev-mode banner */}
      {!supabase && (
        <div style={{ background: 'rgba(228,62,45,0.1)', border: '1px solid rgba(228,62,45,0.35)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md) var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#b83020' }}>
            <strong>Dev mode:</strong> no database is connected, so services cannot be loaded or saved.
          </p>
        </div>
      )}

      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', lineHeight: 1.7, maxWidth: '760px', marginBottom: 'var(--space-lg)' }}>
        These are the price lists on the Salon and Spa pages, in the order they appear there.
        Changes show on the site straight away. MediSpa prices are not listed here.
      </p>

      {notice && (
        <div role="alert" style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.25)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md) var(--space-lg)', marginBottom: 'var(--space-xl)', display: 'flex', justifyContent: 'space-between', gap: 'var(--space-md)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#C0392B' }}>{notice}</p>
          <button onClick={() => setNotice('')} aria-label="Dismiss" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C0392B', display: 'flex' }}><X size={16} /></button>
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>

        {/* Page filter pills */}
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          {[{ id: 'all', label: 'All Services' }, ...PAGES].map(f => (
            <button key={f.id} onClick={() => setPageFilter(f.id)}
              style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 500, padding: '8px 18px', borderRadius: 'var(--radius-full)', border: '1px solid', borderColor: pageFilter === f.id ? 'var(--lavelle-plum-deep)' : 'var(--lavelle-cream)', background: pageFilter === f.id ? 'var(--lavelle-plum-deep)' : 'var(--lavelle-white)', color: pageFilter === f.id ? 'var(--lavelle-white)' : 'var(--lavelle-gray-mid)', cursor: 'pointer' }}>
              {f.label}
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
        <button onClick={() => openAdd()} className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', marginLeft: 'auto' }}>
          <Plus size={15} /> Add Service
        </button>
      </div>

      {/* ── One table per price list ── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--lavelle-gray-mid)' }}>Loading services…</p>
        </div>
      ) : groups.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--lavelle-plum-soft)' }}>No services match your search.</p>
        </div>
      ) : (
        groups.map(({ section, items }, gi) => {
          const firstOfPage = section && groups.findIndex(g => g.section?.page === section.page) === gi
          return (
            <div key={section?.key || 'strays'}>

              {/* Page header */}
              {(firstOfPage || !section) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', margin: `${gi ? 'var(--space-2xl)' : 0} 0 var(--space-lg)` }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)' }}>
                    {!section ? 'Not on the site' : section.page === 'salon' ? '✂ Salon page' : '✦ Spa page'}
                  </h2>
                  <div style={{ flex: 1, height: '1px', background: 'var(--lavelle-cream)' }} />
                </div>
              )}

              <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)', overflow: 'hidden', marginBottom: 'var(--space-lg)' }}>

                {/* Price list header */}
                <div style={{ padding: 'var(--space-md) var(--space-xl)', borderBottom: '1px solid var(--lavelle-cream)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-md)', background: 'var(--lavelle-ivory)' }}>
                  <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lavelle-plum-mid)' }}>
                    {section ? sectionName(section) : 'These belong to no price list — edit one to move it into a list, or delete it'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)' }}>{items.length} service{items.length !== 1 ? 's' : ''}</span>
                    {section && (
                      <button onClick={() => openAdd(section.key)} title={`Add a service to ${section.label}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--lavelle-plum-soft)', background: 'none', color: 'var(--lavelle-plum-soft)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                        <Plus size={12} /> Add
                      </button>
                    )}
                  </div>
                </div>

                {items.length === 0 ? (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', padding: 'var(--space-lg) var(--space-xl)' }}>
                    No services in this list, so it is left off the page.
                  </p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          {['Service', 'French', 'Price', 'Status', 'Actions'].map(h => (
                            <th key={h} style={thStyle}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((svc, i) => {
                          const canMove = Boolean(section) && !q && !moving
                          return (
                            <tr key={svc.id}
                              onMouseEnter={e => e.currentTarget.style.background = 'var(--lavelle-ivory)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                              style={{ transition: 'background 0.15s' }}>

                              <td style={{ ...tdStyle, fontWeight: 500, color: 'var(--lavelle-plum-deep)', minWidth: '200px' }}>{svc.name}</td>
                              <td style={{ ...tdStyle, color: 'var(--lavelle-gray-mid)', minWidth: '180px' }}>{svc.name_fr || '—'}</td>
                              <td style={{ ...tdStyle, fontWeight: 600, whiteSpace: 'nowrap' }}>
                                {svc.price}
                                {svc.price_fr && <span style={{ display: 'block', fontWeight: 400, fontSize: '0.72rem', color: 'var(--lavelle-gray-mid)' }}>FR: {svc.price_fr}</span>}
                              </td>
                              <td style={tdStyle}>
                                <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-micro)', fontWeight: 700, background: svc.active ? 'rgba(46,125,94,0.1)' : 'rgba(192,57,43,0.08)', color: svc.active ? '#2E7D5E' : '#C0392B' }}>
                                  {svc.active ? 'Shown' : 'Hidden'}
                                </span>
                              </td>
                              <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                  <button onClick={() => move(svc, -1)} disabled={!canMove || i === 0} title="Move up" aria-label={`Move ${svc.name} up`} style={iconBtn(canMove && i > 0)}>
                                    <ArrowUp size={13} />
                                  </button>
                                  <button onClick={() => move(svc, 1)} disabled={!canMove || i === items.length - 1} title="Move down" aria-label={`Move ${svc.name} down`} style={iconBtn(canMove && i < items.length - 1)}>
                                    <ArrowDown size={13} />
                                  </button>
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
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )
        })
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
              <button onClick={closeModal} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--lavelle-gray-mid)', display: 'flex' }}>
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

              {/* Price list */}
              <div>
                <label style={labelStyle}>Price List <span style={{ color: '#C0392B' }}>*</span></label>
                <select name="subcategory" value={form.subcategory} onChange={handleChange} style={inputStyle(errors.subcategory)}>
                  {!SECTION[form.subcategory] && <option value="" disabled>Choose a price list…</option>}
                  {PAGES.map(p => (
                    <optgroup key={p.id} label={`${p.label} page`}>
                      {serviceSections.filter(s => s.page === p.id).map(s => (
                        <option key={s.key} value={s.key}>{sectionName(s)}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {errors.subcategory && <p style={errStyle}>{errors.subcategory}</p>}
                {editTarget && editTarget.subcategory !== form.subcategory && SECTION[form.subcategory] && (
                  <p style={hintStyle}>The service will move to the end of {SECTION[form.subcategory].label}.</p>
                )}
              </div>

              {/* English */}
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 'var(--space-lg)' }}>
                <div>
                  <label style={labelStyle}>Service Name <span style={{ color: '#C0392B' }}>*</span></label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Women's Haircut & Style" style={inputStyle(errors.name)} />
                  {errors.name && <p style={errStyle}>{errors.name}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Price <span style={{ color: '#C0392B' }}>*</span></label>
                  <input name="price" value={form.price} onChange={handleChange} placeholder="e.g. $59" style={inputStyle(errors.price)} />
                  {errors.price && <p style={errStyle}>{errors.price}</p>}
                </div>
              </div>

              {/* French */}
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 'var(--space-lg)' }}>
                <div>
                  <label style={labelStyle}>Name in French</label>
                  <input name="name_fr" value={form.name_fr} onChange={handleChange} placeholder="e.g. Coupe & Mise en Plis Femme" style={inputStyle(false)} />
                  <p style={hintStyle}>Left blank, the French site shows the English name.</p>
                </div>
                <div>
                  <label style={labelStyle}>Price in French</label>
                  <input name="price_fr" value={form.price_fr} onChange={handleChange} placeholder="e.g. À partir de 15 $" style={inputStyle(false)} />
                  <p style={hintStyle}>Only for prices with words in them.</p>
                </div>
              </div>

              {/* Active toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <input type="checkbox" name="active" id="svc-active" checked={form.active} onChange={handleChange}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--lavelle-plum-deep)', cursor: 'pointer' }} />
                <label htmlFor="svc-active" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', cursor: 'pointer' }}>
                  Shown on the website
                </label>
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
              This removes the service from the website for good. To take it off for a while, edit it and untick "Shown on the website" instead.
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
