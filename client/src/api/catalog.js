import apiClient from './client.js'

export async function fetchProducts(params = {}) {
  const response = await apiClient.get('/products', { params })
  return response.data
}

export async function fetchProduct(id) {
  const response = await apiClient.get(`/products/${id}`)
  return response.data.data
}

export async function fetchCategories() {
  const response = await apiClient.get('/categories')
  return response.data.data
}