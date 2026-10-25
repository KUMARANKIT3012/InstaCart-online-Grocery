import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import Navbar from './components/Navbar.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { queryClient } from './query-client.js'

const HomePage = lazy(() => import('./pages/HomePage.jsx'))
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage.jsx'))
const CartPage = lazy(() => import('./pages/CartPage.jsx'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.jsx'))
const OrdersPage = lazy(() => import('./pages/OrdersPage.jsx'))
const WishlistPage = lazy(() => import('./pages/WishlistPage.jsx'))
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage.jsx'))

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <CartProvider>
                <WishlistProvider>
                  <Navbar />
                  <Suspense fallback={<main className="page-shell"><div className="state">Loading page...</div></main>}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/products/:id" element={<ProductDetailsPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/orders" element={<OrdersPage />} />
                      <Route path="/orders/:id" element={<OrderTrackingPage />} />
                      <Route path="/wishlist" element={<WishlistPage />} />
                      <Route path="/login" element={<Navigate to="/" replace />} />
                      <Route path="/register" element={<Navigate to="/" replace />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Suspense>
                </WishlistProvider>
              </CartProvider>
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
