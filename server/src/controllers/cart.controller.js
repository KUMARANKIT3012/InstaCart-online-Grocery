import {
  addCartItem,
  clearCart,
  getCartForUser,
  removeCartItem,
  updateCartItem,
} from '../services/cart.service.js'

function parsePositiveInteger(value, fieldName) {
  const parsedValue = Number(value)

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    const error = new Error(`${fieldName} must be a positive integer`)
    error.statusCode = 400
    throw error
  }

  return parsedValue
}

function getProductId(req) {
  return parsePositiveInteger(req.params.productId, 'Product ID')
}

function getQuantity(req) {
  return parsePositiveInteger(req.body.quantity, 'Quantity')
}

export async function getCart(req, res, next) {
  try {
    res.status(200).json(await getCartForUser(req.user.id))
  } catch (error) {
    next(error)
  }
}

export async function addItem(req, res, next) {
  try {
    const productId = parsePositiveInteger(req.body.productId, 'Product ID')
    const quantity = getQuantity(req)
    res.status(200).json(await addCartItem(req.user.id, productId, quantity))
  } catch (error) {
    next(error)
  }
}

export async function updateItem(req, res, next) {
  try {
    const productId = getProductId(req)
    const quantity = getQuantity(req)
    res.status(200).json(await updateCartItem(req.user.id, productId, quantity))
  } catch (error) {
    next(error)
  }
}

export async function removeItem(req, res, next) {
  try {
    res.status(200).json(await removeCartItem(req.user.id, getProductId(req)))
  } catch (error) {
    next(error)
  }
}

export async function clearItems(req, res, next) {
  try {
    res.status(200).json(await clearCart(req.user.id))
  } catch (error) {
    next(error)
  }
}