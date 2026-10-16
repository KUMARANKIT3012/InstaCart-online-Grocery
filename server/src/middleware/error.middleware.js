export function errorHandler(error, req, res, next) {
  console.error(error.stack || error.message)

  if (error.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request body is too large', code: 'PAYLOAD_TOO_LARGE' })
  }

  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'Image must be 5MB or smaller', code: 'FILE_TOO_LARGE' })
  }

  if (error instanceof SyntaxError && error.status === 400) {
    return res.status(400).json({ error: 'Malformed JSON body', code: 'INVALID_JSON' })
  }

  if (error.code === '23505') {
    return res.status(409).json({ error: 'Resource already exists', code: 'CONFLICT' })
  }

  const publicStatuses = new Set([400, 401, 403, 404, 409, 422])
  const statusCode = publicStatuses.has(error.statusCode) ? error.statusCode : 500
  const response = {
    error: statusCode === 500 ? 'Internal server error' : error.message,
    code: statusCode === 500 ? 'INTERNAL_ERROR' : (error.appCode || 'REQUEST_ERROR'),
  }

  if (statusCode !== 500 && error.details) response.details = error.details
  return res.status(statusCode).json(response)
}