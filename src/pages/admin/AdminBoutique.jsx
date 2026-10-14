import { useEffect, useMemo, useState } from 'react'
import AdminLayout from './AdminLayout'
import { supabase } from '../../lib/supabase'
import { forgetSiteRows } from '../../hooks/useSiteRows'
import { uploadImage, IMAGE_TYPES } from '../../lib/uploadImage'
import { clothingTypes, outerwearTypes } from '../../data/boutiqueBrands'
import { Plus, Pencil, Trash2, X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ImagePlus } from 'lucide-react'

/* ──────────────────────────────────────────────────────────────
   Admin ▸ Boutique Brands — the brands on the public Boutique page,
   in `sort_order`: name, write-up (English and French), the clothing-
   type filters each appears under, and photos. Rows live in
   public.boutique_brands; photos go to the public "boutique" storage
   bucket (supabase/boutique-brands.sql).
   ────────────────────────────────────────────────────────────── */

const LABELS = { tops: 'Tops', bottoms: 'Bottoms', jackets: 'Jackets', cardigans: 'Cardigans', dresses: 'Dresses', pjs: 'PJs' }
const GROUPS = [
  { label: null,        types: ['tops', 'bottoms'] },
  { label: 'Outerwear', types: outerwearTypes },
  { label: null,        types: ['dresses', 'pjs'] },
]
const NAVY = '#2E3350'
const PHOTO_WIDTH = 1000   // brand photos show at most about 500px wide

const EMPTY_FORM = {
  name:       '',
  types:      [],
  images:     [],
  tagline:    '',
  body:       '',
  tagline_fr: '',
  body_fr:    '',
  active:     true,
}

const ordered = types => clothingTypes.filter(t => types.includes(t))
const bySortOrder = (a, b) => a.sort_order - b.sort_order || String(a.created_at).localeCompare(String(b.created_at))
const slugify = name => name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'brand'

export default function AdminBoutique() {
  const [brands,      setBrands]      = useState([])
  const [loading,     setLoading]     = useState(true)
  const [notice,      setNotice]      = useState('')
  const [modalOpen,   setModalOpen]   = useState(false)
  const [editTarget,  setEditTarget]  = useState(null)
  const [form,        setForm]        = useState(EMPTY_FORM)
  const [errors,      setErrors]      = useState({})
  const [saving,      setSaving]      = useState(false)
  const [saveError,   setSaveError]   = useState('')
  const [uploading,   setUploading]   = useState(0)      // photos still uploading
  const [uploadError, setUploadError] = useState('')
  const [deleteId,    setDeleteId]    = useState(null)
  const [deleting,    setDeleting]    = useState(false)
  const [moving,      setMoving]      = useState(false)

  // ── Load ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.from('boutique_brands').select('*').order('sort_order').order('created_at')
      .then(({ data, error }) => {
        if (error) { console.error('[AdminBoutique]', error.message); setNotice('Brands could not be loaded: ' + error.message) }
        setBrands(data || [])
        setLoading(false)
      })
      .catch(err => { console.error('[AdminBoutique] fetch failed:', err); setNotice('Brands could not be loaded.'); setLoading(false) })
  }, [])

  const list = useMemo(() => [...brands].sort(bySortOrder), [brands])

  // How many shown brands each public filter has.
  const counts = useMemo(() => {
    const shown = brands.filter(b => b.active)
    const n = type => shown.filter(b => b.types.includes(type)).length
    return {
      tops: n('tops'), bottoms: n('bottoms'), dresses: n('dresses'), pjs: n('pjs'),
      jackets: n('jackets'), cardigans: n('cardigans'),
      outerwear: shown.filter(b => b.types.some(t => outerwearTypes.includes(t))).length,
    }
  }, [brands])

  // ── Modal helpers ─────────────────────────────────────────────────────────
  function openAdd() {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setSaveError('')
    setUploadError('')
    setModalOpen(true)
  }

  function openEdit(brand) {
    setEditTarget(brand)
    setForm({
      name:       brand.name,
      types:      ordered(brand.types || []),
      images:     brand.images || [],
      tagline:    brand.tagline || '',
      body:       brand.body || '',
      tagline_fr: brand.tagline_fr || '',
      body_fr:    brand.body_fr || '',
      active:     brand.active,
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

  const toggleType = type => setForm(f => ({
    ...f, types: ordered(f.types.includes(type) ? f.types.filter(t => t !== type) : [...f.types, type]),
  }))

  // ── Photos ────────────────────────────────────────────────────────────────
  async function handlePhotoFiles(e) {
    const files = [...(e.target.files || [])]
    e.target.value = ''   // so choosing the same files again still uploads
    if (!files.length || !supabase) return
    setUploadError('')
    setUploading(files.length)
    for (const file of files) {
      try {
        const url = await uploadImage('boutique', file, PHOTO_WIDTH)
        setForm(f => ({ ...f, images: [...f.images, url] }))
      } catch (err) {
        setUploadError(`${file.name} could not be uploaded: ${err.message || err}`)
      }
      setUploading(n => n - 1)
    }
  }

  function movePhoto(i, step) {
    setForm(f => {
      const images = [...f.images]
      images.splice(i + step, 0, images.splice(i, 1)[0])
      return { ...f, images }
    })
  }

  const removePhoto = i => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))

  // ── Save, move, delete ────────────────────────────────────────────────────
  async function handleSave(e) {
    e.preventDefault()
    if (!form.name.trim()) { setErrors({ name: 'Brand name is required' }); return }

    if (!supabase) {
      setSaveError('Database connection is not configured. Please contact the site administrator.')
      return
    }

    setSaving(true)
    setSaveError('')

    const payload = {
      name:       form.name.trim(),
      types:      ordered(form.types),
      images:     form.images,
      tagline:    form.tagline.trim(),
      body:       form.body.trim(),
      tagline_fr: form.tagline_fr.trim(),
      body_fr:    form.body_fr.trim(),
      active:     form.active,
    }
    // A new brand gets an address-style key from its name, and goes last.
    if (!editTarget) {
      const taken = new Set(brands.map(b => b.slug))
      const base = slugify(payload.name)
      let slug = base
      for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`
      payload.slug = slug
      payload.sort_order = Math.max(-1, ...brands.map(b => b.sort_order)) + 1
    }

    const query = editTarget
      ? supabase.from('boutique_brands').update(payload).eq('id', editTarget.id)
      : supabase.from('boutique_brands').insert([payload])
    const { data, error } = await query.select().single()

    setSaving(false)
    if (error) { setSaveError(error.message); return }
    setBrands(prev => editTarget ? prev.map(b => b.id === data.id ? data : b) : [...prev, data])
    forgetSiteRows('boutique_brands')
    closeModal()
  }

  // Swaps a brand with its neighbour, numbering them 0, 1, 2 … in the new
  // order; only the rows whose number changed are saved.
  async function move(brand, step) {
    const next = [...list]
    const from = next.findIndex(b => b.id === brand.id)
    const to = from + step
    if (!supabase || to < 0 || to >= next.length) return
    next.splice(to, 0, next.splice(from, 1)[0])
    const changes = next.map((b, i) => ({ id: b.id, sort_order: i })).filter((c, i) => next[i].sort_order !== c.sort_order)

    setMoving(true)
    setNotice('')
    const results = await Promise.all(changes.map(c => supabase.from('boutique_brands').update({ sort_order: c.sort_order }).eq('id', c.id)))
    setMoving(false)

    const saved = {}
    results.forEach((r, i) => { if (!r.error) saved[changes[i].id] = changes[i].sort_order })
    setBrands(prev => prev.map(b => b.id in saved ? { ...b, sort_order: saved[b.id] } : b))
    forgetSiteRows('boutique_brands')
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
    const { error } = await supabase.from('boutique_brands').delete().eq('id', deleteId)
    if (error) {
      setNotice('Delete failed: ' + error.message)
    } else {
      setBrands(prev => prev.filter(b => b.id !== deleteId))
      forgetSiteRows('boutique_brands')
    }
    setDeleting(false)
    setDeleteId(null)
  }

  // ── Styles ────────────────────────────────────────────────────────────────
  const chip = (on) => ({
    fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600, padding: '6px 12px',
    borderRadius: 'var(--radius-full)', cursor: 'pointer', transition: 'all 0.15s ease',
    border: `1px solid ${on ? NAVY : 'var(--lavelle-cream)'}`,
    background: on ? NAVY : 'var(--lavelle-ivory)', color: on ? '#F6F5ED' : 'var(--lavelle-gray-mid)',
  })
  const tag = { fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 'var(--radius-full)', background: 'rgba(233,176,185,0.18)', color: NAVY }
  const stat = (label, n) => (
    <div key={label} style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-sm) var(--space-md)', boxShadow: 'var(--shadow-card)', border: n === 0 ? '1px solid rgba(192,57,43,0.4)' : '1px solid transparent' }}>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 300, lineHeight: 1, color: n === 0 ? '#C0392B' : 'var(--lavelle-plum-deep)' }}>{n}</p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)', marginTop: '2px' }}>{label}</p>
    </div>
  )
  const inputStyle = (err) => ({ width: '100%', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', padding: '10px 14px', border: `1px solid ${err ? '#C0392B' : 'var(--lavelle-cream)'}`, borderRadius: 'var(--radius-md)', outline: 'none', background: 'var(--lavelle-ivory)', color: 'var(--lavelle-charcoal)', boxSizing: 'border-box' })
  const labelStyle = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--lavelle-plum-deep)', display: 'block', marginBottom: '6px' }
  const errStyle   = { fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: '#C0392B', marginTop: '4px' }
  const hintStyle  = { fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--lavelle-gray-mid)', marginTop: '4px', lineHeight: 1.5 }
  const groupTitle = { fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)', borderBottom: '1px solid var(--lavelle-cream)', paddingBottom: 'var(--space-xs)' }
  const iconBtn = (enabled, size = 30) => ({ display: 'flex', alignItems: 'center', justifyContent: 'center', width: `${size}px`, height: `${size}px`, borderRadius: 'var(--radius-full)', border: '1px solid var(--lavelle-cream)', background: 'var(--lavelle-white)', color: 'var(--lavelle-plum-deep)', cursor: enabled ? 'pointer' : 'default', opacity: enabled ? 1 : 0.35, padding: 0 })

  return (
    <AdminLayout title="Boutique Brands">
      {!supabase && (
        <div style={{ background: 'rgba(228,62,45,0.1)', border: '1px solid rgba(228,62,45,0.35)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md) var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#b83020' }}>
            <strong>Dev mode:</strong> no database is connected, so brands cannot be loaded or saved.
          </p>
        </div>
      )}

      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', lineHeight: 1.7, maxWidth: '760px', marginBottom: 'var(--space-lg)' }}>
        These are the brands on the Boutique page, in the order shown. Changes show on the site straight away.
        Each brand appears under the clothing-type filters ticked for it; Outerwear shows every brand
        tagged Jackets or Cardigans. A filter with no brands tells visitors to ask in store.
      </p>

      {notice && (
        <div role="alert" style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.25)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md) var(--space-lg)', marginBottom: 'var(--space-xl)', display: 'flex', justifyContent: 'space-between', gap: 'var(--space-md)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#C0392B' }}>{notice}</p>
          <button onClick={() => setNotice('')} aria-label="Dismiss" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C0392B', display: 'flex' }}><X size={16} /></button>
        </div>
      )}

      {/* Toolbar: brands per public filter, and Add */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
        {stat('Tops', counts.tops)}
        {stat('Bottoms', counts.bottoms)}
        {stat(`Outerwear (${counts.jackets} jackets · ${counts.cardigans} cardigans)`, counts.outerwear)}
        {stat('Dresses', counts.dresses)}
        {stat('PJs', counts.pjs)}
        <button onClick={openAdd} className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', marginLeft: 'auto' }}>
          <Plus size={15} /> Add Brand
        </button>
      </div>

      {/* Brands, in site order */}
      {loading ? (
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--lavelle-gray-mid)', textAlign: 'center', padding: 'var(--space-3xl)' }}>Loading brands…</p>
      ) : list.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--lavelle-plum-soft)' }}>No brands yet — click "Add Brand" to create one.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {list.map((brand, i) => {
            const canMove = !moving
            const photos = (brand.images || []).length
            return (
              <div key={brand.id} style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)', padding: 'var(--space-lg)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-lg)', alignItems: 'flex-start', opacity: brand.active ? 1 : 0.75 }}>

                {/* Tile photo */}
                {photos
                  ? <img src={brand.images[0]} alt="" style={{ width: '64px', height: '86px', objectFit: 'cover', objectPosition: 'center top', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
                  : <div style={{ width: '64px', height: '86px', borderRadius: 'var(--radius-md)', flexShrink: 0, background: NAVY, color: '#E9B0B9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✦</div>}

                {/* Name, tagline, filters */}
                <div style={{ flex: '1 1 280px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 'var(--space-sm)' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)' }}>{brand.name}</h3>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: brand.active ? 'rgba(46,125,94,0.1)' : 'rgba(192,57,43,0.08)', color: brand.active ? '#2E7D5E' : '#C0392B' }}>
                      {brand.active ? 'Shown' : 'Hidden'}
                    </span>
                  </div>
                  {brand.tagline && <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontStyle: 'italic', color: 'var(--lavelle-gray-mid)', lineHeight: 1.5 }}>{brand.tagline}</p>}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                    {ordered(brand.types || []).map(t => <span key={t} style={tag}>{LABELS[t]}</span>)}
                    {!(brand.types || []).length && <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: '#C0392B' }}>No clothing types — shows only under "All"</span>}
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--lavelle-gray-mid)' }}>
                    {photos ? `${photos} photo${photos > 1 ? 's' : ''}` : 'No photos — shown as a lettered tile'}
                    {!brand.tagline_fr && !brand.body_fr && ' · No French text'}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                  <button onClick={() => move(brand, -1)} disabled={!canMove || i === 0} title="Show earlier" aria-label={`Move ${brand.name} up`} style={iconBtn(canMove && i > 0)}>
                    <ArrowUp size={14} />
                  </button>
                  <button onClick={() => move(brand, 1)} disabled={!canMove || i === list.length - 1} title="Show later" aria-label={`Move ${brand.name} down`} style={iconBtn(canMove && i < list.length - 1)}>
                    <ArrowDown size={14} />
                  </button>
                  <button onClick={() => openEdit(brand)}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', padding: '6px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--lavelle-plum-deep)', background: 'none', color: 'var(--lavelle-plum-deep)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => setDeleteId(brand.id)}
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
          <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-float)', width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-xl)', borderBottom: '1px solid var(--lavelle-cream)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)' }}>
                {editTarget ? 'Edit Brand' : 'Add New Brand'}
              </h2>
              <button onClick={closeModal} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--lavelle-gray-mid)', display: 'flex' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSave} style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

              {/* ── Name and filters ── */}
              <div>
                <label style={labelStyle}>Brand Name <span style={{ color: '#C0392B' }}>*</span></label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Joseph Ribkoff" style={inputStyle(errors.name)} />
                {errors.name && <p style={errStyle}>{errors.name}</p>}
              </div>

              <div>
                <label style={labelStyle}>Clothing Types</label>
                {GROUPS.map((g, gi) => (
                  <div key={gi} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    {g.label && <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--lavelle-gray-mid)', marginRight: '2px' }}>{g.label}:</span>}
                    {g.types.map(type => {
                      const on = form.types.includes(type)
                      return (
                        <button key={type} type="button" aria-pressed={on} onClick={() => toggleType(type)} style={chip(on)}>
                          {on ? '✓ ' : ''}{LABELS[type]}
                        </button>
                      )
                    })}
                  </div>
                ))}
                <p style={hintStyle}>The Boutique page filters the brand under these. With none ticked, it shows only under "All".</p>
              </div>

              {/* ── Photos ── */}
              <div>
                <label style={labelStyle}>Photos</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                  {form.images.map((src, i) => (
                    <div key={`${src}-${i}`} style={{ width: '96px' }}>
                      <div style={{ position: 'relative' }}>
                        <img src={src} alt="" style={{ width: '96px', aspectRatio: '3 / 4', objectFit: 'cover', objectPosition: 'center top', borderRadius: 'var(--radius-md)', display: 'block', border: i === 0 ? `2px solid ${NAVY}` : '2px solid transparent', boxSizing: 'border-box' }} />
                        {i === 0 && <span style={{ position: 'absolute', left: '4px', bottom: '4px', background: NAVY, color: '#F6F5ED', fontFamily: 'var(--font-body)', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '2px 6px', borderRadius: 'var(--radius-full)' }}>Tile</span>}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '4px' }}>
                        <button type="button" onClick={() => movePhoto(i, -1)} disabled={i === 0} title="Move earlier" aria-label={`Move photo ${i + 1} earlier`} style={iconBtn(i > 0, 26)}><ArrowLeft size={12} /></button>
                        <button type="button" onClick={() => movePhoto(i, 1)} disabled={i === form.images.length - 1} title="Move later" aria-label={`Move photo ${i + 1} later`} style={iconBtn(i < form.images.length - 1, 26)}><ArrowRight size={12} /></button>
                        <button type="button" onClick={() => removePhoto(i)} title="Remove photo" aria-label={`Remove photo ${i + 1}`} style={{ ...iconBtn(true, 26), color: '#C0392B' }}><X size={12} /></button>
                      </div>
                    </div>
                  ))}
                  <label title="Add photos" style={{ width: '96px', aspectRatio: '3 / 4', borderRadius: 'var(--radius-md)', border: '1px dashed var(--lavelle-plum-deep)', background: 'var(--lavelle-ivory)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--lavelle-plum-deep)', fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 600, textAlign: 'center', cursor: uploading || !supabase ? 'default' : 'pointer', opacity: uploading || !supabase ? 0.6 : 1 }}>
                    <ImagePlus size={20} />
                    {uploading ? `Uploading ${uploading}…` : 'Add photos'}
                    <input type="file" multiple accept={IMAGE_TYPES} onChange={handlePhotoFiles} disabled={Boolean(uploading) || !supabase} style={{ display: 'none' }} />
                  </label>
                </div>
                {uploadError && <p style={errStyle}>{uploadError}</p>}
                <p style={hintStyle}>
                  The first photo is the brand's tile on the Boutique page; the others show when the brand is opened.
                  Portrait photos (3:4) fit best. Without photos, the tile shows the brand's name. Large photos are made smaller for the web.
                </p>
              </div>

              {/* ── English ── */}
              <p style={groupTitle}>English</p>

              <div>
                <label style={labelStyle}>Tagline</label>
                <input name="tagline" value={form.tagline} onChange={handleChange} placeholder="e.g. Timeless style. Beautifully made." style={inputStyle(false)} />
              </div>

              <div>
                <label style={labelStyle}>Description</label>
                <textarea name="body" value={form.body} onChange={handleChange} rows={6} placeholder="Why the boutique carries this brand…" style={{ ...inputStyle(false), resize: 'vertical', lineHeight: 1.6 }} />
                <p style={hintStyle}>Leave a blank line between paragraphs.</p>
              </div>

              {/* ── French ── */}
              <p style={groupTitle}>French <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--lavelle-gray-mid)' }}>— left blank, the French site shows the English</span></p>

              <div>
                <label style={labelStyle}>Tagline in French</label>
                <input name="tagline_fr" value={form.tagline_fr} onChange={handleChange} style={inputStyle(false)} />
              </div>

              <div>
                <label style={labelStyle}>Description in French</label>
                <textarea name="body_fr" value={form.body_fr} onChange={handleChange} rows={6} style={{ ...inputStyle(false), resize: 'vertical', lineHeight: 1.6 }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <input type="checkbox" name="active" id="brand-active" checked={form.active} onChange={handleChange}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--lavelle-plum-deep)', cursor: 'pointer' }} />
                <label htmlFor="brand-active" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', cursor: 'pointer' }}>
                  Shown on the website
                </label>
              </div>

              {saveError && (
                <div style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.25)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#C0392B' }}>{saveError}</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'flex-end', paddingTop: 'var(--space-sm)' }}>
                <button type="button" onClick={closeModal} className="btn-secondary" style={{ fontSize: '0.8rem' }}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving || Boolean(uploading)} style={{ fontSize: '0.8rem', opacity: saving || uploading ? 0.7 : 1 }}>
                  {saving ? 'Saving…' : uploading ? 'Uploading photos…' : editTarget ? 'Save Changes' : 'Add Brand'}
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
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-sm)' }}>
              Delete {brands.find(b => b.id === deleteId)?.name || 'brand'}?
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', marginBottom: 'var(--space-xl)', lineHeight: 1.6 }}>
              This removes the brand from the Boutique page for good. To take it off for a while, edit it and untick "Shown on the website" instead.
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
