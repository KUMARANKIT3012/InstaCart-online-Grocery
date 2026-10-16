import {
  findUserById,
  loginUser,
  registerUser,
} from '../services/auth.service.js'

function requiredString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function validateCredentials(body, includeName = false) {
  const { email, password, firstName, lastName } = body

  if (!requiredString(email) || !requiredString(password) || password.length < 8) {
    const error = new Error('A valid email and a password of at least 8 characters are required')
    error.statusCode = 400
    throw error
  }

  if (includeName && (!requiredString(firstName) || !requiredString(lastName))) {
    const error = new Error('First name and last name are required')
    error.statusCode = 400
    throw error
  }
}

export async function register(req, res, next) {
  try {
    validateCredentials(req.body, true)
    const result = await registerUser({
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
    })
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}

export async function login(req, res, next) {
  try {
    validateCredentials(req.body)
    const result = await loginUser({ email: req.body.email, password: req.body.password })
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await findUserById(req.user.id)
    res.status(200).json({ user })
  } catch (error) {
    next(error)
  }
}