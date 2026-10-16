import { pool } from '../../config/db.js'
import { invalidateProductCache } from './product.service.js'
import { invalidateCategoryCache } from './category.service.js'

const productSelect = `
  SELECT p.id, p.name, p.slug, p.description, p.price, p.unit, p.image_url,
         p.stock_quantity, p.is_active, p.created_at, p.updated_at,
         c.id AS category_id, c.name AS category_name, c.slug AS category_slug
  FROM products p
  JOIN categories c ON c.id = p.category_id
`

export async function listAdminProducts() {
  const { rows } = await pool.query(`${productSelect} ORDER BY p.created_at DESC`)
  return rows
}

export async function createProduct(product) {
  const { rows } = await pool.query(
    `
      INSERT INTO products (category_id, name, slug, description, price, unit, image_url, stock_quantity, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `,
    [product.categoryId, product.name, product.slug, product.description || null, product.price, product.unit, product.imageUrl || null, product.stockQuantity, product.isActive ?? true],
  )
  invalidateProductCache()
  return getAdminProductById(rows[0].id)
}

export async function getAdminProductById(productId) {
  const { rows } = await pool.query(`${productSelect} WHERE p.id = $1`, [productId])
  return rows[0] || null
}

const productUpdateColumns = {
  name: 'name',
  slug: 'slug',
  description: 'description',
  price: 'price',
  unit: 'unit',
  imageUrl: 'image_url',
  stockQuantity: 'stock_quantity',
  categoryId: 'category_id',
  isActive: 'is_active',
}

async function updateByAllowlist(table, id, values, columns, selectQuery) {
  const updates = Object.entries(values).filter(([key]) => columns[key])
  if (updates.length === 0) return null

  const setClause = updates.map(([key], index) => `${columns[key]} = $${index + 2}`).join(', ')
  const params = [id, ...updates.map(([, value]) => value)]
  const { rows } = await pool.query(
    `UPDATE ${table} SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING id`,
    params,
  )
  return rows[0] ? selectQuery(rows[0].id) : null
}

export async function updateProduct(productId, values) {
  const product = { ...values }
  if ('description' in product) product.description = product.description || null
  if ('imageUrl' in product) product.imageUrl = product.imageUrl || null
  const updated = await updateByAllowlist('products', productId, product, productUpdateColumns, getAdminProductById)
  if (updated) invalidateProductCache()
  return updated
}

export async function deleteProduct(productId) {
  const { rowCount } = await pool.query(
    'UPDATE products SET is_active = FALSE, updated_at = NOW() WHERE id = $1 AND is_active = TRUE',
    [productId],
  )
  if (rowCount > 0) invalidateProductCache()
  return rowCount > 0
}

export async function listAdminCategories() {
  const { rows } = await pool.query(
    `
      SELECT c.id, c.name, c.slug, c.created_at, c.updated_at,
             COUNT(p.id)::INTEGER AS product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id AND p.is_active = TRUE
      GROUP BY c.id
      ORDER BY c.name ASC
    `,
  )
  return rows
}

export async function createCategory({ name, slug }) {
  const { rows } = await pool.query(
    'INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING id, name, slug, created_at, updated_at',
    [name, slug],
  )
  invalidateCategoryCache()
  invalidateProductCache()
  return rows[0]
}

export async function updateCategory(categoryId, values) {
  const updated = await updateByAllowlist(
    'categories',
    categoryId,
    values,
    { name: 'name', slug: 'slug' },
    async (id) => {
      const { rows } = await pool.query('SELECT id, name, slug, created_at, updated_at FROM categories WHERE id = $1', [id])
      return rows[0] || null
    },
  )
  if (updated) {
    invalidateCategoryCache()
    invalidateProductCache()
  }
  return updated
}

export async function deleteCategory(categoryId) {
  const { rowCount } = await pool.query('DELETE FROM categories WHERE id = $1', [categoryId])
  if (rowCount > 0) {
    invalidateCategoryCache()
    invalidateProductCache()
  }
  return rowCount > 0
}

export async function updateInventory(productId, stockQuantity) {
  const { rows } = await pool.query(
    `
      UPDATE products
      SET stock_quantity = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING id, name, stock_quantity, is_active
    `,
    [productId, stockQuantity],
  )
  if (rows[0]) invalidateProductCache()
  return rows[0] || null
}