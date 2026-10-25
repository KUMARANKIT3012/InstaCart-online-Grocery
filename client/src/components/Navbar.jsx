import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/useCart.js'
import { useWishlist } from '../context/useWishlist.js'
import { useTheme } from '../context/useTheme.js'

function Navbar() {
  const { cart } = useCart()
  const { products: favorites } = useWishlist()
  const { theme, toggleTheme } = useTheme()
  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="navbar">
      <Link className="brand" to="/">INSTACART</Link>
      <nav className="nav-links" aria-label="Main navigation">
        <NavLink to="/" end>Shop</NavLink>
        <a href="#categories">Categories</a>
        <button aria-label="Toggle color theme" className="theme-button" onClick={toggleTheme} type="button">
          {theme === 'light' ? '☾' : '☀'}
        </button>
        <Link to="/orders">Orders</Link>
        <Link to="/wishlist">Favorites ({favorites.length})</Link>
        <Link className="cart-button" to="/cart">Cart ({itemCount})</Link>
      </nav>
    </header>
  )
}

export default Navbar
