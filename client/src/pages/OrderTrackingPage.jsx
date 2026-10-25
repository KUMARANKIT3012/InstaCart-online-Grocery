import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { fetchOrder } from '../api/orders.js'

const trackingSteps = ['placed', 'packed', 'out_for_delivery', 'delivered']
const labels = {
  placed: 'Order placed',
  packed: 'Packed with care',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
}

function OrderTrackingPage() {
  const { id } = useParams()
  const orderQuery = useQuery({ queryKey: ['order', id], queryFn: () => fetchOrder(id), refetchInterval: 15_000 })
  const order = orderQuery.data
  const error = orderQuery.error?.response?.data?.error || ''

  if (error) return <main className="page-shell"><div className="error-state">{error}</div></main>
  if (!order) return <main className="page-shell"><div className="state">Loading order tracking...</div></main>

  const currentIndex = trackingSteps.indexOf(order.status)

  return (
    <main className="page-shell">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Order #{order.id}</p>
          <h1>Track your delivery</h1>
        </div>
        <Link className="back-link" to="/orders">Order history</Link>
      </div>

      <div style={{
        background: '#e8f5e9',
        border: '2px solid #81c784',
        borderRadius: '1.25rem',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '2.5rem' }}>⏱️</span>
          <div>
            <strong style={{ fontSize: '1.5rem', color: '#1b5e20', display: 'block' }}>
              Arriving in 15 mins
            </strong>
            <span style={{ color: '#2e7d32', fontSize: '0.95rem' }}>
              Your fresh grocery items are on the way!
            </span>
          </div>
        </div>
        <div style={{
          background: '#116b43',
          color: '#fff',
          padding: '0.5rem 1.2rem',
          borderRadius: '999px',
          fontWeight: 700,
          fontSize: '0.85rem',
          letterSpacing: '0.05em',
        }}>
          ON TIME
        </div>
      </div>

      <section className="tracking-card">
        <div className="tracking-progress">
          {trackingSteps.map((step, index) => (
            <div className={`tracking-step ${index <= currentIndex ? 'complete' : ''}`} key={step}>
              <span>{index <= currentIndex ? '✓' : index + 1}</span>
              <strong>{labels[step]}</strong>
              {order.status_history?.find((event) => event.status === step) && (
                <small>{new Date(order.status_history.find((event) => event.status === step).created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
              )}
            </div>
          ))}
        </div>
        <div className="tracking-meta">
          <div>
            <span>Estimated Delivery</span>
            <strong style={{ color: '#116b43' }}>Arriving in 15 mins</strong>
          </div>
          <div>
            <span>Total Amount</span>
            <strong>₹{Number(order.total).toFixed(2)}</strong>
          </div>
          <div>
            <span>Delivering to</span>
            <strong>{order.delivery_address}</strong>
          </div>
        </div>
      </section>

      <section className="order-card tracking-items">
        <h2>Items ({order.items.length})</h2>
        {order.items.map((item) => (
          <div className="order-items" key={item.id}>
            <span>{item.product_name} × {item.quantity}</span>
            <strong>₹{Number(item.line_total).toFixed(2)}</strong>
          </div>
        ))}
      </section>
    </main>
  )
}

export default OrderTrackingPage
