import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { fetchOrders } from '../api/orders.js'
import { OrderListSkeleton } from '../components/Skeleton.jsx'

function OrdersPage() {
  const ordersQuery = useQuery({ queryKey: ['orders'], queryFn: fetchOrders })
  const orders = ordersQuery.data || []
  const isLoading = ordersQuery.isLoading
  const error = ordersQuery.error?.response?.data?.error || ''

  if (isLoading) return <main className="page-shell"><OrderListSkeleton /></main>
  if (error) return <main className="page-shell"><div className="error-state">{error}</div></main>

  return (
    <main className="page-shell">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Your purchases</p>
          <h1>Order History</h1>
        </div>
        <Link className="back-link" to="/">Continue shopping</Link>
      </div>
      {orders.length === 0 ? (
        <div className="empty-cart">
          <h2>No orders yet.</h2>
          <p>Your completed grocery orders will appear here.</p>
          <Link className="button inline-button" to="/">Start shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-header">
                <div>
                  <p className="eyebrow">Order #{order.id}</p>
                  <h2>{new Date(order.created_at).toLocaleDateString()}</h2>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', background: '#e8f5e9', color: '#1b5e20', padding: '0.3rem 0.6rem', borderRadius: '999px', fontWeight: 600 }}>
                    ⚡ Arriving in 15 mins
                  </span>
                  <span className="order-status">{order.status}</span>
                </div>
              </div>
              <Link className="order-address" to={`/orders/${order.id}`} style={{ display: 'block', margin: '0.5rem 0' }}>
                📍 {order.delivery_address}
              </Link>
              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0' }}>
                    <span>{item.product_name} × {item.quantity}</span>
                    <strong>₹{Number(item.line_total).toFixed(2)}</strong>
                  </div>
                ))}
              </div>
              <div className="order-total" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #edf0eb' }}>
                <span>Total</span>
                <strong style={{ color: '#116b43', fontSize: '1.1rem' }}>₹{Number(order.total).toFixed(2)}</strong>
              </div>
              <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                <Link className="button inline-button" to={`/orders/${order.id}`} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  Track Order
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

export default OrdersPage
