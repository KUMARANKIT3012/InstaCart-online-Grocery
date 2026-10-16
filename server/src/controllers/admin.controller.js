import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  listAdminCategories,
  listAdminProducts,
  updateCategory,
  updateInventory,
  updateProduct,
} from '../services/admin.service.js'
import { getAllOrders, updateOrderStatus } from '../services/order.service.js'
import { uploadProductImage } from '../config/cloudinary.js'

function positiveId(value, label) {
  const id = Number(value)
  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error(`${label} must be a positive integer`)
    error.statusCode = 400
    throw error
  }
  return id
}

function requireChanges(values) {
  if (Object.keys(values).length === 0) {
    const error = new Error('At least one field must be provided')
    error.statusCode = 400
    throw error
  }
}

export async function getProducts(req, res, next) {
  try { res.json({ products: await listAdminProducts() }) } catch (error) { next(error) }
}

export async function postProduct(req, res, next) {
  try {
    const product = { ...req.body }
    if (req.file) product.imageUrl = (await uploadProductImage(req.file.buffer)).secure_url
    res.status(201).json({ product: await createProduct(product) })
  } catch (error) { next(error) }
}

export async function patchProduct(req, res, next) {
  try {
    const productId = positiveId(req.params.id, 'Product ID')
    requireChanges(req.body)
    const productValues = { ...req.body }
    if (req.file) productValues.imageUrl = (await uploadProductImage(req.file.buffer)).secure_url
    const product = await updateProduct(productId, productValues)
    if (!product) { const error = new Error('Product not found'); error.statusCode = 404; throw error }
    res.json({ product })
  } catch (error) { next(error) }
}

export async function removeProduct(req, res, next) {
  try {
    const deleted = await deleteProduct(positiveId(req.params.id, 'Product ID'))
    if (!deleted) { const error = new Error('Product not found'); error.statusCode = 404; throw error }
    res.status(204).send()
  } catch (error) { next(error) }
}

export async function patchInventory(req, res, next) {
  try {
    const product = await updateInventory(positiveId(req.params.id, 'Product ID'), req.body.stockQuantity)
    if (!product) { const error = new Error('Product not found'); error.statusCode = 404; throw error }
    res.json({ product })
  } catch (error) { next(error) }
}

export async function getCategories(req, res, next) {
  try { res.json({ categories: await listAdminCategories() }) } catch (error) { next(error) }
}

export async function postCategory(req, res, next) {
  try { res.status(201).json({ category: await createCategory(req.body) }) } catch (error) { next(error) }
}

export async function patchCategory(req, res, next) {
  try {
    requireChanges(req.body)
    const category = await updateCategory(positiveId(req.params.id, 'Category ID'), req.body)
    if (!category) { const error = new Error('Category not found'); error.statusCode = 404; throw error }
    res.json({ category })
  } catch (error) { next(error) }
}

export async function removeCategory(req, res, next) {
  try {
    const deleted = await deleteCategory(positiveId(req.params.id, 'Category ID'))
    if (!deleted) { const error = new Error('Category not found'); error.statusCode = 404; throw error }
    res.status(204).send()
  } catch (error) { next(error) }
}

export async function getOrders(req, res, next) {
  try { res.json({ orders: await getAllOrders() }) } catch (error) { next(error) }
}

export async function patchOrderStatus(req, res, next) {
  try {
    const order = await updateOrderStatus(positiveId(req.params.id, 'Order ID'), req.body.status)
    if (!order) { const error = new Error('Order not found'); error.statusCode = 404; throw error }
    res.json({ order })
  } catch (error) { next(error) }
}