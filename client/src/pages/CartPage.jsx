import { Link } from 'react-router-dom'
import { useCart } from '../context/useCart.js'

function CartPage() {
  const { cart, error, isLoading, updateItem, removeItem, clearItems } = useCart()

  if (isLoading) return <main className="page-shell"><div className="state">Loading your cart...</div></main>

  return (
    <main className="page-shell">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Your basket</p>
          <h1>Cart</h1>
        </div>
        {cart.items.length > 0 && <button className="text-button" onClick={clearItems} type="button">Clear cart</button>}
      </div>
      {error && <div className="error-state">{error}</div>}
      {cart.items.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is waiting.</h2>
          <p>Add a few essentials and they will show up here.</p>
          <Link className="button inline-button" to="/">Browse products</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-items">
            {cart.items.map((item) => (
              <article className="cart-item" key={item.product_id}>
                <div className="cart-item-art" aria-hidden="true">{item.name.charAt(0)}</div>
                <div className="cart-item-info">
                  <Link to={`/products/${item.product_id}`}><h2>{item.name}</h2></Link>
                  <p>${Number(item.price).toFixed(2)} / {item.unit}</p>
                  <div className="quantity-controls">
                    <button aria-label={`Decrease ${item.name}`} onClick={() => item.quantity > 1 && updateItem(item.product_id, item.quantity - 1)} type="button">−</button>
                    <span>{item.quantity}</span>
                    <button aria-label={`Increase ${item.name}`} onClick={() => updateItem(item.product_id, item.quantity + 1)} type="button">+</button>
                  </div>
                </div>
                <div className="cart-item-total">
                  <strong>${Number(item.line_total).toFixed(2)}</strong>
                  <button className="remove-button" onClick={() => removeItem(item.product_id)} type="button">Remove</button>
                </div>
              </article>
            ))}
          </section>
          <aside className="cart-summary">
            <p className="eyebrow">Order summary</p>
            <div><span>Subtotal</span><strong>${cart.subtotal}</strong></div>
            <div><span>Delivery</span><span>Calculated at checkout</span></div>
            <Link className="button inline-button" to="/checkout">Continue to checkout</Link>
          </aside>
        </div>
      )}
    </main>
  )
}

export default CartPage