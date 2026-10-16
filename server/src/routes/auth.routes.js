import { Router } from 'express'
import {
  getMe,
  login,
  register,
} from '../controllers/auth.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validation.middleware.js'
import { loginSchema, registerSchema } from '../validation/schemas.js'
import rateLimit from 'express-rate-limit'

const authRouter = Router()
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler(req, res) {
    res.status(429).json({ error: 'Too many authentication attempts', code: 'RATE_LIMITED' })
  },
})

authRouter.post('/register', authLimiter, validate(registerSchema, 'body'), register)
authRouter.post('/login', authLimiter, validate(loginSchema, 'body'), login)
authRouter.get('/me', requireAuth, getMe)

export default authRouter