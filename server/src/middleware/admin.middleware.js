import { requireAuth } from './auth.middleware.js'

export async function requireAdmin(req, res, next) {
  await requireAuth(req, res, (error) => {
    if (error) return next(error)

    if (req.user.role !== 'admin') {
      const forbidden = new Error('Admin access required')
      forbidden.statusCode = 403
      forbidden.appCode = 'FORBIDDEN'
      return next(forbidden)
    }

    return next()
  })
}