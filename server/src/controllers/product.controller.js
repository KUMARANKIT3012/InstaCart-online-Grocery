import {
  findProductById,
  listProducts,
} from '../services/product.service.js'

export async function getProducts(req, res, next) {
  try {
    // Zod middleware already validated and coerced these values.
    const limit = Number(req.query.limit) || 12
    const page = Number(req.query.page) || 1
    const minPrice = req.query.minPrice !== undefined ? Number(req.query.minPrice) : null
    const maxPrice = req.query.maxPrice !== undefined ? Number(req.query.maxPrice) : null
    const sort = req.query.sort || 'name_asc'

    const result = await listProducts({
      category: req.query.category,
      search: req.query.search || req.query.name,
      minPrice,
      maxPrice,
      sort,
      limit,
      offset: (page - 1) * limit,
    })

    res.status(200).json({
      data: result.products,
      pagination: {
        page,
        limit,
        totalItems: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function getProductById(req, res, next) {
  try {
    const productId = Number(req.params.id)

    if (!Number.isInteger(productId) || productId <= 0) {
      const error = new Error('Product ID must be a positive integer')
      error.statusCode = 400
      throw error
    }

    const product = await findProductById(productId)

    if (!product) {
      const error = new Error('Product not found')
      error.statusCode = 404
      throw error
    }

    res.status(200).json({ data: product })
  } catch (error) {
    next(error)
  }
}