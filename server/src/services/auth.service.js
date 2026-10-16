import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from '../../config/db.js'
import { getJwtConfig } from '../config/security.js'

const passwordRounds = 12

export function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone,
    role: user.role,
    created_at: user.created_at,
  }
}

function createToken(userId) {
  const { secret, issuer, audience } = getJwtConfig()
  return jwt.sign(
    { sub: String(userId) },
    secret,
    {
      algorithm: 'HS256',
      audience,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      issuer,
    },
  )
}

export async function registerUser({ email, password, firstName, lastName, phone }) {
  if (Buffer.byteLength(password, 'utf8') > 72) {
    const error = new Error('Password must be at most 72 UTF-8 bytes')
    error.statusCode = 400
    throw error
  }

  const normalizedEmail = email.trim().toLowerCase()
  const existingUser = await pool.query(
    'SELECT id FROM users WHERE LOWER(email) = $1',
    [normalizedEmail],
  )

  if (existingUser.rowCount > 0) {
    const error = new Error('An account with this email already exists')
    error.statusCode = 409
    throw error
  }

  const passwordHash = await bcrypt.hash(password, passwordRounds)
  const { rows } = await pool.query(
    `
      INSERT INTO users (email, password_hash, first_name, last_name, phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, first_name, last_name, phone, role, created_at
    `,
    [normalizedEmail, passwordHash, firstName.trim(), lastName.trim(), phone?.trim() || null],
  )

  const user = rows[0]
  return { user: sanitizeUser(user), token: createToken(user.id) }
}

export async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase()
  const { rows } = await pool.query(
    `
      SELECT id, email, password_hash, first_name, last_name, phone, role, created_at
      FROM users
      WHERE LOWER(email) = $1
    `,
    [normalizedEmail],
  )

  const user = rows[0]
  const passwordMatches = user && await bcrypt.compare(password, user.password_hash)

  if (!passwordMatches) {
    const error = new Error('Invalid email or password')
    error.statusCode = 401
    throw error
  }

  return { user: sanitizeUser(user), token: createToken(user.id) }
}

export async function findUserById(userId) {
  const { rows } = await pool.query(
    `
      SELECT id, email, first_name, last_name, phone, role, created_at
      FROM users
      WHERE id = $1
    `,
    [userId],
  )

  return rows[0] ? sanitizeUser(rows[0]) : null
}