import { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import { supabase } from '../../lib/supabase'
import { applyPhoto } from '../../lib/siteContent'
import { uploadImage, IMAGE_TYPES } from '../../lib/uploadImage'
import { photoGroups } from '../../data/photoSlots'
import { ImagePlus, RotateCcw, ExternalLink } from 'lucide-react'
import { Notice, DevModeNotice, intro, card, pillButton, tabStyle } from './adminUi'

/* ──────────────────────────────────────────────────────────────
   Admin ▸ Photos — the photos on the site's pages (data/photoSlots.js).
   "Replace" uploads a new photo to the public "site" bucket and saves
   it in site_photos against the photo's address in the code; "Restore
   original" deletes that row. Brand, team, article and promotion photos
   are edited with their brand, profile, article or promotion.
   ────────────────────────────────────────────────────────────── */

const PHOTO_WIDTH = 2400   // page-wide banners

function PhotoCard({ slot, label, replaced, onChange }) {
  const [busy, setBusy]   = useState(false)
  const [error, setError] = useState('')
  const shown = replaced?.url || slot

  async function replace(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true); setError('')
    try {
      const url = await uploadImage('site', file, PHOTO_WIDTH)
      const { data, error: err } = await supabase.from('site_photos')
        .upsert({ slot, url, updated_at: new Date().toISOString() }).select().single()
      if (err) throw err
      applyPhoto(slot, url)
      onChange(slot, data)
    } catch (err) {
      setError(`Not replaced: ${err.message || err}`)
    }
    setBusy(false)
  }

  async function restore() {
    setBusy(true); setError('')
    const { error: err } = await supabase.from('site_photos').delete().eq('slot', slot)
    if (err) setError(`Not restored: ${err.message}`)
    else { applyPhoto(slot, null); onChange(slot, null) }
    setBusy(false)
  }

  return (
    <div style={{ ...card, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', borderTop: replaced ? '3px solid #E9B0B9' : '3px solid transparent' }}>
      <a href={shown} target="_blank" rel="noreferrer" title="Open the photo full size" style={{ display: 'block', aspectRatio: '16 / 10', overflow: 'hidden', background: 'var(--lavelle-cream)' }}>
        <img src={shown} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </a>
      <div style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', flex: 1 }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-plum-deep)', fontWeight: 600, lineHeight: 1.4 }}>{label}</p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.66rem', color: replaced ? '#B05A6A' : 'var(--lavelle-gray-mid)' }}>
          {replaced ? `Replaced ${new Date(replaced.updated_at).toLocaleDateString('en-CA', { dateStyle: 'medium' })}` : 'Original photo'}
        </p>
        {error && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: '#C0392B' }}>{error}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'auto' }}>
          <label style={{ ...pillButton(), cursor: busy || !supabase ? 'default' : 'pointer', opacity: busy || !supabase ? 0.6 : 1 }}>
            <ImagePlus size={12} /> {busy ? 'Working…' : 'Replace'}
            <input type="file" accept={IMAGE_TYPES} onChange={replace} disabled={busy || !supabase} style={{ display: 'none' }} />
          </label>
          {replaced && (
            <button type="button" onClick={restore} disabled={busy} style={pillButton('var(--lavelle-gray-mid)')}>
              <RotateCcw size={12} /> Restore original
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminPhotos() {
  const [replaced, setReplaced] = useState({})
  const [loading, setLoading]   = useState(true)
  const [notice, setNotice]     = useState('')
  const [page, setPage]         = useState(photoGroups[0].page)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.from('site_photos').select('*').then(({ data, error }) => {
      if (error) setNotice('Replaced photos could not be loaded: ' + error.message)
      setReplaced(Object.fromEntries((data || []).map(r => [r.slot, r])))
      setLoading(false)
    })
  }, [])

  const onChange = (slot, row) => setReplaced(prev => {
    const next = { ...prev }
    if (row) next[slot] = row
    else delete next[slot]
    return next
  })

  const group = photoGroups.find(g => g.page === page)
  const count = g => g.photos.filter(p => replaced[p.slot]).length

  return (
    <AdminLayout title="Photos">
      {!supabase && <DevModeNotice />}
      <p style={intro}>
        The photos on each page. “Replace” puts a new photo in its place on the site straight away;
        “Restore original” brings the old one back. Large photos are made smaller for the web. Pick a photo
        shaped like the one it replaces (a wide banner for a banner). Brand, team, article and promotion photos
        are changed with their brand, profile, article or promotion.
      </p>
      <Notice text={notice} onClose={() => setNotice('')} />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
        {photoGroups.map(g => (
          <button key={g.page} type="button" onClick={() => setPage(g.page)} aria-pressed={page === g.page} style={tabStyle(page === g.page)}>
            {g.page}{count(g) ? ` · ${count(g)} replaced` : ''}
          </button>
        ))}
        <a href={group.path} target="_blank" rel="noreferrer" style={{ ...pillButton(), marginLeft: 'auto', textDecoration: 'none' }}>
          <ExternalLink size={12} /> View the {group.page} page
        </a>
      </div>

      {loading ? (
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--lavelle-gray-mid)', textAlign: 'center', padding: 'var(--space-3xl)' }}>Loading photos…</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-lg)' }}>
          {group.photos.map(p => <PhotoCard key={p.slot} {...p} replaced={replaced[p.slot]} onChange={onChange} />)}
        </div>
      )}
    </AdminLayout>
  )
}
