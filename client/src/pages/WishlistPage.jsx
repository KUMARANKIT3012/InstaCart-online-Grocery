import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { ProductGridSkeleton } from '../components/Skeleton.jsx'
import { useWishlist } from '../context/useWishlist.js'

function WishlistPage() {
  const { products, isLoading } = useWishlist()

  return (
    <main className="page-shell">
      <div className="section-heading"><div><p className="eyebrow">Saved for later</p><h1>Favorites</h1></div><Link className="back-link" to="/">Continue shopping</Link></div>
      {isLoading && <ProductGridSkeleton />}
      {!isLoading && products.length === 0 && <div className="empty-cart"><h2>No favorites yet.</h2><p>Tap the heart on a product to save it here.</p><Link className="button inline-button" to="/">Browse products</Link></div>}
      {!isLoading && products.length > 0 && <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={{ ...product, category_name: product.category_name }} />)}</div>}
    </main>
  )
}

export default WishlistPage