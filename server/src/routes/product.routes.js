import { Router } from 'express'
import {
  getProductById,
  getProducts,
} from '../controllers/product.controller.js'
import { validate } from '../middleware/validation.middleware.js'
import { idParamSchema, productQuerySchema } from '../validation/schemas.js'

const productRouter = Router()

productRouter.get('/', validate(productQuerySchema, 'query'), getProducts)
productRouter.get('/:id', validate(idParamSchema, 'params'), getProductById)

export default productRouter