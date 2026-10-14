import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { supabase } from '../../lib/supabase'
import { forgetSiteRows } from '../../hooks/useSiteRows'
import { uploadImage, IMAGE_TYPES } from '../../lib/uploadImage'
import { Plus, Pencil, Trash2, X, ArrowUp, ArrowDown, ImagePlus } from 'lucide-react'

/* ──────────────────────────────────────────────────────────────
   Admin ▸ Promotions — Current Promotions on Giftware and What's
   Happening, in `sort_order`. A promotion with a graphic takes a whole
   row beside its text; graphics go to the public "promotions" storage
   bucket (supabase/admin-content.sql).
   ────────────────────────────────────────────────────────────── */

const EMPTY_FORM = {
  title:          '',
  value:          '',
  description:    '',
  expiry:         '',
  until:          '',
  title_fr:       '',
  value_fr:       '',
  description_fr: '',
  expiry_fr:      '',
  image:          '',
  image_width:    null,
  image_height:   null,
  active:         true,
}

function validate(f) {
  const errs = {}
  if (!f.title.trim())       errs.title       = 'Title is required'
  if (!f.value.trim())       errs.value       = 'Badge is required (e.g. 20% off)'
  if (!f.description.trim()) errs.description = 'Description is required'
  return errs
}

// `until` is a YYYY-MM-DD day; the site shows the promotion through its end.
const today    = () => new Date().toLocaleDateString('en-CA')
const longDate = day => new Date(`${day}T00:00`).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })

function statusOf(p) {
  if (!p.active)                     return { label: 'Hidden', color: '#C0392B', bg: 'rgba(192,57,43,0.08)' }
  if (p.until && p.until < today()) return { label: 'Ended',  color: 'var(--lavelle-gray-mid)', bg: 'var(--lavelle-cream)' }
  return { label: 'Shown', color: '#2E7D5E', bg: 'rgba(46,125,94,0.1)' }
}

const bySortOrder = (a, b) => a.sort_order - b.sort_order || String(a.created_at).localeCompare(String(b.created_at))

export default function AdminPromotions() {
  const [promos,      setPromos]      = useState([])
  const [loading,     setLoading]     = useState(true)
  const [notice,      setNotice]      = useState('')
  const [modalOpen,   setModalOpen]   = useState(false)
  const [editTarget,  setEditTarget]  = useState(null)
  const [form,        setForm]        = useState(EMPTY_FORM)
  const [errors,      setErrors]      = useState({})
  const [saving,      setSaving]      = useState(false)
  const [saveError,   setSaveError]   = useState('')
  const [uploading,   setUploading]   = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [deleteId,    setDeleteId]    = useState(null)
  const [deleting,    setDeleting]    = useState(false)
  const [moving,      setMoving]      = useState(false)

  // ── Load ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.from('promotions').select('*').order('sort_order').order('created_at')
      .then(({ data, error }) => {
        if (error) { console.error('[AdminPromotions]', error.message); setNotice('Promotions could not be loaded: ' + error.message) }
        setPromos(data || [])
        setLoading(false)
      })
      .catch(err => { console.error('[AdminPromotions] fetch failed:', err); setNotice('Promotions could not be loaded.'); setLoading(false) })
  }, [])

  const ordered = [...promos].sort(bySortOrder)

  // ── Modal helpers ─────────────────────────────────────────────────────────
  function openAdd() {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setSaveError('')
    setUploadError('')
    setModalOpen(true)
  }

  function openEdit(p) {
    setEditTarget(p)
    setForm({
      ...EMPTY_FORM,
      ...Object.fromEntries(Object.keys(EMPTY_FORM).map(k => [k, p[k] ?? EMPTY_FORM[k]])),
    })
    setErrors({})
    setSaveError('')
    setUploadError('')
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setSaveError('')
    setUploadError('')
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    setErrors(err => ({ ...err, [name]: undefined }))
  }

  async function handleImageFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''   // so choosing the same file again still uploads
    if (!file || !supabase) return
    setUploading(true)
    setUploadError('')
    try {
      const image = await uploadImage('promotions', file)
      setForm(f => ({ ...f, image, image_width: null, image_height: null }))
    } catch (err) {
      setUploadError('Upload failed: ' + (err.message || err))
    }
    setUploading(false)
  }

  // The preview reports the graphic's size, which the site uses to hold its
  // space while it loads.
  function handlePreviewLoad(e) {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget
    setForm(f => (f.image_width === w && f.image_height === h ? f : { ...f, image_width: w, image_height: h }))
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

    const image = form.image.trim()
    const payload = {
      title:          form.title.trim(),
      value:          form.value.trim(),
      description:    form.description.trim(),
      expiry:         form.expiry.trim(),
      until:          form.until || null,
      title_fr:       form.title_fr.trim(),
      value_fr:       form.value_fr.trim(),
      description_fr: form.description_fr.trim(),
      expiry_fr:      form.expiry_fr.trim(),
      image,
      image_width:    image ? form.image_width : null,
      image_height:   image ? form.image_height : null,
      active:         form.active,
    }
    // A new promotion goes to the end; move it up to show it sooner.
    if (!editTarget) payload.sort_order = Math.max(-1, ...promos.map(p => p.sort_order)) + 1

    const query = editTarget
      ? supabase.from('promotions').update(payload).eq('id', editTarget.id)
      : supabase.from('promotions').insert([payload])
    const { data, error } = await query.select().single()

    setSaving(false)
    if (error) { setSaveError(error.message); return }
    setPromos(prev => editTarget ? prev.map(p => p.id === data.id ? data : p) : [...prev, data])
    forgetSiteRows('promotions')
    closeModal()
  }

  // Swaps a promotion with its neighbour, numbering them 0, 1, 2 … in the
  // new order; only the rows whose number changed are saved.
  async function move(promo, step) {
    const list = [...ordered]
    const from = list.findIndex(p => p.id === promo.id)
    const to = from + step
    if (!supabase || to < 0 || to >= list.length) return
    list.splice(to, 0, list.splice(from, 1)[0])
    const changes = list.map((p, i) => ({ id: p.id, sort_order: i })).filter((c, i) => list[i].sort_order !== c.sort_order)

    setMoving(true)
    setNotice('')
    const results = await Promise.all(changes.map(c => supabase.from('promotions').update({ sort_order: c.sort_order }).eq('id', c.id)))
    setMoving(false)

    const saved = {}
    results.forEach((r, i) => { if (!r.error) saved[changes[i].id] = changes[i].sort_order })
    setPromos(prev => prev.map(p => p.id in saved ? { ...p, sort_order: saved[p.id] } : p))
    forgetSiteRows('promotions')
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
    const { error } = await supabase.from('promotions').delete().eq('id', deleteId)
    if (error) {
      setNotice('Delete failed: ' + error.message)
    } else {
      setPromos(prev => prev.filter(p => p.id !== deleteId))
      forgetSiteRows('promotions')
    }
    setDeleting(false)
    setDeleteId(null)
  }

  const inputStyle = (err) => ({ width: '100%', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', padding: '10px 14px', border: `1px solid ${err ? '#C0392B' : 'var(--lavelle-cream)'}`, borderRadius: 'var(--radius-md)', outline: 'none', background: 'var(--lavelle-ivory)', color: 'var(--lavelle-charcoal)', boxSizing: 'border-box' })
  const labelStyle = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--lavelle-plum-deep)', display: 'block', marginBottom: '6px' }
  const errStyle   = { fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: '#C0392B', marginTop: '4px' }
  const hintStyle  = { fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--lavelle-gray-mid)', marginTop: '4px' }
  const groupTitle = { fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)', borderBottom: '1px solid var(--lavelle-cream)', paddingBottom: 'var(--space-xs)' }
  const twoCol     = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: 'var(--space-lg)' }
  const iconBtn = (enabled) => ({ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', borderRadius: 'var(--radius-full)', border: '1px solid var(--lavelle-cream)', background: 'none', color: 'var(--lavelle-gray-mid)', cursor: enabled ? 'pointer' : 'default', opacity: enabled ? 1 : 0.35 })

  return (
    <AdminLayout title="Promotions">

      {/* Dev-mode banner */}
      {!supabase && (
        <div style={{ background: 'rgba(228,62,45,0.1)', border: '1px solid rgba(228,62,45,0.35)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md) var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#b83020' }}>
            <strong>Dev mode:</strong> no database is connected, so promotions cannot be loaded or saved.
          </p>
        </div>
      )}

      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', lineHeight: 1.7, maxWidth: '760px', marginBottom: 'var(--space-lg)' }}>
        These are the Current Promotions on the Giftware and What's Happening pages, in the order shown.
        Changes show on the site straight away. A promotion with an end date comes off the site by itself after that day.
      </p>

      {notice && (
        <div role="alert" style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.25)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md) var(--space-lg)', marginBottom: 'var(--space-xl)', display: 'flex', justifyContent: 'space-between', gap: 'var(--space-md)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#C0392B' }}>{notice}</p>
          <button onClick={() => setNotice('')} aria-label="Dismiss" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C0392B', display: 'flex' }}><X size={16} /></button>
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
        <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-md) var(--space-lg)', boxShadow: 'var(--shadow-card)', display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 300, color: 'var(--lavelle-plum-deep)', lineHeight: 1 }}>{promos.filter(p => statusOf(p).label === 'Shown').length}</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)' }}>Shown on the site</p>
        </div>
        <button onClick={openAdd} className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', marginLeft: 'auto' }}>
          <Plus size={15} /> Add Promotion
        </button>
      </div>

      {/* Promotions, in site order */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--lavelle-gray-mid)' }}>Loading promotions…</p>
        </div>
      ) : ordered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--lavelle-plum-soft)' }}>No promotions yet — click "Add Promotion" to create one.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {ordered.map((promo, i) => {
            const status = statusOf(promo)
            const canMove = !moving
            return (
              <div key={promo.id} style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)', borderTop: `4px solid ${status.label === 'Shown' ? 'var(--lavelle-gold-champagne)' : 'var(--lavelle-cream)'}`, display: 'flex', flexWrap: 'wrap', gap: 'var(--space-lg)', padding: 'var(--space-lg)' }}>

                {/* Graphic */}
                <div style={{ width: '180px', flexShrink: 0 }}>
                  {promo.image
                    ? <img src={promo.image} alt="" style={{ width: '100%', aspectRatio: '940 / 788', objectFit: 'cover', borderRadius: 'var(--radius-md)', display: 'block', background: 'var(--lavelle-cream)' }} />
                    : <div style={{ width: '100%', aspectRatio: '940 / 788', borderRadius: 'var(--radius-md)', background: 'var(--lavelle-ivory)', border: '1px dashed var(--lavelle-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'var(--space-sm)', fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--lavelle-gray-mid)' }}>No graphic — shown as a small card</div>}
                </div>

                {/* Text */}
                <div style={{ flex: '1 1 280px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 700, background: 'var(--lavelle-gold-shimmer)', color: 'var(--lavelle-gold-deep)', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>{promo.value}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: status.bg, color: status.color }}>{status.label}</span>
                    {!promo.title_fr && <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--lavelle-gray-mid)' }}>No French text</span>}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)' }}>{promo.title}</h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{promo.description}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)' }}>
                    {promo.expiry ? `Valid: ${promo.expiry}` : 'No "Valid" line'}
                    {promo.until && <span style={{ color: 'var(--lavelle-gray-mid)' }}> · {status.label === 'Ended' ? 'Ended' : 'Comes off after'} {longDate(promo.until)}</span>}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', flexShrink: 0 }}>
                  <button onClick={() => move(promo, -1)} disabled={!canMove || i === 0} title="Show earlier" aria-label={`Move ${promo.title} up`} style={iconBtn(canMove && i > 0)}>
                    <ArrowUp size={14} />
                  </button>
                  <button onClick={() => move(promo, 1)} disabled={!canMove || i === ordered.length - 1} title="Show later" aria-label={`Move ${promo.title} down`} style={iconBtn(canMove && i < ordered.length - 1)}>
                    <ArrowDown size={14} />
                  </button>
                  <button onClick={() => openEdit(promo)}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', padding: '6px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--lavelle-plum-deep)', background: 'none', color: 'var(--lavelle-plum-deep)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => setDeleteId(promo.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', padding: '6px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--lavelle-alert)', background: 'none', color: 'var(--lavelle-alert)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 800, background: 'rgba(25,12,4,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-xl)' }}
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-float)', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-xl)', borderBottom: '1px solid var(--lavelle-cream)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)' }}>
                {editTarget ? 'Edit Promotion' : 'Add New Promotion'}
              </h2>
              <button onClick={closeModal} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--lavelle-gray-mid)', display: 'flex' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSave} style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

              {/* ── Graphic ── */}
              <div>
                <label style={labelStyle}>Graphic</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-lg)', alignItems: 'flex-start' }}>
                  {form.image ? (
                    <img src={form.image} alt="" onLoad={handlePreviewLoad}
                      style={{ width: '200px', borderRadius: 'var(--radius-md)', border: '1px solid var(--lavelle-cream)', display: 'block' }} />
                  ) : (
                    <div style={{ width: '200px', aspectRatio: '940 / 788', borderRadius: 'var(--radius-md)', border: '1px dashed var(--lavelle-cream)', background: 'var(--lavelle-ivory)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lavelle-gray-mid)' }}>
                      <ImagePlus size={28} />
                    </div>
                  )}
                  <div style={{ flex: '1 1 220px', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                      <label className="btn-secondary" style={{ fontSize: '0.72rem', padding: '9px 20px', cursor: uploading || !supabase ? 'default' : 'pointer', opacity: uploading || !supabase ? 0.6 : 1 }}>
                        {uploading ? 'Uploading…' : form.image ? 'Replace graphic' : 'Upload graphic'}
                        <input type="file" accept={IMAGE_TYPES} onChange={handleImageFile} disabled={uploading || !supabase} style={{ display: 'none' }} />
                      </label>
                      {form.image && !uploading && (
                        <button type="button" onClick={() => setForm(f => ({ ...f, image: '', image_width: null, image_height: null }))}
                          style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', padding: '8px 16px', borderRadius: 'var(--radius-full)', border: '1px solid var(--lavelle-cream)', background: 'none', color: 'var(--lavelle-gray-mid)', cursor: 'pointer' }}>
                          Remove
                        </button>
                      )}
                    </div>
                    {uploadError && <p style={errStyle}>{uploadError}</p>}
                    <p style={hintStyle}>
                      With a graphic, the promotion takes a whole row, the graphic beside the text.
                      Without one, it shows as a smaller card. JPEG, PNG, WebP or GIF; large photos are made smaller for the web.
                    </p>
                    <input name="image" value={form.image} onChange={handleChange} placeholder="…or paste an image address" style={{ ...inputStyle(false), fontSize: '0.72rem', padding: '7px 10px' }} />
                  </div>
                </div>
              </div>

              {/* ── English ── */}
              <p style={groupTitle}>English</p>

              <div>
                <label style={labelStyle}>Title <span style={{ color: '#C0392B' }}>*</span></label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Discover Maria Nila — New at Spa Rivier!" style={inputStyle(errors.title)} />
                {errors.title && <p style={errStyle}>{errors.title}</p>}
              </div>

              <div style={twoCol}>
                <div>
                  <label style={labelStyle}>Badge <span style={{ color: '#C0392B' }}>*</span></label>
                  <input name="value" value={form.value} onChange={handleChange} placeholder="e.g. Buy two, get one free" style={inputStyle(errors.value)} />
                  {errors.value && <p style={errStyle}>{errors.value}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Valid</label>
                  <input name="expiry" value={form.expiry} onChange={handleChange} placeholder="e.g. October 1–31, Ongoing" style={inputStyle(false)} />
                  <p style={hintStyle}>Shown as "Valid: …". Left blank, there is no Valid line.</p>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Description <span style={{ color: '#C0392B' }}>*</span></label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="What the promotion offers and any conditions…" style={{ ...inputStyle(errors.description), resize: 'vertical', lineHeight: 1.6 }} />
                {errors.description && <p style={errStyle}>{errors.description}</p>}
              </div>

              {/* ── French ── */}
              <p style={groupTitle}>French <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--lavelle-gray-mid)' }}>— left blank, the French site shows the English</span></p>

              <div>
                <label style={labelStyle}>Title in French</label>
                <input name="title_fr" value={form.title_fr} onChange={handleChange} style={inputStyle(false)} />
              </div>

              <div style={twoCol}>
                <div>
                  <label style={labelStyle}>Badge in French</label>
                  <input name="value_fr" value={form.value_fr} onChange={handleChange} style={inputStyle(false)} />
                </div>
                <div>
                  <label style={labelStyle}>Valid in French</label>
                  <input name="expiry_fr" value={form.expiry_fr} onChange={handleChange} style={inputStyle(false)} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Description in French</label>
                <textarea name="description_fr" value={form.description_fr} onChange={handleChange} rows={4} style={{ ...inputStyle(false), resize: 'vertical', lineHeight: 1.6 }} />
              </div>

              {/* ── On the site ── */}
              <p style={groupTitle}>On the site</p>

              <div style={twoCol}>
                <div>
                  <label style={labelStyle}>End date</label>
                  <input type="date" name="until" value={form.until} onChange={handleChange} style={inputStyle(false)} />
                  <p style={hintStyle}>Optional. The promotion comes off the site after this day.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', paddingTop: '22px' }}>
                  <input type="checkbox" name="active" id="promo-active" checked={form.active} onChange={handleChange}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--lavelle-plum-deep)', cursor: 'pointer' }} />
                  <label htmlFor="promo-active" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', cursor: 'pointer' }}>
                    Shown on the website
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
                <button type="submit" className="btn-primary" disabled={saving || uploading} style={{ fontSize: '0.8rem', opacity: saving || uploading ? 0.7 : 1 }}>
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
              This removes the promotion for good. To take it off the site for a while, edit it and untick "Shown on the website" instead.
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
