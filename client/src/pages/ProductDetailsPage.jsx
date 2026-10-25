import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import { fetchProduct } from '../api/catalog.js'
import { useCart } from '../context/useCart.js'

function ProductDetailsPage() {
  const { id } = useParams()
  const { cart, addItem, updateItem, removeItem } = useCart()
  const [isUpdating, setIsUpdating] = useState(false)
  const productQuery = useQuery({ queryKey: ['product', id], queryFn: () => fetchProduct(id) })
  const product = productQuery.data
  const isLoading = productQuery.isLoading
  const error = productQuery.error?.response?.data?.error || ''

  if (isLoading) return <main className="page-shell"><div className="state">Loading product...</div></main>
  if (error) return <main className="page-shell"><div className="error-state">{error}</div></main>
  if (!product) return <main className="page-shell"><div className="state">Product not found.</div></main>

  const price = Number(product.price).toFixed(2)
  const cartItem = cart.items.find((item) => Number(item.product_id) === Number(product.id))

  async function handleAdd() {
    setIsUpdating(true)
    try {
      await addItem(product.id, 1)
    } finally {
      setIsUpdating(false)
    }
  }

  async function changeQuantity(quantity) {
    setIsUpdating(true)
    try {
      if (quantity <= 0) await removeItem(product.id)
      else await updateItem(product.id, quantity)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <main className="page-shell">
      <Link className="back-link" to="/">← Back to products</Link>
      <section className="detail-layout">
        {product.image_url ? (
          <img className="detail-art" src={product.image_url} alt={product.name} />
        ) : (
          <div className="detail-art" aria-hidden="true">{product.name.charAt(0)}</div>
        )}
        <div className="detail-copy">
          <span className="product-category">{product.category_name}</span>
          <h1>{product.name}</h1>
          <p className="detail-description">{product.description || 'Fresh grocery essential carefully sourced for your home.'}</p>
          <p className="detail-price">₹{price}</p>
          <p className="product-unit">Sold by {product.unit}</p>

          {cartItem ? (
            <div className="quantity-controls card-quantity" style={{ width: 'fit-content', marginTop: '1.5rem' }}>
              <button
                aria-label={`Decrease ${product.name}`}
                disabled={isUpdating}
                onClick={() => changeQuantity(cartItem.quantity - 1)}
                type="button"
              >
                −
              </button>
              <span style={{ padding: '0 0.5rem' }}>{cartItem.quantity} in cart</span>
              <button
                aria-label={`Increase ${product.name}`}
                disabled={isUpdating}
                onClick={() => changeQuantity(cartItem.quantity + 1)}
                type="button"
              >
                +
              </button>
            </div>
          ) : (
            <button
              className="button"
              disabled={isUpdating}
              onClick={handleAdd}
              type="button"
              style={{ marginTop: '1.5rem' }}
            >
              {isUpdating ? 'Adding...' : 'Add to cart'}
            </button>
          )}
        </div>
      </section>
    </main>
  )
}

export default ProductDetailsPage
