import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { boutiqueProducts } from '../data/boutiqueData'

const ProductsContext = createContext(null)

/** Normalise a Supabase row into the shape the rest of the app expects */
function normalize(row) {
  const cents = row.price_cents ?? 0
  return {
    id:           row.id,
    name:         row.name         || '',
    description:  row.description  || '',
    price:        row.price        || `$${(cents / 100).toFixed(0)}`,
    priceInCents: cents,
    stock:        row.stock        ?? 0,
    image:        row.image        || '',
  }
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    if (!supabase) {
      // No DB — use bundled static data; still "real-time" within the session
      setProducts(boutiqueProducts)
      setLoading(false)
      return
    }

    // ── Initial load ──────────────────────────────────────────────────────────
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error('[ProductsContext] initial load error:', error.message)
          setProducts(boutiqueProducts) // graceful fallback
        } else {
          setProducts((data || []).map(normalize))
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('[ProductsContext] fetch threw:', err)
        setProducts(boutiqueProducts)
        setLoading(false)
      })

    // ── Real-time subscription ────────────────────────────────────────────────
    const channel = supabase
      .channel('products-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        payload => {
          const { eventType, new: newRow, old: oldRow } = payload
          if (eventType === 'INSERT') {
            setProducts(prev => [...prev, normalize(newRow)])
          } else if (eventType === 'UPDATE') {
            setProducts(prev =>
              prev.map(p => String(p.id) === String(newRow.id) ? normalize(newRow) : p)
            )
          } else if (eventType === 'DELETE') {
            setProducts(prev => prev.filter(p => String(p.id) !== String(oldRow.id)))
          }
        }
      )
      .subscribe(status => {
        if (status === 'SUBSCRIBED') {
          console.log('[ProductsContext] real-time channel active')
        }
      })

    return () => { supabase.removeChannel(channel) }
  }, [])

  // ── CRUD helpers ─────────────────────────────────────────────────────────────

  const addProduct = useCallback(async (formData) => {
    if (!supabase) {
      // Dev-mode: add locally so the UI still reflects the change
      const fake = normalize({ ...formData, id: Date.now() })
      setProducts(prev => [...prev, fake])
      return { data: fake }
    }
    const { data, error } = await supabase
      .from('products')
      .insert([formData])
      .select()
      .single()
    if (error) return { error: error.message }
    // real-time INSERT event will update state automatically
    return { data: normalize(data) }
  }, [])

  const updateProduct = useCallback(async (id, updates) => {
    if (!supabase) {
      setProducts(prev =>
        prev.map(p => String(p.id) === String(id) ? { ...p, ...normalize({ ...p, ...updates, id }) } : p)
      )
      return {}
    }
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) return { error: error.message }
    // real-time UPDATE event will update state automatically
    return { data: normalize(data) }
  }, [])

  const deleteProduct = useCallback(async (id) => {
    if (!supabase) {
      setProducts(prev => prev.filter(p => String(p.id) !== String(id)))
      return {}
    }
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) return { error: error.message }
    // real-time DELETE event will update state automatically
    return {}
  }, [])

  return (
    <ProductsContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used inside <ProductsProvider>')
  return ctx
}
