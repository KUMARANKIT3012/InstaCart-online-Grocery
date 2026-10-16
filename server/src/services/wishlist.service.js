import { pool } from '../../config/db.js'

export async function getWishlist(userId) {
  const { rows } = await pool.query(
    `
      SELECT p.id, p.name, p.slug, p.description, p.price, p.unit, p.image_url,
             c.name AS category_name, c.slug AS category_slug,
             wi.created_at AS saved_at
      FROM wishlist_items wi
      JOIN products p ON p.id = wi.product_id
      JOIN categories c ON c.id = p.category_id
      WHERE wi.user_id = $1 AND p.is_active = TRUE
      ORDER BY wi.created_at DESC
    `,
    [userId],
  )
  return rows
}

export async function addWishlistItem(userId, productId) {
  const { rows: products } = await pool.query(
    'SELECT id FROM products WHERE id = $1 AND is_active = TRUE',
    [productId],
  )
  if (products.length === 0) {
    const error = new Error('Product not found or unavailable')
    error.statusCode = 404
    throw error
  }

  await pool.query(
    'INSERT INTO wishlist_items (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [userId, productId],
  )
  return getWishlist(userId)
}

export async function removeWishlistItem(userId, productId) {
  await pool.query('DELETE FROM wishlist_items WHERE user_id = $1 AND product_id = $2', [userId, productId])
  return getWishlist(userId)
}