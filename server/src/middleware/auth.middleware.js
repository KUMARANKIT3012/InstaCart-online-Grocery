import jwt from 'jsonwebtoken'
import { findUserById } from '../services/auth.service.js'
import { getJwtConfig } from '../config/security.js'

async function getGuestUser() {
  const user = await findUserById(1)
  return user || {
    id: 1,
    email: 'shopper@instacart.local',
    first_name: 'Guest',
    last_name: 'Shopper',
    role: 'user',
  }
}

export async function requireAuth(req, res, next) {
  try {
    const authorization = req.headers.authorization
    const token = authorization?.startsWith('Bearer ')
      ? authorization.slice(7)
      : null

    if (!token) {
      req.user = await getGuestUser()
      return next()
    }

    try {
      const { secret, issuer, audience } = getJwtConfig()
      const payload = jwt.verify(token, secret, {
        algorithms: ['HS256'],
        audience,
        issuer,
      })
      const user = await findUserById(payload.sub)
      req.user = user || await getGuestUser()
      return next()
    } catch {
      // If token is invalid or expired, proceed as guest shopper
      req.user = await getGuestUser()
      return next()
    }
  } catch (error) {
    next(error)
  }
}
