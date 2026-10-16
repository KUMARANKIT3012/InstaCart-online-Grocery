import { z } from 'zod'

const password = z.string()
  .min(8)
  .max(128)
  .refine((value) => Buffer.byteLength(value, 'utf8') <= 72, 'Password must be at most 72 UTF-8 bytes')

export const registerSchema = z.object({
  email: z.string().trim().email().max(255),
  password,
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  phone: z.string().trim().max(30).optional(),
}).strict()

export const loginSchema = z.object({
  email: z.string().trim().email().max(255),
  password,
}).strict()

export const productQuerySchema = z.object({
  category: z.string().trim().max(120).optional(),
  search: z.string().trim().max(100).optional(),
  name: z.string().trim().max(100).optional(),
  minPrice: z.coerce.number().finite().min(0).optional(),
  maxPrice: z.coerce.number().finite().min(0).optional(),
  sort: z.enum(['newest', 'name_asc', 'name_desc', 'price_asc', 'price_desc']).optional(),
  page: z.coerce.number().int().min(1).max(10000).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
}).strict()

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
}).strict()

export const productIdParamSchema = z.object({
  productId: z.coerce.number().int().positive(),
}).strict()

export const cartItemSchema = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive().max(999),
}).strict()

export const cartQuantitySchema = z.object({
  quantity: z.coerce.number().int().positive().max(999),
}).strict()

export const deliveryAddressSchema = z.object({
  deliveryAddress: z.string().trim().min(5).max(500),
}).strict()

const productFields = {
  name: z.string().trim().min(1).max(200),
  slug: z.string().trim().min(1).max(220).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(2000).nullable().optional(),
  price: z.coerce.number().finite().min(0).max(99999999.99),
  unit: z.string().trim().min(1).max(50),
  imageUrl: z.union([z.string().trim().url().max(2048), z.literal(''), z.null()]).optional(),
  stockQuantity: z.coerce.number().int().min(0).max(2147483647),
  categoryId: z.coerce.number().int().positive(),
  isActive: z.preprocess((value) => value === 'true' ? true : value === 'false' ? false : value, z.boolean().optional()),
}

export const createProductSchema = z.object(productFields).strict()
export const updateProductSchema = z.object(productFields).partial().strict()
export const inventorySchema = z.object({
  stockQuantity: productFields.stockQuantity,
}).strict()

export const createCategorySchema = z.object({
  name: z.string().trim().min(1).max(100),
  slug: productFields.slug,
}).strict()
export const updateCategorySchema = createCategorySchema.partial().strict()

export const orderStatusSchema = z.object({
  status: z.enum(['placed', 'packed', 'out_for_delivery', 'delivered', 'cancelled']),
}).strict()