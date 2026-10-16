import { v2 as cloudinary } from 'cloudinary'

let isConfigured = false

function getCloudinary() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    const error = new Error('Cloudinary is not configured')
    error.statusCode = 503
    throw error
  }

  if (!isConfigured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
    isConfigured = true
  }

  return cloudinary
}

export function uploadProductImage(buffer) {
  const client = getCloudinary()
  return new Promise((resolve, reject) => {
    const upload = client.uploader.upload_stream(
      { folder: 'instacart/products', resource_type: 'image' },
      (error, result) => error ? reject(error) : resolve(result),
    )
    upload.end(buffer)
  })
}