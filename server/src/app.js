import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import healthRouter from './routes/health.routes.js'
import productRouter from './routes/product.routes.js'
import categoryRouter from './routes/category.routes.js'
import authRouter from './routes/auth.routes.js'
import cartRouter from './routes/cart.routes.js'
import orderRouter from './routes/order.routes.js'
import adminRouter from './routes/admin.routes.js'
import wishlistRouter from './routes/wishlist.routes.js'
import { errorHandler } from './middleware/error.middleware.js'
import { stripeWebhook } from './controllers/webhook.controller.js'

const app = express()
const allowedOrigins = (process.env.CLIENT_URL || '')
	.split(',')
	.map((origin) => origin.trim())
	.filter(Boolean)

if (process.env.NODE_ENV === 'production' && allowedOrigins.length === 0) {
	throw new Error('CLIENT_URL must be configured in production')
}

app.use(helmet())
app.use(cors({
	credentials: true,
	methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
	origin(origin, callback) {
		if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
		const error = new Error('Origin is not allowed')
		error.statusCode = 403
		error.appCode = 'CORS_ORIGIN_DENIED'
		return callback(error)
	},
}))
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhook)
app.use(express.json({ limit: '10kb' }))
app.use('/api', healthRouter)
app.use('/api/products', productRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/auth', authRouter)
app.use('/api/cart', cartRouter)
app.use('/api/orders', orderRouter)
app.use('/api/admin', adminRouter)
app.use('/api/wishlist', wishlistRouter)
app.use(errorHandler)

export default app