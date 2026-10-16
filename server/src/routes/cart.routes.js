import { Router } from 'express'
import {
  addItem,
  clearItems,
  getCart,
  removeItem,
  updateItem,
} from '../controllers/cart.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validation.middleware.js'
import { cartItemSchema, cartQuantitySchema, productIdParamSchema } from '../validation/schemas.js'

const cartRouter = Router()

cartRouter.use(requireAuth)
cartRouter.get('/', getCart)
cartRouter.post('/items', validate(cartItemSchema, 'body'), addItem)
cartRouter.patch('/items/:productId', validate(productIdParamSchema, 'params'), validate(cartQuantitySchema, 'body'), updateItem)
cartRouter.delete('/items/:productId', validate(productIdParamSchema, 'params'), removeItem)
cartRouter.delete('/', clearItems)

export default cartRouter