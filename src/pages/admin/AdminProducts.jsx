import { useState } from 'react'
import AdminLayout from './AdminLayout'
import { useProducts } from '../../context/ProductsContext'
import { supabase } from '../../lib/supabase'
import { Plus, Pencil, Trash2, X, ImageOff } from 'lucide-react'

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  price_cents: '',
  stock: '',
  image: '',
}

function validate(f) {
  const errs = {}
  if (!f.name.trim())        errs.name        = 'Name is required'
  if (!f.price.trim())       errs.price       = 'Display price is required (e.g. $128)'
  if (!f.price_cents || isNaN(Number(f.price_cents)) || Number(f.price_cents) < 0)
    errs.price_cents = 'Price in cents must be a non-negative number'
  if (f.stock === '' || isNaN(Number(f.stock)) || Number(f.stock) < 0)
    errs.stock = 'Stock must be a non-negative number'
  return errs
}

export default function AdminProducts() {
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts()

  const [modalOpen,   setModalOpen]   = useState(false)
  const [editTarget,  setEditTarget]  = useState(null)   // null = new
  const [form,        setForm]        = useState(EMPTY_FORM)
  const [errors,      setErrors]      = useState({})
  const [saving,      setSaving]      = useState(false)
  const [saveError,   setSaveError]   = useState('')
  const [deleteId,    setDeleteId]    = useState(null)
  const [deleting,    setDeleting]    = useState(false)
  const [search,      setSearch]      = useState('')

  // ── helpers ──────────────────────────────────────────────────────────────────

  function openAdd() {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setSaveError('')
    setModalOpen(true)
  }

  function openEdit(product) {
    setEditTarget(product)
    setForm({
      name:        product.name,
      description: product.description,
      price:       product.price,
      price_cents: String(product.priceInCents),
      stock:       String(product.stock),
      image:       product.image,
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
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setErrors(err => ({ ...err, [name]: undefined }))
  }

  async function handleSave(e) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    setSaveError('')

    const payload = {
      name:        form.name.trim(),
      description: form.description.trim(),
      price:       form.price.trim(),
      price_cents: Number(form.price_cents),
      stock:       Number(form.stock),
      image:       form.image.trim(),
    }

    let result
    if (editTarget) {
      result = await updateProduct(editTarget.id, payload)
    } else {
      result = await addProduct(payload)
    }

    setSaving(false)
    if (result?.error) {
      setSaveError(result.error)
    } else {
      closeModal()
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    const result = await deleteProduct(deleteId)
    setDeleting(false)
    if (result?.error) {
      alert('Delete failed: ' + result.error)
    }
    setDeleteId(null)
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  )

  // ── styles ────────────────────────────────────────────────────────────────────

  const thStyle = {
    fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600,
    letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lavelle-gray-mid)',
    padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid var(--lavelle-cream)',
    whiteSpace: 'nowrap',
  }
  const tdStyle = {
    fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)',
    padding: '12px 14px', borderBottom: '1px solid var(--lavelle-cream)', verticalAlign: 'middle',
  }
  const inputStyle = (err) => ({
    width: '100%', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)',
    padding: '10px 14px', border: `1px solid ${err ? '#C0392B' : 'var(--lavelle-cream)'}`,
    borderRadius: 'var(--radius-md)', outline: 'none', background: 'var(--lavelle-ivory)',
    color: 'var(--lavelle-charcoal)', boxSizing: 'border-box',
  })
  const labelStyle = {
    fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600,
    letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--lavelle-plum-deep)',
    display: 'block', marginBottom: '6px',
  }
  const errMsgStyle = {
    fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: '#C0392B', marginTop: '4px',
  }

  return (
    <AdminLayout title="Products">

      {/* Dev-mode banner */}
      {!supabase && (
        <div style={{ background: 'rgba(228,62,45,0.1)', border: '1px solid rgba(228,62,45,0.35)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md) var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#b83020' }}>
            <strong>Dev mode:</strong> Changes are reflected live in this session but are not persisted to a database. Connect Supabase to enable permanent storage and real-time sync across all sessions.
          </p>
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
        <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-md) var(--space-xl)', boxShadow: 'var(--shadow-card)', display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, color: 'var(--lavelle-plum-deep)', lineHeight: 1 }}>{products.length}</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)' }}>Products</p>
        </div>

        <input
          type="search"
          placeholder="Search products…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle(false), flex: '1 1 220px', maxWidth: '320px' }}
        />

        <button onClick={openAdd} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', marginLeft: 'auto' }}>
          <Plus size={15} /> Add Product
        </button>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--lavelle-gray-mid)' }}>Loading products…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--lavelle-plum-soft)' }}>
              {search ? 'No products match your search.' : 'No products yet — click "Add Product" to create your first one.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['', 'Name', 'Price', 'Stock', 'Description', 'Actions'].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => (
                  <tr key={product.id} style={{ transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--lavelle-ivory)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Thumbnail */}
                    <td style={{ ...tdStyle, width: '60px', padding: '8px 10px 8px 14px' }}>
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: '52px', height: '62px', objectFit: 'cover', borderRadius: 'var(--radius-md)', display: 'block' }}
                          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                        />
                      ) : null}
                      <div style={{ width: '52px', height: '62px', borderRadius: 'var(--radius-md)', background: 'var(--lavelle-cream)', display: product.image ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ImageOff size={18} color="var(--lavelle-gray-mid)" />
                      </div>
                    </td>

                    {/* Name */}
                    <td style={{ ...tdStyle, maxWidth: '180px' }}>
                      <span style={{ fontWeight: 500, color: 'var(--lavelle-plum-deep)' }}>{product.name}</span>
                    </td>

                    {/* Price */}
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 500 }}>{product.price}</span>
                    </td>

                    {/* Stock */}
                    <td style={tdStyle}>
                      <span style={{
                        display: 'inline-block', padding: '2px 10px', borderRadius: 'var(--radius-full)',
                        fontSize: 'var(--text-micro)', fontWeight: 700,
                        background: product.stock === 0 ? 'rgba(192,57,43,0.1)' : product.stock <= 3 ? 'rgba(228,62,45,0.15)' : 'rgba(46,125,94,0.1)',
                        color: product.stock === 0 ? '#C0392B' : product.stock <= 3 ? '#b83020' : '#2E7D5E',
                      }}>
                        {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                      </span>
                    </td>

                    {/* Description */}
                    <td style={{ ...tdStyle, maxWidth: '260px' }}>
                      <span style={{ color: 'var(--lavelle-gray-mid)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {product.description}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => openEdit(product)}
                          title="Edit product"
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', padding: '5px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--lavelle-plum-soft)', background: 'none', color: 'var(--lavelle-plum-soft)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                          <Pencil size={12} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          title="Delete product"
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
        )}
      </div>

      {/* ── Add / Edit Modal ──────────────────────────────────────────────────── */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 800, background: 'rgba(25,12,4,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-xl)' }}
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-float)', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>

            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-xl)', borderBottom: '1px solid var(--lavelle-cream)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)' }}>
                {editTarget ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--lavelle-gray-mid)', display: 'flex' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSave} style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

              {/* Row: image URL + live preview */}
              <div>
                <label style={labelStyle}>Product Image URL</label>
                <input name="image" value={form.image} onChange={handleChange} placeholder="https://…" style={inputStyle(errors.image)} />
                {errors.image && <p style={errMsgStyle}>{errors.image}</p>}
                {form.image && (
                  <div style={{ marginTop: 'var(--space-sm)', display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start' }}>
                    <img
                      src={form.image}
                      alt="preview"
                      style={{ width: '90px', height: '110px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--lavelle-cream)', flexShrink: 0 }}
                      onError={e => { e.target.style.opacity = 0.25 }}
                    />
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--lavelle-gray-mid)', marginTop: '4px' }}>Live preview. Image will appear exactly like this on the Boutique page.</p>
                  </div>
                )}
              </div>

              {/* Name */}
              <div>
                <label style={labelStyle}>Product Name <span style={{ color: '#C0392B' }}>*</span></label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. The Plum Silk Midi Dress" style={inputStyle(errors.name)} />
                {errors.name && <p style={errMsgStyle}>{errors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Brief product description visible to customers…"
                  style={{ ...inputStyle(errors.description), resize: 'vertical', lineHeight: 1.6 }}
                />
              </div>

              {/* Price row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                <div>
                  <label style={labelStyle}>Display Price <span style={{ color: '#C0392B' }}>*</span></label>
                  <input name="price" value={form.price} onChange={handleChange} placeholder="$128" style={inputStyle(errors.price)} />
                  {errors.price && <p style={errMsgStyle}>{errors.price}</p>}
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--lavelle-gray-mid)', marginTop: '4px' }}>Shown on the product card (e.g. $128)</p>
                </div>
                <div>
                  <label style={labelStyle}>Price in Cents <span style={{ color: '#C0392B' }}>*</span></label>
                  <input name="price_cents" value={form.price_cents} onChange={handleChange} type="number" min="0" placeholder="12800" style={inputStyle(errors.price_cents)} />
                  {errors.price_cents && <p style={errMsgStyle}>{errors.price_cents}</p>}
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--lavelle-gray-mid)', marginTop: '4px' }}>Used for payment processing (e.g. 12800 = $128)</p>
                </div>
              </div>

              {/* Stock */}
              <div style={{ maxWidth: '200px' }}>
                <label style={labelStyle}>Stock Quantity <span style={{ color: '#C0392B' }}>*</span></label>
                <input name="stock" value={form.stock} onChange={handleChange} type="number" min="0" placeholder="0" style={inputStyle(errors.stock)} />
                {errors.stock && <p style={errMsgStyle}>{errors.stock}</p>}
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
                  {saving ? 'Saving…' : editTarget ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete confirmation ────────────────────────────────────────────────── */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 900, background: 'rgba(25,12,4,0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-xl)' }}>
          <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-float)', padding: 'var(--space-2xl)', maxWidth: '420px', width: '100%', textAlign: 'center' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(192,57,43,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-lg)' }}>
              <Trash2 size={22} color="#C0392B" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-sm)' }}>Delete Product?</h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', marginBottom: 'var(--space-xl)', lineHeight: 1.6 }}>
              This will permanently remove the product from your boutique and database. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
              <button onClick={() => setDeleteId(null)} className="btn-secondary" style={{ fontSize: '0.8rem' }} disabled={deleting}>Cancel</button>
              <button
                onClick={handleDelete}
                disabled={deleting}
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
