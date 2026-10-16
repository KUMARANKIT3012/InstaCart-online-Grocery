import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addCartItem,
  clearCart,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from '../api/cart.js'
import { useAuth } from './useAuth.js'
import { CartContext } from './cart-context.js'

const emptyCart = { items: [], subtotal: '0.00' }

export function CartProvider({ children }) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const cartQuery = useQuery({ queryKey: ['cart'], queryFn: fetchCart, enabled: Boolean(user) })

  async function runCartAction(action) {
    const updatedCart = await action()
    queryClient.setQueryData(['cart'], updatedCart)
    return updatedCart
  }

  async function refreshCart() {
    if (!user) return emptyCart
    return queryClient.fetchQuery({ queryKey: ['cart'], queryFn: fetchCart })
  }

  const value = {
    cart: user ? (cartQuery.data || emptyCart) : emptyCart,
    error: cartQuery.error?.response?.data?.error || '',
    isLoading: Boolean(user && cartQuery.isLoading),
    refreshCart,
    addItem: (productId, quantity = 1) => runCartAction(() => addCartItem(productId, quantity)),
    updateItem: (productId, quantity) => runCartAction(() => updateCartItem(productId, quantity)),
    removeItem: (productId) => runCartAction(() => removeCartItem(productId)),
    clearItems: () => runCartAction(clearCart),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}