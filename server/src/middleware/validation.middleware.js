export function validate(schema, source) {
  return (req, res, next) => {
    const result = schema.safeParse(req[source])

    if (!result.success) {
      const error = new Error('Request validation failed')
      error.statusCode = 400
      error.appCode = 'VALIDATION_ERROR'
      error.details = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || source,
        message: issue.message,
      }))
      return next(error)
    }

    req.validated = { ...(req.validated || {}), [source]: result.data }
    return next()
  }
}