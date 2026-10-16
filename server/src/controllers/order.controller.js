import {
  createOrder,
  getOrderById,
  getOrdersForUser,
} from '../services/order.service.js'

function parseOrderId(value) {
  const orderId = Number(value)
  if (!Number.isInteger(orderId) || orderId <= 0) {
    const error = new Error('Order ID must be a positive integer')
    error.statusCode = 400
    throw error
  }
  return orderId
}

export async function checkout(req, res, next) {
  try {
    const deliveryAddress = req.body.deliveryAddress
    if (typeof deliveryAddress !== 'string' || deliveryAddress.trim().length < 5) {
      const error = new Error('A delivery address of at least 5 characters is required')
      error.statusCode = 400
      throw error
    }

    const order = await createOrder(req.user.id, deliveryAddress.trim())
    res.status(201).json({ order, clientSecret: order.payment_intent_client_secret })
  } catch (error) {
    next(error)
  }
}

export async function getOrders(req, res, next) {
  try {
    res.status(200).json({ orders: await getOrdersForUser(req.user.id) })
  } catch (error) {
    next(error)
  }
}

export async function getOrder(req, res, next) {
  try {
    const order = await getOrderById(req.user.id, parseOrderId(req.params.id))
    res.status(200).json({ order })
  } catch (error) {
    next(error)
  }
}