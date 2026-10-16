import { Router } from 'express'
import {
  getCategories,
  getOrders,
  getProducts,
  patchCategory,
  patchInventory,
  patchOrderStatus,
  patchProduct,
  postCategory,
  postProduct,
  removeCategory,
  removeProduct,
} from '../controllers/admin.controller.js'
import { requireAdmin } from '../middleware/admin.middleware.js'
import { productImageUpload } from '../middleware/upload.middleware.js'
import { validate } from '../middleware/validation.middleware.js'
import {
  createCategorySchema,
  createProductSchema,
  idParamSchema,
  inventorySchema,
  orderStatusSchema,
  updateCategorySchema,
  updateProductSchema,
} from '../validation/schemas.js'

const adminRouter = Router()
adminRouter.use(requireAdmin)

adminRouter.get('/products', getProducts)
adminRouter.post('/products', productImageUpload, validate(createProductSchema, 'body'), postProduct)
adminRouter.patch('/products/:id', productImageUpload, validate(idParamSchema, 'params'), validate(updateProductSchema, 'body'), patchProduct)
adminRouter.patch('/products/:id/inventory', validate(idParamSchema, 'params'), validate(inventorySchema, 'body'), patchInventory)
adminRouter.delete('/products/:id', validate(idParamSchema, 'params'), removeProduct)

adminRouter.get('/categories', getCategories)
adminRouter.post('/categories', validate(createCategorySchema, 'body'), postCategory)
adminRouter.patch('/categories/:id', validate(idParamSchema, 'params'), validate(updateCategorySchema, 'body'), patchCategory)
adminRouter.delete('/categories/:id', validate(idParamSchema, 'params'), removeCategory)

adminRouter.get('/orders', getOrders)
adminRouter.patch('/orders/:id/status', validate(idParamSchema, 'params'), validate(orderStatusSchema, 'body'), patchOrderStatus)

export default adminRouter