import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { calcTax } from '../lib/tax'

/* ─────────────────────────────────────────────────────────────
   Sparivier Shopping Cart — Global State
   Cart items are persisted to localStorage so they survive
   page refreshes. All prices are in CENTS (integers).

   Item shape:
   {
     cartKey   : string  — unique key (id + category)
     id        : number
     name      : string
     price     : number  — cents per unit
     image     : string
     category  : string  — 'boutique' | 'gifts' | 'spa' | ...
     qty       : number
     maxQty    : number  — stock limit (default 99)
   }
──────────────────────────────────────────────────────────── */

const CartContext = createContext(null)
const STORAGE_KEY = '__lavelle_cart__'

function cartKey(item) {
  return `${item.category || 'general'}-${item.id}`
}

function reducer(state, action) {
  switch (action.type) {

    case 'ADD': {
      const key = cartKey(action.item)
      const existing = state.find(i => i.cartKey === key)
      if (existing) {
        return state.map(i =>
          i.cartKey === key
            ? { ...i, qty: Math.min(i.qty + (action.item.qty || 1), i.maxQty || 99) }
            : i
        )
      }
      return [...state, { ...action.item, cartKey: key, qty: action.item.qty || 1 }]
    }

    case 'REMOVE':
      return state.filter(i => i.cartKey !== action.cartKey)

    case 'UPDATE_QTY':
      if (action.qty <= 0) return state.filter(i => i.cartKey !== action.cartKey)
      return state.map(i =>
        i.cartKey === action.cartKey
          ? { ...i, qty: Math.min(action.qty, i.maxQty || 99) }
          : i
      )

    case 'CLEAR':
      return []

    case 'LOAD':
      return action.items

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, [], () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch { return [] }
  })

  /* Persist on every change */
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) }
    catch { /* storage full — ignore */ }
  }, [items])

  /* ── Actions ── */
  const addItem    = useCallback(item => dispatch({ type: 'ADD', item }), [])
  const removeItem = useCallback(cartKey => dispatch({ type: 'REMOVE', cartKey }), [])
  const updateQty  = useCallback((cartKey, qty) => dispatch({ type: 'UPDATE_QTY', cartKey, qty }), [])
  const clearCart  = useCallback(() => dispatch({ type: 'CLEAR' }), [])

  /* ── Computed totals (all in cents) ── */
  const itemCount      = items.reduce((n, i) => n + i.qty, 0)
  const subtotalCents  = items.reduce((n, i) => n + i.price * i.qty, 0)
  const { pst, gst, total: taxTotal, grandTotal } = calcTax(subtotalCents)

  return (
    <CartContext.Provider value={{
      items, itemCount,
      subtotalCents, pst, gst, taxTotal, grandTotal,
      addItem, removeItem, updateQty, clearCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within <CartProvider>')
  return ctx
}
