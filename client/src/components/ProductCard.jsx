import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../context/useCart.js'
import { useWishlist } from '../context/useWishlist.js'
import { useToast } from '../context/useToast.js'

function ProductCard({ product }) {
  const { cart, addItem, updateItem, removeItem } = useCart()
  const { isWishlisted, toggle } = useWishlist()
  const { addToast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)
  const price = Number(product.price).toFixed(2)
  const cartItem = cart.items.find((item) => Number(item.product_id) === Number(product.id))

  async function changeQuantity(quantity) {
    setIsUpdating(true)
    try {
      if (cartItem && quantity <= 0) await removeItem(product.id)
      else if (cartItem) await updateItem(product.id, quantity)
      else await addItem(product.id, quantity)
    } finally {
      setIsUpdating(false)
    }
  }

  async function toggleFavorite(event) {
    event.preventDefault()
    try {
      const saved = await toggle(product)
      addToast(saved ? 'Added to favorites' : 'Removed from favorites')
    } catch (error) {
      addToast(error.response?.data?.error || 'Unable to update favorites', 'error')
    }
  }

  return (
    <article className="product-card">
      <button
        aria-label={isWishlisted(product.id) ? 'Remove from favorites' : 'Add to favorites'}
        className={`favorite-button ${isWishlisted(product.id) ? 'saved' : ''}`}
        onClick={toggleFavorite}
        type="button"
      >
        ♥
      </button>

      {product.image_url ? (
        <Link to={`/products/${product.id}`}>
          <img
            className="product-image"
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </Link>
      ) : (
        <Link to={`/products/${product.id}`}>
          <div className="product-art" aria-hidden="true">{product.name.charAt(0)}</div>
        </Link>
      )}

      <div className="product-info">
        <span className="product-category">{product.category_name}</span>
        <Link to={`/products/${product.id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <div className="product-meta">
          <span className="product-price">₹{price}</span>
          <span className="product-unit">{product.unit}</span>
        </div>

        {cartItem ? (
          <div className="quantity-controls card-quantity">
            <button
              aria-label={`Decrease ${product.name}`}
              disabled={isUpdating}
              onClick={() => changeQuantity(cartItem.quantity - 1)}
              type="button"
            >
              −
            </button>
            <span>{cartItem.quantity}</span>
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
            className="add-button"
            disabled={isUpdating}
            onClick={() => changeQuantity(1)}
            type="button"
          >
            {isUpdating ? 'Adding...' : 'Add to cart'}
          </button>
        )}
      </div>
    </article>
  )
}

export default ProductCard
