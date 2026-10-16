import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { useCart } from '../context/useCart.js'
import { useWishlist } from '../context/useWishlist.js'
import { useTheme } from '../context/useTheme.js'

function Navbar() {
  const { user, logout } = useAuth()
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
        <button aria-label="Toggle color theme" className="theme-button" onClick={toggleTheme} type="button">{theme === 'light' ? '☾' : '☀'}</button>
        {user ? <><Link to="/account">{user.first_name}</Link>{user.role === 'admin' && <Link to="/admin">Admin</Link>}<Link to="/orders">Orders</Link><Link to="/wishlist">Favorites ({favorites.length})</Link><Link className="cart-button" to="/cart">Cart ({itemCount})</Link><button className="sign-out-button" onClick={logout} type="button">Sign out</button></> : <Link className="cart-button" to="/login">Sign in</Link>}
      </nav>
    </header>
  )
}

export default Navbar