import { pool } from '../../config/db.js'
import { getCached, invalidateCachePrefix, setCached } from '../config/cache.js'

const sortExpressions = {
  newest: 'p.created_at DESC, p.id DESC',
  name_asc: 'p.name ASC, p.id ASC',
  name_desc: 'p.name DESC, p.id DESC',
  price_asc: 'p.price ASC, p.id ASC',
  price_desc: 'p.price DESC, p.id DESC',
}

export async function listProducts({ category, search, minPrice, maxPrice, sort, limit, offset }) {
  const cacheKey = `products:list:${JSON.stringify({ category, search, minPrice, maxPrice, sort, limit, offset })}`
  const cached = getCached(cacheKey)
  if (cached) return cached
  const sortExpression = sortExpressions[sort] || sortExpressions.name_asc
  const filters = `
    WHERE p.is_active = TRUE
      AND ($1::text IS NULL OR c.slug = $1)
      AND ($2::text IS NULL OR p.name ILIKE $2)
      AND ($3::numeric IS NULL OR p.price >= $3)
      AND ($4::numeric IS NULL OR p.price <= $4)
  `
  const query = `
    SELECT
      p.id,
      p.name,
      p.slug,
      p.description,
      p.price,
      p.unit,
      p.image_url,
      p.stock_quantity,
      p.is_active,
      c.id AS category_id,
      c.name AS category_name,
      c.slug AS category_slug
    FROM products p
    JOIN categories c ON c.id = p.category_id
    ${filters}
    ORDER BY ${sortExpression}
    LIMIT $5 OFFSET $6
  `
  const values = [
    category || null,
    search ? `%${search}%` : null,
    minPrice ?? null,
    maxPrice ?? null,
    limit,
    offset,
  ]

  const countQuery = `
    SELECT COUNT(*)::INTEGER AS total
    FROM products p
    JOIN categories c ON c.id = p.category_id
    ${filters}
  `
  const [{ rows }, { rows: countRows }] = await Promise.all([
    pool.query(query, values),
    pool.query(countQuery, values.slice(0, 4)),
  ])

  return setCached(cacheKey, { products: rows, total: countRows[0].total }, 30_000)
}

export async function findProductById(id) {
  const cacheKey = `products:item:${id}`
  const cached = getCached(cacheKey)
  if (cached) return cached
  const query = `
    SELECT
      p.id,
      p.name,
      p.slug,
      p.description,
      p.price,
      p.unit,
      p.image_url,
      p.stock_quantity,
      p.is_active,
      c.id AS category_id,
      c.name AS category_name,
      c.slug AS category_slug
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE p.id = $1 AND p.is_active = TRUE
  `

  const { rows } = await pool.query(query, [id])
  return setCached(cacheKey, rows[0] || null, 60_000)
}

export function invalidateProductCache() {
  invalidateCachePrefix('products:')
}