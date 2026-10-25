import { Link } from 'react-router-dom'
import { useCart } from '../context/useCart.js'

function CartPage() {
  const { cart, error, isLoading, updateItem, removeItem, clearItems } = useCart()

  if (isLoading) return <main className="page-shell"><div className="state">Loading your cart...</div></main>

  return (
    <main className="page-shell">
      <div className="section-heading">
        <div>
          <p className="eyebrow">⚡ Delivery in 15 mins</p>
          <h1>Your Cart</h1>
        </div>
        {cart.items.length > 0 && <button className="text-button" onClick={clearItems} type="button">Clear cart</button>}
      </div>
      {error && <div className="error-state">{error}</div>}
      {cart.items.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty.</h2>
          <p>Add fresh fruits, veggies, snacks, and essentials to get started.</p>
          <Link className="button inline-button" to="/">Browse products</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-items">
            {cart.items.map((item) => (
              <article className="cart-item" key={item.product_id}>
                {item.image_url ? (
                  <img
                    className="cart-item-art"
                    src={item.image_url}
                    alt={item.name}
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className="cart-item-art" aria-hidden="true">{item.name.charAt(0)}</div>
                )}
                <div className="cart-item-info">
                  <Link to={`/products/${item.product_id}`}><h2>{item.name}</h2></Link>
                  <p>₹{Number(item.price).toFixed(2)} / {item.unit}</p>
                  <div className="quantity-controls">
                    <button
                      aria-label={`Decrease ${item.name}`}
                      onClick={() => item.quantity > 1 ? updateItem(item.product_id, item.quantity - 1) : removeItem(item.product_id)}
                      type="button"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      aria-label={`Increase ${item.name}`}
                      onClick={() => updateItem(item.product_id, item.quantity + 1)}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-item-total">
                  <strong>₹{Number(item.line_total).toFixed(2)}</strong>
                  <button className="remove-button" onClick={() => removeItem(item.product_id)} type="button">Remove</button>
                </div>
              </article>
            ))}
          </section>
          <aside className="cart-summary">
            <p className="eyebrow">Bill details</p>
            <div><span>Item total</span><strong>₹{cart.subtotal}</strong></div>
            <div><span>Delivery fee</span><span style={{ color: '#116b43', fontWeight: 600 }}>FREE (15 mins)</span></div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              <span>To Pay</span>
              <strong>₹{cart.subtotal}</strong>
            </div>
            <Link className="button inline-button" to="/checkout">Proceed to Pay</Link>
          </aside>
        </div>
      )}
    </main>
  )
}

export default CartPage
