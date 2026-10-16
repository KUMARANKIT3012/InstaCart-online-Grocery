import { Router } from 'express'
import { addWishlist, listWishlist, removeWishlist } from '../controllers/wishlist.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validation.middleware.js'
import { productIdParamSchema } from '../validation/schemas.js'

const wishlistRouter = Router()
wishlistRouter.use(requireAuth)
wishlistRouter.get('/', listWishlist)
wishlistRouter.post('/:productId', validate(productIdParamSchema, 'params'), addWishlist)
wishlistRouter.delete('/:productId', validate(productIdParamSchema, 'params'), removeWishlist)

export default wishlistRouter