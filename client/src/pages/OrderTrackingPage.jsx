import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { fetchOrder } from '../api/orders.js'

const trackingSteps = ['placed', 'packed', 'out_for_delivery', 'delivered']
const labels = { placed: 'Order placed', packed: 'Packed', out_for_delivery: 'Out for delivery', delivered: 'Delivered' }

function OrderTrackingPage() {
  const { id } = useParams()
  const orderQuery = useQuery({ queryKey: ['order', id], queryFn: () => fetchOrder(id), refetchInterval: 30_000 })
  const order = orderQuery.data
  const error = orderQuery.error?.response?.data?.error || ''

  if (error) return <main className="page-shell"><div className="error-state">{error}</div></main>
  if (!order) return <main className="page-shell"><div className="state">Loading order tracking...</div></main>

  const currentIndex = trackingSteps.indexOf(order.status)

  return (
    <main className="page-shell">
      <div className="section-heading"><div><p className="eyebrow">Order #{order.id}</p><h1>Track your delivery</h1></div><Link className="back-link" to="/orders">Order history</Link></div>
      <section className="tracking-card">
        <div className="tracking-progress">{trackingSteps.map((step, index) => <div className={`tracking-step ${index <= currentIndex ? 'complete' : ''}`} key={step}><span>{index <= currentIndex ? '✓' : index + 1}</span><strong>{labels[step]}</strong>{order.status_history?.find((event) => event.status === step) && <small>{new Date(order.status_history.find((event) => event.status === step).created_at).toLocaleString()}</small>}</div>)}</div>
        <div className="tracking-meta"><div><span>Payment</span><strong>{order.payment_status}</strong></div><div><span>Total</span><strong>${Number(order.total).toFixed(2)}</strong></div><div><span>Delivering to</span><strong>{order.delivery_address}</strong></div></div>
      </section>
      <section className="order-card tracking-items"><h2>Items</h2>{order.items.map((item) => <div className="order-items" key={item.id}><span>{item.product_name} × {item.quantity}</span><strong>${Number(item.line_total).toFixed(2)}</strong></div>)}</section>
    </main>
  )
}

export default OrderTrackingPage