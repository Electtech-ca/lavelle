import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

/* ──────────────────────────────────────────────────────────────
   The active rows of a table the admin edits for the public site
   (services, promotions), in their sort order.

   undefined while loading; null when there is no database or it can't
   be read, so the page shows the copy kept in code instead.

   Each table is read once per visit and shared between pages. The admin
   pages call forgetSiteRows() after a change, so the site shows it
   without a reload. The `active` filter matters for signed-in admins:
   row-level security lets them read hidden rows too.
   ────────────────────────────────────────────────────────────── */

const reads = new Map()

function read(table) {
  if (!reads.has(table)) {
    reads.set(table, supabase.from(table).select('*')
      .eq('active', true).order('sort_order').order('created_at')
      .then(({ data, error }) => {
        if (error) throw error
        return data
      })
      .catch(err => {
        console.error(`[${table}] read failed, showing the copy in code:`, err.message || err)
        reads.delete(table)   // the next page to need it tries again
        return null
      }))
  }
  return reads.get(table)
}

export function forgetSiteRows(table) {
  reads.delete(table)
}

export default function useSiteRows(table) {
  const [rows, setRows] = useState(supabase ? undefined : null)

  useEffect(() => {
    if (!supabase) return
    let live = true
    read(table).then(data => { if (live) setRows(data) })
    return () => { live = false }
  }, [table])

  return rows
}
