import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { createOrder } from '../api/orders.js'
import { useCart } from '../context/useCart.js'

function CheckoutPage() {
  const { cart, refreshCart } = useCart()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [step, setStep] = useState('address') // 'address' | 'payment' | 'success'
  const [name, setName] = useState('Guest Shopper')
  const [phone, setPhone] = useState('9876543210')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('upi') // 'upi' | 'card' | 'cod'
  const [upiId, setUpiId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [createdOrder, setCreatedOrder] = useState(null)

  function proceedToPayment(event) {
    event.preventDefault()
    if (!deliveryAddress.trim()) {
      setError('Please enter your delivery address')
      return
    }
    setError('')
    setStep('payment')
  }

  async function handleFinalPayment(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const fullAddress = `${name} | ${phone} | ${deliveryAddress.trim()}`
      const result = await createOrder(fullAddress)
      await refreshCart()
      await queryClient.invalidateQueries({ queryKey: ['orders'] })
      setCreatedOrder(result.order)
      setStep('success')
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to place your order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (step === 'success' && createdOrder) {
    return (
      <main className="page-shell">
        <div className="checkout-card" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <p className="eyebrow" style={{ color: '#116b43', fontSize: '1rem' }}>Payment Successful!</p>
          <div style={{
            background: '#e8f5e9',
            border: '2px solid #a5d6a7',
            borderRadius: '1rem',
            padding: '1.25rem',
            margin: '1.5rem 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
          }}>
            <span style={{ fontSize: '2rem' }}>⚡</span>
            <div style={{ textAlign: 'left' }}>
              <strong style={{ fontSize: '1.3rem', color: '#1b5e20', display: 'block' }}>Arriving in 15 mins</strong>
              <small style={{ color: '#2e7d32' }}>Our delivery partner is on the way to your location.</small>
            </div>
          </div>

          <div style={{ margin: '1.5rem 0', textAlign: 'left', background: '#f8faf7', padding: '1.2rem', borderRadius: '0.8rem', border: '1px solid #e2e8e0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#65746b' }}>Order ID</span>
              <strong>#{createdOrder.id}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#65746b' }}>Total Paid</span>
              <strong style={{ color: '#116b43', fontSize: '1.1rem' }}>₹{Number(createdOrder.total).toFixed(2)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#65746b' }}>Payment Mode</span>
              <strong style={{ textTransform: 'uppercase' }}>{paymentMethod}</strong>
            </div>
            <div style={{ marginTop: '0.5rem', borderTop: '1px solid #e2e8e0', paddingTop: '0.5rem' }}>
              <small style={{ color: '#65746b' }}>Delivering to: {createdOrder.delivery_address}</small>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              className="button"
              onClick={() => navigate(`/orders/${createdOrder.id}`)}
              type="button"
            >
              Track Order
            </button>
            <Link className="button" style={{ background: '#eff6ed', color: '#116b43' }} to="/">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (cart.items.length === 0 && step !== 'success') {
    return (
      <main className="page-shell">
        <div className="empty-cart">
          <h2>Your cart is empty.</h2>
          <p>Add products to your cart before proceeding to checkout.</p>
          <Link className="button inline-button" to="/">Browse products</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <div className="section-heading">
        <div>
          <p className="eyebrow">⚡ Delivery in 15 mins</p>
          <h1>{step === 'address' ? 'Delivery Address' : 'Payment & Checkout'}</h1>
        </div>
        <Link className="back-link" to="/cart">Back to cart</Link>
      </div>

      {error && <div className="error-state" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      <div className="checkout-layout">
        {step === 'address' ? (
          <form className="checkout-card auth-form" onSubmit={proceedToPayment}>
            <h2>1. Delivery Details</h2>
            <div className="form-row">
              <label>
                Your Name
                <input
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  required
                  value={name}
                />
              </label>
              <label>
                Phone Number
                <input
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  required
                  type="tel"
                  value={phone}
                />
              </label>
            </div>
            <label>
              Delivery Address (House/Flat No, Street, Landmark, City)
              <textarea
                className="address-input"
                minLength="5"
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Flat 302, Green Valley Apts, Sector 4, Indiranagar"
                required
                rows="4"
                value={deliveryAddress}
              />
            </label>
            <button className="button" type="submit" style={{ marginTop: '0.5rem' }}>
              Proceed to Payment
            </button>
          </form>
        ) : (
          <form className="checkout-card auth-form" onSubmit={handleFinalPayment}>
            <h2>2. Select Payment Method</h2>

            <div style={{ display: 'grid', gap: '0.75rem', margin: '1rem 0' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem',
                border: paymentMethod === 'upi' ? '2px solid #116b43' : '1px solid #dfe6dd',
                borderRadius: '0.75rem',
                background: paymentMethod === 'upi' ? '#f0f9f3' : '#fff',
                cursor: 'pointer',
              }}>
                <input
                  checked={paymentMethod === 'upi'}
                  name="paymentMode"
                  onChange={() => setPaymentMethod('upi')}
                  type="radio"
                  value="upi"
                />
                <div style={{ flex: 1 }}>
                  <strong>⚡ UPI (Google Pay / PhonePe / Paytm / BHIM)</strong>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#65746b' }}>Instant and secure UPI payment</p>
                </div>
              </label>

              {paymentMethod === 'upi' && (
                <div style={{ padding: '0 0.5rem 0.5rem' }}>
                  <input
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="Enter UPI ID (e.g. user@okhdfcbank or 9876543210@paytm)"
                    style={{ width: '100%' }}
                    value={upiId}
                  />
                </div>
              )}

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem',
                border: paymentMethod === 'card' ? '2px solid #116b43' : '1px solid #dfe6dd',
                borderRadius: '0.75rem',
                background: paymentMethod === 'card' ? '#f0f9f3' : '#fff',
                cursor: 'pointer',
              }}>
                <input
                  checked={paymentMethod === 'card'}
                  name="paymentMode"
                  onChange={() => setPaymentMethod('card')}
                  type="radio"
                  value="card"
                />
                <div style={{ flex: 1 }}>
                  <strong>💳 Credit / Debit Card / Net Banking</strong>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#65746b' }}>Visa, Mastercard, RuPay, Maestro</p>
                </div>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem',
                border: paymentMethod === 'cod' ? '2px solid #116b43' : '1px solid #dfe6dd',
                borderRadius: '0.75rem',
                background: paymentMethod === 'cod' ? '#f0f9f3' : '#fff',
                cursor: 'pointer',
              }}>
                <input
                  checked={paymentMethod === 'cod'}
                  name="paymentMode"
                  onChange={() => setPaymentMethod('cod')}
                  type="radio"
                  value="cod"
                />
                <div style={{ flex: 1 }}>
                  <strong>💵 Cash on Delivery (COD)</strong>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#65746b' }}>Pay via cash or UPI when your groceries arrive</p>
                </div>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button
                className="text-button"
                onClick={() => setStep('address')}
                type="button"
                style={{ padding: '0.75rem 1rem' }}
              >
                ← Back
              </button>
              <button
                className="button"
                disabled={isSubmitting}
                style={{ flex: 1 }}
                type="submit"
              >
                {isSubmitting ? 'Processing Payment...' : `Pay ₹${cart.subtotal} & Place Order`}
              </button>
            </div>
          </form>
        )}

        <aside className="cart-summary">
          <p className="eyebrow">Order Summary ({cart.items.reduce((sum, item) => sum + item.quantity, 0)} items)</p>
          <div style={{ display: 'grid', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto', padding: '0.5rem 0' }}>
            {cart.items.map((item) => (
              <div key={item.product_id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span>{item.name} × {item.quantity}</span>
                <strong>₹{Number(item.line_total).toFixed(2)}</strong>
              </div>
            ))}
          </div>
          <div><span>Subtotal</span><strong>₹{cart.subtotal}</strong></div>
          <div><span>Delivery fee (15 mins)</span><span style={{ color: '#116b43', fontWeight: 600 }}>FREE</span></div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            <span>Total Amount</span>
            <strong>₹{cart.subtotal}</strong>
          </div>
          <div style={{ marginTop: '0.75rem', padding: '0.6rem', background: '#eff6ed', borderRadius: '0.5rem', textAlign: 'center' }}>
            <span style={{ color: '#116b43', fontSize: '0.82rem', fontWeight: 600 }}>⚡ Guaranteed delivery in 15 mins</span>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default CheckoutPage
