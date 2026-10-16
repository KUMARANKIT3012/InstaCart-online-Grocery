import { useContext } from 'react'
import { WishlistContext } from './wishlist-context.js'

export function useWishlist() { return useContext(WishlistContext) }