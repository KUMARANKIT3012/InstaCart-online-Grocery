import { useContext } from 'react'
import { CartContext } from './cart-context.js'

export function useCart() {
  return useContext(CartContext)
}