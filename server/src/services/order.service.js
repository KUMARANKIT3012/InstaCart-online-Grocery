import { pool } from '../../config/db.js'
import { createOrderPaymentIntent } from './payment.service.js'
import { invalidateProductCache } from './product.service.js'

function orderWithItems(order, items) {
  return { ...order, items }
}

function orderWithHistory(order, items, statusHistory) {
  return { ...orderWithItems(order, items), status_history: statusHistory }
}

export async function createOrder(userId, deliveryAddress) {
  const client = await pool.connect()
  let order

  try {
    await client.query('BEGIN')

    const { rows: cartItems } = await client.query(
      `
        SELECT ci.product_id, ci.quantity, p.name, p.price, p.stock_quantity, p.is_active
        FROM cart_items ci
        JOIN products p ON p.id = ci.product_id
        WHERE ci.user_id = $1
        ORDER BY ci.created_at ASC
        FOR UPDATE OF ci, p
      `,
      [userId],
    )

    if (cartItems.length === 0) {
      const error = new Error('Your cart is empty')
      error.statusCode = 400
      throw error
    }

    for (const item of cartItems) {
      if (!item.is_active) {
        const error = new Error(`${item.name} is no longer available`)
        error.statusCode = 409
        throw error
      }

      if (item.stock_quantity < item.quantity) {
        const error = new Error(`Insufficient stock for ${item.name}`)
        error.statusCode = 409
        throw error
      }
    }

    const subtotal = cartItems
      .reduce((total, item) => total + Number(item.price) * item.quantity, 0)
      .toFixed(2)
    const tax = '0.00'
    const deliveryFee = '0.00'
    const total = subtotal

    const { rows: orderRows } = await client.query(
      `
        INSERT INTO orders (user_id, subtotal, tax, delivery_fee, total, delivery_address, payment_status)
        VALUES ($1, $2, $3, $4, $5, $6, 'pending')
        RETURNING id, user_id, status, subtotal, tax, delivery_fee, total,
                  delivery_address, payment_intent_id, payment_status, created_at, updated_at
      `,
      [userId, subtotal, tax, deliveryFee, total, deliveryAddress],
    )
    order = orderRows[0]

    await client.query(
      'INSERT INTO order_status_history (order_id, status) VALUES ($1, $2)',
      [order.id, order.status],
    )

    for (const item of cartItems) {
      await client.query(
        `
          UPDATE products
          SET stock_quantity = stock_quantity - $1, updated_at = NOW()
          WHERE id = $2
        `,
        [item.quantity, item.product_id],
      )
      await client.query(
        `
          INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity)
          VALUES ($1, $2, $3, $4, $5)
        `,
        [order.id, item.product_id, item.name, item.price, item.quantity],
      )
    }

    await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId])
    await client.query('COMMIT')
    invalidateProductCache()
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }

  // Stripe is optional. If it is not configured or the call fails, still return the
  // order so the user sees their confirmation. Payment status stays 'unpaid'.
  try {
    const paymentIntent = await createOrderPaymentIntent({ orderId: order.id, userId, total: order.total })
    await markOrderPaymentIntent(order.id, paymentIntent.id)
    const persistedOrder = await getOrderById(userId, order.id)
    return { ...persistedOrder, payment_intent_client_secret: paymentIntent.client_secret }
  } catch (paymentError) {
    // Not a fatal error — the order and stock changes are already committed.
    console.warn('Payment intent creation skipped:', paymentError.message)
    const persistedOrder = await getOrderById(userId, order.id)
    return persistedOrder
  }
}

export async function getOrdersForUser(userId) {
  const { rows: orders } = await pool.query(
    `
            SELECT id, user_id, status, subtotal, tax, delivery_fee, total,
              delivery_address, payment_intent_id, payment_status, created_at, updated_at
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC
    `,
    [userId],
  )

  if (orders.length === 0) return []

  const { rows: items } = await pool.query(
    `
      SELECT id, order_id, product_id, product_name, unit_price, quantity,
             line_total, created_at
      FROM order_items
      WHERE order_id = ANY($1::BIGINT[])
      ORDER BY created_at ASC
    `,
    [orders.map((order) => order.id)],
  )

  return orders.map((order) => orderWithItems(
    order,
    items.filter((item) => item.order_id === order.id),
  ))
}

export async function getOrderById(userId, orderId) {
  const { rows } = await pool.query(
    `
            SELECT id, user_id, status, subtotal, tax, delivery_fee, total,
              delivery_address, payment_intent_id, payment_status, created_at, updated_at
      FROM orders
      WHERE id = $1 AND user_id = $2
    `,
    [orderId, userId],
  )

  if (rows.length === 0) {
    const error = new Error('Order not found')
    error.statusCode = 404
    throw error
  }

  const { rows: items } = await pool.query(
    `
      SELECT id, order_id, product_id, product_name, unit_price, quantity,
             line_total, created_at
      FROM order_items
      WHERE order_id = $1
      ORDER BY created_at ASC
    `,
    [orderId],
  )

  const { rows: statusHistory } = await pool.query(
    `
      SELECT id, status, created_at
      FROM order_status_history
      WHERE order_id = $1
      ORDER BY created_at ASC
    `,
    [orderId],
  )

  return orderWithHistory(rows[0], items, statusHistory)
}

export async function getAllOrders() {
  const { rows: orders } = await pool.query(
    `
            SELECT o.id, o.user_id, o.status, o.subtotal, o.tax, o.delivery_fee, o.total,
              o.delivery_address, o.payment_intent_id, o.payment_status, o.created_at, o.updated_at,
             u.email AS user_email, u.first_name AS user_first_name, u.last_name AS user_last_name
      FROM orders o
      JOIN users u ON u.id = o.user_id
      ORDER BY o.created_at DESC
    `,
  )

  if (orders.length === 0) return []

  const { rows: items } = await pool.query(
    `
      SELECT id, order_id, product_id, product_name, unit_price, quantity,
             line_total, created_at
      FROM order_items
      WHERE order_id = ANY($1::BIGINT[])
      ORDER BY created_at ASC
    `,
    [orders.map((order) => order.id)],
  )

  return orders.map((order) => orderWithItems(
    order,
    items.filter((item) => item.order_id === order.id),
  ))
}

export async function updateOrderStatus(orderId, status) {
  const { rows } = await pool.query(
    `
      UPDATE orders
      SET status = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING id, user_id, status, subtotal, tax, delivery_fee, total,
            delivery_address, payment_intent_id, payment_status, created_at, updated_at
    `,
    [orderId, status],
  )

  if (rows.length === 0) return null

  await pool.query(
    'INSERT INTO order_status_history (order_id, status) VALUES ($1, $2)',
    [orderId, status],
  )

  const { rows: items } = await pool.query(
    `
      SELECT id, order_id, product_id, product_name, unit_price, quantity,
             line_total, created_at
      FROM order_items
      WHERE order_id = $1
      ORDER BY created_at ASC
    `,
    [orderId],
  )

  const { rows: statusHistory } = await pool.query(
    'SELECT id, status, created_at FROM order_status_history WHERE order_id = $1 ORDER BY created_at ASC',
    [orderId],
  )

  return orderWithHistory(rows[0], items, statusHistory)
}

async function markOrderPaymentIntent(orderId, paymentIntentId) {
  await pool.query(
    `
      UPDATE orders
      SET payment_intent_id = $2, payment_status = 'pending', updated_at = NOW()
      WHERE id = $1
    `,
    [orderId, paymentIntentId],
  )
}

export async function markOrderPaymentStatus(orderId, paymentStatus, paymentIntentId = null) {
  await pool.query(
    `
      UPDATE orders
      SET payment_status = $2,
          payment_intent_id = COALESCE($3, payment_intent_id),
          updated_at = NOW()
      WHERE id = $1
    `,
    [orderId, paymentStatus, paymentIntentId],
  )
}