import { Router } from 'express'
import {
  checkout,
  getOrder,
  getOrders,
} from '../controllers/order.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validation.middleware.js'
import { deliveryAddressSchema, idParamSchema } from '../validation/schemas.js'

const orderRouter = Router()

orderRouter.use(requireAuth)
orderRouter.post('/', validate(deliveryAddressSchema, 'body'), checkout)
orderRouter.get('/', getOrders)
orderRouter.get('/:id', validate(idParamSchema, 'params'), getOrder)

export default orderRouter