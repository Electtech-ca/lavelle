import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from './hooks/useAuth'
import { CartProvider } from './context/CartContext'
import { ProductsProvider } from './context/ProductsContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import PageTransition from './components/layout/PageTransition'

import Home              from './pages/Home'
import Spa               from './pages/Spa'
import MediSpa           from './pages/MediSpa'
import Boutique          from './pages/Boutique'
import GourmetFood       from './pages/GourmetFood'
import Gifts             from './pages/Gifts'
import GiftCertificates  from './pages/GiftCertificates'
import Cart              from './pages/Cart'
import Checkout          from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import MemberPortal      from './pages/MemberPortal'
import Blog              from './pages/Blog'

import AdminLogin      from './pages/admin/AdminLogin'
import AdminDashboard  from './pages/admin/AdminDashboard'
import AdminBookings   from './pages/admin/AdminBookings'
import AdminServices   from './pages/admin/AdminServices'
import AdminGifts      from './pages/admin/AdminGifts'
import AdminPromotions from './pages/admin/AdminPromotions'
import AdminMembers    from './pages/admin/AdminMembers'
import AdminNewsletter from './pages/admin/AdminNewsletter'
import AdminPayments   from './pages/admin/AdminPayments'
import AdminProducts   from './pages/admin/AdminProducts'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--lavelle-ivory)' }}><p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--lavelle-plum-soft)' }}>Loading…</p></div>
  return user ? children : <Navigate to="/admin/login" replace />
}

function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--lavelle-ivory)' }}><p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--lavelle-plum-soft)' }}>Loading…</p></div>
  if (!user) return <Navigate to="/admin/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ProductsProvider>
      <CartProvider>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<PublicLayout><PageTransition><Home /></PageTransition></PublicLayout>} />
          <Route path="/spa" element={<PublicLayout><PageTransition><Spa /></PageTransition></PublicLayout>} />
          <Route path="/medispa" element={<PublicLayout><PageTransition><MediSpa /></PageTransition></PublicLayout>} />
          <Route path="/salon" element={<Navigate to="/medispa" replace />} />
          <Route path="/boutique" element={<PublicLayout><PageTransition><Boutique /></PageTransition></PublicLayout>} />
          <Route path="/gourmet" element={<PublicLayout><PageTransition><GourmetFood /></PageTransition></PublicLayout>} />
          <Route path="/gifts"             element={<PublicLayout><PageTransition><Gifts /></PageTransition></PublicLayout>} />
          <Route path="/gift-certificates" element={<PublicLayout><PageTransition><GiftCertificates /></PageTransition></PublicLayout>} />
          <Route path="/blog"              element={<PublicLayout><PageTransition><Blog /></PageTransition></PublicLayout>} />
          <Route path="/promotions"        element={<Navigate to="/gifts" replace />} />
          <Route path="/cart"              element={<PublicLayout><PageTransition><Cart /></PageTransition></PublicLayout>} />
          <Route path="/checkout"          element={<PublicLayout><PageTransition><Checkout /></PageTransition></PublicLayout>} />
          <Route path="/order-confirmation" element={<PublicLayout><PageTransition><OrderConfirmation /></PageTransition></PublicLayout>} />

          {/* Member portal */}
          <Route path="/my-account" element={
            <ProtectedRoute>
              <PublicLayout><PageTransition><MemberPortal /></PageTransition></PublicLayout>
            </ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
          <Route path="/admin/services" element={<AdminRoute><AdminServices /></AdminRoute>} />
          <Route path="/admin/gifts" element={<AdminRoute><AdminGifts /></AdminRoute>} />
          <Route path="/admin/promotions" element={<AdminRoute><AdminPromotions /></AdminRoute>} />
          <Route path="/admin/members" element={<AdminRoute><AdminMembers /></AdminRoute>} />
          <Route path="/admin/newsletter" element={<AdminRoute><AdminNewsletter /></AdminRoute>} />
          <Route path="/admin/payments" element={<AdminRoute><AdminPayments /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />

          {/* 404 */}
          <Route path="*" element={
            <PublicLayout>
              <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-lg)', textAlign: 'center', padding: 'var(--space-3xl) var(--space-xl)' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)' }}>404</p>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h1)', fontWeight: 300, color: 'var(--lavelle-plum-deep)' }}>Page Not Found</h1>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--lavelle-gray-mid)', maxWidth: '420px' }}>The page you're looking for doesn't exist. Let us guide you back to something beautiful.</p>
                <a href="/" className="btn-primary">Return Home</a>
              </div>
            </PublicLayout>
          } />
        </Routes>
      </AnimatePresence>
      </CartProvider>
      </ProductsProvider>
    </BrowserRouter>
  )
}
