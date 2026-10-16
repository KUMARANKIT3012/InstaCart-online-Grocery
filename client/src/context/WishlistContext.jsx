import { useQuery, useQueryClient } from '@tanstack/react-query'
import { addWishlist, fetchWishlist, removeWishlist } from '../api/wishlist.js'
import { useAuth } from './useAuth.js'
import { WishlistContext } from './wishlist-context.js'

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const wishlistQuery = useQuery({ queryKey: ['wishlist'], queryFn: fetchWishlist, enabled: Boolean(user) })
  const products = wishlistQuery.data || []

  async function toggle(product) {
    const isSaved = products.some((item) => item.id === product.id)
    const updated = isSaved ? await removeWishlist(product.id) : await addWishlist(product.id)
    queryClient.setQueryData(['wishlist'], updated)
    return !isSaved
  }

  return <WishlistContext.Provider value={{ products: user ? products : [], isLoading: Boolean(user && wishlistQuery.isLoading), toggle, isWishlisted: (id) => products.some((item) => item.id === id) }}>{children}</WishlistContext.Provider>
}