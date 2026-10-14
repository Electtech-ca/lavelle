import { supabase } from './supabase'

/* Calls one of the admin portal's server functions (supabase/functions)
   as the signed-in admin. Resolves to its reply, or throws an Error with
   the function's own message. A function that isn't installed on the
   server yet answers 404 or not at all; that is said in plain words. */
export async function callAdminFunction(name, body) {
  if (!supabase) throw new Error('No database is connected.')
  const { data, error } = await supabase.functions.invoke(name, { body })
  if (!error) return data

  let message = '', missing = false
  try {
    const reply = await error.context.json()
    message = reply.error
    // The self-hosted runtime's answer for a function folder that isn't there
    missing = /could not find an appropriate entrypoint|worker boot error/i.test(reply.msg || '')
  } catch { /* no JSON reply */ }
  const status = error.context?.status
  if (!message && (missing || status === 404 || error.name === 'FunctionsFetchError')) {
    message = 'This feature is not switched on on the server yet. Ask Elect Technologies to install it.'
  }
  throw new Error(message || error.message)
}

export const MIN_PASSWORD = 10
