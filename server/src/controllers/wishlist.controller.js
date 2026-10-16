import {
  addWishlistItem,
  getWishlist,
  removeWishlistItem,
} from '../services/wishlist.service.js'

export async function listWishlist(req, res, next) {
  try { res.json({ products: await getWishlist(req.user.id) }) } catch (error) { next(error) }
}

export async function addWishlist(req, res, next) {
  try { res.status(201).json({ products: await addWishlistItem(req.user.id, req.params.productId) }) } catch (error) { next(error) }
}

export async function removeWishlist(req, res, next) {
  try { res.json({ products: await removeWishlistItem(req.user.id, req.params.productId) }) } catch (error) { next(error) }
}