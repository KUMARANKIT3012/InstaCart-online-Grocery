import jwt from 'jsonwebtoken'
import { findUserById } from '../services/auth.service.js'
import { getJwtConfig } from '../config/security.js'

export async function requireAuth(req, res, next) {
  try {
    const authorization = req.headers.authorization
    const token = authorization?.startsWith('Bearer ')
      ? authorization.slice(7)
      : null

    if (!token) {
      const error = new Error('Authentication required')
      error.statusCode = 401
      throw error
    }

    const { secret, issuer, audience } = getJwtConfig()
    const payload = jwt.verify(token, secret, {
      algorithms: ['HS256'],
      audience,
      issuer,
    })
    const user = await findUserById(payload.sub)

    if (!user) {
      const error = new Error('User account not found')
      error.statusCode = 401
      throw error
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      error.statusCode = 401
      error.message = 'Invalid or expired token'
    }
    next(error)
  }
}