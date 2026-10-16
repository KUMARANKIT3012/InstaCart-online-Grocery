import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import pg from 'pg'

const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

try {
  for (const fileName of ['schema.sql', 'seed.sql']) {
    const filePath = resolve('db', fileName)
    await pool.query(await readFile(filePath, 'utf8'))
    console.log(`Applied db/${fileName}`)
  }
  console.log('Database setup complete: 8 categories and 40 products are available.')
} catch (error) {
  console.error('Database setup failed:', error.message)
  console.error('Confirm PostgreSQL is running and DATABASE_URL points to the instacart database.')
  process.exitCode = 1
} finally {
  await pool.end()
}