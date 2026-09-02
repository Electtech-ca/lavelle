import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  || ''
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Detect unconfigured / placeholder values — these are truthy strings
// but are NOT real credentials, so we must treat them as missing.
const isPlaceholder = (v) =>
  !v ||
  v.includes('your-project') ||
  v.includes('your-anon-key') ||
  v.startsWith('your-') ||
  v === 'placeholder'

const configured = !isPlaceholder(supabaseUrl) && !isPlaceholder(supabaseKey)

// Returns null if not configured — components fall back to static / dev mode
export const supabase = configured
  ? createClient(supabaseUrl, supabaseKey)
  : null

export const isSupabaseConfigured = configured
