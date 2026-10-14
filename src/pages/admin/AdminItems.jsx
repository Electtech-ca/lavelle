import { useEffect, useMemo, useState } from 'react'
import AdminLayout from './AdminLayout'
import { supabase } from '../../lib/supabase'
import { forgetSiteRows } from '../../hooks/useSiteRows'
import { uploadImage, IMAGE_TYPES } from '../../lib/uploadImage'
import { siteLists } from '../../data/siteLists'
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ImagePlus, X, ExternalLink } from 'lucide-react'
import {
  NAVY, Notice, DevModeNotice, Modal, ConfirmDelete, intro, card, inputStyle, textareaStyle,
  labelStyle, hintStyle, errStyle, groupTitle, pillButton, iconBtn, tabStyle,
} from './adminUi'

/* ──────────────────────────────────────────────────────────────
   Admin ▸ one of the lists edited item by item (data/siteLists.js):
   Product Brands, Team, What's Happening, Spa FAQ. Items are rows of
   site_items, shown in `sort_order`; their fields are in `data`.
   Photos go to the public "site" storage bucket.
   ────────────────────────────────────────────────────────────── */

const PHOTO_WIDTH = 1600
const bySortOrder = (a, b) => a.sort_order - b.sort_order || String(a.created_at).localeCompare(String(b.created_at))
const slugify = text => String(text || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'item'

async function imageSize(file) {
  try { const b = await createImageBitmap(file); return { width: b.width, height: b.height } } catch { return {} }
}

/* ── Photos: one, or several with the first as the tile ── */
function PhotoField({ field, value, onChange, setUploading }) {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(0)
  const many = field.type === 'images'
  const list = many ? (value || []) : value ? [value] : []

  async function add(e) {
    const files = [...(e.target.files || [])]
    e.target.value = ''
    if (!files.length) return
    setError(''); setBusy(files.length); setUploading(n => n + files.length)
    for (const file of files) {
      try {
        const url = await uploadImage('site', file, PHOTO_WIDTH)
        if (many) onChange(prev => ({ [field.name]: [...(prev[field.name] || []), url] }))
        else onChange(() => ({ [field.name]: url }), await imageSize(file))   // the size keeps the page steady while it loads
      } catch (err) {
        setError(`${file.name} could not be uploaded: ${err.message || err}`)
      }
      setBusy(n => n - 1); setUploading(n => n - 1)
    }
  }
  const move = (i, step) => onChange(prev => {
    const images = [...(prev[field.name] || [])]
    images.splice(i + step, 0, images.splice(i, 1)[0])
    return { [field.name]: images }
  })
  const remove = i => onChange(prev => ({ [field.name]: many ? (prev[field.name] || []).filter((_, j) => j !== i) : '' }))

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
        {list.map((src, i) => (
          <div key={`${src}-${i}`} style={{ width: '96px' }}>
            <div style={{ position: 'relative' }}>
              <img src={src} alt="" style={{ width: '96px', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: 'var(--radius-md)', display: 'block', border: many && i === 0 ? `2px solid ${NAVY}` : '2px solid transparent', boxSizing: 'border-box' }} />
              {many && i === 0 && <span style={{ position: 'absolute', left: '4px', bottom: '4px', background: NAVY, color: '#F6F5ED', fontFamily: 'var(--font-body)', fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', padding: '2px 6px', borderRadius: 'var(--radius-full)' }}>Tile</span>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '4px' }}>
              {many && <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move photo ${i + 1} earlier`} style={iconBtn(i > 0, 26)}><ArrowLeft size={12} /></button>}
              {many && <button type="button" onClick={() => move(i, 1)} disabled={i === list.length - 1} aria-label={`Move photo ${i + 1} later`} style={iconBtn(i < list.length - 1, 26)}><ArrowRight size={12} /></button>}
              <button type="button" onClick={() => remove(i)} aria-label={`Remove photo ${i + 1}`} style={{ ...iconBtn(true, 26), color: '#C0392B' }}><X size={12} /></button>
            </div>
          </div>
        ))}
        {(many || list.length === 0) && (
          <label style={{ width: '96px', aspectRatio: '1 / 1', borderRadius: 'var(--radius-md)', border: `1px dashed ${NAVY}`, background: 'var(--lavelle-ivory)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', color: NAVY, fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 600, textAlign: 'center', cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.6 : 1 }}>
            <ImagePlus size={20} />
            {busy ? `Uploading ${busy}…` : many ? 'Add photos' : 'Add photo'}
            <input type="file" multiple={many} accept={IMAGE_TYPES} onChange={add} disabled={Boolean(busy)} style={{ display: 'none' }} />
          </label>
        )}
      </div>
      {error && <p style={errStyle}>{error}</p>}
    </div>
  )
}

function Field({ field, lang, form, setForm, errors, setUploading }) {
  const name = lang === 'fr' ? `${field.name}_fr` : field.name
  const label = lang === 'fr' ? `${field.label} in French` : field.label
  const value = form[name] ?? ''
  const set = v => setForm(f => ({ ...f, [name]: v }))

  if (field.type === 'checkbox') return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', cursor: 'pointer' }}>
      <input type="checkbox" checked={Boolean(form[name])} onChange={e => set(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--lavelle-plum-deep)' }} />
      {label}
    </label>
  )

  let input
  if (field.type === 'image' || field.type === 'images') {
    input = <PhotoField field={{ ...field, name }} value={form[name]} setUploading={setUploading}
      onChange={(update, size) => setForm(f => ({ ...f, ...update(f), ...(size || {}) }))} />
  } else if (['textarea', 'paragraphs', 'lines'].includes(field.type)) {
    input = <textarea value={value} onChange={e => set(e.target.value)} lang={lang} rows={field.type === 'paragraphs' ? 8 : field.type === 'lines' ? 5 : 3} style={textareaStyle(errors[name])} />
  } else {
    input = <input type="text" value={value} onChange={e => set(e.target.value)} lang={lang} style={inputStyle(errors[name])} />
  }
  const hint = lang === 'fr' ? null : field.hint || (field.type === 'paragraphs' ? 'Leave a blank line between paragraphs.' : field.type === 'lines' ? 'One per line.' : null)
  return (
    <div>
      <label style={labelStyle}>{label}{field.required && lang !== 'fr' && <span style={{ color: '#C0392B' }}> *</span>}</label>
      {input}
      {errors[name] && <p style={errStyle}>{errors[name]}</p>}
      {hint && <p style={hintStyle}>{hint}</p>}
    </div>
  )
}

export default function AdminItems({ title, lists, children }) {
  const [list, setList]           = useState(lists[0])
  const [rows, setRows]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [notice, setNotice]       = useState('')
  const [editing, setEditing]     = useState(null)        // { row } or { row: null } for a new item
  const [form, setForm]           = useState({})
  const [active, setActive]       = useState(true)
  const [errors, setErrors]       = useState({})
  const [saving, setSaving]       = useState(false)
  const [saveError, setSaveError] = useState('')
  const [uploading, setUploading] = useState(0)
  const [deleteRow, setDeleteRow] = useState(null)
  const [deleting, setDeleting]   = useState(false)
  const [moving, setMoving]       = useState(false)

  const def = siteLists[list]
  const titleField = def.fields[0].name

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.from('site_items').select('*').in('list', lists).order('sort_order').order('created_at')
      .then(({ data, error }) => {
        if (error) setNotice('Items could not be loaded: ' + error.message)
        setRows(data || [])
        setLoading(false)
      })
  }, [lists])

  const items = useMemo(() => rows.filter(r => r.list === list).sort(bySortOrder), [rows, list])

  function openEdit(row) {
    setEditing({ row })
    setForm(row ? { ...row.data } : {})
    setActive(row ? row.active : true)
    setErrors({}); setSaveError('')
  }
  const closeEdit = () => { setEditing(null); setForm({}); setErrors({}); setSaveError('') }

  async function save(e) {
    e.preventDefault()
    const errs = {}
    for (const f of def.fields) {
      const v = form[f.name]
      if (f.required && (Array.isArray(v) ? !v.length : !String(v ?? '').trim())) errs[f.name] = `${f.label} is required`
    }
    if (Object.keys(errs).length) { setErrors(errs); return }

    // Text is trimmed; empty French fields are left out.
    const data = Object.fromEntries(Object.entries(form)
      .map(([k, v]) => [k, typeof v === 'string' ? v.replace(/\r\n/g, '\n').trim() : v])
      .filter(([, v]) => v !== '' && v !== undefined && v !== null))

    setSaving(true); setSaveError('')
    const row = editing.row
    let query
    if (row) {
      query = supabase.from('site_items').update({ data, active }).eq('id', row.id)
    } else {
      const taken = new Set(items.map(r => r.slug))
      const base = slugify(data[titleField])
      let slug = base
      for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`
      query = supabase.from('site_items').insert([{ list, slug, data, active, sort_order: Math.max(-1, ...items.map(r => r.sort_order)) + 1 }])
    }
    const { data: savedRow, error } = await query.select().single()
    setSaving(false)
    if (error) { setSaveError(error.message); return }
    setRows(prev => row ? prev.map(r => r.id === savedRow.id ? savedRow : r) : [...prev, savedRow])
    forgetSiteRows('site_items')
    closeEdit()
  }

  async function move(row, step) {
    const next = [...items]
    const from = next.findIndex(r => r.id === row.id)
    const to = from + step
    if (to < 0 || to >= next.length) return
    next.splice(to, 0, next.splice(from, 1)[0])
    const changes = next.map((r, i) => ({ id: r.id, sort_order: i })).filter((c, i) => next[i].sort_order !== c.sort_order)
    setMoving(true)
    const results = await Promise.all(changes.map(c => supabase.from('site_items').update({ sort_order: c.sort_order }).eq('id', c.id)))
    setMoving(false)
    const saved = {}
    results.forEach((r, i) => { if (!r.error) saved[changes[i].id] = changes[i].sort_order })
    setRows(prev => prev.map(r => r.id in saved ? { ...r, sort_order: saved[r.id] } : r))
    forgetSiteRows('site_items')
    const failed = results.find(r => r.error)
    if (failed) setNotice('Reordering failed: ' + failed.error.message)
  }

  async function remove() {
    setDeleting(true)
    const { error } = await supabase.from('site_items').delete().eq('id', deleteRow.id)
    setDeleting(false)
    if (error) setNotice('Delete failed: ' + error.message)
    else { setRows(prev => prev.filter(r => r.id !== deleteRow.id)); forgetSiteRows('site_items') }
    setDeleteRow(null)
  }

  const thumb = d => (Array.isArray(d.images) ? d.images[0] : null) || d.image
  const subtitle = d => d.tagline || d.title || d.when || d.category || d.a || d.alt || ''
  const noFrench = d => def.fields.some(f => f.fr) && !def.fields.some(f => f.fr && d[`${f.name}_fr`])

  return (
    <AdminLayout title={title}>
      {!supabase && <DevModeNotice />}
      {children && <div style={intro}>{children}</div>}
      <Notice text={notice} onClose={() => setNotice('')} />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
        {lists.length > 1 && lists.map(key => (
          <button key={key} type="button" onClick={() => setList(key)} aria-pressed={list === key} style={tabStyle(list === key)}>
            {siteLists[key].label} · {rows.filter(r => r.list === key).length}
          </button>
        ))}
        <a href={def.page} target="_blank" rel="noreferrer" style={{ ...pillButton(), textDecoration: 'none', marginLeft: lists.length > 1 ? 'var(--space-sm)' : 0 }}>
          <ExternalLink size={12} /> View on the site
        </a>
        <button onClick={() => openEdit(null)} className="btn-primary" disabled={!supabase}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', marginLeft: 'auto' }}>
          <Plus size={15} /> Add {def.itemName}
        </button>
      </div>

      {loading ? (
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--lavelle-gray-mid)', textAlign: 'center', padding: 'var(--space-3xl)' }}>Loading…</p>
      ) : items.length === 0 ? (
        <div style={{ ...card, textAlign: 'center', padding: 'var(--space-3xl)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--lavelle-plum-soft)' }}>
            Nothing here yet — click “Add {def.itemName}” to create one.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {items.map((row, i) => {
            const d = row.data || {}
            const src = thumb(d)
            return (
              <div key={row.id} style={{ ...card, display: 'flex', flexWrap: 'wrap', gap: 'var(--space-lg)', alignItems: 'center', opacity: row.active ? 1 : 0.75 }}>
                {def.fields.some(f => f.type === 'image' || f.type === 'images') && (src
                  ? <img src={src} alt="" style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
                  : <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', flexShrink: 0, background: NAVY, color: '#E9B0B9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✦</div>)}
                <div style={{ flex: '1 1 280px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 'var(--space-sm)' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)' }}>
                      {d[titleField] || (d.image ? 'Promo graphic' : '(untitled)')}
                    </h3>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: row.active ? 'rgba(46,125,94,0.1)' : 'rgba(192,57,43,0.08)', color: row.active ? '#2E7D5E' : '#C0392B' }}>
                      {row.active ? 'Shown' : 'Hidden'}
                    </span>
                    {d.featured && <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(233,176,185,0.25)', color: NAVY }}>Featured</span>}
                  </div>
                  {subtitle(d) && subtitle(d) !== d[titleField] && (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontStyle: 'italic', color: 'var(--lavelle-gray-mid)', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subtitle(d)}</p>
                  )}
                  {noFrench(d) && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--lavelle-gray-mid)' }}>No French text — the French site shows the English</p>}
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                  <button onClick={() => move(row, -1)} disabled={moving || i === 0} title="Show earlier" aria-label="Move up" style={iconBtn(!moving && i > 0)}><ArrowUp size={14} /></button>
                  <button onClick={() => move(row, 1)} disabled={moving || i === items.length - 1} title="Show later" aria-label="Move down" style={iconBtn(!moving && i < items.length - 1)}><ArrowDown size={14} /></button>
                  <button onClick={() => openEdit(row)} style={pillButton()}><Pencil size={12} /> Edit</button>
                  <button onClick={() => setDeleteRow(row)} style={pillButton('var(--lavelle-alert)')}><Trash2 size={12} /> Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {editing && (
        <Modal title={editing.row ? `Edit ${def.itemName}` : `Add ${def.itemName}`} onClose={closeEdit}>
          <form onSubmit={save} style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            {def.fields.map(f => <Field key={f.name} field={f} lang="en" form={form} setForm={setForm} errors={errors} setUploading={setUploading} />)}

            {def.fields.some(f => f.fr) && <>
              <p style={groupTitle}>French <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--lavelle-gray-mid)' }}>— left blank, the French site shows the English</span></p>
              {def.fields.filter(f => f.fr).map(f => <Field key={f.name} field={f} lang="fr" form={form} setForm={setForm} errors={errors} setUploading={setUploading} />)}
            </>}

            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', cursor: 'pointer' }}>
              <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--lavelle-plum-deep)' }} />
              Shown on the website
            </label>

            {saveError && <Notice text={saveError} />}
            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'flex-end' }}>
              <button type="button" onClick={closeEdit} className="btn-secondary" style={{ fontSize: '0.8rem' }}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={saving || uploading > 0} style={{ fontSize: '0.8rem', opacity: saving || uploading ? 0.7 : 1 }}>
                {saving ? 'Saving…' : uploading ? 'Uploading photos…' : editing.row ? 'Save Changes' : `Add ${def.itemName}`}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteRow && (
        <ConfirmDelete
          title={`Delete ${deleteRow.data?.[titleField] || def.itemName}?`}
          text={`This removes it from the website for good. To take it off for a while, edit it and untick “Shown on the website” instead.`}
          busy={deleting} onCancel={() => setDeleteRow(null)} onConfirm={remove} />
      )}
    </AdminLayout>
  )
}
