import { pool } from '../../config/db.js'
import { getCached, invalidateCachePrefix, setCached } from '../config/cache.js'

export async function listCategories() {
  const cached = getCached('categories:list')
  if (cached) return cached
  const query = `
    SELECT id, name, slug, created_at, updated_at
    FROM categories
    ORDER BY name ASC
  `

  const { rows } = await pool.query(query)
  return setCached('categories:list', rows, 300_000)
}

export function invalidateCategoryCache() {
  invalidateCachePrefix('categories:')
}