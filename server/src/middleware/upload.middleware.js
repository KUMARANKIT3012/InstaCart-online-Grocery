import multer from 'multer'

const imageUpload = multer({
  limits: { fileSize: 5 * 1024 * 1024 },
  storage: multer.memoryStorage(),
  fileFilter(req, file, callback) {
    if (!file.mimetype.startsWith('image/')) {
      const error = new Error('Only image files are allowed')
      error.statusCode = 400
      return callback(error)
    }
    return callback(null, true)
  },
})

export const productImageUpload = imageUpload.single('image')