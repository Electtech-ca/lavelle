import { useEffect, useMemo, useState } from 'react'
import AdminLayout from './AdminLayout'
import { supabase } from '../../lib/supabase'
import { Search, RotateCcw, Check } from 'lucide-react'
import {
  TEXT_GROUPS, ALL_KEYS, DEFAULTS, groupOf, keyLabel, toEditable, hasTokens,
  loadTextOverrides, saveText,
} from './pageText'
import { Notice, DevModeNotice, intro, textareaStyle, tabStyle, pillButton, card } from './adminUi'

/* ──────────────────────────────────────────────────────────────
   Admin ▸ Page Text — every heading, paragraph, button and label on
   the public site, in English and French, page by page. A change is
   saved to site_text and shows on the site straight away; "Restore
   original" puts back the wording the site was built with.
   ────────────────────────────────────────────────────────────── */

const MAX_RESULTS = 120
const rowsFor = text => Math.min(12, Math.max(2, Math.ceil((text || '').length / 70) + (text || '').split('\n').length - 1))

function TextRow({ textKey, label, saved, onSaved }) {
  const current = lng => toEditable(saved?.[lng] || DEFAULTS[lng][textKey])
  const [draft, setDraft]   = useState({ en: current('en'), fr: current('fr') })
  const [busy, setBusy]     = useState(false)
  const [error, setError]   = useState('')
  const [done, setDone]     = useState(false)

  // A save elsewhere (or the first load) refreshes the boxes.
  useEffect(() => { setDraft({ en: current('en'), fr: current('fr') }) }, [saved?.en, saved?.fr])   // eslint-disable-line react-hooks/exhaustive-deps

  const dirty   = draft.en !== current('en') || draft.fr !== current('fr')
  const changed = Boolean(saved?.en || saved?.fr)

  async function save(values) {
    setBusy(true); setError(''); setDone(false)
    try {
      const row = await saveText(textKey, values)
      onSaved(textKey, row)
      setDone(true)
      setTimeout(() => setDone(false), 2500)
    } catch (err) {
      setError(err.message || String(err))
    }
    setBusy(false)
  }

  const box = lng => (
    <div style={{ flex: '1 1 320px', minWidth: 0 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lavelle-gray-mid)', marginBottom: '4px' }}>
        {lng === 'en' ? 'English' : 'French'}{saved?.[lng] ? ' · changed' : ''}
      </p>
      <textarea value={draft[lng]} rows={rowsFor(draft[lng])} lang={lng}
        onChange={e => { const value = e.target.value; setDraft(d => ({ ...d, [lng]: value })) }}
        style={{ ...textareaStyle(false), background: saved?.[lng] ? 'rgba(233,176,185,0.08)' : 'var(--lavelle-ivory)' }} />
    </div>
  )

  return (
    <div style={{ ...card, padding: 'var(--space-md) var(--space-lg)', borderLeft: changed ? '3px solid #E9B0B9' : '3px solid transparent' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
        <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 600, color: 'var(--lavelle-plum-deep)' }}>{label || keyLabel(textKey)}</h3>
        <code style={{ fontSize: '0.62rem', color: 'var(--lavelle-gray-mid)' }}>{textKey}</code>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        {box('en')}
        {box('fr')}
      </div>
      {error && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: '#C0392B', marginTop: '6px' }}>Not saved: {error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginTop: 'var(--space-sm)' }}>
        {hasTokens(DEFAULTS.en[textKey]) && (
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.66rem', color: 'var(--lavelle-gray-mid)', marginRight: 'auto' }}>
            Keep words in [ ] and {'{{ }}'} as they are: the site fills them in.
          </span>
        )}
        <span style={{ marginLeft: 'auto' }} />
        {done && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: '#2E7D5E' }}><Check size={13} /> Saved</span>}
        {dirty && <button type="button" onClick={() => setDraft({ en: current('en'), fr: current('fr') })} disabled={busy} style={pillButton()}>Undo</button>}
        {changed && !dirty && (
          <button type="button" onClick={() => save({ en: '', fr: '' })} disabled={busy} title="Put back the wording the site was built with" style={pillButton()}>
            <RotateCcw size={12} /> Restore original
          </button>
        )}
        {dirty && (
          <button type="button" onClick={() => save(draft)} disabled={busy} className="btn-primary" style={{ fontSize: '0.72rem', padding: '6px 16px' }}>
            {busy ? 'Saving…' : 'Save'}
          </button>
        )}
      </div>
    </div>
  )
}

export default function AdminText({ only, labels = {}, title = 'Page Text', children }) {
  const [saved, setSaved]     = useState({})
  const [loading, setLoading] = useState(true)
  const [notice, setNotice]   = useState('')
  const [group, setGroup]     = useState(only || TEXT_GROUPS[0].id)
  const [search, setSearch]   = useState('')
  const [changedOnly, setChangedOnly] = useState(false)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    loadTextOverrides()
      .then(setSaved)
      .catch(err => setNotice('Changed text could not be loaded: ' + (err.message || err)))
      .finally(() => setLoading(false))
  }, [])

  const onSaved = (key, row) => setSaved(prev => {
    const next = { ...prev }
    if (row) next[key] = row
    else delete next[key]
    return next
  })

  const keys = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = only ? (Array.isArray(only) ? only : ALL_KEYS.filter(k => groupOf(k)?.id === only)) : ALL_KEYS
    if (!only && !q) list = list.filter(k => groupOf(k)?.id === group)
    if (q) list = list.filter(k => [k, DEFAULTS.en[k], DEFAULTS.fr[k], saved[k]?.en, saved[k]?.fr]
      .some(v => (v || '').toLowerCase().includes(q)))
    if (changedOnly) list = list.filter(k => saved[k])
    return list
  }, [only, group, search, changedOnly, saved])

  const changedIn = id => Object.keys(saved).filter(k => groupOf(k)?.id === id).length

  return (
    <AdminLayout title={title}>
      {!supabase && <DevModeNotice />}
      {children || (
        <p style={intro}>
          Every heading, paragraph, button and label on the website, page by page, in English and French.
          Change the wording and press Save: it shows on the site straight away. Changed text is marked pink;
          "Restore original" puts back the wording the site was built with. Photos are on the Photos page;
          prices, brands, team profiles and articles have pages of their own.
        </p>
      )}
      <Notice text={notice} onClose={() => setNotice('')} />

      {/* Search and page choice */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
        <label style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--lavelle-gray-mid)' }} />
          <input type="search" value={search} onChange={e => setSearch(e.target.value)} aria-label="Search the text"
            placeholder={only ? 'Search…' : 'Search all pages, e.g. “gift” or “Monday”'}
            style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px 10px 36px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', border: '1px solid var(--lavelle-cream)', borderRadius: 'var(--radius-full)', background: 'var(--lavelle-white)' }} />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', cursor: 'pointer' }}>
          <input type="checkbox" checked={changedOnly} onChange={e => setChangedOnly(e.target.checked)} style={{ accentColor: 'var(--lavelle-plum-deep)' }} />
          Only changed text ({Object.keys(saved).length})
        </label>
      </div>

      {!only && !search.trim() && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: 'var(--space-xl)' }}>
          {TEXT_GROUPS.map(g => (
            <button key={g.id} type="button" onClick={() => setGroup(g.id)} aria-pressed={group === g.id} style={tabStyle(group === g.id)}>
              {g.label}{changedIn(g.id) ? ` · ${changedIn(g.id)}` : ''}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--lavelle-gray-mid)', textAlign: 'center', padding: 'var(--space-3xl)' }}>Loading text…</p>
      ) : keys.length === 0 ? (
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--lavelle-gray-mid)', textAlign: 'center', padding: 'var(--space-2xl)' }}>
          {changedOnly ? 'No changed text here yet.' : 'Nothing matches that search.'}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {keys.slice(0, MAX_RESULTS).map(k => <TextRow key={k} textKey={k} label={labels[k] || (search.trim() && !only ? `${groupOf(k).label} — ${keyLabel(k)}` : null)} saved={saved[k]} onSaved={onSaved} />)}
          {keys.length > MAX_RESULTS && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', textAlign: 'center', padding: 'var(--space-md)' }}>
              Showing the first {MAX_RESULTS} of {keys.length}. Type more words to narrow the search.
            </p>
          )}
        </div>
      )}
    </AdminLayout>
  )
}
