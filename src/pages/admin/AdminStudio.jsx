import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { startStudioSession, studioReturnUrl } from '../../lib/studioSession'

/* /admin/studio — where Supabase Studio sends a browser that isn't signed
   in (functions/studio-gate). The route only opens for a signed-in admin
   (the login comes first), so this sets the Studio cookie and goes back
   to the Studio page that was asked for. */
export default function AdminStudio() {
  const [params] = useSearchParams()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    startStudioSession().then(ok => {
      if (ok) window.location.replace(studioReturnUrl(params.get('next')))
      else setFailed(true)
    })
  }, [params])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #2E3350 0%, #1a1f3a 100%)', padding: 'var(--space-xl)' }}>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#F6F5ED', textAlign: 'center' }}>
        {failed ? <>Your session has ended. <a href="/admin/login?next=/admin/studio" style={{ color: '#E9B0B9' }}>Sign in again</a>.</> : 'Opening Supabase Studio…'}
      </p>
    </div>
  )
}
