import { getHealthStatus } from '../services/health.service.js'

export async function getHealth(req, res, next) {
  try {
    const health = await getHealthStatus()
    res.status(200).json(health)
  } catch (error) {
    next(error)
  }
}