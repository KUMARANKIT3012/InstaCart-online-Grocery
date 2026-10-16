import { pool } from '../../config/db.js'

const cartItemsQuery = `
  SELECT
    ci.product_id,
    ci.quantity,
    p.name,
    p.slug,
    p.price,
    p.unit,
    p.image_url,
    (p.price * ci.quantity)::NUMERIC(12, 2) AS line_total
  FROM cart_items ci
  JOIN products p ON p.id = ci.product_id
  WHERE ci.user_id = $1
  ORDER BY ci.created_at ASC
`

async function getCart(userId) {
  const { rows } = await pool.query(cartItemsQuery, [userId])
  const subtotal = rows.reduce((sum, item) => sum + Number(item.line_total), 0)

  return {
    items: rows,
    subtotal: subtotal.toFixed(2),
  }
}

async function assertProductAvailable(productId) {
  const { rows } = await pool.query(
    'SELECT id FROM products WHERE id = $1 AND is_active = TRUE',
    [productId],
  )

  if (rows.length === 0) {
    const error = new Error('Product not found or unavailable')
    error.statusCode = 404
    throw error
  }
}

export async function getCartForUser(userId) {
  return getCart(userId)
}

export async function addCartItem(userId, productId, quantity) {
  await assertProductAvailable(productId)
  await pool.query(
    `
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, product_id)
      DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity,
                    updated_at = NOW()
    `,
    [userId, productId, quantity],
  )

  return getCart(userId)
}

export async function updateCartItem(userId, productId, quantity) {
  const { rowCount } = await pool.query(
    `
      UPDATE cart_items
      SET quantity = $3, updated_at = NOW()
      WHERE user_id = $1 AND product_id = $2
    `,
    [userId, productId, quantity],
  )

  if (rowCount === 0) {
    const error = new Error('Cart item not found')
    error.statusCode = 404
    throw error
  }

  return getCart(userId)
}

export async function removeCartItem(userId, productId) {
  const { rowCount } = await pool.query(
    'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2',
    [userId, productId],
  )

  if (rowCount === 0) {
    const error = new Error('Cart item not found')
    error.statusCode = 404
    throw error
  }

  return getCart(userId)
}

export async function clearCart(userId) {
  await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId])
  return getCart(userId)
}