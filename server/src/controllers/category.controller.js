import { listCategories } from '../services/category.service.js'

export async function getCategories(req, res, next) {
  try {
    const categories = await listCategories()
    res.status(200).json({ data: categories })
  } catch (error) {
    next(error)
  }
}