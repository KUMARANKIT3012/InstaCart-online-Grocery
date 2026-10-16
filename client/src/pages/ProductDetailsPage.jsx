import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { fetchProduct } from '../api/catalog.js'
import { useAuth } from '../context/useAuth.js'
import { useCart } from '../context/useCart.js'

function ProductDetailsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { addItem } = useCart()
  const productQuery = useQuery({ queryKey: ['product', id], queryFn: () => fetchProduct(id) })
  const product = productQuery.data
  const isLoading = productQuery.isLoading
  const error = productQuery.error?.response?.data?.error || ''

  if (isLoading) return <main className="page-shell"><div className="state">Loading product...</div></main>
  if (error) return <main className="page-shell"><div className="error-state">{error}</div></main>

  const price = Number(product.price).toFixed(2)

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
          <p className="detail-description">{product.description || 'A carefully selected grocery essential for your kitchen.'}</p>
          <p className="detail-price">${price}</p>
          <p className="product-unit">Sold by {product.unit}</p>
          {user ? <button className="button" onClick={() => addItem(product.id)} type="button">Add to cart</button> : <Link className="button inline-button" to="/login">Sign in to add</Link>}
        </div>
      </section>
    </main>
  )
}

export default ProductDetailsPage