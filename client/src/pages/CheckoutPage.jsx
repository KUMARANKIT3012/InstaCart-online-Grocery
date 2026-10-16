import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { createOrder } from '../api/orders.js'
import { useCart } from '../context/useCart.js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null

function PaymentForm({ onComplete }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!stripe || !elements) return
    setError('')
    setIsSubmitting(true)

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/orders` },
      redirect: 'if_required',
    })

    if (result.error) setError(result.error.message || 'Payment could not be completed.')
    else if (result.paymentIntent?.status === 'succeeded') await onComplete()
    else setError('Payment is processing. Check your order history shortly.')
    setIsSubmitting(false)
  }

  return (
    <form className="checkout-card auth-form" onSubmit={handleSubmit}>
      <h2>Payment</h2>
      <PaymentElement />
      {error && <div className="error-state">{error}</div>}
      <button className="button" disabled={!stripe || isSubmitting} type="submit">{isSubmitting ? 'Confirming payment...' : 'Pay and place order'}</button>
    </form>
  )
}

function CheckoutPage() {
  const { cart, refreshCart } = useCart()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [orderTotal, setOrderTotal] = useState('0.00')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const result = await createOrder(deliveryAddress)
      await refreshCart()
      if (result.clientSecret) {
        // Stripe is configured — proceed to payment form
        setOrderTotal(result.order.total)
        setClientSecret(result.clientSecret)
      } else {
        // Stripe not configured — order is placed, go to confirmation
        await queryClient.invalidateQueries({ queryKey: ['orders'] })
        navigate(`/orders/${result.order.id}`, { replace: true })
      }
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to place your order.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function finishPayment() {
    await refreshCart()
    await queryClient.invalidateQueries({ queryKey: ['orders'] })
    navigate('/orders', { replace: true })
  }

  if (!clientSecret && cart.items.length === 0) {
    return (
      <main className="page-shell">
        <div className="empty-cart">
          <h2>Your cart is empty.</h2>
          <p>Add products before checking out.</p>
          <Link className="button inline-button" to="/">Browse products</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <div className="section-heading">
        <div><p className="eyebrow">Almost there</p><h1>Checkout</h1></div>
        <Link className="back-link" to="/cart">Back to cart</Link>
      </div>
      {clientSecret && stripePromise ? (
        <div className="checkout-layout">
          <Elements options={{ clientSecret }} stripe={stripePromise}>
            <PaymentForm onComplete={finishPayment} />
          </Elements>
          <aside className="cart-summary"><p className="eyebrow">Order total</p><div><strong>Total</strong><strong>${Number(orderTotal).toFixed(2)}</strong></div></aside>
        </div>
      ) : (
      <div className="checkout-layout">
        <form className="checkout-card auth-form" onSubmit={handleSubmit}>
          <h2>Delivery details</h2>
          <label>
            Delivery address
            <textarea className="address-input" minLength="5" onChange={(event) => setDeliveryAddress(event.target.value)} placeholder="123 Market Street, Springfield" required rows="5" value={deliveryAddress} />
          </label>
          {error && <div className="error-state">{error}</div>}
          <button className="button" disabled={isSubmitting} type="submit">{isSubmitting ? 'Placing order...' : 'Place order'}</button>
        </form>
        <aside className="cart-summary">
          <p className="eyebrow">Order summary</p>
          {cart.items.map((item) => <div key={item.product_id}><span>{item.name} × {item.quantity}</span><strong>${Number(item.line_total).toFixed(2)}</strong></div>)}
          <div><strong>Total</strong><strong>${cart.subtotal}</strong></div>
        </aside>
      </div>
      )}
      {clientSecret && !stripePromise && <div className="error-state">Stripe is not configured. Set VITE_STRIPE_PUBLISHABLE_KEY and restart the client.</div>}
    </main>
  )
}

export default CheckoutPage