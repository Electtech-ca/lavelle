import AdminLayout from './AdminLayout'
import { Inbox, ExternalLink } from 'lucide-react'

const WEBMAIL_URL = import.meta.env.VITE_WEBMAIL_URL || 'https://mail.sparivier.ca/SOGo'

export default function AdminWebmail() {
  return (
    <AdminLayout title="Webmail">
      <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)', padding: 'var(--space-2xl)', maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', background: 'var(--lavelle-plum-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-lg)' }}>
          <Inbox size={26} color="white" />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-sm)' }}>
          @sparivier.ca Mailboxes
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', marginBottom: 'var(--space-xl)' }}>
          Mailboxes for this domain are hosted on our own mail server. Sign in with your full email address (e.g. hello@sparivier.ca) and mailbox password.
        </p>
        <a
          href={WEBMAIL_URL}
          target="_blank"
          rel="noreferrer"
          className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          Open Webmail <ExternalLink size={14} />
        </a>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)', marginTop: 'var(--space-lg)' }}>
          Opens in a new tab at {WEBMAIL_URL.replace(/^https?:\/\//, '')}
        </p>
      </div>
    </AdminLayout>
  )
}
