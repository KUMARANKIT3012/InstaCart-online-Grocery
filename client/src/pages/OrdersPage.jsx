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
        <div><p className="eyebrow">Your purchases</p><h1>Order history</h1></div>
        <Link className="back-link" to="/">Continue shopping</Link>
      </div>
      {orders.length === 0 ? (
        <div className="empty-cart"><h2>No orders yet.</h2><p>Your completed orders will appear here.</p><Link className="button inline-button" to="/">Start shopping</Link></div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-header"><div><p className="eyebrow">Order #{order.id}</p><h2>{new Date(order.created_at).toLocaleDateString()}</h2></div><span className="order-status">{order.status}</span></div>
              <Link className="order-address" to={`/orders/${order.id}`}>{order.delivery_address}</Link>
              <div className="order-items">{order.items.map((item) => <div key={item.id}><span>{item.product_name} × {item.quantity}</span><strong>${Number(item.line_total).toFixed(2)}</strong></div>)}</div>
              <div className="order-total"><span>Total</span><strong>${Number(order.total).toFixed(2)}</strong></div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

export default OrdersPage